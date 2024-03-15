import React from 'react';
import { Image, Linking, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import style from '../../styles/default.js';

const Info = ( { navigation } ) => {

  const openLink = () => {
    const url = 'https://www.youtube.com/watch?v=H4FjPn48aG0';
    Linking.openURL( url ).catch( err => console.error( 'Error opening URL:', err ) );
  };
  return (

    <SafeAreaView style={ {  backgroundColor: '#F1F3F4', alignItems: 'center' } } screenReaderLabel="Defibrillator Information Screen">
      <View style={ style.backIconInfoPages }>
        <TouchableOpacity onPress={ () => navigation.navigate( 'Home' ) } accessibilityLabel="Navigate back to Dashboard">
          <Image source={ require( '../../images/arrow-back.png' ) } style={ { width: 55, height: 55 } } />
        </TouchableOpacity>
      </View>


      <View style={ { padding: '3%', height: '94%', width: '90%', borderRadius: 25, backgroundColor: '#00A34A', alignItems: 'center' } }>
        <View style={ {  flex: 1, alignItems: 'center', justifyContent: 'center' } }>
          <Text style={ { color: 'white', fontSize: 40, fontWeight: 'bold',fontFamily: 'Roboto',textAlign:'center' } }>
            What is a Defibrillator?</Text>
          <Image source={ require( '../../images/defib.jpg' ) } style={ { width: 225, height: 225 } } />

          <Text style={ { color: 'white', fontSize: 22, fontWeight: 'bold', fontFamily: 'Roboto', textAlign: 'center', marginTop: '2%' } }>
            A defibrillator is a device that gives a jolt of energy to the heart. It helps get the heart beating again when someone is in cardiac arrest and their heart has stopped.
            You might also hear it being called a defib, a PAD (public access defibrillator) or an AED (automated external defibrillator).</Text>

        </View>

      </View>

    </SafeAreaView>


  );
};

export default Info;
