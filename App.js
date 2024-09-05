import React from 'react';
import {
  SafeAreaView,
  StyleSheet,    
} from 'react-native';

import AppNavigator from './src/navigation/AppNavigator'
const  App = () =>{
  return (
    <SafeAreaView style={styles?.root}>
      <AppNavigator/>    
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
 root:{
  flex:1
 }
});

export default App;
