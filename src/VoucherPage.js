import { StyleSheet, Text, View } from "react-native";
import BackButton from "./components/BackButton";


export default VoucherPage = ({ navigation }) => {
  return (
    <View style={StyleSheet.container}>
      <View style={styles.topLabel}>
        <BackButton
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        />
        <Text style={{fontSize: 20, fontWeight: '500', marginBottom: 10}}>My Vouchers</Text>
      </View>
      <Text style={{alignSelf: 'center', fontSize: 18, marginTop: 250}}>You currently have no vouchers available</Text>
    </View>
  )
}

const styles=StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  topLabel: {
    backgroundColor: 'lightsalmon',
    width: '100%',
    height: 100,
    alignItems: 'center',
  },
  backButton: {
    marginTop: 28,
    marginLeft: 20,
    alignSelf: 'flex-start',
  }
})