import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useState, useEffect } from 'react';
import { supabase } from "./supabaseClient";

export default ProfilePage = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => supabase.auth.signOut()}
      >
        <Text>Sign out</Text>
      </TouchableOpacity>
    </View>
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
  },
})