import { useState, useEffect} from 'react';
import { StyleSheet } from 'react-native';
import LoginNavigation from './LoginNavigation';
import Main from './Main';
import { supabase } from './supabaseClient';
import { Provider } from 'react-redux';
import { store } from './store/store';
 
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
