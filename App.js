import React from 'react';
import {
  SafeAreaView,
  StyleSheet,    
} from 'react-native';
import {AlertNotificationRoot } from 'react-native-alert-notification';
import AppNavigator from './src/navigation/AppNavigator'
const  App = () =>{
  return (
    <SafeAreaView style={styles?.root}>
      <AlertNotificationRoot>
      <AppNavigator/>    
      </AlertNotificationRoot>
    
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
 root:{
  flex:1
 }
});

export default App;
