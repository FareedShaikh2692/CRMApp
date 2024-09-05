import React from 'react';
import { NavigationContainer,  } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import ContactsScreen from '../screens/ContactsScreen';
import ContactDetailsScreen from '../screens/ContactDetailsScreen';
const Stack = createStackNavigator();
const AppNavigator = () => {
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">       
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
          <Stack.Screen name="Contacts" component={ContactsScreen} options={{ title: 'Contacts' }} />
          <Stack.Screen name="ContactDetails" component={ContactDetailsScreen} options={{ title: 'Contact Details' }} />           
      </Stack.Navigator>
    </NavigationContainer>   
  );
};

export default AppNavigator;
