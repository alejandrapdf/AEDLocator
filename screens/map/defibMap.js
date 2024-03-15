import React, { useEffect, useRef } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { online } from '../../config.js';
import { default as AEDMarker, default as offlineImage } from '../../images/AEDMarker.png';
import style from '../../styles/default.js';
import { aedMarkers } from '../../utils/cache.js';
import { fetchAEDs } from '../../utils/fetchDBs.js';

const DefibMap = ( {navigation } ) => {


  useEffect( () => {
    const fetchData = async () => {
      await fetchAEDs();
        console.log( aedMarkers );

    };

    if (online == true){
      fetchData();
    }


  }, [] );


  const mapRef = useRef( null );

  return (
    <SafeAreaView style={ { height: '82%', width: '90%', borderRadius: 25, backgroundColor: '#FFA800', top: '5%',alignSelf: 'center' } }>
      <Text style={ { color: 'white', fontSize: 50, fontWeight: 'bold', fontFamily: 'Roboto', textAlign: 'center' } }>Campus Defib Map</Text>


      <SafeAreaView style={ { flex: 1, ...style.defibMapContainer} }>
        { !online ? (
          <Image source={ offlineImage } style={ { flex: 1, resizeMode: 'contain' } } />
        ) : (
      <MapView
        provider={ PROVIDER_GOOGLE }
        style={ style.defibMap }
        showsCompass={ false }
        showsMyLocationButton={ false }
        accessibilityLabel="Map showing AED locations"
        initialRegion={ {
          latitude: 55.86194001395574,
          longitude: -4.244393357201725,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        } }
        indoorLevelPicker={ true }
        ref={ mapRef }
      >

        { Object.values( aedMarkers ).map( ( location, index ) => (
          <Marker
            key={ index }
            coordinate={ { latitude: location.latitude, longitude: location.longitude } }
            title={ location.name }
          >
            <Image source={ AEDMarker } style={ { width: 20, height: 35 } } />
          </Marker>
        ) ) }


      </MapView>
        ) }
    </SafeAreaView>

      <View style={ style.backIconDefib }>
        <TouchableOpacity onPress={ () => navigation.navigate( 'Home' ) } accessibilityLabel="Navigate back to Dashboard">
          <Image source={ require( '../../images/arrow-back.png' ) } style={ { width: 55, height: 55 } } />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default DefibMap;