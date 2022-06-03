import { StatusBar } from 'expo-status-bar';
import { useState, useEffect} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LoginNavigation from './LoginNavigation';
import Main from './Main';
import { supabase } from './supabaseClient';
 
export default function App() {
  const [session, setSession] = useState(false)

  useEffect(() => {
    setSession(supabase.auth.session())

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  if (!session) {
    return (<LoginNavigation/>)
  } else {
    return <Main key={session.user.id} session={session} />
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#fff',
    //alignItems: 'center',
    //justifyContent: 'center',
  },
});
