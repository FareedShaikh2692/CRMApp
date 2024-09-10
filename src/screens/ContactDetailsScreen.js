import React from 'react';
import { View, Text, StyleSheet, ScrollView, } from 'react-native';


const ContactDetails = ({ route }) => {
  const { contact } = route.params;
  const getInitials = (firstName, lastName) => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}`;
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileContainer}>

        <View style={styles.profileInitial}>
          <Text style={styles.initialText} >{getInitials(contact.firstname, contact.lastname)}</Text>
        </View>


        <Text style={styles.profileName}>{contact.firstname} {contact.lastname}</Text>
        <Text style={styles.profileEmail}>{contact.email}</Text>
      </View>
      <View style={styles.itemContainer}>
        {Object.keys(contact).map((key) => {
          // Skip rendering if the key is 'assigned_user_id'
          if (key === 'firstname' || key === 'lastname' || key === 'phone' || key === 'email' || key === 'department' || key === 'contactstatus' || key === 'contacttype' || key === 'birthday') {
            return (
              <View key={key} style={styles.itemList}>
                <Text style={styles.label}>
                  {
                    key === 'firstname' ? 'FIRST NAME' :
                      key === 'lastname' ? 'LAST NAME' :
                        key === 'contactstatus' ? 'CONTACT STATUS' :
                          key === 'contactstatus' ? 'CONTACT TYPE' :
                            key.replaceAll('_', ' ')
                              .toUpperCase()}:
                </Text>
                <Text style={styles.value}>{contact[key] || 'N/A'}</Text>
              </View>
            );

          }
          return null;
        })}
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9ecef',
    padding: 16,

  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#ced4da',
    paddingBottom: 10,
    paddingTop: 10,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  profileInitial: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#007bff',
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(231, 241, 255)',

    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,

    // Elevation for Android
    elevation: 5,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#343a40',
  },
  profileEmail: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 12,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  itemContainer: {
    marginBottom: 30,
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,

  },
  itemList: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  label: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 4,
  },
  value: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#212529',
    justifyContent: 'start'
  },
  initialText: {
    color: '#007bff',
    fontSize: 40,
    fontWeight: 'bold',
  }

});

export default ContactDetails;
