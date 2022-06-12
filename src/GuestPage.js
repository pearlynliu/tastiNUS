import { Image, ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useState, useEffect } from 'react';
import { supabase } from "./supabaseClient";

export default GuestPage = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Create an account to give reviews/edit profile</Text>
      <TouchableOpacity
        style={styles.signOutButton}
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
  signOutButton: {
    backgroundColor: 'pink',
    width: 80,
    height: 40,
    borderRadius: 8,
    margin: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
})