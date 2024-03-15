import { useRoute } from '@react-navigation/native';
import * as Location from 'expo-location';
import * as Speech from 'expo-speech';
import { get, onValue, ref, remove, set } from 'firebase/database';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Image, Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, Vibration, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { handleCallPress, zoomIn } from '../components/map/mapButtons.js';
import { db } from '../config.js';
import AEDMarker from '../images/AEDMarker.png';
import AL from '../images/AndersonianLibrary.jpg';
import JW from '../images/JamesWeir.jpg';
import JA from '../images/JohnAnderson.jpg';
import LT from '../images/LivingstonTower.png';
import SS from '../images/StrathSport.jpg';
import SU from '../images/StrathclydeUnion.jpg';
import SR from '../images/StudentResidences.jpg';
import T from '../images/TIC.jpg';
import test from '../images/Test.jpg';
import style from '../styles/default.js';
import { setBannerInstruct } from '../utils/bannerSetting.js';
import { aedData, updateAEDData } from '../utils/cache.js';
import { calculateFont } from '../utils/calculateFontSize.js';
import { addNewReport, fetchIncidentDetails, fetchIncidentReports, incident, incidentData, newEntryID } from '../utils/fetchDBs.js';
import { computeDirections, drawPolyline, extractDirections, extractDuration, findClosestAED } from '../utils/findingRoute.js';

