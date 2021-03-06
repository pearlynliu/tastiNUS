import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, TextInput, TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import { useState, useEffect } from 'react';
import { supabase, appUrl } from "./supabaseClient";
import * as Linking from 'expo-linking';
import SafeViewAndroid from './components/SafeViewAndroid'

export default ResetPasswordPage = ({ url }) => {
  const [accessToken, setAccessToken] = useState(null)
  const [password, setPassword] = useState(null)
  const [confirmPassword, setConfirmPassword] = useState(null)
  const [loading, setLoading] = useState(false)

  function getParameterByName(name, url) {
    if (!url) url = window?.location?.href || ''
    // eslint-disable-next-line no-useless-escape
    name = name.replace(/[\[\]]/g, '\\$&')
    const regex = new RegExp('[?&#]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url)
    if (!results) return null
    if (!results[2]) return ''
    return decodeURIComponent(results[2].replace(/\+/g, ' '))
  }

  useEffect(() => {
    const token = getParameterByName('access_token', url)
    setAccessToken(token)
  }, [])

  const token = getParameterByName('access_token', url)
  
  const resetPassword = async () => {
    setLoading(true)
    if (password != confirmPassword) {
      Alert.alert("Confirm password is different from password")
    } else {
      const { error, data } = await supabase.auth.api
        .updateUser(accessToken, { password : password })

      if (error) {
        Alert.alert(error.message)
      } else {
        setPassword(null)
        setConfirmPassword(null)
        Alert.alert('Password successfully changed')
        Linking.openURL(appUrl)
      }
    }
    setLoading(false)
  }

  return (
    <SafeAreaView style={[styles.container, SafeViewAndroid.AndroidSafeArea]}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <Text style={styles.text}>Key in your new password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={password => setPassword(password)}
            placeholder="New password"
          />
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={confirmPassword => setConfirmPassword(confirmPassword)}
            placeholder="Confirm your password"
          />
          <TouchableOpacity
            style={styles.button}
            onPress={resetPassword}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Reset Password</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'cornsilk',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    color: 'darkorange',
    fontWeight: '800',
    alignSelf: 'flex-start',
    paddingLeft: 10,
    paddingTop: 140,
    paddingBottom: 20,
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
  button: {
    width: 230,
    height: 40,
    borderRadius: 16,
    borderColor: 'cornsilk',
    backgroundColor: 'white',
    marginTop: 60,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 18,
    color: 'red',
    fontWeight: '800',
  },
})