import { View, SafeAreaView, Text, StyleSheet, Image, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useState, useEffect} from 'react';
import { supabase } from './supabaseClient';
import * as ImagePicker from 'expo-image-picker';
import BackButton from './components/BackButton'

export default SettingsPage = ({ navigation }) => {
  const [avatarUrl, setAvatarUrl] = useState()
  const [tempAvatar, setTempAvatar] = useState()
  const [isAvatarNew, setIsAvatarNew] = useState(false)
  const [firstName, setFirstName] = useState()
  const [lastName, setLastName] = useState()
  const [loading, setLoading] = useState(false)
  const user = supabase.auth.user()

  useEffect(() => {
    getProfile()
  }, [])


  const getProfile = async () => { // get profile data from supabase
    try {
      setLoading(true)
      let { data, error, status } = await supabase
        .from('profiles')
        .select(`*`)
        .eq('id', user.id)
        .single()

        if (error && status !== 406) {
          throw error
        }
  
        if (data) {
          setFirstName(data.first_name)
          setLastName(data.last_name)
          setAvatarUrl(data.avatar_url)
        }
    } catch (error){
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async () => {
    setLoading(true)
    if (isAvatarNew) {
      try {
        // get the extension
        const ext = tempAvatar.substring(tempAvatar.lastIndexOf('.') + 1)
       
        //get the file name
        const fileName = tempAvatar.replace(/^.*[\\\/]/,"")

        var formData = new FormData();
        formData.append('files', {
          uri: tempAvatar,
          name: fileName,
          type: `image/${ext}`
        })

        // uploading image onto supabase storage
        let { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, formData)
        if (uploadError) {
          throw uploadError
        }

        // retrieving URL of image from supabase
        const {publicURL, error: downloadError} = supabase
        .storage
        .from('avatars')
        .getPublicUrl(fileName)

        if (downloadError) {
          throw downloadError
        }

        const updates = {
          id: user.id,
          updated_at: new Date(),
          avatar_url: publicURL,
          first_name: firstName,
          last_name: lastName,
        }

        // updating user profile
        let { error: upsertError } = await supabase.from('profiles').upsert(updates, {
          returning: 'minimal', // Don't return the value after inserting
        })
  
        if (upsertError) {
          throw upsertError
        }
      } catch (error) {
        alert(error.message)
      }
    } else {
      try {
        const updates = {
          id: user.id,
          updated_at: new Date(),
          avatar_url: avatarUrl,
          first_name: firstName,
          last_name: lastName,
        }

        let { error } = await supabase.from('profiles').upsert(updates, {
          returning: 'minimal', // Don't return the value after inserting
        })
  
        if (error) {
          throw error
        }
      } catch (error) {
        alert(error.message)
      }
    }
    setLoading(false)
    alert('Edits saved successfully. Login again to see changes')
  }



  const pickImage = async () => {
    setLoading(true)
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setTempAvatar(result.uri);
      setIsAvatarNew(true)
    }
    setLoading(false)
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <BackButton
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.editProfileText}>Edit Profile</Text>
          <Image
            style={styles.profilePicture}
            source={tempAvatar ? {url: tempAvatar} 
                              : avatarUrl 
                              ? {url: avatarUrl} 
                              : require('./images/profile_placeholder.png')}
          />
          <TouchableOpacity
            style={styles.uploadImageButton}
            onPress={pickImage}
            disabled={loading}
          >
            <Image
              style={styles.uploadImageIcon}
              source={require('./images/add_icon.png')}
            />
          </TouchableOpacity>
          <View style={styles.inputContainer}>
            <Text style={styles.nameText}>First name</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={(firstName) => setFirstName(firstName)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.nameText}>Last name</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={(lastName) => setLastName(lastName)}
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={updateProfile}
              disabled={loading}
            >
              <Text style={styles.saveText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
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
  editProfileText: {
    fontSize: 30,
    fontWeight: '800',
    color: 'orange',
    marginBottom: 50,
    marginTop: -10,
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 750,
  },
  uploadImageButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginTop: -15,
  },
  uploadImageIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'black',
    tintColor: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameText: {

  },
  input: {
    width: 200,
    height: 40,
    borderRadius: 16,
    borderColor: 'white',
    backgroundColor: "white",
    borderWidth: 12,
    margin: 6,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 180,
    width: '100%'
  },
  cancelButton: {
    width: 70,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 40
  },
  cancelText: {
    fontSize: 20,
    fontWeight: '500',
    color: 'red'
  },
  saveButton: {
    width: 120,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 30
  },
  saveText: {
    fontSize: 18,
    fontWeight: '500',
    color: 'green'
  }
})