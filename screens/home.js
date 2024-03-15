import { React, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ImageBackground, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { online } from '../config.js';
import AEDMarker from '../images/AEDMarkerHome.png';
import style from '../styles/default.js';
import { aedData } from '../utils/cache.js';
import { checkActiveAEDs } from '../utils/fetchDBs.js';
import { floorSelection, renderNumberList } from '../utils/floorSelection.js';


// Function to represent the Home Screen
const HomeScreen = ( { navigation } ) => {
  useEffect( () => {
    const fetchData = async () => {
      try {
        await checkActiveAEDs();
      } catch ( error ) {
        console.error( 'Error checking active AEDs:', error );
      }
    };
    if ( online == true){
    fetchData();
  }

  }, [] );
  // State variables
  const [ opacity ] = useState( 1 );
  const [ isModalVisible, setModalVisible ] = useState( false );
  const [ isInfoModalVisible, setInfoModalVisible ] = useState( false );
  const [ loading, setLoading ] = useState( false );
  const closeModalAndNavigate = ( screenName ) => {
    setLoading( true );
    toggleInfoModal(); // Close the modal before navigating
    navigation.navigate( screenName );
    setLoading( false );
  };
  // Function to toggle the visibility of the modal
  const toggleModal = () => {
    setModalVisible( !isModalVisible );
  };
  const toggleInfoModal = () => {
    setInfoModalVisible( !isInfoModalVisible );
  };

  // Function to handle location retrieval and update
  const handleLocateNow = async () => {
    setLoading(true);

    if(online == true){
    if ( aedData.length == 0 ) {
      Alert.alert(
        'No Active AEDs',
        'There are no active AEDs available. Please try again later.',
        [ { text: 'OK' } ]
      );
    }

    else {
      await floorSelection( navigation, toggleModal, "user" );
    }
  } else{
    alert("Application can't get online, please check connectivity, otherwise head to menu and defib map in order to view the AEDs on Campus");
  }

    setLoading( false );
  };




  // Main rendering of the Home Screen component
  return (
    <ImageBackground
      source={ require( '../images/maps.png' ) }
      style={ { flex: 1 } }
    >
      <SafeAreaView style={ { flex: 1, backgroundColor: 'rgba(241, 243, 244, 0.25)' } } screenReaderLabel="Defib Locator Screen">
        <SafeAreaView style={ style.dropDownInfo }>
          <TouchableOpacity onPress={ () => toggleInfoModal() } accessibilityLabel="Navigate to Info screen">
            <Image source={ require( '../images/threeLines.png' ) } style={ { width: 35, height: 30 } } />
          </TouchableOpacity>
        </SafeAreaView>

        <View style={ { flex: 1, alignItems: 'center', justifyContent: 'center' } }>
          { loading && (
            <View style={ { position: 'absolute', zIndex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' } }>
              <ActivityIndicator size="large" color="#ffffff" />
            </View>
          ) }
          <Text style={ { color: 'black', backgroundColor: '#F6F6F6', fontSize: 40, fontFamily: 'Roboto', fontWeight: 'bold' } }>DEFIB FINDER</Text>

          <Image
            source={ AEDMarker }
            style={ { marginTop: 55, width: '30%', height: '30%' } }
            accessibilityLabel="AED Marker Image"
          />

          <TouchableOpacity
            onPress={ handleLocateNow }
            style={ [ style.button, { opacity } ] }
            accessibilityLabel="Locate Now button"
          >
            <Text style={ style.buttonText }>LOCATE NOW</Text>
          </TouchableOpacity>


          <View style={ { position: 'absolute', bottom: '10%' } }>
            <TouchableOpacity onPress={ () => navigation.navigate( 'Login' ) } accessibilityLabel="Navigate to Login screen">
              <Text style={ { color: '#262626', backgroundColor: '#F6F6F6', fontSize: 20, fontFamily: 'Roboto', fontWeight: 'bold', fontStyle: 'italic', textDecorationLine: 'underline' } }>STAFF SIGN IN</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Modal animationType="slide" transparent={ true } visible={ isModalVisible }>
          <View style={ { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' } }>
            <View style={ { ...style.floorPicker } }>
              <TouchableOpacity onPress={ () => toggleModal() } style={ { left: '40%', bottom: '2%' } }>
                <Image source={ require( '../images/cross.png' ) } style={ { width: 20, height: 20 } } />
              </TouchableOpacity>
              <Text style={ { ...style.floorPickerText } }>Scroll and select which floor you are on:</Text>
              <ScrollView style={ { maxHeight: 100, borderRadius: 12, backgroundColor: '#0074b3' } }>{ renderNumberList( navigation, toggleModal ) }</ScrollView>
            </View>
          </View>
        </Modal>

        <Modal animationType="slide" transparent={ true } visible={ isInfoModalVisible }>
          <View style={ { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' } }>
            <View style={ { ...style.infoMenu } }>
              <TouchableOpacity onPress={ () => toggleInfoModal() } style={ { right: '40%', bottom: '10%' } }>
                <Image source={ require( '../images/cross.png' ) } style={ { width: 20, height: 20 } } />
              </TouchableOpacity>
              <Text style={ { ...style.infoText } }>MENU</Text>
              <View style={ { flexDirection: 'row', flexWrap: 'wrap', margin: 10, justifyContent: 'space-around' } }>

                <TouchableOpacity onPress={ () => closeModalAndNavigate( 'HowToUseDefib' ) } style={ { ...style.menuButtons } }>
                  <View style={ { flexDirection: 'row', alignItems: 'center' } }>
                    <Image source={ require( '../images/defibInfo.png' ) } style={ { marginLeft: 5, width: 60, height: 60 } } />
                    <Text style={ { ...style.infoLabel, marginLeft: 10 } }>How to use a defib?</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={ () => closeModalAndNavigate( 'DefibMap' ) } style={ { ...style.menuButtons } }>
                  <View style={ { flexWrap: 'wrap', flexDirection: 'row', alignItems: 'center' } }>
                    <Image source={ require( '../images/mapInfo.png' ) } style={ { marginLeft: 5, width: 60, height: 60 } } />
                    <Text style={ { ...style.infoLabel, marginLeft: 10 } }>Defib map on Campus</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={ () => closeModalAndNavigate( 'Info' ) } style={ { ...style.menuButtons  } }>
                    <View style={ { flexDirection: 'row', alignItems: 'center' } }>
                    <Image source={ require( '../images/AEDInfo.png' ) } style={ { marginLeft: 5,width: 60, height: 60 } } />
                      <Text style={ { ...style.infoLabel, marginLeft: 10 } }>What is a defib?</Text>
                    </View>
                  </TouchableOpacity>
                <TouchableOpacity onPress={ () => closeModalAndNavigate( 'EmergencyContacts' ) } style={ { ...style.menuButtons } }>
                  <View style={ { flexDirection: 'row', alignItems: 'center' } }>
                    <Image source={ require( '../images/emergencyContacts.png' ) } style={ { marginLeft: 5, width: 60, height: 60 } } />
                    <Text style={ { ...style.infoLabel, marginLeft: 10 } }>Emergency Contacts</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={ () => closeModalAndNavigate( 'UserManual' ) } style={ { ...style.menuButtons } }>
                  <View style={ { flexDirection: 'row', alignItems: 'center' } }>
                    <Image source={ require( '../images/userManual.png' ) } style={ { marginLeft: 5, width: 60, height: 60 } } />
                    <Text style={ { ...style.infoLabel, marginLeft: 10 } }>How do I use this app?</Text>
                  </View>
                </TouchableOpacity>

                  </View>

              </View>

            </View>

        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
};
export default HomeScreen;