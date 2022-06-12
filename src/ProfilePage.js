import { Image, ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useState, useEffect } from 'react';
import { supabase } from "./supabaseClient";

export default ProfilePage = ({ navigation }) => {

  const [profile, setProfile] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getProfile()
  }, [])

  const getProfile = async () => { // get profile data from supabase
    try {
      setLoading(true)
      const user = supabase.auth.user()
      let { data, error, status } = await supabase
        .from('profiles')
        .select(`*`)
        .eq('id', user.id)
        .single()

        if (error && status !== 406) {
          throw error
        }
  
        if (data) {
          setProfile(data)
        }
    } catch (error){
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const gotoSettingsPage = () => {
    navigation.navigate('Settings')
  }

  return (
    <View style={styles.container}>
      <View style={{width: '100%', backgroundColor: 'white', alignItems: 'center'}}>
      <ImageBackground
        style={styles.backgroundImage}
        source={require('./images/profile_page_background.jpg')}
      >
        <Image
          style={styles.profilePicture}
          source={profile.avatar_url 
                    ? {url: profile.avatar_url} 
                    : require('./images/profile_placeholder.png')}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.buttons}
            onPress={gotoSettingsPage}
          >
            <Text>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.buttons}
          >
            <Text style={{fontSize: 12}}>My Vouchers</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
      <Text style={styles.nameText}>{profile.first_name + ' ' + profile.last_name}</Text>
      <Text style={{fontSize: 12, marginBottom: 8}}>0 Reviews</Text>
      </View>
      <TouchableOpacity
        style={styles.signOutButton}
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
  },
  backgroundImage: {
    width: '100%',
    height: 220 ,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  profilePicture: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: -30,
    backgroundColor: 'white'
  },
  buttonContainer: {
    width: '100%',
    marginBottom: -40,
    alignSelf: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  buttons: {
    width: 90,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'cornsilk',
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  nameText: {
    marginTop: 35,
    fontWeight:'bold',
    fontSize: 18,
    alignSelf: 'center',
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