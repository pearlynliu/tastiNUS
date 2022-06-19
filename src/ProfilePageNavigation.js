import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import ProfilePage from './ProfilePage';
import SettingsPage from './SettingsPage';
import VoucherPage from './VoucherPage';

export default ProfilePageNavigation = ({ navigation, route }) => {

  React.useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (routeName != 'Profile' && routeName != undefined) {
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
      initialRouteName='Profile'
    >
      <Stack.Screen
        name='Profile'
        component={ProfilePage}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='Settings'
        component={SettingsPage}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='Voucher'
        component={VoucherPage}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  )
}