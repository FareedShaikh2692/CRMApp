import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import ContactsScreen from '../screens/ContactsScreen';
import ContactDetailsScreen from '../screens/ContactDetailsScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text, Tooltip } from 'react-native-elements';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionId = await AsyncStorage.getItem('sessionid');
        setIsLoggedIn(!!sessionId);
      } catch (error) {
        console.error("Failed to check session data:", error);
        setIsLoggedIn(false);
      }
    };

    checkSession();
  }, []);

  const logout = async (navigation) => {
    try {
      await AsyncStorage.removeItem('sessionid');
      setIsLoggedIn(false);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error("Failed to clear session data:", error);
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLoggedIn ? "Contacts" : "Login"}>
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
        <Stack.Screen
          name="Contacts"
          component={ContactsScreen}
          options={({ navigation }) => ({
            title: 'Contacts List',
            headerRight: () => (
              <Tooltip popover={<Text>Logout</Text>}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => logout(navigation)}
                >
                  <Icon name="logout" size={20} color="#007BFF" />
                </TouchableOpacity>
              </Tooltip>
            ),
          })}
        />
        <Stack.Screen name="ContactDetails" component={ContactDetailsScreen} options={{ title: 'Contact Details' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AppNavigator;
