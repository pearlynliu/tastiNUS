import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import SafeViewAndroid from './components/SafeViewAndroid'

export default SignUpPage = ({navigation}) => {
  const [firstName, setFirstName] = React.useState(null)
  const [lastName, setLastName] = React.useState(null)
  const [email, setEmail] = React.useState(null)
  const [password, setPassword] = React.useState(null)
  const [confirmPassword, setConfirmPassword] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
  const [successful, setSuccessful] = React.useState(false)

  const signUpWithEmail = async () => {
    setLoading(true)
    if (password != confirmPassword) {
      Alert.alert('Repeated password is different')
    }
    const { user, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    },
    {
      data: {
        first_name: firstName,
        last_name: lastName,
      }
    })
    
    if (error) {
      Alert.alert(error.message) // return error message if signup is unsuccessful
    } else { 
      // clear the form if signup is successful, returning a message that signup is successful
      setEmail(null)
      setPassword(null)
      setConfirmPassword(null)
      setFirstName(null)
      setLastName(null)
      Alert.alert('Check your email for verification')
    }
    setLoading(false)
    } 

    return (
      <SafeAreaView style={[styles.container, SafeViewAndroid.AndroidSafeArea]}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.container}>
            <BackButton
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            />
            <Text style={styles.text}>Create an Account</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={firstName => setFirstName(firstName)}
              placeholder={'First Name'}
            />
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={lastName => setLastName(lastName)}
              placeholder={'Last Name'}
            />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={email=> setEmail(email)}
              placeholder={'Email'}
            />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={password => setPassword(password)}
              placeholder={'Enter your password'}
              secureTextEntry={true}
            />
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={confirmPassword => setConfirmPassword(confirmPassword)}
              placeholder={'Repeat your password'}
              secureTextEntry={true}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={signUpWithEmail}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'cornsilk',
    width: '100%',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginTop: 10,
    marginLeft: 20,
  },
  text: {
    fontSize: 22,
    color: 'darkorange',
    fontWeight: '800',
    marginTop: 50,
    marginBottom: 10,
  },
  input: {
    width: 300,
    height: 40,
    borderRadius: 16,
    borderColor: 'white',
    backgroundColor: "white",
    borderWidth: 12,
    margin: 6,
  },
  button: {
    width: 300,
    height: 40,
    borderRadius: 16,
    borderColor: 'cornsilk',
    backgroundColor: 'white',
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'red',
    fontSize: 15,
    fontWeight: 'bold',
  },
  successText: {
    fontSize: 14,
    marginTop: 30,
  }
})