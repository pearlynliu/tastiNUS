import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import HomePage from './HomePage';
import WorkInProgress from './WorkInProgress';


export default LoginNavigation = () => {

  const Stack = createNativeStackNavigator()
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name='Home'
          component={HomePage}
        />
        <Stack.Screen 
          name="Login" 
          component={LoginPage}
          options={{
            headerStyle: {backgroundColor: 'cornsilk'}
          }}
        />
        <Stack.Screen 
          name="Signup" 
          component={SignUpPage}
          options={{
            headerStyle: {backgroundColor: 'cornsilk'}
          }}
        />
        <Stack.Screen 
          name="WorkInProgress" 
          component={WorkInProgress}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