const Map = ( { navigation } ) => {
  const route = useRoute();
  const { floorParam } = route.params;
  const [ staffUsername, setStaffUsername ] = useState( "" );
  const [ floorofIncident, setFloorOfIncident ] = useState( null );
  const [ currentFloor, setCurrentFloor ] = useState( null );
  const [ staffNav, setStaffNav ] = useState( false );
  const [ startMessage, setStartMessage ] = useState( false );
  const [ currentClosestAED, setCurrentClosestAED ] = useState( "" );
  useEffect( () => {
    if ( /^\d+$/.test( floorParam ) ) {
      // If it's a plain number
      setFloorOfIncident( floorParam );
      setCurrentFloor( floorParam );
      setUserNav( true );
    } else {
      // This regex captures the word and the number inside parentheses
      const regex = /(\w+)\((\d+)\)/;
      const match = floorParam.match( regex );
      if ( match ) {
        const staff = match[ 1 ]; // "staff"
        const staffFloor = parseInt( match[ 2 ] ); // 1
        setStaffUsername( staff );
        fetchIncidentDetails();
        setFloorOfIncident( incidentData.floor );
        setCurrentFloor( staffFloor );
        setIncidentNav( true );
        setStaffNav( true );
      }
    }
  }, [] );
  // Memoized image mapping
  const imageMapping = useMemo( () => {
    return {
      AndersonianLibrary: AL,
      JamesWeir: JW,
      JohnAnderson: JA,
      LivingstonTower: LT,
      StrathSport: SS,
      StrathclydeUnion: SU,
      StudentResidences: SR,
      TIC: T,
      Test: test,
    };
  }, [] );
  // Refs
  const mapRef = useRef( null );

  // State variables
  const [ imageOpacity, setImageOpacity ] = useState( undefined );
  const [ sound, setSound ] = useState( true );
  const [ polylineCoords, setPolylineCoords ] = useState( [] );
  const [ userLocation, setUserLocation ] = useState( null );
  const [ userHeading, setUserHeading ] = useState( 0 );
  const [ instructBanner, setInstruct ] = useState("Loading Route.....");
  const [ AEDReached, setAEDReached ] = useState( false );
  const [ incidentReached, setIncidentReached ] = useState( false );
  const [ stairsReached, setStairsReached ] = useState( false );
  const [ backToStairsReached, setBackToStairsReached ] = useState( false );
  const [ AEDNotLocated, setAEDNotLocated ] = useState( false );
  const [ userNav, setUserNav ] = useState( false );
  const [ incidentNav, setIncidentNav ] = useState( false );
  const [ aed, setFinalAED ] = useState( '' );
  const [ AEDImage, setAEDImage ] = useState( "null" );
  const stairsCoord = [ 55.861169624718606, -4.243512748533567 ];
  const [ durationBanner, setDurationBanner ] = useState( "" );

  const [ speechInProgress, setSpeechInProgress ] = useState( false );

  // Function to toggle the sound state between true and false
  const toggleSound = () => {
    setSound( ( prevSound ) => !prevSound );
  };

  // Function to initiate speech synthesis based on the provided text
  const speakInstructions = async ( text ) => {

    if ( sound && startMessage === false ) {

      await Speech.speak( text, {
        language: 'en',
        onStart: () => setSpeechInProgress( true ),

        onDone: () => setSpeechInProgress( false ),
      } );
    }
  };


  useEffect( () => {
    // If sound is turned off and speech is still in progress,
    // set the opacity of an element to 0.25 to indicate ongoing speech
    if ( !sound && speechInProgress ) {
      setImageOpacity( 0.25 );
    } else {

      setImageOpacity( undefined );
    }
  }, [ sound, speechInProgress ] );




  // Fetch incident details and active AEDs on component mount
  useEffect( () => {


    const fetchData = async () => {
      await fetchIncidentDetails();
    };

    // Initial fetch
    fetchData();

  }, [] );

  useEffect( () => {

    const checkActiveAEDs = () => {
      const starCountRef = ref( db, 'aeds/' );

      const unsubscribe = onValue(
        starCountRef,
        ( snapshot ) => {
          const data = snapshot.val();
          if ( data ) {
            const activeAEDs = Object.keys( data )
              .map( ( key ) => ( {
                name: data[ key ].name,
                latitude: data[ key ].latitude,
                longitude: data[ key ].longitude,
                ...( data[ key ].active ? { active: data[ key ].active } : {} ),
              } ) )
              .filter( ( aed ) => aed.active === true );

            updateAEDData( activeAEDs );
          }
        },
        ( error ) => {
          console.error( 'Error fetching AED data:', error.message );
        }
      );

      // Return the unsubscribe function
      return unsubscribe;
    };

    // Call the function to start listening
    const unsubscribe = checkActiveAEDs();

    // Cleanup function (unsubscribe) is automatically handled by onValue

    // If you want to stop listening when the component unmounts
    return () => {
      unsubscribe();
    };
  }, [aedData] );

  // Add AED used to incident details
  const addAEDUsedToIncidentDetail = useCallback( async ( aed ) => {
    let newEntryID = 0;
    try {
      const incidentRep = await ref( db, 'incidentDetails/' );
      const incidentRepSnapshot = await get( incidentRep );

      if ( incidentRepSnapshot.exists() ) {
        incidentReportData = await incidentRepSnapshot.val();
        newEntryID = await incidentReportData.length - 1;
      } else {
        alert( 'Incident Report data not found.' );
      }
    } catch ( error ) {
      alert( 'Error fetching incident reports:', error.message );
    }

    const userRef = ref( db, 'incidentDetails/' + newEntryID );
    try {
      const snapshot = await get( userRef );
      const existingData = await snapshot.val();
      set( userRef, { ...existingData, aedUsed: aed } );
    } catch ( error ) {
      console.error( 'Error updating user status:', error.message );
    }
    setFinalAED( aed );
  }, [] );

  // Deactivate AED
  const deactivateAED = useCallback( async ( aed ) => {
    const userRef = ref( db, `aeds/` + aed );
    try {
      const snapshot = await get( userRef );
      const existingData = await snapshot.val();
      await set( userRef, { ...existingData, active: false } );
    } catch ( error ) {
      console.error( 'Error updating user status:', error.message );
    }
  }, [] );

  // Request location permission and set up location and heading tracking
  useEffect( () => {

    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if ( status === 'granted' ) {


        await watchUserLocation();
        await watchUserHeading();


      }
    };
    requestLocationPermission();
  }, [] );

  // Animate camera when heading or location changes
  useEffect( () => {
    if ( userHeading !== null && mapRef.current ) {
      mapRef.current.animateCamera( {
        pitch: 45,
        heading: userHeading,
      } );
    }
  }, [ userHeading, userLocation ] );

  // Watch user heading changes
  const watchUserHeading = useCallback( async () => {
    await Location.watchHeadingAsync( ( value ) => {
      setUserHeading( value.trueHeading );
    } );
  }, [] );

  // Watch user location changes
  const watchUserLocation = useCallback( async () => {
    await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.BestForNavigation, distanceInterval: 1 },
      ( location ) => {
        setUserLocation( location.coords );
      }
    );
  }, [] );
  useEffect( () => {

  }, [] );

  // Start user or incident navigation based on user's current state
  useEffect( () => {
    if ( userLocation && userNav === true && staffNav === false ) {
      startUserNavigation( userLocation );

    } else if ( userLocation && ( ( incidentNav === true && staffNav === true ) || ( incidentNav === true && staffNav === false ) ) ) {
      startIncidentNavigation( userLocation );
    }
  }, [ aedData, userLocation, userNav, incidentNav, currentFloor, staffNav ] );

  // Start user navigation
  const startUserNavigation = useCallback( async ( user ) => {

    if ( user && currentFloor == 1 ) {

      // User's current location as the origin
      const origin = { latitude: user.latitude, longitude: user.longitude };

      // Find the closest AED to the user's location
      const closest = await findClosestAED( origin, aedData, navigation );


      // Compute route directions to the closest AED
      const routeData = await computeDirections( origin, closest, navigation );

      // Extract directions for user guidance
      const directions = await extractDirections( routeData, closest, false, user );

      // Identify the name of the closest AED
      const AED = await aedData.find( ( location ) => location.latitude === closest[ 0 ] ).name;

      if ( AED !== currentClosestAED && currentClosestAED != "") {
        // Alert the user about the change
        alert( `The closest AED has changed to be in ${ AED }` );
        // Update the current closest AED
        setCurrentClosestAED( AED );
      };
        // Fetch the map image for the identified AED
        const map = await mapImage( AED );

        // Add the used AED to incident details
        await addAEDUsedToIncidentDetail( AED );

        // Set AED image state
        await setAEDImage( map );



      // Compute proximity to the AED
      await computeProximity( user, closest, false );


      await setPolylineCoords( await drawPolyline( routeData, closest, false, user ) );

      await setDurationBanner( await extractDuration() );

      const closestInstruction = await setBannerInstruct( user, directions );

      await settingBanner( closestInstruction );

    } else if ( user && currentFloor != 1 ) {

      const origin = { latitude: user.latitude, longitude: user.longitude };
      // Compute route directions to the closest AED
      const routeData = await computeDirections( origin, stairsCoord, navigation );

      // Extract directions for user guidance
      const directions = await extractDirections( routeData, stairsCoord, false, user );

      // Compute proximity to the AED
      await computeProximity( user, stairsCoord, false, true );




      await setPolylineCoords( await drawPolyline( routeData, stairsCoord, false, user ) );
      await setDurationBanner( await extractDuration() );

      await settingBanner( await setBannerInstruct( user, directions ) );


    }
  }, [ aedData, userLocation, currentFloor, polylineCoords, sound ] );

  // Start incident navigation
  const startIncidentNavigation = useCallback( async ( user ) => {
    if ( user && floorofIncident == currentFloor ) {

      // User's current location as the origin
      const origin = await { latitude: user.latitude, longitude: user.longitude };

      // Incident coordinates
      const incidentCoord = await [ incident[ 0 ], incident[ 1 ] ];

      // Compute proximity to the incident
      await computeProximity( origin, incidentCoord, true );

      // Compute route directions to the incident
      const routeData = await computeDirections( origin, incidentCoord, navigation );

      // Extract directions for user guidance
      const directions = await extractDirections( routeData, undefined, true, user );

      // Draw the route polyline on the map

      await setPolylineCoords( await drawPolyline( routeData, undefined, true, user ) );


      // Speak the closest instruction if sound is on
      await settingBanner( await setBannerInstruct( user, directions ) );
    }
    else if ( user && ( floorofIncident != currentFloor ) ) {
      // User's current location as the origin
      const origin = await { latitude: user.latitude, longitude: user.longitude };

      // Incident coordinates

      // Compute proximity to the incident
      await computeProximity( origin, stairsCoord, true, undefined, true );

      // Compute route directions to the incident
      const routeData = await computeDirections( origin, stairsCoord, navigation );

      // Extract directions for user guidance
      const directions = await extractDirections( routeData, undefined, undefined, user, stairsCoord );

      // Draw the route polyline on the map

      await setPolylineCoords( await drawPolyline( routeData, undefined, undefined, user, stairsCoord ) );


      // Speak the closest instruction if sound is on

      await settingBanner( await setBannerInstruct( user, directions ) );
    }

  }, [ aedData, userLocation, currentFloor,  floorofIncident, polylineCoords, sound ] );


  const settingBanner = ( closestInstruction ) => {
    setInstruct( ( prevInstruct ) => {
      if ( prevInstruct !== closestInstruction ) {
        speakInstructions( closestInstruction );
        return closestInstruction;
      } else {

        return prevInstruct;
      }
    } );
  };


  // Compute proximity to the target (AED or incident)
  const computeProximity = useCallback(
    ( user, target, incident, stairs, backToStairs ) => {
      // Fixed radius for proximity check
      const fixedRadius = 0.00002;

      // Compute latitude and longitude differences
      const latDiff = Math.abs( user.latitude - target[ 0 ] );
      const lonDiff = Math.abs( user.longitude - target[ 1 ] );

      // Check if user is within the fixed radius of the target
      if ( latDiff <= fixedRadius && lonDiff <= fixedRadius ) {

        // Vibrate the device to alert the user
        if ( incident == false && currentFloor == 1 ) {
          // Set AED reached state
          setAEDReached( true );

          // Vibrate pattern for AED
          Vibration.vibrate( [ 100, 100, 300, 100, 100, 1000 ] );
        } else if ( incident == true && currentFloor == floorofIncident ) {
          // Set incident reached state
          setIncidentReached( true );

          // Vibrate pattern for incident
          Vibration.vibrate( [ 100, 100, 300, 100, 100, 1000 ] );

        } else if ( incident == false && stairs == true ) {
          setStairsReached( true );

          // Vibrate pattern for incident
          Vibration.vibrate( [ 100, 100, 300, 100, 100, 1000 ] );
        }
        else if ( incident == true && backToStairs == true ) {

          setBackToStairsReached( true );

          // Vibrate pattern for incident
          Vibration.vibrate( [ 100, 100, 300, 100, 100, 1000 ] );
        }
      }
    },
    [ userLocation, setAEDReached, setIncidentReached ]
  );


  const handleReachedStairs = useCallback( () => {
    // Deactivate the AED and update states
    setStairsReached( false );
    setCurrentFloor( 1 );
  }, [] );


  const handleBackToStairs = useCallback( () => {
    // Deactivate the AED and update states
    setBackToStairsReached( false );
    setIncidentNav( true );
    setUserNav( false );
    setCurrentFloor( floorofIncident );
  }, [ floorofIncident ] );

  // Handle user pressing 'YES' for AED
  const handleYesAEDPress = useCallback( () => {
    // Deactivate the AED and update states
    setInstruct("Heading back to casualty");
    speakInstructions( "Heading back to casualty" );
    deactivateAED( aed );
    setAEDReached( false );
    setIncidentNav( true );
    setUserNav( false );
    setAEDNotLocated( false );


  }, [ deactivateAED, aed ] );

  // Handle user pressing 'NO' for AED
  const handleNoAEDPress = useCallback( () => {
    // Update states
    setAEDReached( false );
    setAEDNotLocated( true );
  }, [ setAEDReached, setAEDNotLocated ] );

  // Handle user pressing 'OK' for incident
  const handleIncident = useCallback( async () => {
    try {
      // Fetch incident details and reports
      await fetchIncidentDetails();
      await fetchIncidentReports();
      let currentIncidentID = 0;
      try {
        const incidentRep = await ref( db, 'incidentReports/' );
        const incidentRepSnapshot = await get( incidentRep );

        if ( incidentRepSnapshot.exists() ) {
          incidentReportData = await incidentRepSnapshot.val();
          currentIncidentID = await incidentReportData.length;
        } else {
          alert( 'Incident Report data not found.' );
        }
      } catch ( error ) {
        alert( 'Error fetching incident reports:', error.message );
      }

      // Create a new incident report
      const newIncidentReport = {
        aed: aed,
        id: currentIncidentID,
        incidentDate: incidentData.incidentDate,
        latitude: incident[ 0 ],
        longitude: incident[ 1 ],
        notes: "",
        staffAttended: incidentData.staffAttended,
        username: incidentData.username,
        floor: floorofIncident,
      };

      // Add the new incident report to the database
      await addNewReport( newIncidentReport, currentIncidentID );

      try {
        const incidentRep = await ref( db, 'incidentDetails/' );
        const incidentRepSnapshot = await get( incidentRep );

        if ( incidentRepSnapshot.exists() ) {
          incidentDetailsData = await incidentRepSnapshot.val();
          currentIncidentID = await incidentDetailsData.length - 1;
        } else {
          alert( 'Incident Report data not found.' );
        }
      } catch ( error ) {
        alert( 'Error fetching incident reports:', error.message );
      }
      const entryRef = ref( db, 'incidentDetails/' + currentIncidentID );

      try {
        // Remove the entry from the database
        await remove( entryRef );

      } catch ( error ) {
        console.error( 'Error removing entry:', error.message );
      };
      // Redirect or perform any other actions after creating the incident report
      navigation.navigate( 'Home' );
    } catch ( error ) {
      console.error( 'Error creating incident report:', error.message );
    }
  }, [ incident, incidentData, newEntryID, navigation ] );

  // Fetch the map image for the given AED
  const mapImage = useCallback( ( AED ) => {
      // Get the image source for the AED
      const imageSource = imageMapping[ AED.replace( /\s/g, '' ) ];
      return imageSource;
    },
    [ imageMapping ]
  );

  const handleBack = async () => {
    try {
      await fetchIncidentDetails();

      const incidentRep = ref( db, 'incidentDetails/' );
      const incidentRepSnapshot = await get( incidentRep );

      let currentIncidentID = 0;

      if ( incidentRepSnapshot.exists() ) {
        const incidentDetailsData = incidentRepSnapshot.val();
        currentIncidentID = incidentDetailsData.length - 1;
      } else {
        alert( 'Incident Report data not saved.' );
        return; // Return early if data is not found
      }

      const entryRef = ref( db, 'incidentDetails/' + currentIncidentID );

      try {
        // Remove the entry from the database
        await remove( entryRef );
        // Additional logic or alerts after successfully removing the entry
      } catch ( error ) {
        console.error( 'Error removing entry:', error.message );
        alert( 'Error removing entry:', error.message ); // Add an alert for the error
      }
    } catch ( error ) {
      console.error( 'Error fetching incident reports:', error.message );
      alert( 'Error fetching incident reports:', error.message ); // Add an alert for the error
    }
   navigation.navigate( 'Home' );
  };


  return (
    <SafeAreaView style={ style.container }>
      <View style={ style.banner }>
        <Text style={ { ...style.bannerText, fontSize: calculateFont( instructBanner, 375 ) } }>
          { instructBanner }
        </Text>
      </View>
      { userLocation && durationBanner != null && userNav == true ? (
        <View style={ style.durationBanner }>
          <Text style={ { ...style.bannerText, fontSize: 18 } }>
            { durationBanner } mins away
          </Text>
        </View>
      ) : null }


      { userLocation && (
        <MapView
          provider={ PROVIDER_GOOGLE }
          style={ style.map }
          ref={ mapRef }
          followUserLocation={ true }
          followsUserHeading={ true }
          showsUserLocation={ true }
          showsCompass={ false }
          showsMyLocationButton={ false }
          onUserLocationChange={ () => {
            if ( mapRef.current && userLocation ) {
              mapRef.current.animateCamera( {
                center: {
                  latitude: userLocation.latitude,
                  longitude: userLocation.longitude,
                },
              } );
            }
          } }
          accessibilityLabel="Map showing AED locations"
          initialRegion={ {
            latitude: userLocation?.latitude || 0,
            longitude: userLocation?.longitude || 0,
            latitudeDelta: 0.0001,
            longitudeDelta: 0.0001,
          } }
          indoorLevelPicker={ true }
        >
          { aedData.map( ( location, index ) => {
            if ( aed === location.name && currentFloor == 1 && userNav == true ) {
              return (
                <Marker
                  key={ index }
                  coordinate={ { latitude: location.latitude, longitude: location.longitude } }
                  title={ location.name }
                >
                  <Image source={ AEDMarker } style={ { width: 20, height: 35 } } />
                </Marker>
              );
            } else {
              // You may optionally handle the case when the condition is not met.
              return null;
            }
          } ) }



          { currentFloor != 1 && userNav == true && (
            <Marker coordinate={ { latitude: stairsCoord[ 0 ], longitude: stairsCoord[ 1 ] } } title="Lift">
              <Image source={ require( '../images/lift.png' ) } style={ { width: 36, height: 36, opacity: imageOpacity } } />
            </Marker>
          ) }

          { floorofIncident == currentFloor && incidentNav == true && (
            <Marker coordinate={ { latitude: incident[ 0 ], longitude: incident[ 1 ] } } title="Incident">
              <Image source={ require( '../images/IncidentMarker.png' ) } style={ { width: 20, height: 35, opacity: imageOpacity } } />
            </Marker>
          ) }



          { floorofIncident != currentFloor && incidentNav == true && (
            <Marker coordinate={ { latitude: stairsCoord[ 0 ], longitude: stairsCoord[ 1 ] } } title="lift">
              <Image source={ require( '../images/lift.png' ) } style={ { width: 36, height: 36, opacity: imageOpacity } } />
            </Marker>
          ) }


          { polylineCoords.length > 0 && (
            <Polyline coordinates={ polylineCoords } strokeWidth={ 2 } strokeColor="red" />
          ) }
        </MapView>
      ) }

      <SafeAreaView style={ style.microIcon }>
        <Pressable onPress={ () => toggleSound() } accessibilityLabel="Turn Sound On/Off">
          <Image
            source={ sound ? require( '../images/microphoneOn.png' ) : require( '../images/microphoneOff.png' ) }
            style={ { width: 55, height: 55, opacity: imageOpacity } }
          />
        </Pressable>
      </SafeAreaView>

      <SafeAreaView style={ style.zoomInIcon }>
        <TouchableOpacity onPress={ () => zoomIn( mapRef, userLocation ) } accessibilityLabel="Zoom in">
          <Image source={ require( '../images/zoomIn.png' ) } style={ { width: 55, height: 55 } } />
        </TouchableOpacity>
      </SafeAreaView>
      <SafeAreaView style={ style.backIcon }>
        { staffNav === false ? (
          <TouchableOpacity onPress={handleBack} accessibilityLabel="Navigate back to Home">
            <Image source={ require( '../images/arrow-back.png' ) } style={ { width: 55, height: 55 } } />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={ () => navigation.navigate( 'Dashboard', { user: staffUsername } ) } accessibilityLabel="Navigate back to Dashboard">
            <Image source={ require( '../images/arrow-back.png' ) } style={ { width: 55, height: 55 } } />
          </TouchableOpacity>
        ) }
      </SafeAreaView>

      <SafeAreaView style={ style.sosIcon }>
        <TouchableOpacity onPress={ () => handleCallPress() } accessibilityLabel="call emergency services">
          <Text style={ { fontSize: 23, fontWeight: 'bold', color: 'white', justifyContent: 'center' } }>SOS</Text>
        </TouchableOpacity>
      </SafeAreaView>

      { ( AEDReached === true && userNav == true ) && (
        <SafeAreaView style={ style.yesNoContainer } accessibilityLabel="Defibrillator located prompt">
          <Text style={ style.emergencyYesNoText }>DEFIB FOUND?</Text>
          <View style={ { flexDirection: 'row', justifyContent: 'space-evenly' } }>
            <SafeAreaView style={ style.noButton }>
              <TouchableOpacity onPress={ handleNoAEDPress } accessibilityLabel="No, Defibrillator Not Located">
                <Text style={ style.noText }>NO</Text>
              </TouchableOpacity>
            </SafeAreaView>
            <SafeAreaView style={ style.yesButton }>
              <TouchableOpacity onPress={ handleYesAEDPress } accessibilityLabel="Yes, Defibrillator Located">
                <Text style={ style.yesText }>YES</Text>
              </TouchableOpacity>
            </SafeAreaView>

          </View>
        </SafeAreaView>
      ) }

      { incidentReached === true && incidentNav === true && (
        <SafeAreaView style={ style.incidentFoundContainer } accessibilityLabel="Defibrillator located prompt">
          { staffNav === false && (
            <>
              <Text style={ style.emergencyYesNoText }>FOLLOW INSTRUCTIONS ON DEFIB</Text>
              <SafeAreaView style={ style.yesButton }>
                <TouchableOpacity onPress={ handleIncident } accessibilityLabel="Yes, Defibrillator Located">
                  <Text style={ style.yesText }>OK</Text>
                </TouchableOpacity>
              </SafeAreaView>
            </>
          ) }

          { staffNav === true && (
            <>
              <Text style={ style.emergencyYesNoText }>INCIDENT REACHED</Text>
              <SafeAreaView style={ style.yesButton }>
                <TouchableOpacity onPress={ () => navigation.navigate( 'Dashboard', { user: staffUsername } ) } accessibilityLabel="">
                  <Text style={ style.yesText }>OK</Text>
                </TouchableOpacity>
              </SafeAreaView>
            </>
          ) }
        </SafeAreaView>
      ) }


      { ( stairsReached === true && userNav == true ) && (
        <SafeAreaView style={ style.incidentFoundContainer } accessibilityLabel="Defibrillator located prompt">
          <Text style={ style.emergencyYesNoText }>TAKE THE STAIRS/LIFT TO FLOOR 1</Text>
          <SafeAreaView style={ style.yesButton }>
            <TouchableOpacity onPress={ handleReachedStairs } accessibilityLabel="Yes, Defibrillator Located">
              <Text style={ style.yesText }>OK</Text>
            </TouchableOpacity>
          </SafeAreaView>

        </SafeAreaView>
      ) }

      { ( backToStairsReached === true && incidentNav == true ) && (
        <SafeAreaView style={ style.incidentFoundContainer } accessibilityLabel="Defibrillator located prompt">
          <Text style={ style.emergencyYesNoText }>TAKE THE STAIRS/LIFT TO FLOOR { floorofIncident }</Text>
          <SafeAreaView style={ style.yesButton }>
            <TouchableOpacity onPress={ handleBackToStairs } accessibilityLabel="Yes, Defibrillator Located">
              <Text style={ style.yesText }>OK</Text>
            </TouchableOpacity>
          </SafeAreaView>

        </SafeAreaView>
      ) }


      { startMessage && (
        <View style={ { zIndex: 2,backgroundColor: 'rgba(128, 128, 128, 0.4)' , ...StyleSheet.absoluteFillObject, alignItems: 'center' } }>

          <View style={ {  top: "10%", padding: '5%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', backgroundColor: '#BFBFBF', borderRadius: 10, elevation: 5, width: '91%', height: '60%' } }>
          <Text style={ style.isThisAnEmergency }>BEFORE LOCATING:</Text>

          <View style={ { marginBottom: '5%', width: '100%', flexDirection: 'row', alignItems: 'center' } }>
            <Image source={ require( '../images/listenToBreathing.png' ) } style={ { width: 60, height: 60, marginRight: '5%' } } />
            <Text style={ { ...style.startText, flex: 1, fontStyle: 'normal' } }>Check responsiveness, tilt head, lift chin, listen for breathing.</Text>
          </View>

          <View style={ { marginBottom: '5%', width: '100%', flexDirection: 'row', alignItems: 'center' } }>
            <Image source={ require( '../images/CPR.png' ) } style={ { marginRight: '5%', width: 60, height: 60 } } />
            <Text style={ { ...style.startText, flex: 1, fontStyle: 'normal' } }>If not breathing, delegate someone to call 999/112 and start CPR.</Text>
          </View>

          <View style={ { marginBottom: '5%', width: '100%', flexDirection: 'row', alignItems: 'center' } }>
            <Image source={ require( '../images/locateNowIcon.png' ) } style={ { marginRight: '5%', width: 50, height: 90 } } />
            <Text style={ { ...style.startText, flex: 1, fontStyle: 'normal' } }>Follow the directions to find a defibrillator.</Text>
          </View>

          <Text style={ { ...style.startText, } }>If a staff member is available, they will be guided to the incident.</Text>

      </View>

      <SafeAreaView style={ style.emergencyContainer } accessibilityLabel="Defibrillator located prompt">
        <Text style={ style.isThisAnEmergency }>IS THIS AN EMERGENCY?</Text>


        <View style={ { flexDirection: 'row', justifyContent: 'space-evenly' } }>
          <SafeAreaView style={ style.noButton }>
            <TouchableOpacity onPress={ () => navigation.navigate( 'Home' ) } accessibilityLabel="No, Defibrillator Not Located">
              <Text style={ style.noTextBeforeLocate }>NO</Text>
            </TouchableOpacity>
          </SafeAreaView>
          <SafeAreaView style={ style.yesButton }>
            <TouchableOpacity onPress={ () => setStartMessage(false) } accessibilityLabel="Yes, Defibrillator Located">
              <Text style={ style.yesBeforeLocate }>YES</Text>
            </TouchableOpacity>
          </SafeAreaView>
          </View>

      </SafeAreaView>


      </View>
      ) }

      { AEDNotLocated && (

        <View style={ style.AEDImageContainer }>
          <Text style={ style.emergencyYesNoText }>USE IMAGE TO FIND DEFIB</Text>
          <Image source={ AEDImage } style={ { width: '60%', height: '65%' } } accessibilityLabel="Image of Defibrillator" />

          <View style={ style.yesAEDButton }>
            <TouchableOpacity onPress={ handleYesAEDPress } accessibilityLabel="Yes, Defibrillator Located">
              <Text style={ style.yesText }>FOUND</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) }
    </SafeAreaView>

  );
}

export default Map;
