import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import WelcomePage from './WelcomePage';
import WorkInProgress from './WorkInProgress';
import ForgetPasswordPage from './ForgetPasswordPage';


export default LoginNavigation = () => {

  const Stack = createNativeStackNavigator()
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Welcome"
      >
        <Stack.Screen
          name='Welcome'
          component={WelcomePage}
          options={{headerShown: false}}
        />
        <Stack.Screen 
          name="Login" 
          component={LoginPage}
          options={{
            headerStyle: {backgroundColor: 'cornsilk'},
            title: ''
          }}
        />
        <Stack.Screen 
          name="Signup" 
          component={SignUpPage}
          options={{
            headerStyle: {backgroundColor: 'cornsilk'},
            title: ''
          }}
        />
        <Stack.Screen 
          name="ForgetPassword" 
          component={WorkInProgress}
          options={{
            headerStyle: {backgroundColor: 'cornsilk'},
            title: ''
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
