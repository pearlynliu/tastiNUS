import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import React, { useState } from 'react';
import { supabase } from './supabaseClient'
import { Keyboard } from 'react-native-web';

export default SignUpPage = () => {
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
      <SafeAreaView style={styles.container}>
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
      </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'cornsilk',
  },
  text: {
    fontSize: 22,
    color: 'darkorange',
    fontWeight: '800',
    alignSelf: 'flex-start',
    marginLeft: 40,
    marginTop: 65,
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