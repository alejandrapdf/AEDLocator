import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import style from '../../styles/default.js';


const UserManual = ( { navigation } ) => {
  const carouselData = [
    {
      id: 1, image: require( '../../images/locateNow.png' ), text: 'Home Screen'
    },
    {
      id: 2, image: require( '../../images/locateNowMap.png' ), text: 'Locate Screen'
    },
  ];



  return (

    <SafeAreaView style={ {  backgroundColor: '#F1F3F4', alignItems: 'center' } } screenReaderLabel="Defibrillator Information Screen">
      <View style={ style.backIconInfoPages }>
        <TouchableOpacity onPress={ () => navigation.navigate( 'Home' ) } accessibilityLabel="Navigate back to Dashboard">
          <Image source={ require( '../../images/arrow-back.png' ) } style={ { width: 55, height: 55 } } />
        </TouchableOpacity>
      </View>


      <View style={ { padding: 10,height: '92%', width: '90%', borderRadius: 25, backgroundColor: '#A1A1A1', alignItems: 'center' } }>
      <Text style={ { color: 'white', fontSize: 50, fontWeight: 'bold', fontFamily: 'Roboto', textAlign: 'center' } }>
            How to Use this App?</Text>
          <Text style={ { color: 'white', fontSize: 25, marginTop: 20, marginBottom: 20, fontFamily: 'Roboto', textAlign: 'center' } }>
            Swipe to explore App Features</Text>
        <PagerView style={ { flex: 1, width: '100%', height: '100%' } } initialPage={ 0 }>

          { carouselData.map( ( item ) => (
            <View style={ { alignItems: 'center' } } key={ item.id.toString() }>
              <Image source={ item.image } style={ { width: '90%', height: '70%' } } />
              <Text style={ { color: 'white', fontSize: 30, fontWeight: 'bold', fontFamily: 'Roboto', textAlign: 'center', marginTop: 10 } }>{ item.text }</Text>
            </View>
          ) ) }

          </PagerView>
        </View>

    </SafeAreaView>


  );
};

export default UserManual;
