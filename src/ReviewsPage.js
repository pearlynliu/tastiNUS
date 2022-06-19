import { Image, TextInput, StyleSheet, Text, TouchableOpacity, View, TouchableWithoutFeedback, Keyboard, } from "react-native";
import { useState, useEffect, useRef } from 'react';
import { supabase } from "./supabaseClient";
import { Camera, CameraType } from 'expo-camera';
import { useSelector, useDispatch } from "react-redux";
import { refreshApp } from "./store/refresh";
import { Rating } from 'react-native-ratings' // API for this component: https://www.npmjs.com/package/react-native-ratings
import { Dropdown } from 'react-native-element-dropdown'; // API for this component: https://www.npmjs.com/package/react-native-element-dropdown
import BackButton from "./components/BackButton";

export default ReviewsPage = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null)
  const [type, setType] = useState(CameraType.back)
  const [showCamera, setShowCamera] = useState(true)
  const [profile, setProfile] = useState([])
  const [loading, setLoading] = useState(false)
  const [rating, setRating] = useState(3)
  const [foodData, setFoodData] = useState([])
  const [storeName, setStoreName] = useState(null)
  const [storeId, setStoreId] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState()
  const refresh = useSelector((state) => state.refreshStore.refresh)
  const dispatch = useDispatch()

  useEffect(() => {
    navigation.setOptions({ tabBarStyle: { display: "none" } });
  }, [])

  useEffect(() => {
    getProfile()
  }, [refresh])

  const getProfile = async () => { // get profile data from supabase
    try {
      setLoading(true)
      const user = supabase.auth.user()
      let { data, error, status } = await supabase
        .from('profiles')
        .select(`id, first_name`)
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

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data, error } = await supabase
      .from('food_stores')
      .select('id, name')
      .order('name', { ascending: true })

    if (error) {
      alert(error.message)
    } else {
      setFoodData(data)
    }
  } 

  const postReview = async () => {
    setLoading(true)
    try {
      // get the extension
      const ext = imageUrl.substring(imageUrl.lastIndexOf('.') + 1)
       
      //get the file name
      const fileName = imageUrl.replace(/^.*[\\\/]/,"")

      var formData = new FormData();
      formData.append('files', {
        uri: imageUrl,
        name: fileName,
        type: `image/${ext}`
      })

      // uploading image onto supabase storage
      let { error: uploadError } = await supabase.storage.from('review-images').upload(fileName, formData)
      if (uploadError) {
        alert('uploadError')
        throw uploadError
      }

      // retrieving URL of image from supabase
      const {publicURL, error: downloadError} = supabase
      .storage
      .from('review-images')
      .getPublicUrl(fileName)

      if (downloadError) {
        alert('downloadError')
        throw downloadError
      }

      const insert = {
        image_url: publicURL,
        image_file_name: fileName,
        author_id: profile.id,
        author_name: profile.first_name,
        store_id: storeId,
        store_name: storeName,
        rating: rating,
        title: title,
        description: description,
      }

      let { error: upsertError } = await supabase.from('reviews').upsert(insert, {
        returning: 'minimal', // Don't return the value after inserting
      })

      if (upsertError) {
        throw upsertError
      }

      const { data, error:functionError } = await supabase
        .rpc('review_increment', {rating: rating, author_id: profile.id, store_id: storeId})

      if (functionError) {
        throw functionError
      }

      navigation.goBack()
      setRating(3)
      setTitle('')
      setDescription('')
      setShowCamera(true)
      dispatch(refreshApp())
      alert('Review successfully uploaded')
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  //camera ref to access camera
  const cameraRef = useRef(null)

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  //called to take the photo
  const takePhoto = async () => {
    if (cameraRef) {
      console.log('in take picture')
    }
    try {
      let photo = await cameraRef.current.takePictureAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1
      })
      return photo
    } catch (e) {
      console.log(e)
    }
  }
  return (
    <View style={styles.container}>
      { showCamera ?
      <Camera style={styles.camera} type={type} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
          >
            <Image
              style={styles.closeIcon}
              source={require('./images/cross_icon.png')}
            />
          </TouchableOpacity>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '90%', alignSelf: 'center'}}>
          <TouchableOpacity
            style={styles.flipButton}
            onPress={() => {
              setType(type === CameraType.back ? CameraType.front : CameraType.back);
            }}>
            <Text style={styles.cameraText}> Flip </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cameraButton}
            onPress={async () => {
              const r = await takePhoto()
              setImageUrl(r.uri)
              setShowCamera(false)
            }}>
            <Text style={styles.cameraText}> Capture </Text>
          </TouchableOpacity>
          </View>
        </View>
      </Camera> 
      : 
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.reviewContainer}>
          <View style={styles.topLabel}>
            <BackButton
              style={styles.backButton}
              onPress={() => setShowCamera(true)}
            />
            <Text style={styles.newPostText}> New Post </Text>
            <TouchableOpacity
              onPress={postReview}
              disabled={loading}
            >
              <Text style={styles.doneText}> Done </Text>
            </TouchableOpacity>
          </View>
          <Rating
            style={styles.ratingBar}
            tintColor={'cornsilk'}
            startingValue={3}
            onFinishRating={(rating) => {setRating(rating)}}
          />
          <Dropdown
            style={styles.dropdown}
            data={foodData}
            labelField='name'
            valueField='id'
            onChange={store => {
              setStoreName(store.name)
              setStoreId(store.id)
            }}
            search
            placeholder='Location'
            searchPlaceholder='Search'
            placeholderStyle={{color: 'grey'}}
          />
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={(title) => setTitle(title)}
            placeholder={'Title'}
            placeholderTextColor={'grey'}
          />
          <TextInput
            style={styles.descriptionInput}
            value={description}
            onChangeText={(description) => setDescription(description)}
            placeholder={"Describe the dish, price and share your experiences.."}
            placeholderTextColor={'grey'}
            multiline={true}
          />
          <Image
            style={styles.image}
            source={{url: imageUrl}}
          />
        </View>
      </TouchableWithoutFeedback>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'navajowhite'
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    margin: 20,
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  closeButton: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    width: 30,
    height: 30,
    borderRadius: 15,
    marginTop: 20,
  },
  closeIcon: {
    width: 15,
    height: 15,
    tintColor: 'white',
  },
  flipButton: {
    backgroundColor: 'black',
  },
  cameraButton: {
    backgroundColor: 'black',
  },
  cameraText: {
    fontSize: 18,
    color: 'white',
  },
  reviewContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'cornsilk',
  },
  topLabel: {
    backgroundColor: 'navajowhite',
    flexDirection: 'row',
    height: 100,
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  },
  backButton: {
    marginLeft: 15,
    marginBottom: 20,
  },
  newPostText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    marginLeft: 20    
  },
  doneText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'orange',
    marginRight: 20,
    marginBottom: 20,
  },
  ratingBar: {
    marginTop: 30,
  },
  dropdown: {
    width: 270,
    height: 45,
    borderRadius: 15,
    borderWidth: 7,
    borderColor: 'white',
    backgroundColor: 'white',
    marginTop: 20,
  },
  titleInput: {
    width: 270,
    height: 45,
    borderRadius: 15,
    borderWidth: 7,
    borderColor: 'white',
    backgroundColor: 'white',
    marginTop: 13,
    fontSize: 16,
  },
  descriptionInput: {
    width: 270,
    height: 130,
    borderRadius: 15,
    borderWidth: 7,
    borderColor: 'white',
    backgroundColor: 'white',
    marginTop: 13,
    fontSize: 13,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 15,
  }
});
