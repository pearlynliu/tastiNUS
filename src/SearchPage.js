import { StyleSheet, View, TextInput, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useState } from 'react';
import BackButton from './components/BackButton';
import SearchOptionsPage from './SearchOptionsPage';
import SearchResultsPage from './SearchResultsPage';

export default SearchPage = ({ navigation }) => {
  const [search, setSearch] = useState('')
  const [tempSearch, setTempSearch] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  return (
    <SafeAreaView style={styles.container}>
      <BackButton 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      />
      <View style={styles.searchBar}>
        <Image
          style={styles.searchIcon}
          source={require('./images/magnifying_glass_icon.png')}
        />
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={(text) => setSearch(text)}
          placeholder={'Search'}
          returnKeyType='search'
          onPressIn={() => setIsSearching(true)}
          onSubmitEditing={() => setIsSearching(false)}
        />
        <TouchableOpacity 
          style={styles.clearButton}
          onPress={() => setSearch('')}>
          <Image
            style={styles.crossIcon}
            source={require('./images/cross_icon.png')}
          />
        </TouchableOpacity>
      </View>
      {isSearching 
          ? <SearchOptionsPage
              search={search}
              onPress={(text) => {
                setSearch(text)
                setIsSearching(false)
              }}
            /> 
          : <SearchResultsPage 
              search={search} 
              navigation={navigation}
            />
      }
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginTop: 10,
    marginLeft: 20,
  },
  searchBar: {
    width: 300,
    height: 60,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 30,
    marginTop: 10,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    width: 25,
    height: 25,
    marginLeft: 15,
    tintColor: 'grey',
  },
  searchInput: {
    width: 225,
    height: 50,
    //backgroundColor: 'red',
    borderRadius: 10,
    borderWidth: 10,
    borderColor: 'transparent',
    fontSize: 20,
  },
  clearButton: {
    width: 25,
    height: 25,
    //backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
  },
  crossIcon: {
    width: 12,
    height: 12,
    tintColor: 'grey'
  },
})