// this is a placeholder page for all app features that is currently work in progress

import { StyleSheet, Text, View } from 'react-native';

export default WorkInProgress = () => {
  return (
    <View style={styles.container}>
      <Text style={[{fontSize: 20}, {alignSelf: 'center'}]}>Work in progress</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  }
})