import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ImageBackground, Image } from 'react-native';
import { useState } from 'react';
import { supabase, Guest } from './supabaseClient';

export default WelcomePage = ({ navigation }) => {

  const [loading, setLoading] = useState(false)
  const gotoLoginPage = () => {
    navigation.navigate('Login')
  }

  const gotoGuestLogin = async () => {
    //todo
    setLoading(true)
    const {user, error} = await supabase.auth.signIn({
      email: Guest.email,
      password: Guest.password,
    })

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
      style={styles.image}
      source={require('./images/home_screen.jpg')}
    >
        <View
        style={{flexDirection: 'row'}}
        >
          <Text style={styles.logoText}>tasti</Text>
          <Text style={[styles.logoText, {color: 'gold'}]}>NUS</Text>
        </View>
        <Text style={styles.slogan}>simple discoveries,</Text>
        <Text style={styles.slogan}>tasty delicacies.</Text>
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={gotoLoginPage}
        >
          <Text style={styles.loginText}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.guestButton}
          onPress={gotoGuestLogin}
          disabled={loading}
        >
          <Text style={styles.guestText}>Continue as a Guest</Text>
        </TouchableOpacity>
      </ImageBackground>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 50,
    fontWeight: 'bold',
    letterSpacing: 3,
  },
  slogan: {
    fontSize: 18,
    color: 'saddlebrown',
  },
  loginButton: {
    width: 200,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'goldenrod',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 150,
  },
  loginText: {
    fontSize: 20,
    color: 'black',
  },
  guestButton: {
    width: 200,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  guestText: {
    fontSize : 18,
    color: 'black',
  }
})