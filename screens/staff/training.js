import { useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { Image, ImageBackground, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import style from '../../styles/default.js';


const Training = ( { navigation } ) => {

  const [ aedData, setAEData ] = useState( [] );
  const activeAEDCount = aedData.filter( ( aed ) => aed.active ).length;

  const route = useRoute();

  const { user } = route.params;
  console.log( "user", user );


  const openPolicies = () => {

    const url = `https://www.strath.ac.uk/professionalservices/media/ps/safetyservices/campusonly/standards/firstaid/First_Aid_Standard_v1.7.pdf`;
    Linking.openURL( url );
  };


  const openCPR = () => {

    const url = `https://www.nhs.uk/conditions/first-aid/cpr/`;
    Linking.openURL( url );
  };

  const openAED = () => {

    const url = `https://www.resus.org.uk/sites/default/files/2020-03/AED_Guide_2019-12-04.pdf`;
    Linking.openURL( url );
  };

  return (
    <SafeAreaView style={ { flex: 1 } }>
      <ImageBackground
        source={ require( '../../images/dashboardheader.png' ) }
        style={ style.background }
        accessible={ true }
        accessibilityLabel="Dashboard Header Image"
      >
        <Text style={ { ...style.trainHeading } } accessibilityRole="header" accessibilityLevel={ 1 }>
          Training & Protocols
        </Text>

      </ImageBackground>


      <ScrollView style={ { marginTop: 20, flex: 1, width: '100%', borderTopLeftRadius: 50, borderTopRightRadius: 50, overflow: 'hidden' } }>

        {/* Training */ }
        <View style={ { height: '10%', width: '50%', marginBottom: '5%', borderRadius: 60,  justifyContent: 'center', alignItems: 'center', alignSelf: 'center' } } accessibilityLabel={ 'Incident' }>
          <Text style={ { fontSize: 25, fontWeight: 'bold' } }>Training Guides</Text>
        </View>


        {/* CPR and AED */ }
        <View style={ { flexDirection: 'row', justifyContent: 'space-evenly' } }>
          {/* CPR */ }
          <TouchableOpacity onPress={ openCPR } style={ { height: 130, width: 130, marginBottom: '5%', borderRadius: 20, backgroundColor: "#FFD966", justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3, elevation: 5 } } accessibilityLabel={ 'Incident' }>
            <Text style={ { fontSize: 20, fontWeight: 'bold' } }>CPR</Text>
            <Image source={ require( '../../images/CPR.png' ) } style={ { justifyContent: 'center', alignItems: 'center', width: 60, height: 60 } } />
          </TouchableOpacity>

          {/* AED */ }
          <TouchableOpacity onPress={ openAED } style={ { height: 130, width: 130, marginBottom: '5%', borderRadius: 20, backgroundColor: "#00B050", justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3, elevation: 5 } } accessibilityLabel={ "User" }>
            <Text style={ { fontSize: 20, fontWeight: 'bold' } }>AED</Text>
            <Image source={ require( '../../images/AEDTrain.png' ) } style={ { justifyContent: 'center', alignItems: 'center', width: 60, height: 60 } } />
          </TouchableOpacity>
        </View>


        {/* AED Protocols */ }
        <View style={ { height: '10%', width: '100%', marginBottom: '5%', borderRadius: 60, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' } } accessibilityLabel={ 'Incident' }>
          <Text style={ { fontSize: 25, fontWeight: 'bold' } }>AED Protocol Documents</Text>
        </View>

        {/* Incident Reporting Protocols */ }
        <TouchableOpacity onPress={ openPolicies } style={ { height: 80, width: '80%', marginBottom: '5%', alignSelf: 'center', borderRadius: 20, backgroundColor: "#FFD966", flexDirection: 'row', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3, elevation: 5 } } accessibilityLabel={ 'Incident' }>
          <Image source={ require( '../../images/clipboard.png' ) } style={ { width: 60, height: 60, margin: 20 } } />
          <Text style={ { fontSize: 20, fontWeight: 'bold', flex: 1 } }>Incident Reporting Protocols</Text>
        </TouchableOpacity>

        {/* Emergency Protocols */ }
        <TouchableOpacity onPress={ openPolicies } style={ { height: 80, width: "80%", marginBottom: '5%', alignSelf: 'center', borderRadius: 20, backgroundColor: "#00B050", flexDirection: 'row', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3, elevation: 5 } } accessibilityLabel={ "User" }>
          <Text style={ { fontSize: 20, fontWeight: 'bold', margin: 10 } }>Emergency Protocols</Text>
          <Image source={ require( '../../images/emergency.png' ) } style={ { width: 60, height: 60, } } />

        </TouchableOpacity>

      </ScrollView>








      <View style={ style.backIcon }>
        <TouchableOpacity onPress={ () => navigation.navigate( 'Dashboard', { user: user } ) } accessibilityLabel="Navigate back to Dashboard">
          <Image source={ require( '../../images/arrow-back.png' ) } style={ { width: 55, height: 55 } } />
        </TouchableOpacity>
      </View>













    </SafeAreaView>
  );
};

export default Training;
