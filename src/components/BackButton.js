/**
 * creates a button with a back arrow to function as a go-back button
 * 
 * @params {onPress} function that is executed when button is pressed (just use navigation.goBack() and it will work)
 * @params {style} style of the button
 * @params {arrowStyle} style of the arrow icon
 */

import { Image, StyleSheet, TouchableOpacity } from "react-native";

export default BackButton = ({onPress, style, arrowStyle}) => {
  return (
  <TouchableOpacity
    style={[styles.button, style]}
    onPress={onPress}
  >
    <Image style={[styles.image, arrowStyle]} source={require('./../images/back_button_icon.png')}/>
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
    
  },
  image: {
    width: 20,
    height: 20,
  }
})