import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import React, { useState } from 'react';
import { supabase } from './supabaseClient';

export default LoginPage = ({ navigation }) => {
  const [email, setEmail] = React.useState(null)
  const [password, setPassword] = React.useState(null)
  const [loading, setLoading] = React.useState(false)

  const loginWithEmail = async () => { //log user in to database
    setLoading(true)
    const {user, error} = await supabase.auth.signIn({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  const forgotPassword = () => {
    //todo
    navigation.navigate('WorkInProgress')
  }

  const gotoSignUp = () => {
    navigation.navigate('Signup')
  }

  return (
    <SafeAreaView
      style={styles.container}
    >
      <Text style={styles.loginText}>Log in to Your Account</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={email => setEmail(email)}
        placeholder="Email"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={password => setPassword(password)}
        placeholder='Password'
      />
      <TouchableOpacity
        style={styles.logInButton}
        onPress={loginWithEmail}
      >
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.forgetPasswordButton}
        onPress={forgotPassword}>
        <Text style={[styles.buttonText, {paddingTop: 3}]}>Forgot Password?</Text>
      </TouchableOpacity>
      <View style={styles.signUpText}>
        <Text style={{fontWeight: 'bold'}}>Don't have an account?</Text>
        <TouchableOpacity 
          style={styles.signUpButton}
          onPress={gotoSignUp}
        >
          <Text style={[{color: 'red'}, {fontWeight: '700'}]}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'cornsilk',
    alignItems: 'center',
    //justifyContent: 'space-between',
  },
  input: {
    width: 300,
    height: 40,
    borderRadius: 16,
    borderColor: 'white',
    backgroundColor: "white",
    borderWidth: 12,
    margin: 8,
  },
  loginText: {
    fontSize: 22,
    color: 'darkorange',
    fontWeight: '800',
    alignSelf: 'flex-start',
    paddingLeft: 40,
    paddingTop: 60,
    paddingBottom: 4,
  },
  logInButton: {
    width: 300,
    height: 40,
    borderRadius: 16,
    borderColor: 'cornsilk',
    backgroundColor: 'white',
    marginTop: 30,
  },
  forgetPasswordButton: {
    width: 150,
    height: 25,
    borderRadius: 16,
    borderColor: 'cornsilk',
    backgroundColor: 'cornsilk',
    marginTop: 30,
  },
  buttonText: {
    textAlign: 'center',
    color: 'red',
    paddingTop: 8,
    flex: 1,
    fontSize: 17,
    fontWeight: 'bold'
  },
  signUpText: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginBottom: 40,
  },
  signUpButton: {
    width: 55,
    height: 18,
    backgroundColor: 'cornsilk',
    marginLeft: 8,

  }
})