import {  StyleSheet, TouchableOpacity, Image, View } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { supabase, Guest } from "./supabaseClient";
import HomePageNavigation from "./HomePageNavigation";
import 'react-native-url-polyfill/auto';
import GuestPage from "./GuestPage";
import ProfilePageNavigation from "./ProfilePageNavigation";
import ReviewsPage from "./ReviewsPage";

export default Main = () => {
  const user = supabase.auth.user()
  const Tab = createBottomTabNavigator()

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={tabs.tabBar}>
        <Tab.Screen
          name='HomePage'
          component={HomePageNavigation}
          options={tabs.hometab}
        />
        <Tab.Screen
          name='Camera'
          component={user.id != Guest.id ? ReviewsPage : GuestPage}
          options={tabs.cameratab}
        />
        <Tab.Screen
          name='ProfilePage'
          component={user.id != Guest.id ? ProfilePageNavigation : GuestPage}
          options={tabs.profiletab}
        />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

const CameraTabButton = ({children, onPress}) => {
  return (
  <TouchableOpacity
    style={styles.cameraButton}
    onPress={onPress}
  >
    <View style={styles.cameraIcon}>
      {children}
    </View>
  </TouchableOpacity>
)
}

const tabs = StyleSheet.create({
  hometab: {
    headerShown: false,
    tabBarIcon: (props) => 
    (<Image 
        source={require('./images/house_icon.png')}
        style={{width:30, height: 30, tintColor: props.color}}
    />),
  },
  cameratab: {
    headerShown: false,
    tabBarIcon: () => 
    (<Image 
        source={require('./images/camera_icon.png')}
        style={{width:55, height: 55, tintColor:'black'}}
    />),
    tabBarButton: (props) => (
      <CameraTabButton {...props}/>
    )
  },
  profiletab: {
    headerShown: false,
    tabBarIcon: (props) => 
    (<Image 
        source={require('./images/profile_icon.png')}
        style={{width:30, height: 31, tintColor: props.color}}
    />),
  },
  tabBar: {
    tabBarShowLabel: false,
    tabBarStyle: {
      position: 'absolute',
      bottom: 30,
      left: 20,
      right: 20,
      elevation: 0,
      borderRadius: 30,
      height: 60,
    },
    tabBarActiveTintColor: 'orange',
    tabBarInactiveTintColor: 'grey',
  }
})

const styles=StyleSheet.create({
  cameraButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIcon: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'moccasin',
  }
})