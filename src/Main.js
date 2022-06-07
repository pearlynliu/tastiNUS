import { SafeAreaView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useState, useEffect } from 'react';
import { supabase } from "./supabaseClient";
import 'react-native-url-polyfill/auto';

export default Main = ({ session }) => {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { 
    let mounted = true

    if (mounted) {
      getProfile()
    }
    return () => mounted = false

  }, [session])

  const getProfile = async () => { // get profile data from supabase
    try {
      setLoading(true)
      const user = supabase.auth.user()
      let { data, error, status } = await supabase
        .from('profiles')
        .select(`first_name`)
        .eq('id', user.id)
        .single()

        if (error && status !== 406) {
          throw error
        }
  
        if (data) {
          setName(data.first_name)
        }
    } catch (error){
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text>Hello {name}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => supabase.auth.signOut()}
      >
        <Text>Sign out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'pink',
    width: 80,
    height: 40,
    borderRadius: 8,
    margin: 30,
    alignItems: 'center',
    justifyContent: 'center',
  }
})