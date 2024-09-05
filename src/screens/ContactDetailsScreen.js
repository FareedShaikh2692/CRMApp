import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ContactDetailsScreen = ({ route }) => {
  const { contact } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.contactName}>{contact.firstname + contact?.lastname}</Text>
      <Text >{contact.phone}</Text>
      <Text >{contact.email}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    margin:5
  },
  contactName: {
    fontSize: 20,
    fontWeight: 'bold',
   
  },

});

export default ContactDetailsScreen;
