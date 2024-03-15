import React from 'react';
import { Image, Linking, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import style from '../../styles/default.js';

const EmergencyContacts = ( { navigation } ) => {



  // Open Google Maps with a specified address
  const openMaps = () => {
    const address = 'Security Services, Livingstone Tower, 26 Richmond Street, Glasgow, G1 1XH';
    const formattedAddress = address.replace( /\s/g, '+' );
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${ formattedAddress }`;
    Linking.openURL( mapsUrl );
  };

  // Send email to the specified email address with a predefined subject
  const sendEmail = () => {
    const email = 'security-control@strath.ac.uk';
    const subject = 'Regarding AED Information';
    Linking.openURL( `mailto:${ email }?subject=${ subject }` );
  };

  // Make a phone call to the specified phone number
  const makePhoneCall = ( phoneNumber ) => {
    Linking.openURL( `tel:${ phoneNumber }` );
  };

  // Make a phone call to the general emergency number
  const emergency = () => {
    makePhoneCall( '0141 548 2222' ); // Replace with your actual emergency phone number
  };

  // Make a phone call to the emergency number 999
  const emergency999 = () => {
    makePhoneCall( '999' );
  };

  // Make a phone call to the emergency number 111
  const emergency111 = () => {
    makePhoneCall( '111' );
  };


  return (

    <SafeAreaView style={ {  backgroundColor: '#F1F3F4', alignItems: 'center' } } screenReaderLabel="Defibrillator Information Screen">
      <View style={ { ...style.backIconInfoPages }}>
        <TouchableOpacity onPress={ () => navigation.navigate( 'Home' ) } accessibilityLabel="Navigate back to Dashboard">
          <Image source={ require( '../../images/arrow-back.png' ) } style={ { width: 50, height: 50 } } />
        </TouchableOpacity>
      </View>


      <View style={ { padding: '5%', height: '95%', width: '95%', borderRadius: 25, backgroundColor: '#C03636', alignItems: 'center' } }>
        <View style={ { alignItems: 'center', justifyContent: 'center' } }>
          <Text style={ { color: 'white',  fontSize: 40, fontWeight: 'bold',fontFamily: 'Roboto',textAlign:'center' } }>Campus Contacts</Text>


          <View style={ { flexDirection: 'row', flexWrap: 'wrap', } }>


              <TouchableOpacity onPress={ openMaps }  style={ { flexDirection: 'row', alignItems: 'center' } }>

                  <View style={ { alignItems: 'center' } }>
                    <Image source={ require( '../../images/locate.png' ) } style={ { marginRight: 10,width: 50, height: 50 } } />
                  </View>
                  <Text style={ { fontSize: 20, height: 100, width: 260,borderRadius: 20, color: 'white',padding: 5, fontWeight: 'bold' } }>Security Services, Livingstone Tower, 26 Richmond Street, Glasgow, G1 1XH</Text>
              </TouchableOpacity>


            <TouchableOpacity onPress={ sendEmail } style={ { flexDirection: 'row', marginTop: '5%', alignItems: 'center' } }>
                <View style={ { marginRight: 10 ,alignItems: 'center' } }>
                  <Image source={ require( '../../images/emergencyEmail.png' ) } style={ { width: 50, height: 50 } } />
                </View>
                <View style={ { alignItems: 'center' } }>
                  <Text style={ { fontSize: 20, height: 60, width: 260, borderRadius: 20, color: 'white', padding: 5, fontWeight: 'bold' } }>security-control@strath.ac.uk (enquiries)</Text>
                </View>
              </TouchableOpacity>

            <View style={ { alignItems: 'center', justifyContent: 'center', marginTop: '5%', marginBottom: '5%' } }>
              <View style={ { height: 110, width: '100%', borderRadius: 20, justifyContent: 'center', alignItems: 'center', } } >
                <View style={ { flexDirection: 'row', alignItems: 'center' } }>
                  {/* Image */ }
                  <View style={ { marginRight: 10 } }>
                    <Image source={ require( '../../images/emergencyPhone.png' ) } style={ { width: 50, height: 50 } } />
                  </View>

                  {/* Phone Numbers Column */ }
                  <View style={ { flexDirection: 'column', } }>
                    {/* General Enquiries Button */ }
                    <TouchableOpacity onPress={ () => makePhoneCall( '0141 548 3333' ) } style={ { marginBottom: 5 } }>
                      <Text style={ { fontSize: 20, height: 34, width: 260, borderRadius: 20, color: 'white', padding: 5, fontWeight: 'bold' } }>0141 548 3333 (general)</Text>
                    </TouchableOpacity>

                    {/* Emergencies Button */ }
                    <TouchableOpacity onPress={ emergency }>
                      <Text style={ { fontSize: 20, height: 60, width: 260, borderRadius: 20, color: 'white', padding: 5, fontWeight: 'bold' } }>0141 548 2222 (emergencies)</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
           <Text style={ { color: 'white', fontSize: 40, fontWeight: 'bold', fontFamily: 'Roboto', textAlign: 'center' } }>Emergencies</Text>
            </View>




            <View style={ { height: 110, width: '100%', borderRadius: 20,  justifyContent: 'center', alignItems: 'center', } } >
              <View style={ { flexDirection: 'row', alignItems: 'center' } }>
                {/* Image */ }
                <View style={ { marginRight: 10 } }>
                  <Image source={ require( '../../images/emergencyNumbers.png' ) } style={ { width: 50, height: 50 } } />
                </View>

                {/* Phone Numbers Column */ }
                <View style={ { flexDirection: 'column', } }>
                  {/* General Enquiries Button */ }
                  <TouchableOpacity onPress={ emergency999 } style={ { marginBottom: 10 } }>
                    <Text style={ { fontSize: 20, height: 60, width: 260, borderRadius: 20, color: 'white', padding: 5, fontWeight: 'bold' } }>999 for emergency services</Text>
                  </TouchableOpacity>

                  {/* Emergencies Button */ }
                  <TouchableOpacity onPress={ emergency111 }>
                    <Text style={ { fontSize: 20, height: 40, width: 260, borderRadius: 20, color: 'white', padding: 5, fontWeight: 'bold' } }>NHS 111 for 24/7 support</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
        <Text style={ { color: 'white', marginTop:'5%',fontSize: 20, fontStyle: 'italic', fontFamily: 'Roboto', textAlign: 'center' } }>Tap your preferred contact method for assistance.</Text>
      </View>

    </SafeAreaView>


  );
};

export default EmergencyContacts;
