import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, TouchableOpacity, Modal, ActivityIndicator, RefreshControl } from 'react-native';
import { ALERT_TYPE, Dialog, Toast } from 'react-native-alert-notification';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ContactsScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [contacts, setContacts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [pageLoader, setpageLoader] = useState(false)
  const [buttonloader, setbuttonloader] = useState(false)
  const [selectedDetails, setselectedDetails] = useState('')
  const [firstname, setfirstname] = useState();
  const [lastname, setlastname] = useState();
  const [email, setemail] = useState();
  const [phone, setphone] = useState();
  const [refreshing, setRefreshing] = useState(false);

  const getConatactData = async () => {
    setpageLoader(true)
    try {
      const sessionId = await AsyncStorage.getItem('sessionid');
      const response = await axios.get(`https://personal1714.od2.vtiger.com/webservice.php?operation=query&sessionName=${sessionId}&query=SELECT * FROM Contacts;`);
      setContacts(response.data.result);
    } catch (error) {      
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Something went wrong. Please try again later.',
      })
    }
    setpageLoader(false)
  }

  const updateContact = async () => {
    setbuttonloader(true)
    const sessionId = await AsyncStorage.getItem('sessionid');
    const url = 'https://personal1714.od2.vtiger.com/webservice.php';
    const params = {
      operation: 'update',
      sessionName: sessionId,
      elementType: 'Contacts',
      element: JSON.stringify({
        id: selectedDetails?.id,
        firstname: firstname,
        lastname: lastname,
        email: email,
        phone: phone,
        assigned_user_id: "19x1"
      })
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(params).toString()
      });

      await response.json();
      getConatactData()
      setModalVisible(false)
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Success',
        textBody: 'Contact Details Updated Successfully',
        button: 'close',
      })
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Something went wrong. Please try again later.',
      })
      console.error('Error:', error);
    }
    setbuttonloader(false)
  }


  const deleteContact = async (item) => {
    setpageLoader(true)
    const sessionId = await AsyncStorage.getItem('sessionid');
    const params = {
      operation: 'delete',
      sessionName: sessionId,    
      id: item?.id
    };

    const url = 'https://personal1714.od2.vtiger.com/webservice.php';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(params).toString()
      });

      const responseText = await response.text();
      try {
        const result = JSON.parse(responseText);
        console.log('Delete Response:', result);
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Success',
          textBody: 'Deleted Successfully',
          button: 'close',
        })
      } catch (jsonError) {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Error',
          textBody: 'Something went wrong. Please try again later.',
        })      
      }
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Something went wrong. Please try again later.',
      })      
    }
    getConatactData()
    setpageLoader(false)
  }

  const updateDetails = (item) => {
    setfirstname(item?.firstname)
    setlastname(item?.lastname)
    setemail(item?.email)
    setphone(item?.phone)
    setselectedDetails(item)
    setModalVisible(true)
  }
  const onRefresh = () => {

    setRefreshing(true);
    getConatactData()
      setRefreshing(false);
  };
  useEffect(() => {
    getConatactData()
  }, []);

  const filteredContacts = contacts?.filter(contact =>
    contact.firstname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View style={styles.previewContainer}>
      <View
        style={[
          styles.box,
          {
            flexBasis: 'auto',
            flexGrow: 80,
            flexShrink: 1,
            padding: 5,
            backgroundColor: '#fff',
          },
        ]}
      >
        <Text style={styles.name}>{item?.firstname + (' '+item?.lastname || '')}</Text>
        <Text style={styles.contactEmail}>{item?.email || ''}</Text>
      </View>
      <View
        style={[
          styles.box,
          {
            flexBasis: 'auto',
            flexGrow: 20,
            flexShrink: 1,
            padding: 2,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center'
          },
        ]}
      >
        <View style={[{ flexDirection: 'row' },]}>
          <TouchableOpacity
            style={[styles.button,]}
            onPress={() => { updateDetails(item) }}
          >
            <Icon name="edit" size={20} color="#007BFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button,]}
            onPress={() => navigation.navigate('ContactDetails', { contact: item })}
          >
            <Icon name="visibility" size={20} color="#28A745" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button,]}
            onPress={() => deleteContact(item)}
          >
            <Icon name="delete" size={20} color="#DC3545" />
          </TouchableOpacity>
        </View>
      </View>
    </View>

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
      {
        pageLoader ? (<ActivityIndicator size="large" color="#0000ff" />) : (<>
          <FlatList
            data={filteredContacts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            ListEmptyComponent={<Text style={styles.noResultsText}>No contacts found</Text>}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#009688']} // Customize refresh control color
                progressBackgroundColor="#ffffff" // Customize background color
              />}
          />
        </>)
      }
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}  // Android back button closes modal
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Contact Details</Text>

            {/* Name Input */}
            <TextInput
              style={styles.input}
              placeholder="Enter your first name"
              value={firstname}
              onChangeText={(text) => setfirstname(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter your last name"
              value={lastname}
              onChangeText={(text) => setlastname(text)}
            />

            {/* Email Input */}
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              keyboardType="email-address"
              value={email}
              onChangeText={(text) => setemail(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              maxLength={15}
              value={phone}
              onChangeText={(text) => setphone(text)}
            />
            <View style={{
              flexBasis: 'auto',
              flexGrow: 100,
              flexShrink: 1,
              padding: 5,
              backgroundColor: '#fff',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <TouchableOpacity style={styles.modalbuttonCancel} onPress={() => setModalVisible(false)}>
                  <Text style={{ fontSize: 14, color: '#fff', fontWeight: 600 }} >Cancel</Text>
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1 }}>
                <TouchableOpacity style={styles.modalbuttonSave} onPress={() => updateContact()}   >
                  {buttonloader ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <Text style={{ fontSize: 14, color: '#fff', fontWeight: 600 }} >Submit</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
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

  button: {
    flex: 1,
    marginHorizontal: 2,
    paddingVertical: 2,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalbuttonCancel: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalbuttonSave: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 16,
    color: '#333',
    width: '100%',
  },

  box: {
    flex: 1,
    height: 60,
  },
  previewContainer: {
    flex: 1,
    margin: 5,
    borderRadius: 5,
    flexDirection: 'row',
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },

  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },



  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Semi-transparent background
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
  },
  closeButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  noResultsText: {
    padding: 10
  },
});

export default ContactsScreen;
