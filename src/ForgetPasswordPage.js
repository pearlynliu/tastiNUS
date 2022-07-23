import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, TextInput, TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import { useState } from 'react';
import { supabase } from "./supabaseClient";

export default ForgetPasswordPage = () => {
  const [email, setEmail] = useState(null)
  const [loading, setLoading] = useState(false)

  const sendVerificationEmail = async () => {
    setLoading(true)

    const { data, error } = await supabase.auth.api.resetPasswordForEmail(email)
    if (error) {
      Alert.alert(error.message)
    } else {
      setEmail(null)
      Alert.alert('Check your email for verification link')
      Keyboard.dismiss()
    }
    setLoading(false)
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <Text style={styles.text}>Enter your email address</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={email => setEmail(email)}
            placeholder="Email"
          />
          <TouchableOpacity
            style={styles.button}
            onPress={sendVerificationEmail}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Send verification email</Text>
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
    backgroundColor: 'cornsilk',
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