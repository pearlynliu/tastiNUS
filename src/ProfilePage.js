import { Modal, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View, FlatList } from "react-native";
import { useState, useEffect } from 'react';
import { supabase } from "./supabaseClient";
import { useSelector, useDispatch } from "react-redux";
import { refreshApp } from "./store/refresh";

export default ProfilePage = ({ navigation }) => {

  const [profile, setProfile] = useState([])
  const [loading, setLoading] = useState(false)
  const [reviews, setReviews] = useState([])
  const [isDeleting, setIsDeleting] = useState(false)
  const refresh = useSelector((state) => state.refreshStore.refresh)
  const dispatch = useDispatch()

  /*
    these variables purely exist because usage of modal messes with the details being sent into deleteReview()
    this serves as a way to make sure the id and filePath being sent in is correct
    DO NOT USE FOR OTHER REASONS
  */
  const [deleteId, setDeleteId] = useState(null)
  const [deleteFileName, setDeleteFileName] = useState(null)
  const [deleteRating, setDeleteRating] = useState(null)
  const [deleteAuthorId, setDeleteAuthorId] = useState(null)
  const [deleteStoreId, setDeleteStoreId] = useState(null)

  useEffect(() => {
    getProfile()
  }, [refresh])

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

  useEffect(() => {
    getReviews()
  }, [refresh])

  const getReviews = async () => {
    try {
      setLoading(true)
      const user = supabase.auth.user()
      let { data, error, status } = await supabase
        .from('reviews')
        .select(`*`)
        .eq('author_id', user.id)

        if (error && status !== 406) {
          throw error
        }
  
        if (data) {
          setReviews(data)
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

  const gotoVoucherPage = () => {
    navigation.navigate('Voucher')
  }

  const deleteReview = async (review_id, rating, author_id, store_id, image_fileName) => {
    setLoading(true)
    try {
      const { data: deleteData, error: deleteError } = await supabase
        .from('reviews')
        .delete()
        .eq('id', review_id)

      if (deleteError) {
        throw deleteError
      }

      const { data: deleteImage, error: deleteImageError } = await supabase
        .storage
        .from('review-images')
        .remove([image_fileName])
      
        if (deleteImageError) {
          throw deleteImageError
        }

      const { data: functionData, error:functionError } = await supabase
        .rpc('review_decrement', {rating: rating, author_id: author_id, store_id: store_id})

      if (functionError) {
        throw functionError
      }

      alert('Review successfully deleted')
      dispatch(refreshApp())
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const Reviews = ({ title, image_url, store_name, description, rating, review_id, store_id, author_id, image_fileName }) => ( //food store buttons being listed 
    <View style={styles.review}>
      <Image
        style={styles.reviewImage}
        source={{url: image_url}}
      />
      <View style={styles.descriptionContainer}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            setIsDeleting(true)
            setDeleteId(review_id)
            setDeleteFileName(image_fileName)
            setDeleteRating(rating)
            setDeleteAuthorId(author_id)
            setDeleteStoreId(store_id)
          }}
          disabled={isDeleting}
        >
          <Image
            style={styles.crossIcon}
            source={require('./images/cross_icon.png')}
          />
        </TouchableOpacity>
        <Text> {title} </Text>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 5,}}>
          <Image
            style={styles.locationIcon}
            source={require('./images/location_icon.png')}
          />
          <Text style={styles.titleText}> {store_name} </Text>
        </View>
        <Text style={styles.descriptionText}> {description} </Text>
        <View style={styles.starContainer}>
          <Text> {rating} </Text>
          <Image
            style={styles.starIcon}
            source={require('./images/star.png')}
          />
        </View>
      </View>
      

      <Modal
        animationType="slide"
        visible={isDeleting}
        transparent={true}
      >
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View style={styles.deleteModal}>
            <Text style={styles.modalText}> Delete this review? </Text>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  deleteReview(deleteId, deleteRating, deleteAuthorId, deleteStoreId, deleteFileName)
                  setIsDeleting(false)
                }}
              >
                <Text style={{color: 'green', fontSize: 20}}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setIsDeleting(false)}
              >
                <Text style={{color: 'red', fontSize: 20}}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );

  const renderReviews = ({ item }) => (
    <Reviews 
      title={item.title}
      image_url={item.image_url}
      store_name={item.store_name}
      description={item.description}
      rating={item.rating}
      review_id={item.id}
      store_id={item.store_id}
      author_id={item.author_id}
      image_fileName={item.image_file_name}
    />
  );

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
            style={styles.settingButtons}
            onPress={gotoSettingsPage}
          >
            <Text>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.settingButtons}
            onPress={gotoVoucherPage}
          >
            <Text style={{fontSize: 12}}>My Vouchers</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
      <Text style={styles.nameText}>{profile.first_name + ' ' + profile.last_name}</Text>
      <Text style={{fontSize: 12, marginBottom: 8}}>{profile.review_count} Reviews</Text>
      </View>
      <Text style={styles.reviewsText}>Reviews</Text>
      <FlatList
        style={{width: '100%', marginBottom: 100,}}
        contentContainerStyle={{alignItems: 'center'}}
        data={reviews}
        renderItem={renderReviews}
      /> 
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
  settingButtons: {
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
  reviewsText: {
    alignSelf: 'flex-start',
    marginLeft: 35,
    fontSize: 16,
    marginTop: 20,
  },
  review: {
    width: 300,
    height: 100,
    flexDirection: 'row',
    backgroundColor: 'white',
    margin: 8,
    borderRadius: 10,
  },
  reviewImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },
  descriptionContainer: {
    width: 200,
    alignItems: 'flex-start',
    //backgroundColor: 'red'
  },
  deleteButton: {
    alignSelf: 'flex-end',
    marginTop: 10,
    marginBottom: -10,
    width: 12,
    height: 12,
    alignItems: 'center',
    justifyContent: "center"
    //backgroundColor: 'red'
  },
  crossIcon: {
    width: 10,
    height: 10,
  },
  locationIcon: {
    width: 9,
    height: 13,
    tintColor: 'grey',
  },
  titleText : {
    fontSize: 11,
    color: 'grey'
  },
  descriptionText: {
    fontSize: 10,
    marginLeft: 3
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 25,
    backgroundColor: 'white',
    marginLeft: -70,
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 0.5,
  },
  starIcon: {
    width: 20,
    height: 20,
  },
  deleteModal: {
    width: 300,
    height: 200,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 30
  },
  modalText: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 40,
  },
  modalButton: {
    //backgroundColor: 'blue',
    width: 80,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 30,
  },
})