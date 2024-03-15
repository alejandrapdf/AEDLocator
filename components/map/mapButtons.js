
import { Linking } from 'react-native';


const handleCallPress = () => {
  const phoneNumber = 999;
  const telLink = `tel:${ phoneNumber }`;
  Linking.openURL( telLink );
};

const zoomIn = ( mapRef, user ) => {
  if ( user ) {
    mapRef.current.setCamera( {
      center: {
        latitude: user.latitude,
        longitude: user.longitude,
      },
      zoom: 100,
    } );
  }
};


export { handleCallPress, zoomIn };
