import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const ContactsScreen = ({ navigation }) => {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const getConatactData = async () => {
    try {
      const sessionId = await AsyncStorage.getItem('sessionid');
      const response = await axios.get(`https://personal1714.od2.vtiger.com/webservice.php?operation=query&sessionName=${sessionId}&query=SELECT * FROM Contacts;`);
      setContacts(response.data.result);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  }
  useEffect(() => {
    getConatactData()
  }, []);

  const filteredContacts = contacts.filter(contact =>
    contact.firstname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity contentContainer style={styles.detailsContainer} onPress={() => navigation.navigate('ContactDetails', { contact: item })}>
      <Text style={styles.name}>{item.firstname + item?.lastname}</Text>
      <Text style={styles.contactEmail}>{item.email}</Text>
    </TouchableOpacity>

  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search By Name"
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.noResultsText}>No contacts found</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  searchBar: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    fontSize: 16,
    color: '#333',
  },

  detailsContainer: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
    margin:5
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  position: {
    fontSize: 16,
    color: '#666',
  },

});

export default ContactsScreen;
