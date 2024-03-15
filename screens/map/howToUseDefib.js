import React from 'react';
import { Image, Linking, Text, TouchableOpacity, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import style from '../../styles/default.js';

const HowToUseDefib = ( { navigation } ) => {
  console.log( "nav", navigation );
  const carouselData = [
    {
      id: 1, image: require( '../../images/step1.jpg' ), text: 'Press the on button to switch on the defibrillator and follow the instructions.' },
    {
      id: 2, image: require( '../../images/step2.jpg' ), text: 'Remove the person’s clothing above the waist, and if required shave the chest area. Most defibrillator packs have tools like scissors to help you to do this.'
    }, {
      id: 3, image: require( '../../images/step3.jpg' ), text: 'Peel off the sticky pads and attach them to the person’s bare skin. Put one pad on each side of the chest as shown in the picture on the defibrillator.'},
    {
      id: 4, image: require( '../../images/step4.jpg' ), text: 'Once you have attached the pads, stop CPR and do not touch the person. The defibrillator will then check the person’s heart rhythm.'
    },
    {
      id: 5, image: require( '../../images/step5.jpg' ), text: 'The defibrillator will decide whether a shock is needed and will tell you when to press the ‘shock’ button. Do not touch the person while they’re being shocked.'
    },
    {
      id: 6, image: require( '../../images/step6.jpg' ), text: 'The defibrillator will tell you when the shock has been given and whether you need to continue CPR.'
    },
    {
      id: 7, image: require( '../../images/step7.jpg' ), text: 'If the defibrillator tells you to continue to do CPR, continue with chest compressions until the person shows signs of life, or the defibrillator tells you to stop so it can analyse the heartbeat again.'
    },
    {
      id: 8, image: require( '../../images/step8.jpg' ), text: 'The AED will continue analysing heart rhythm and instruct to do either CPR or administer shocks. Continue this until emergency services arrive.'
    },
      ];

  const renderItem = ( { item } ) => (
    <View style={ { alignItems: 'center' } }>
      <Image source={ item.image } style={ { width: 300, height: 300 } } />
      <Text style={ { color: 'white', fontSize: 18, fontWeight: 'bold',fontFamily: 'Roboto', textAlign: 'center', marginTop: 10 } }>{ item.text }</Text>
    </View>
  );
  const openLink = () => {
    const url = 'https://www.youtube.com/watch?v=H4FjPn48aG0';
    Linking.openURL( url ).catch( err => console.error( 'Error opening URL:', err ) );
  };
  return (

    <SafeAreaView style={ { backgroundColor: '#F1F3F4', alignItems: 'center' } } screenReaderLabel="Defibrillator Information Screen">
      <View style={ style.backIconInfoPages }>
        <TouchableOpacity onPress={ () => navigation.navigate( 'Home' ) } accessibilityLabel="Navigate back to Dashboard">
          <Image source={ require( '../../images/arrow-back.png' ) } style={ { width: 55, height: 55 } } />
        </TouchableOpacity>
      </View>


      <View style={ { padding: '5%', height: '95%', width: '90%', borderRadius: 25, backgroundColor: '#3384F9', alignItems: 'center' } }>

        <Text style={ { color: 'white', fontSize: 35, fontWeight: 'bold',fontFamily: 'Roboto',textAlign:'center' } }>How to Use A Defib</Text>

        <PagerView style={ { flex: 1, width: '100%', height: '100%' } } initialPage={ 0 }>

          { carouselData.map( ( item ) => (
            <View style={ { alignItems: 'center' } } key={ item.id.toString() }>

              <Image source={ item.image } style={ { width: '100%', height: '50%' } } />
              { item.id === 1 && (

                <View style={ { marginTop: '5%', flexDirection: 'row' } }>

                  <Text style={ { color: 'white', fontStyle:'italic', fontSize: 20, fontFamily: 'Roboto', textAlign: 'center', marginLeft: '5%', marginRight: '5%' } }>
                    Swipe left for next step
                  </Text>

                </View>
              ) }
              { item.id === 1 && (

                <View style={ { marginTop: '5%', flexDirection: 'row' } }>

                  <Text style={ { color: 'white', fontWeight: 'bold', fontSize: 30, fontFamily: 'Roboto', textAlign: 'center', marginLeft: '5%', marginRight: '5%' } }>
                    { item.id.toString() } / 8
                  </Text>
                  <Image source={ require( '../../images/right-arrow.png' ) } style={ { width: 25, height: 35 } } />

                </View>
              ) }
              { item.id >= 2 && item.id <= 7 && (
                <View style={ { marginTop: '5%', flexDirection: 'row' } }>
                  <Image source={ require( '../../images/left-arrow.png' ) } style={ { width: 25, height: 35 } } />
                  <Text style={ { color: 'white', fontWeight: 'bold', fontSize: 25, fontFamily: 'Roboto', textAlign: 'center', marginLeft: '5%', marginRight: '5%' } }>
                    { item.id.toString() } / 8
                  </Text>
                  <Image source={ require( '../../images/right-arrow.png' ) } style={ { width: 25, height: 35 } } />
                </View>
              ) }

              { item.id === 8 && (
                <View style={ { marginTop: '5%', flexDirection: 'row' } }>
                  <Image source={ require( '../../images/left-arrow.png' ) } style={ { width: 25, height: 35 } } />
                  <Text style={ { color: 'white', fontWeight: 'bold', fontSize: 25, fontFamily: 'Roboto', textAlign: 'center', marginLeft: '5%', marginRight: '5%' } }>
                    { item.id.toString() } / 8
                  </Text>
                </View>
              ) }



              <Text style={ { color: 'white', fontSize: 23, fontFamily: 'Roboto', textAlign: 'center', marginTop: 10 } }>{ item.text }</Text>



            </View>
          ) ) }

          </PagerView>

        <View >
        <Text style={ { color: 'white', fontWeight: 'bold', fontStyle: 'italic', fontSize: 20, fontFamily: 'Roboto', marginTop:'1%',textAlign: 'center' } }>Need More Help?</Text>
        <TouchableOpacity style={ { ...style.instruct } } onPress={ openLink } >
          <Text style={ { color: 'white', fontWeight: 'bold', fontStyle: 'italic', fontSize: 20, fontFamily: 'Roboto', textAlign: 'center' } }>Watch Tutorial</Text></TouchableOpacity>
        </View>



      </View>






    </SafeAreaView>


  );
};

export default HowToUseDefib;
