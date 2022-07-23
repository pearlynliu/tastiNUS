import { useState, useEffect} from 'react';
import { StyleSheet } from 'react-native';
import LoginNavigation from './LoginNavigation';
import Main from './Main';
import ResetPasswordPage from './ResetPasswordPage.js'
import { supabase } from './supabaseClient';
import { Provider } from 'react-redux';
import { store } from './store/store';
import * as Linking from 'expo-linking';
 
export default function App() {
  const [session, setSession] = useState(false)
  const [url, setUrl] = useState('')

  const useMount = func => useEffect(() => func(), []);
  useMount(() => {
    const getUrlAsync = async () => {
      // Get the deep link used to open the app
      const initialUrl = await Linking.getInitialURL();
      setUrl(initialUrl)
      
      try {
        const newUrl = Linking.addEventListener('url', ({url}) => setUrl(url))
      } catch (error) {
        console.log(error)
      }
    }; 

    getUrlAsync();
  });

  useEffect(() => {
    setSession(supabase.auth.session())

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

 if (!session) {
  if (url.includes('type=recovery')) {
    return (<ResetPasswordPage url={url}/>)
  } else {
    return (<LoginNavigation/>)
  }
  } else {
    return (
      <Provider store={store}>
        <Main key={session.user.id} session={session} />
      </Provider>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
