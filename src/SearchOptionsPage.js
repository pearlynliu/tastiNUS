import { StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView, ImageBackground, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import DATA from './FoodSuggestionData';

export default SearchOptionsPage = ({ search, onPress }) => {
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState(DATA);

  const Button = ({ name }) => ( //food store buttons being listed 
    <TouchableOpacity
      style={styles.button}
      onPress={() => onPress(name)}
    >
      <Text style={styles.text}>{name}</Text>
    </TouchableOpacity>
  );


  const renderButton = ({ item }) => (
    <Button 
      name={item.name}
    />
  );

  useEffect(() => {
    searchFilter()
  }, [search])

  const searchFilter = () => {
    if (search == '') {
      setFilteredDataSource(EMPTYDATA)
    } else {
      const newData = masterDataSource.filter(
        function (item) {
          const itemData = item.name
            ? item.name.toUpperCase()
            : ''.toUpperCase();
          const textData = search.toUpperCase();
          return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData)
    }
  }


  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        style={{width: '100%'}}
        contentContainerStyle={{alignItems: 'center'}}
        data={filteredDataSource}
        renderItem={renderButton}
      /> 
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  button: {
    width: 350,
    height: 40,
    //backgroundColor: 'blue',
    marginTop: 18,
    justifyContent: 'center',
  },
  text: {
    fontSize: 17,
  }
})


const EMPTYDATA = []