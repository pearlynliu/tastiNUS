import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, TextInput } from "react-native";
import { useState, useEffect } from 'react';
import { supabase } from "./supabaseClient";

export default SearchResultsPage = ({ navigation, search }) => {
  const [stores, setStores] = useState([])

  const StoreButton = ({ name, image_url, id, keywords, location }) => ( //food store buttons being listed 
    <TouchableOpacity
      style={styles.storeButton}
      onPress={() => gotoFoodPage(id)}
    >
      <Image
        style={styles.storeImage}
        source={{url: image_url}}
        resizeMode= 'cover'
      />
      <View style={styles.detailsContainter}>
        <Text style={styles.nameText}>{name}</Text>
        <Text style={styles.keywordText}>{keywords}</Text>
        <View style={styles.locationContainer}>
          <Image
            style={styles.locationIcon}
            source={require('./images/location_icon.png')}
          />
          <Text style={styles.locationText}>{location}</Text>
      </View>
      </View>
    </TouchableOpacity>
  );

  const renderStoreButton = ({ item }) => (
    <StoreButton 
      name={item.name}
      image_url={item.image_url}
      id={item.id}
      keywords={item.keywords}
      location={item.location}
    />
  );

  useEffect(() => {
    fetchStores()
  }, [search])
  
  const fetchStores = async () => {
    const searchPattern = '%' + search + '%'
    const { data, error } = await supabase
      .from('food_stores')
      .select('*')
      .or(`name.ilike.${searchPattern}, location.ilike.${searchPattern}, keywords.ilike.${searchPattern}`)
      .order('name', { ascending: true })
    if (error) alert(error.message)
    else setStores(data)
  }

  const gotoFoodPage = (id) => {
    navigation.navigate('Food', {
      id: id
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        style={{width: '100%'}}
        contentContainerStyle={{alignItems: 'center'}}
        data={stores}
        renderItem={renderStoreButton}
      /> 
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  storeButton: {
    width: 300,
    height: 100,
    flexDirection: 'row',
    backgroundColor: 'cornsilk',
    margin: 8,
    borderRadius: 10,
  },
  storeImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },
  detailsContainter: {
    marginLeft: 10,
  },
  nameText: {
    fontWeight: 'bold',
    width: 200,
  },
  keywordText: {
    marginTop: 8,
    fontSize: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
  },
  locationIcon: {
    width: 10,
    height: 14,
    tintColor: 'grey',
  },
  locationText: {
    fontSize: 10,
    marginLeft: 3,
    color: 'grey',
  },
})