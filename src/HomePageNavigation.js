import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import HomePage from './HomePage';
import FoodPage from './FoodPage';
import SearchPage from './SearchPage';
import RandomGenerator from "./RandomGenerator";
import WorkInProgress from './WorkInProgress';

export default HomePageNavigation = ({ navigation, route }) => {
  
  React.useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (routeName != 'Home' && routeName != undefined) {
    navigation.setOptions({ tabBarStyle: { display: "none" } });
    } else {
      navigation.setOptions({ 
        tabBarStyle: { 
          display: "flex",
          position: 'absolute',
          bottom: 30,
          left: 20,
          right: 20,
          elevation: 0,
          borderRadius: 30,
          height: 60, 
        } 
      });
    }
}, [navigation, route]);

  const Stack = createNativeStackNavigator()

  return (
    <Stack.Navigator
      initialRouteName='Home'
     >
       <Stack.Screen
         name='Home'
         component={HomePage}
         options={{
           headerShown: false,
           headerBackTitleVisible: false,
          }}
         
       />
       <Stack.Screen
         name='RandomGenerator'
         component={RandomGenerator}
         options={{
          headerShown: false,
        }}
       />
      <Stack.Screen
        name='Search'
        component={SearchPage}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='Food'
        component={FoodPage}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  )
}
