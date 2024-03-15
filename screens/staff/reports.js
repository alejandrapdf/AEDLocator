import { useRoute } from '@react-navigation/native';
import { get, onValue, ref, set } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { Image, ImageBackground, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../config.js';
import style from '../../styles/default.js';

// Component for Reports screen
const Reports = ( { navigation } ) => {
  const route = useRoute();

  const { user } = route.params;

  const [ note, setNote ] = useState( '' );

  const [ detailsModal, setDetailsModalVisible ] = useState( false );
  const [ notesModal, setNotesModal ] = useState( false );
  const [ selectedReport, setSelectedReport ] = useState( {} );
  const [ detailsModalKey, setDetailsModalKey ] = useState( 0 );

  const [ reportData, setReportData ] = useState( [] );

  const toggleModalDetails = async ( report ) => {

    setSelectedReport( report );


    if ( user === report.username || report.username == "") {

      await setDetailsModalVisible( !detailsModal ); // Toggle details modal
      await setNotesModal( false ); // Close notes modal when opening details modal
    } else {
      alert( 'You are not allowed to view details for this incident. Only staff involved in this incident can open this.' );
    }
  };

  const toggleBack = async () => {
    await setDetailsModalKey( ( prevKey ) => prevKey + 1 );
    await setDetailsModalVisible( true ); // Toggle details modal
    await setNotesModal( false ); // Close notes modal when opening details modal

  };

  const toggleModalNotes = async () => {

    await setNotesModal( !notesModal ); // Toggle notes modal
    await setDetailsModalVisible( false ); // Close details modal when opening notes modal

  };



  const handleEdit = async () => {
    try {
      const incidentRef = ref( db, `incidentReports/${ selectedReport.id }` );
      const reportSnapshot = await get( incidentRef );

      if ( reportSnapshot.exists() ) {
        const reportToUpdate = reportSnapshot.val();

        // Update the specified field with the new value
        reportToUpdate[ "notes" ] = note;

        // Update the database for the specific report
        await set( incidentRef, reportToUpdate );

        // Update the local state with the new note
        setSelectedReport( { ...selectedReport, notes: note } );

        toggleBack();
      } else {
        alert( 'Incident report not found for editing.' );
      }
    } catch ( error ) {
      alert( 'Error editing incident report:', error.message );
    }
  };




  useEffect( () => {
    // Fetch incident reports data from Firebase
    const userRef = ref( db, 'incidentReports/' );
    onValue( userRef, ( snapshot ) => {
      const data = snapshot.val();
      const reports = Object.keys( data ).map( ( key ) => ( {
        ...data[ key ],
      } ) );
      setReportData( reports );
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
        <Text style={ style.heading } accessibilityRole="header" accessibilityLevel={ 1 }>Incidents </Text>
      </ImageBackground>
      <ScrollView style={ { flex: 1, width: '100%', borderTopLeftRadius: 50, borderTopRightRadius: 50, overflow: 'hidden' } }>
        <View style={ { flexDirection: 'row', flexWrap: 'wrap', margin: 10, justifyContent: 'space-around' } }>
          {
            reportData.length === 0 ? (
              <Text>No reports available</Text>
            ) : (
              reportData.map( ( incident, index ) => (
                <View key={ index } style={ { height: 100, width: '100%', borderRadius: 20, backgroundColor: "#FFD966", justifyContent: 'center', alignItems: 'center', marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3, elevation: 5 } } accessibilityLabel={ `Incident ${ index + 1 }` }>
                  <TouchableOpacity onPress={ () => toggleModalDetails( incident ) } style={ { position: 'absolute', top: 5, right: 10 } }>
                    <Image source={ require( '../../images/threedots.png' ) } style={ { width: 30, height: 30 } } />
                  </TouchableOpacity>

                  <View style={ { flexDirection: 'row', alignItems: 'center' } }>
                    <View style={ { alignItems: 'center' } }>
                      <Image source={ require( '../../images/clipboard.png' ) } style={ { width: 75, height: 60 } } />
                      <Text style={ { fontSize: 20, marginLeft: 10, fontWeight: 'bold' } }>#{ incident.id }</Text>
                    </View>
                    <View style={ { alignItems: 'center' } }>
                      <Text style={ { fontSize: 20, marginLeft: 10, fontWeight: 'bold' } }>Incident Date</Text>
                      <Text style={ { fontSize: 20, marginLeft: 10, fontWeight: 'bold' } }>{ incident.incidentDate }</Text>
                    </View>
                  </View>
                </View>
              ) )
            )
          }

        </View>

      </ScrollView>

      <View style={ style.backIcon }>
        <TouchableOpacity onPress={ () => navigation.navigate( 'Dashboard', { user: user } ) } accessibilityLabel="Navigate back to Dashboard">
          <Image source={ require( '../../images/arrow-back-black.png' ) } style={ { width: 55, height: 55 } } />
        </TouchableOpacity>
      </View>



      {/* DETAIL MODULE*/ }
      <Modal key={ detailsModalKey } animationType="slide" transparent={ true } visible={ detailsModal }>
        <View style={ { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' } }>
          <View style={ { backgroundColor: '#BFBFBF', padding: '5%', borderRadius: 10, elevation: 5, height: '75%', width: '85%', alignItems: 'center' } }>
            <TouchableOpacity onPress={ () => setDetailsModalVisible( false ) } style={ { position: 'absolute', top: '5%', right: 20 } }>
              <Image source={ require( '../../images/cross.png' ) } style={ { width: 20, height: 20 } } />
            </TouchableOpacity>
            <Image source={ require( '../../images/clipboard.png' ) } style={ { marginTop: '5%',width: 60, height: 60 } } />

            <Text style={ { fontSize: 30, fontWeight: 'bold' } }>Incident #{ selectedReport.id }</Text>




            <View style={ { } }>


              <Text style={ { fontSize: 20, fontWeight: 'bold', color: 'black', marginTop: '5%' } }>Notes:</Text>

              { selectedReport.notes == "" ? (
                <TouchableOpacity onPress={ () => toggleModalNotes() } style={ { height: 50, width: 150, borderRadius: 20, backgroundColor: "#00B050", justifyContent: 'center', alignItems: 'center', margin: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3, elevation: 5 } } accessibilityLabel={ "AED" }>
                  <Text style={ { justifyContent: 'center', color: 'white', fontFamily: 'Roboto', fontSize: 18, fontStyle: 'italic', fontWeight: 'bold' } }>Add Note</Text>
                </TouchableOpacity>

              ) : (
                <View>
                  <Text style={ { fontSize: 20, marginBottom: 10 } }>{ selectedReport.notes }</Text>
                    <TouchableOpacity onPress={ () => toggleModalNotes() } style={ { alignSelf: 'center', height: 50, width: 150, borderRadius: 20, backgroundColor: "#00B050", justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3, elevation: 5 } } accessibilityLabel={ "AED" }>

                    <Text style={ { alignSelf: 'center', color: 'white', fontFamily: 'Roboto', fontSize: 18, fontStyle: 'italic', fontWeight: 'bold' } }>Edit Note</Text>
                  </TouchableOpacity>
                </View>
              ) }

              <Text style={ { fontSize: 20, fontWeight: 'bold', color: 'black', marginTop: '5%' } }>Date of Incident:</Text>
              <Text style={ { fontSize: 20, marginBottom: 10 } }>{ selectedReport.incidentDate }</Text>

              <Text style={ { fontSize: 20, fontWeight: 'bold', color: 'black', marginTop: '5%' } }>Staff Attended:</Text>
              <Text style={ { fontSize: 20, marginBottom: 10 } }>{ selectedReport.staffAttended }</Text>

              <Text style={ { fontSize: 20, fontWeight: 'bold', color: 'black', marginTop: '5%' } }>AED Utilised:</Text>
              <Text style={ { fontSize: 20 } }>{ selectedReport.aed }</Text>
              <Text style={ { fontSize: 20, fontWeight: 'bold', color: 'black', marginTop: '5%' } }>Floor of Incident:</Text>
              <Text style={ { fontSize: 20 } }>{ selectedReport.floor }</Text>
            </View>

          </View>
        </View>
      </Modal>



      {/* NOTE MODULE*/ }

      <Modal animationType="slide" transparent={ true } visible={ notesModal }>
        <View style={ { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' } }>
          <View style={ { backgroundColor: '#BFBFBF', padding: 20, borderRadius: 10, elevation: 5, width: '60%', alignItems: 'center' } }>
            <TouchableOpacity onPress={ () => toggleBack() } style={ { position: 'absolute', top: 10, right: 20 } }>
              <Image source={ require( '../../images/cross.png' ) } style={ { width: 20, height: 20 } } />
            </TouchableOpacity>

            <View style={ { justifyContent: 'center', alignItems: 'center', marginBottom: 10 } }>
              <Text style={ { fontSize: 30, fontWeight: 'bold', marginBottom: 10,} }>Add Note</Text>
              <TextInput
                placeholder="Enter Details About Incident"
                value={ note }
                onChangeText={ ( text ) => setNote( text ) }
                style={ { backgroundColor: 'white', height: 40, borderBottomWidth: 1, paddingVertical: 8 } }
              />
            </View>


            <View style={ { flexDirection: 'row', marginTop: '10%', justifyContent: 'space-between' } }>
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

export default Reports;
