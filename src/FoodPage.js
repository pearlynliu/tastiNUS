import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ImageBackground } from "react-native";
import { useState, useEffect } from 'react';
import { supabase } from "./supabaseClient";
import BackButton from "./components/BackButton";
import 'react-native-url-polyfill/auto';

export default FoodPage = ({ route, navigation }) => {
  const { id } = route.params
  const [foodData, setFoodData] = useState([])
  const [loading, setLoading] = useState(false)
  const [test, setTest] = useState()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data, error } = await supabase
      .from('food_stores_test')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      alert(error.message)
    } else {
      setFoodData(data)
    }
  } 
  
  const goBack = () => {
    navigation.navigate('Home')
  }

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        style={styles.storeImage}
        imageStyle={{borderRadius: 30}}
        source={{url: foodData.image_url}}
        resizeMode={'cover'}
      >
        <View style={styles.backButton}>
        <BackButton onPress={goBack}/>
      </View>
      </ImageBackground>
      <Text style={styles.storeName}>{foodData.name}</Text>
      <View style={styles.locationContainer}>
        <Image
          style={styles.locationIcon}
          source={require('./images/location_icon.png')}
        />
        <Text style={styles.locationText}>{foodData.location}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Image
          style={styles.clockIcon}
          source={require('./images/clock_icon.png')}
        />
        <Text style={styles.detailsText}>{foodData.details}</Text>
      </View>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  backButton: {
    alignSelf: 'flex-start', 
    marginLeft: 10, 
    marginTop: 10,
  },
  storeName: {
    fontSize: 28,
    fontWeight: '500',
    marginTop: 12,
  },
  storeImage: {
    width: 320,
    height: 260,
    borderRadius: 20,
    marginTop: 3,
  },
  locationContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start', 
    alignItems: 'center',
    marginLeft: 60, 
    marginTop: 5,
  },
  locationIcon: {
    width: 11,
    height: 16,
    tintColor: 'grey'
  },
  locationText: {
    fontSize: 14,
    marginLeft: 6,
    color: 'grey'
  },
  detailsContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start', 
    marginLeft: 59, 
    marginTop: 5,
  },
  clockIcon: {
    width: 14,
    height: 14,
    tintColor: 'grey'
  },
  detailsText: {
    fontSize: 14,
    marginLeft: 5,
    color: 'grey'
  },
})