import { useRoute } from '@react-navigation/native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { get, ref, set } from 'firebase/database';
import { React, useEffect, useState } from 'react';
import { ActivityIndicator, Image, ImageBackground, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../config.js';
import style from '../../styles/default.js';
import { allIncidents, fetchAllIncidents, fetchIncidentDetails, fetchStaffDetails, removeStaffFromAED, staffData, updateStafftoIncidentDetails } from '../../utils/fetchDBs.js';
import { floorSelection, loading, renderNumberList } from '../../utils/floorSelection.js';


const Dashboard = ( { navigation } ) => {
  const route = useRoute();
  const { user } = route.params;

  const [ showButton, setShowButton ] = useState( false );
  const [ staffName, setStaffName ] = useState( '' );
  const [ showModal, setShowModal ] = useState( false );
  const [ scanned, setScanned ] = useState( false );
  const [ hasPermission, setHasPermission ] = useState( null );
  const [ checkedIn, setCheckedIn ] = useState( false );
  const [ isModalVisible, setModalVisible ] = useState( false );

  // Function to toggle container
  const toggleContainer = () => {
    setShowButton( false );
  };

  useEffect( () => {

    const fetchDataInterval = setInterval( () => {
      fetchData();
    }, 5000 ); // Adjust the interval as needed (e.g., every 5 seconds)

    // Initial fetch when the component mounts

    fetchData();

    // Clear the interval when the component is unmounted
    return () => clearInterval( fetchDataInterval );

  }, [] );

  const fetchData = async () => {
    await fetchAllIncidents();
    await fetchStaffDetails();

    if ( Array.isArray( allIncidents ) && allIncidents.length > 0 ) {
    allIncidents.forEach( ( incident, index ) => {

      if ( Object.keys( staffData ).length > 0 ) {
        for ( const staffMember of Object.values( staffData ) ) {
          if ( staffMember.awayToIncident === false && staffMember.stationed === incident.aedUsed && staffMember.username === user && staffMember.active === true ) {
            setStaffName( staffMember.fullname );
            setShowButton( true );
          }
        }
      }
    } );
  };

  };

  useEffect( () => {

    fetchStaffDetails();

    for ( const staffMember of Object.values( staffData ) ) {

      if ( staffMember.username === user && staffMember.active === true ) {
        setCheckedIn( true );
        break;
      } else {
        setCheckedIn( false );
        break;
      }
    }

  }, [ user ] );

  const requestCameraPermissions = async () => {
    try {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission( status === 'granted' );
    } catch ( error ) {
      console.error( 'Error requesting camera permissions:', error );
      // Handle the error as needed, e.g., show an error message to the user
    }
  };

  useEffect( () => {
    requestCameraPermissions();
  }, [] );


  // Function to handle scanned barcode
  const handleBarCodeScanned = async ( { type, data } ) => {
    try {
      setScanned( true );
      alert( `You have checked in to ${ data }!` );

      const userRef = ref( db, `staff/${ user }` );

      // Fetch the existing data
      const snapshot = await get( userRef );
      const existingData = snapshot.val();

      // Update only the 'active' field, keeping other fields intact
      await set( userRef, { ...existingData, active: true, awayToIncident: false, stationed: data } );

      setShowModal( false );
      setCheckedIn( true );
      setScanned( false );
    } catch ( error ) {
      console.error( 'Error handling barcode scan:', error );
    }
  };

  // Function to handle active status
  const handleActiveStatus = async () => {
    alert( `You have checked out!` );

    const userRef = ref( db, `staff/${ user }` );

    try {
      // Fetch the existing data
      const snapshot = await get( userRef );
      const existingData = snapshot.val();

      await set( userRef, { ...existingData, active: false, awayToIncident: false, stationed: "none" } );
    } catch ( error ) {
      alert( 'Error updating user status:', error.message );
    }
    // Fetch the updated data immediately
    const updatedUserSnapshot = await get( userRef );
    setCheckedIn( false );
  };

  // Function to render camera view
  const renderCamera = () => {
    return (
      <View style={ styles.cameraContainer }>
        <BarCodeScanner
          onBarCodeScanned={ scanned ? undefined : handleBarCodeScanned }
          style={ styles.camera }
        />
      </View>
    );
  };

  // Function to handle check-in button press
  const handleCheckInButtonPress = () => {
    setShowModal( true );
  };


  // Function to handle logout
  const handleLogOut = async () => {
    alert( `You have logged out!` );

    const userRef = ref( db, `staff/${ user }` );

    try {
      // Fetch the existing data
      const snapshot = await get( userRef );
      const existingData = snapshot.val();

      await set( userRef, { ...existingData, active: false, stationed: "none" } );
    } catch ( error ) {
      alert( 'Error updating user status:', error.message );
    }

    setCheckedIn( false );
    navigation.navigate( 'Login' );
  };

  // Function to close the barcode scanner modal
  const handleCloseModal = () => {
    setScanned( false );
    setShowModal( false );
  };

  if ( hasPermission === null ) {
    return <View />;
  }

  if ( hasPermission === false ) {
    return (
      <View style={ styles.container }>
        <Text style={ styles.text }>Camera permission not granted</Text>
      </View>
    );
  }
  const toggleModal = () => {
    setModalVisible( !isModalVisible );

  };
  // Function to handle navigate button press
  const handleNavigate = async () => {
    await setShowButton( false );
    await fetchIncidentDetails();
    await updateStafftoIncidentDetails( user, staffName );
    await removeStaffFromAED(user);
    await setCheckedIn(false);
    await floorSelection( navigation, toggleModal, user );

  };

  return (
    <SafeAreaView style={ { flex: 1 } }>

      <ImageBackground source={ require( '../../images/dashboardheader.png' ) } style={ style.background } accessible={ true } accessibilityLabel="Dashboard Header Image">

        <Text style={ style.heading } accessibilityRole="header" accessibilityLevel={ 1 }>
          Staff Portal
        </Text>
      </ImageBackground>
      <ScrollView style={ {} }>

        <View style={ { flexDirection: 'row', marginTop: 10, marginLeft: 40 } }>

          <View style={ style.column1 }>

            <TouchableOpacity
              style={ style.dashboardIconAED }
              accessibilityLabel="AED Status"
              onPress={ () => navigation.navigate( 'AEDStatus', { user: user } ) }
            >
              <View style={ { alignItems: 'center' } }>
                <Text style={ style.dashboardTextAED }>AED Status'</Text>
                <Image source={ require( '../../images/aedStatus.png' ) } style={ { width: 60, height: 60, } } />


              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={ style.trainIcon }
              accessibilityLabel="Training"
              onPress={ () => navigation.navigate( 'Training', { user: user } ) }
            >
              <View style={ { alignItems: 'center' } }>
                <Text style={ style.trainIconText }>Training & Protocols</Text>
                <Image source={ require( '../../images/training.png' ) } style={ { width: 60, height: 60, } } />

              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={ { ...style.logOut } }
              accessibilityLabel="Log Out"
              onPress={ handleLogOut }
            >
              <View style={ { alignItems: 'center' } }>
                <Text style={ style.logOutText }>Log Out</Text>
                <Image source={ require( '../../images/logOut.png' ) } style={ { width: 50, height: 50 } } />
              </View>
            </TouchableOpacity>


          </View>

          <View style={ style.column }>
           <TouchableOpacity style={ style.checkIn } onPress={ checkedIn ? handleActiveStatus : handleCheckInButtonPress }>
              { checkedIn ? (
                <>
                  <Text style={ style.checkInText }>Active</Text>
                  <Image source={ require( '../../images/active.png' ) } style={ { width: 39, height: 41 } } />
                </>
              ) : (
                <>
                  <Image source={ require( '../../images/checkIn.png' ) } style={ { width: 40, height: 40 } } />
                  <Text style={ style.checkInText }>Check In</Text>
                </>
              ) }
            </TouchableOpacity>

            <TouchableOpacity
              style={ style.dashboardIconStaff }
              onPress={ () => navigation.navigate( 'Staff', { user: user } ) }
              accessibilityLabel="Staff"
            >
              <View style={ { alignItems: 'center', margin: 10 } }>

                <Text style={ style.dashboardTextStaff }>Trained Staff</Text>
                <Image source={ require( '../../images/staff.png' ) } style={ { width: 60, height: 60, } } />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={ { ...style.reports } }
              accessibilityLabel="Reports"
              onPress={ () => navigation.navigate( 'Reports', { user: user } ) }
            >
              <Image source={ require( '../../images/reports.png' ) } style={ { width: 60, height: 60, } } />
              <Text style={ style.dashboardTextReports }>Incident Reports</Text>
            </TouchableOpacity>
          </View>


        </View>


      </ScrollView>

      <SafeAreaView style={ style.personIcon }>
        <TouchableOpacity onPress={ () => navigation.navigate( 'StaffDetails', { user: user } ) } accessibilityLabel="Navigate back to Login">
          <Image source={ require( '../../images/profile.png' ) } style={ { width: 60, height: 60 } } />
          <Text style={ style.profileIconText }>My Profile</Text>

        </TouchableOpacity>
      </SafeAreaView>

     <Modal animationType="slide" transparent={ true } visible={ showButton }>

        <View style={ { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' } }>

          <View style={ { ...style.incidentContainer } }>
            <TouchableOpacity onPress={ () => toggleContainer() } style={ { alignItems: 'flex-end', position: 'absolute', right: 10, top: 10 } }>
              <Image source={ require( '../../images/cross.png' ) } style={ { width: 20, height: 20 } } />
            </TouchableOpacity>
            <Text style={ style.incidentTitle }>INCIDENT REPORTED!</Text>
            <Text style={ style.incidentText }>Navigate to incident immediately</Text>
            <View style={ style.incidentButton }>
              <TouchableOpacity onPress={ handleNavigate } accessibilityLabel="Navigate to StaffNavigation">
                <Text style={ style.yesText }>NAVIGATE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


      <Modal
        animationType="slide"
        transparent={ true }
        visible={ showModal }
        onRequestClose={ handleCloseModal }
      >
        <View style={ { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' } }>
          <View style={ { backgroundColor: 'white', padding: 20, borderRadius: 10, elevation: 5, width: '80%', alignItems: 'center' } }>
            <TouchableOpacity onPress={ handleCloseModal } style={ { position: 'absolute', top: 10, right: 10 } }>
              <Image source={ require( '../../images/cross.png' ) } style={ { width: 20, height: 20 } } />
            </TouchableOpacity>
            <Text style={ style.QR }>Scan QR to check in</Text>
            { renderCamera() }
          </View>
        </View>
      </Modal>

      <Modal animationType="slide" transparent={ true } visible={ isModalVisible }>
        <View style={ { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' } }>
          <View style={ { ...style.floorPicker } }>
            <TouchableOpacity onPress={ () => toggleModal() } style={ { left: '40%', bottom: '2%' } }>
              <Image source={ require( '../../images/cross.png' ) } style={ { width: 20, height: 20 } } />
            </TouchableOpacity>
            <Text style={ { ...style.floorPickerText } }>Scroll and select which floor you are on:</Text>
            <ScrollView style={ { maxHeight: 100, borderRadius: 12, backgroundColor: '#0074b3' } }>{ renderNumberList( navigation, toggleModal ) }</ScrollView>
          </View>
        </View>
      </Modal>
      { loading && (
        <View style={ { position: 'absolute', zIndex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' } }>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      ) }
    </SafeAreaView>
  );
};

export default Dashboard;

const styles = StyleSheet.create( {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 40,
    marginBottom: 40,
  },
  modalContainer: {
    flex: 1,
  },
  cameraContainer: {
    width: '70%',

    aspectRatio: 1,


    marginBottom: 20,
  },
  camera: {
    flex: 1,

  },
} );
