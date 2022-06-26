import { View, Animated, Text, Easing, SafeAreaView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import BackButton from './components/BackButton';

export default RandomGenerator = ({ navigation }) => {
  const [data, setData] = useState([])
  const [storeCount, setStoreCount] = useState()
  const [storeName, setStoreName] = useState('')
  const [storeId, setStoreId] = useState('')
  const [resultFound, setResultFound] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data, error, count } = await supabase
      .from('food_stores')
      .select('name, id', { count: 'exact' })

      if (error) {
        throw error
      }

      setData(data)
      setStoreCount(count)
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    } 
  } 

  const gotoFoodPage = (id) => {
    navigation.navigate('Food', {
      id: id
    })
  }

  const spinValue = useState(new Animated.Value(0))[0]

  // First set up animation 
  const spinWheel = () => {
    setResultFound(false)
    spinValue.setValue(0);
    Animated.timing(
        spinValue,
      {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear, // Easing is an additional import from react-native
        useNativeDriver: true  // To make use of native driver for performance
      }
    ).start(() => {
      const randomStoreId = Math.ceil(Math.random() * storeCount)
      data.filter(store => store.id == randomStoreId)
          .map(store => {
            setStoreId(store.id)
            setStoreName(store.name)
          })
      setResultFound(true)
    })
}

  // Next, interpolate beginning and end values (in this case 0 and 1)
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '3600deg']
  })

  return (
    <View style={styles.container}>
      <View style={styles.topLabel}>
        <BackButton
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.title}>Random Food Generator</Text>
      </View>
      <View style={{height: 380, alignItems: 'center'}}>
      <Animated.Image 
        style={[{transform: [{rotate: spin}]}, styles.wheel]}
        source={require('./images/spin_wheel.png')}
      />
      {
        resultFound && 
          <Text style={styles.storeNameText}>{storeName}</Text>
      }
      </View>
      <TouchableOpacity 
        style={styles.buttons}
        disabled={loading}
        onPress={spinWheel}
      >
        <Text
          style={styles.generateFoodText}
        >
          {!resultFound ? 'What should I eat today?' : "Don't like it? Spin again"}
        </Text>
      </TouchableOpacity>
      {
        resultFound && 
          <TouchableOpacity
            style={styles.buttons}
            disabled={loading}
            onPress={() => gotoFoodPage(storeId)}
          >
            <Text>Check out the store</Text>
          </TouchableOpacity>
      }
    </View> 
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'cornsilk',
  },
  topLabel: {
    backgroundColor: 'orange',
    width: '100%',
    height: 100,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: -25,
    marginLeft: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20
  },
  wheel: {
    width: 300, 
    height: 300, 
    //backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  buttons: {
    width: 200,
    height: 30,
    backgroundColor: 'white',
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  storeNameText: {
    width: 260,
    height: 30,
    backgroundColor: 'cornsilk',
    marginTop: -160,
    textAlign: 'center',
    fontSize: 16,
  },
  generateFoodText: {
    fontSize: 14,
  },
})