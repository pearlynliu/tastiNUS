import { LogBox, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ImageBackground, ScrollView } from "react-native";
import { useState, useEffect } from 'react';
import { supabase } from "./supabaseClient";
import BackButton from "./components/BackButton";
import 'react-native-url-polyfill/auto';

export default FoodPage = ({ route, navigation }) => {
  const { id } = route.params
  const [foodData, setFoodData] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getReviews()
  }, [])

  const getReviews = async () => {
    try {
      setLoading(true)
      let { data, error, status } = await supabase
        .from('reviews')
        .select(`*`)
        .eq('store_id', id)

        if (error && status !== 406) {
          throw error
        }
  
        if (data) {
          setReviews(data)
        }
    } catch (error){
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data, error } = await supabase
      .from('food_stores')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      alert(error.message)
    } else {
      setFoodData(data)
    }
  } 

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
}, [])

  const Reviews = ({ title, image_url, description, rating }) => ( //food store buttons being listed 
    <View style={styles.review}>
      <Image
        style={styles.reviewImage}
        source={{url: image_url}}
      />
      <View style={styles.descriptionContainer}>
        <Text style={styles.titleText}> {title} </Text>
        <Text style={styles.descriptionText}> {description} </Text>
        <View style={styles.starContainer}>
          <Text> {rating} </Text>
          <Image
            style={styles.starIcon}
            source={require('./images/star.png')}
          />
        </View>
      </View>
    </View>
);

  const renderReviews = ({ item }) => (
    <Reviews 
      title={item.title}
      image_url={item.image_url}
      description={item.description}
      rating={item.rating}
    />
  );
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={{width: '100%'}}
        contentContainerStyle={styles.scrollView} 
        nestedScrollEnabled>
      <ImageBackground
        style={styles.storeImage}
        imageStyle={{borderRadius: 30}}
        source={{url: foodData.image_url}}
        resizeMode={'cover'}
      >
        <BackButton 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        />
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
        <Text style={styles.detailsText}>{foodData.operating_hours}</Text>
      </View>
      <Text style={styles.reviewCountText}> {foodData.review_count} Reviews</Text>
      <FlatList
        style={{width: '100%', marginTop: 10, height: 300,}}
        contentContainerStyle={{alignItems: 'center'}}
        data={reviews}
        renderItem={renderReviews}
      /> 
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    //width: '100%',
  },
  scrollView: {
    alignItems: 'center',
    backgroundColor: 'white',
    width: '100%',
  },
  backButton: {
    alignSelf: 'flex-start', 
    marginLeft: 10, 
    marginTop: 10,
    borderWidth: 1,
    backgroundColor: 'white'
  },
  storeName: {
    fontSize: 28,
    fontWeight: '500',
    marginTop: 12,
    textAlign: 'center'
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
    marginLeft: 35, 
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
    marginLeft: 34, 
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
  reviewCountText: {
    alignSelf: 'flex-start',
    marginTop: 20,
    marginLeft: 35,
    fontSize: 16,
    fontWeight: '500',
  },
  review: {
    width: 300,
    height: 100,
    flexDirection: 'row',
    backgroundColor: 'white',
    margin: 8,
    borderRadius: 10,
  },
  reviewImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },
  descriptionContainer: {
    width: 200,
    alignItems: 'flex-start',
    //backgroundColor: 'red'
  },
  titleText : {
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 3,
    
  },
  descriptionText: {
    fontSize: 10,
    marginLeft: 3,
    marginTop: 8,
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 25,
    backgroundColor: 'white',
    marginLeft: -70,
    marginTop: 40,
    borderRadius: 10,
    borderWidth: 0.5,
  },
  starIcon: {
    width: 20,
    height: 20,
  },

})