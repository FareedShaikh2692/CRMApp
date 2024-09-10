import React, { useState } from 'react';
import { View, Text, TextInput,Image, Alert, StyleSheet, ActivityIndicator ,TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import CryptoJS from 'crypto-js';
const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const VTIGER_BASE_URL = 'https://personal1714.od2.vtiger.com'
  const ACCESS_KEY = 'wUj0Rj5a8X0CyEQa'; 

  const getChallenge = async () => {
    try {
      const response = await fetch(
        `${VTIGER_BASE_URL}/webservice.php?operation=getchallenge&username=${email}`
      );
      const result = await response.json();

      if (result.success) {
        return result.result.token;
      } else {
        throw new Error('Failed to get challenge token');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const generateAccessKey = (token, accessKey) => {
    const combinedKey = `${token}${accessKey}`;
    const hashedAccessKey = CryptoJS.MD5(combinedKey).toString();
    return hashedAccessKey;
  };

  const login = async () => {
    setLoading(true);
    const token = await getChallenge();

    if (!token) {
      setLoading(false);
      console.error('Failed to retrieve token');
      return;
    }

    const hashedAccessKey = generateAccessKey(token, ACCESS_KEY);

    const loginData = {
      operation: 'login',
      username: email,
      accessKey: hashedAccessKey,
    };

    try {
      const response = await fetch(`${VTIGER_BASE_URL}/webservice.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(loginData).toString(),
      });

      const result = await response.json();

      if (result.success) {
        console.log('Login successful! Session:', result.result.sessionName);
        await AsyncStorage.setItem('sessionid', result.result.sessionName);
        navigation.navigate('Contacts');
        setLoading(false);
      } else {
        setLoading(false);
        Alert.alert('Invalid credentials', 'Please check your email and password.');
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>

          <Image
            source={{ uri: 'https://fareedshaikh2692.github.io/my-portfolio/assets/img/appstore.png' }} // Replace with your logo
            style={styles.logo}
          />
          <Text style={styles.title}>Welcome Back!</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity style={styles.loginButton} onPress={login}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 16,
    color: '#333',
    width: '100%',
  },
  loginButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#aaa',
    fontSize: 16,
  },
  signUpText: {
    color: '#007BFF',
    fontSize: 16,
    marginLeft: 5,
  },
});

export default LoginScreen;
