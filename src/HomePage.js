import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useState, useEffect } from 'react';
import { supabase } from "./supabaseClient";
import 'react-native-url-polyfill/auto';

export default HomePage = ({ session, navigation }) => {
  const [name, setName] = useState()
  const [avatar, setAvatar] = useState()
  const [loading, setLoading] = useState(false)
  const [stores, setStores] = useState([])

  const StoreButton = ({ name, image_url, id }) => ( //food store buttons being listed 
    <TouchableOpacity
      style={styles.storeButton}
      onPress={() => gotoFoodPage(id)}
    >
      <Image
        style={styles.storeImage}
        source={{url: image_url}}
        resizeMode= 'cover'
      />
      <Text style={styles.storeText}>{name}</Text>
    </TouchableOpacity>
  );

  const renderStoreButton = ({ item }) => (
    <StoreButton 
      name={item.name}
      image_url={item.image_url}
      id={item.id}
    />
  );

  const gotoFoodPage = (id) => {
    navigation.navigate('Food', {
      id: id
    })
  }

  useEffect(() => { 
    getProfile()
  }, [session])

  const getProfile = async () => { // get profile data from supabase
    try {
      setLoading(true)
      const user = supabase.auth.user()
      let { data, error, status } = await supabase
        .from('profiles')
        .select(`first_name, avatar_url`)
        .eq('id', user.id)
        .single()

        if (error && status !== 406) {
          throw error
        }
  
        if (data) {
          setName(data.first_name)
          setAvatar(data.avatar_url)
        }
    } catch (error){
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStores()
  }, [])

  const fetchStores = async () => {
    const { data, error } = await supabase
      .from('food_stores')
      .select('*')
      .order('id', { ascending: false })
      .limit(8)
    if (error) alert(error.message)
    else setStores(data)
  }

  const gotoRandomGenerator = () => {
    navigation.navigate('RandomGenerator')
  }

  const gotoSearch = () => {
    navigation.navigate('Search')
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        <TouchableOpacity
          style={[styles.randomGenIcon, {marginRight: 230}]}
          onPress={gotoRandomGenerator}
        >
        <Image
          style={styles.randomGenIcon}
          source={require('./images/random_cube_icon.png')}
        />
        </TouchableOpacity>
        <Image
        style={styles.profilePic}
        source={avatar 
                  ? {url: avatar} 
                  : require('./images/profile_placeholder.png')}
        />
      </View>
      <View style={styles.helloTextContainer}>
        <Image
          style={styles.wavingHandIcon}
          source={require('./images/waving_hand.png')}
        />
        <Text style={styles.helloText}>Hi, {name}</Text>
      </View>
      <Text style={styles.findGoodFoodText}>Find good food {'\n'}around you</Text>
      <TouchableOpacity
        style={styles.searchBar}
        onPress={gotoSearch}
      >
        <Image
          style={styles.magnifyingGlassIcon}
          source={require('./images/magnifying_glass_icon.png')}
        />
        <Text style={styles.searchText}>Search</Text>
      </TouchableOpacity>
      <Text style={styles.mostPopularText}>Most Popular</Text>
      <FlatList
        style={{marginLeft: 30}}
        data={stores}
        renderItem={renderStoreButton}
        horizontal={true}
      /> 
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  randomGenIcon: {
    width: 50,
    height: 50,
  },
  profilePic: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  imageContainer: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
  },
  helloTextContainer: {
    flexDirection: 'row',
    marginTop: 25,
    marginLeft: 30,
    alignItems: 'center',
    alignSelf: 'flex-start'
  },
  helloText: {
    fontSize: 20,
  },
  wavingHandIcon: {
    width: 30,
    height: 30,
    marginRight: 5,
  },
  findGoodFoodText: {
    fontWeight: "500",
    fontSize: 30,
    letterSpacing: 3,
    alignSelf: 'flex-start',
    marginLeft: 30,
    marginTop: 15,
  },
  searchBar: {
    flexDirection: 'row',
    marginTop: 20,
    width: 320,
    height: 55,
    borderRadius: 30,
    borderColor: 'grey',
    borderWidth: 1,
    alignItems: 'center',
  },
  magnifyingGlassIcon: {
    width: 20,
    height: 20,
    margin: 15,
    tintColor: 'grey'
  },
  searchText: {
    fontSize: 20,
    color: 'grey',
    letterSpacing: 3,
  },
  mostPopularText: {
    alignSelf: 'flex-start',
    marginLeft: 40,
    marginTop: 15,
    fontSize: 20,
    letterSpacing: 1,
    fontWeight: '500'
  },
  storeButton: {
    alignItems: 'center',
    width: 130,
    height: 180,
    borderWidth: 1,
    borderRadius: 30,
    margin: 10,
    backgroundColor: 'white',
  },
  storeImage: {
    width: 110,
    height: 110,
    borderRadius: 60,
    margin: 15,
    marginBottom: 10,
  },
  storeText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    width: 100,
    height: 50,
  }
})