import { Picker } from '@react-native-picker/picker';
import { useRoute } from '@react-navigation/native';
import { get, onValue, ref, remove, set } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { Image, ImageBackground, Modal, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../config.js';
import style from '../../styles/default.js';


const AEDStatus = ( { navigation } ) => {
  const [ title, setTitle ] = useState( '' );
  const [ dueDate, setDueDate ] = useState( '' );
  const [ latitude, setLatitude ] = useState( '' );
  const [ longitude, setLongitude ] = useState( '' );
  const [ isModalVisible, setModalVisible ] = useState( false );
  const [ isRemoveModalVisible, setRemoveModalVisible ] = useState( false );
  const [ editModal, setEditModal ] = useState( false );
  const [ isDetailsModalVisible, setDetailsModalVisible ] = useState( false );
  const [ selectedAED, setSelectedAED ] = useState( {} );
  const [ chosenAEDToRemove, setChosenAEDToRemove ] = useState( "" );
  const [ toggleSwitch, setToggleSwitch ] = useState( false );
  const [ aedData, setAEData ] = useState( [] );
  const activeAEDCount = aedData.filter( ( aed ) => aed.active ).length;
  const allAEDs  = aedData.map( ( aed ) => aed.id );
  const allAEDNames = JSON.stringify( allAEDs );


  const route = useRoute();
  const [ newText, setNewText ] = useState( '' );
  const { user } = route.params;


  const handleEdit = async () => {
    // Close the modal

    try {
      const aedRef = ref( db, `aeds/${ selectedAED.name }` );
      const aedSnapshot = await get( aedRef );

      if ( aedSnapshot.exists() ) {
        const aedToUpdate = aedSnapshot.val();
        await set( aedRef, { ...aedToUpdate, serviceDue: newText } );


        // Fetch the updated data immediately
        const updatedAEDSnapshot = await get( aedRef );
        const updatedAED = updatedAEDSnapshot.val();

        // Update the state with the new data
        setSelectedAED( updatedAED );

        closeEditModal();

      } else {
        alert( 'User not found for editing.' );
      }
    } catch ( error ) {
      alert( 'Error editing user:', error.message );
    }
  };


  // Function to open the edit modal
  const openEditModal = (  ) => {

    setEditModal( true );
  }

  const closeEditModal = () => {
    setEditModal( false );
  }

  const toggleRemoveModal = () => {
    setRemoveModalVisible( !isRemoveModalVisible );
  };

  const toggleModal = () => {
    setModalVisible( !isModalVisible );
  };

  const toggleDetailsModal = () => {
    setDetailsModalVisible( !isDetailsModalVisible );
  };

  const openDetailsModal = ( aed ) => {
    setSelectedAED( aed );
    setToggleSwitch( aed.active ); // Set toggle switch state based on AED active status
    toggleDetailsModal();
  };

  const toggleAEDStatus = async ( id, newStatus ) => {
    // Assuming 'aeds' is the correct path to your AEDs in the database
    const aedRef = ref( db, `aeds/${ id }` );

    try {
      // Fetch the existing data
      const snapshot = await get( aedRef );
      const existingData = snapshot.val();

      // Update only the 'active' field, keeping other fields intact
      await set( aedRef, { ...existingData, active: newStatus } );
    } catch ( error ) {
      alert( 'Error updating AED status:', error.message );
    }
  };
  const addAEDToDB = () => {
    if ( dueDate && latitude && longitude ) {
      set( ref( db, 'aeds/' + title ), {
        active: true,
        serviceDue: dueDate,
        latitude: latitude,
        longitude: longitude,
        name: title,
      } );
      setTitle( '' );
      setLatitude( 0 );
      setLongitude( 0 );
      setDueDate( '' );
      toggleModal();
    }
    else {
      // Handle the case when mandatory fields are not filled
      alert( 'Please fill in all the fields' );
    }

  };

  const removeAED = () => {
    const entryRef = ref( db, 'aeds/' + chosenAEDToRemove );

    try {
      // Remove the entry from the database
      remove( entryRef );
      setChosenAEDToRemove( '' );
      toggleRemoveModal();
    } catch ( error ) {
      // Handle the case when an error occurs
      console.error( 'Error removing AED:', error.message );
      // You might want to show an alert or handle the error in some way
    }
  };

  useEffect( () => {
    const starCountRef = ref( db, 'aeds/' );
    onValue( starCountRef, ( snapshot ) => {
      const data = snapshot.val();
      const newAEDs = Object.keys( data ).map( ( key ) => ( {
        ...data[ key ],
        id: key,
      } ) );
      setAEData( newAEDs );
    } );
  }, [] );

  return (
    <SafeAreaView style={ { flex: 1 } }>
      <ImageBackground
        source={ require( '../../images/dashboardheader.png' ) }
        style={ style.background }
        accessible={ true }
        accessibilityLabel="Dashboard Header Image"
      >
        <Text style={ style.heading } accessibilityRole="header" accessibilityLevel={ 1 }>
          AEDs
        </Text>
        <Text style={ style.activeHeading }>Active AEDs: { activeAEDCount }/{ aedData.length }</Text>

      </ImageBackground>
      <ScrollView style={ { marginTop: 20, flex: 1 } }>

        <View style={ { flexDirection: 'row', flexWrap: 'wrap', margin: 10, justifyContent: 'space-around' } }>
          {
            aedData.length === 0 ? (
              <Text>No AED available</Text>
            ) : ( aedData.map( ( aed, index ) => (
            <View key={ index } style={ { height: 150, width: 150, borderRadius: 20, backgroundColor: "#FFD966", justifyContent: 'center', alignItems: 'center', margin: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3, elevation: 5 } } accessibilityLabel={ `AED ${ index + 1 }` }>
              <TouchableOpacity onPress={ () => openDetailsModal( aed ) } style={ { position: 'absolute', top: 5, right: 10 } }>
                <Image source={ require( '../../images/threedots.png' ) } style={ { width: 30, height: 30 } } />
              </TouchableOpacity>
              { aed.active ? (
                <Image source={ require( '../../images/aedGreen.png' ) } style={ { top: 2, width: 81, height: 70 } } />
              ) : (
                <Image source={ require( '../../images/aedRed.png' ) } style={ { top: 2, width: 81, height: 70 } } />
              ) }
              <Text style={ { textAlign: 'center', color: '#3E4550', fontFamily: 'Roboto', fontSize: 18, fontStyle: 'italic', fontWeight: 'bold' } }>{ aed.id }</Text>

            </View>
            ) )
            )
          }

          <TouchableOpacity title="Add an AED" onPress={ toggleModal } style={ { height: 150, width: 150, borderRadius: 20, backgroundColor: "lightgrey", justifyContent: 'center', alignItems: 'center', margin: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3, elevation: 5 } } accessibilityLabel={ "AED" }>
            <Image source={ require( '../../images/addAED.png' ) } style={ { width: 70, height: 70 } } />
            <Text style={ { justifyContent: 'center', color: '#3E4550', fontFamily: 'Roboto', fontSize: 18, fontStyle: 'italic', fontWeight: 'bold' } }>Add New AED</Text>

          </TouchableOpacity>

          <TouchableOpacity title="Remove an AED" onPress={ toggleRemoveModal } style={ { height: 150, width: 150, borderRadius: 20, backgroundColor: "lightgrey", justifyContent: 'center', alignItems: 'center', margin: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3, elevation: 5 } } accessibilityLabel={ "AED" }>
            <Image source={ require( '../../images/removeAED.png' ) } style={ { width: 85, height: 70 } } />
            <Text style={ { justifyContent: 'center', color: '#3E4550', fontFamily: 'Roboto', fontSize: 18, fontStyle: 'italic', fontWeight: 'bold' } }>Remove an AED</Text>

          </TouchableOpacity>

        </View>





      </ScrollView>

      <View style={ style.backIcon }>
        <TouchableOpacity onPress={ () => navigation.navigate( 'Dashboard', { user: user } ) } accessibilityLabel="Navigate back to Dashboard">
          <Image source={ require( '../../images/arrow-back-black.png' ) } style={ { width: 55, height: 55 } } />
        </TouchableOpacity>
      </View>

      <Modal animationType="slide" transparent={ true } visible={ isRemoveModalVisible }>
        <View style={ { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' } }>
          <View style={ { backgroundColor: '#BFBFBF', padding: 20, borderRadius: 10, elevation: 5, width: '80%' } }>
            <TouchableOpacity onPress={ toggleRemoveModal } style={ { alignItems: 'flex-end', marginBottom: 10 } }>
              <Image source={ require( '../../images/cross.png' ) } style={ { width: 20, height: 20 } } />
            </TouchableOpacity>

            <View style={ { justifyContent: 'center', alignItems: 'center' } }>
              <Image source={ require( '../../images/removeAED.png' ) } style={ { width: 100, height: 80 } } />

              <Text style={ { fontSize: 30, fontWeight: 'bold', fontStyle: 'italic', } }>Remove an AED</Text>
            </View>
            <ScrollView>


                <Text style={ { marginBottom: 5, fontSize: 20, fontStyle: 'italic', fontWeight: 'bold' } }>AED Name:</Text>
                <Picker
                  selectedValue={ chosenAEDToRemove }
                  onValueChange={ ( itemValue ) => setChosenAEDToRemove( itemValue ) }
                  style={ { marginBottom: 10, height: 40, backgroundColor: 'white', borderBottomWidth: 1 } }
                 textStyle={ { color: 'black' } } // Set the color of the selected item
                >
                  <Picker.Item label="hello" value="key0" />

                </Picker>



              <TouchableOpacity onPress={ removeAED } style={ { backgroundColor: 'green', padding: 10, borderRadius: 5, alignItems: 'center' } }>
                <Text style={ { color: 'white', fontSize: 20, fontWeight: 'bold' } }>Remove</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

        </View>
      </Modal>

      <Modal animationType="slide" transparent={ true } visible={ isModalVisible }>
        <View style={ { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' } }>
          <View style={ { backgroundColor: '#BFBFBF', padding: 20, borderRadius: 10, elevation: 5, width: '80%' } }>
            <TouchableOpacity onPress={ toggleModal } style={ { alignItems: 'flex-end', marginBottom: 10 } }>
              <Image source={ require( '../../images/cross.png' ) } style={ { width: 20, height: 20 } } />
            </TouchableOpacity>

            <View style={ { justifyContent: 'center', alignItems: 'center' } }>
              <Image source={ require( '../../images/addAED.png' ) } style={ { width: 80, height: 80 } } />

              <Text style={ { fontSize: 30, fontWeight: 'bold', fontStyle: 'italic', } }>Add AED</Text>
            </View>
            <ScrollView>
              <View style={ { marginBottom: 5 } }>
                <Text style={ { marginBottom: 5, fontSize: 20, fontStyle: 'italic', fontWeight: 'bold' } }>AED Name:</Text>
                <TextInput
                  placeholder="Enter name of the building the AED is in"
                  value={ title }
                  onChangeText={ ( text ) => setTitle( text ) }
                  style={ { backgroundColor: 'white', height: 40, borderBottomWidth: 1, paddingVertical: 8 } }
                />
              </View>

              <View style={ { marginBottom: 20 } }>
                <Text style={ { marginBottom: 5, fontSize: 20, fontStyle: 'italic', fontWeight: 'bold' } }>Service Due:</Text>
                <TextInput
                  placeholder="DD/MM/YYYY"
                  value={ dueDate }
                  onChangeText={ ( text ) => setDueDate( text ) }
                  style={ { backgroundColor: 'white', height: 40, borderBottomWidth: 1, paddingVertical: 8 } }
                />
              </View>

              <View style={ { justifyContent: 'center', alignItems: 'center' } }>
                <Text style={ { fontSize: 20, fontStyle: 'italic', } }>Right click on the exact location of the new AED on Google Map to find these values</Text>
              </View>

              <View style={ { marginBottom: 20 } }>
                <Text style={ { marginBottom: 5, fontSize: 20, fontStyle: 'italic', fontWeight: 'bold' } }>Latitude:</Text>
                <TextInput
                  placeholder="Enter latitude"
                  value={ latitude }
                  onChangeText={(text) => setLatitude(text)}
                  style={ { backgroundColor: 'white', height: 40, borderBottomWidth: 1, paddingVertical: 8 } }
                  keyboardType="numeric"
                />
              </View>

              <View style={ { marginBottom: 20 } }>
                <Text style={ { marginBottom: 5, fontSize: 20, fontStyle: 'italic', fontWeight: 'bold' } }>Longitude:</Text>
                <TextInput
                  placeholder="Enter longitude"
                  value={ longitude }
                  onChangeText={ ( text ) => setLongitude( text ) }
                  style={ { backgroundColor: 'white', height: 40, borderBottomWidth: 1, paddingVertical: 8 } }
                  keyboardType="numeric"
                />
              </View>

              <TouchableOpacity onPress={ addAEDToDB } style={ { backgroundColor: 'green', padding: 10, borderRadius: 5, alignItems: 'center' } }>
                <Text style={ { color: 'white', fontSize: 20, fontWeight: 'bold' } }>Add</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

        </View>
      </Modal>


      <Modal animationType="slide" transparent={ true } visible={ isDetailsModalVisible }>
        <View style={ { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' } }>
          <View style={ { backgroundColor: '#BFBFBF', padding: 20, borderRadius: 10, elevation: 5, width: '80%', alignItems: 'center' } }>
            <TouchableOpacity onPress={ toggleDetailsModal } style={ { position: 'absolute', top: 10, right: 10 } }>
              <Image source={ require( '../../images/cross.png' ) } style={ { width: 20, height: 20 } } />
            </TouchableOpacity>

            <Text style={ { fontSize: 30, fontWeight: 'bold', fontStyle: 'italic', } }>{ selectedAED.name }</Text>

            <Image source={ require( '../../images/aed.png' ) } style={ { marginTop: '5%', width: 80, height: 80 } } />


            <Text style={ { fontSize: 20, fontWeight: 'bold', fontStyle: 'italic', marginTop: 10 } }>Active:</Text>

            <Switch
              trackColor={ { false: "#767577", true: "#81b0ff" } }
              value={ selectedAED.active }
              onValueChange={ ( newValue ) => {

                toggleAEDStatus( selectedAED.id, newValue );
                setSelectedAED( ( prevAED ) => ( {
                  ...prevAED,
                  active: newValue,
                } ) );
              } }
            />

            <View style={ { marginTop: 10 } }>
              <Text style={ { marginBottom: 5, fontSize: 20, fontStyle: 'italic', fontWeight: 'bold' } }>Service Due:</Text>
              <Text style={ { fontSize: 20 } }>{ selectedAED.serviceDue }</Text>
              <TouchableOpacity style={ { left: '43%', bottom: '30%' } } onPress={ () => openEditModal( ) }>
                <Image source={ require( '../../images/edit.png' ) } style={ { width: 20, height: 20 } } />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


      <Modal animationType="slide" transparent={ true } visible={ editModal } >
        <View style={ { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' } }>
          <View style={ { backgroundColor: '#BFBFBF', padding: 20, borderRadius: 10, elevation: 5, width: '80%', alignItems: 'center' } }>
            <TouchableOpacity onPress={ closeEditModal } style={ { alignItems: 'flex-end', left: 125 } }>
              <Image source={ require( '../../images/cross.png' ) } style={ { width: 20, height: 20 } } />

            </TouchableOpacity>

            <Text style={ { fontSize: 30, fontWeight: 'bold', marginBottom: 10 } }>Change Service Due</Text>

            <TextInput
              style={ { backgroundColor: 'white', marginTop: '5%', width: '80%', height: 40, borderBottomWidth: 1, paddingVertical: 8 } }
              placeholder="DD/MM/YYYY"
              onChangeText={ ( text ) => setNewText( text ) }
            />

            <View style={ { flexDirection: 'row', marginTop: '5%', justifyContent: 'space-between' } }>
              <TouchableOpacity style={ { backgroundColor: '#00A34A', justifyContent: 'center', margin: 5, padding: 10, borderRadius: 5 } } onPress={ handleEdit }>
                <Text style={ { color: 'white', fontSize: 20, fontWeight: 'bold' } }>Save</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>




    </SafeAreaView>
  );
};

export default AEDStatus;
