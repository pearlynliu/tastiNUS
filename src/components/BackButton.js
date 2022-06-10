import { Image, StyleSheet, TouchableOpacity } from "react-native";

export default BackButton = ({onPress}) => {
  return (
  <TouchableOpacity
    style={styles.button}
    onPress={onPress}
  >
    <Image style={styles.image} source={require('./../images/back_button_icon.png')}/>
  </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    borderWidth: 1,
    backgroundColor: 'white'
  },
  image: {
    width: 20,
    height: 20,
  }
})