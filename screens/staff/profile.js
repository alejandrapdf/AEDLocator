import { useRoute } from '@react-navigation/native';
import { get, ref, set } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../config.js';
import style from '../../styles/default.js';
import { fetchStaffDetails, staffData } from '../../utils/fetchDBs.js';

// Component for StaffDetails screen
const StaffDetails = ( { navigation } ) => {
  const route = useRoute();
  const [ currentStaff, setCurrentStaff ] = useState( '' );
  const [ isModalVisible, setIsModalVisible ] = useState( false );
  const [ newText, setNewText ] = useState( '' );
  const { user } = route.params;
  const [ field, setField ] = useState();

  // Function to open the edit modal
  const openEditModal = ( param ) => {
    setField( param );
    setIsModalVisible( true );
  }

  // Function to close the edit modal
  const closeEditModal = () => {
    setIsModalVisible( false );
  }

  // Function to handle editing user data
  const handleEdit = async () => {
    // Close the modal

    try {
      const userRef = ref( db, `staff/${user}` );
      const userSnapshot = await get( userRef );

      if ( userSnapshot.exists() ) {
        const userToUpdate = userSnapshot.val();
        if(field == "email"){
          await set( userRef, { ...userToUpdate, email: newText } );
        } else if ( field == "phone" ) {
          await set( userRef, { ...userToUpdate, phone: newText } );
        }
        else if ( field == "position" ) {
          await set( userRef, { ...userToUpdate, position: newText } );
        }
        // Fetch the updated data immediately
        const updatedUserSnapshot = await get( userRef );
        const updatedUser = updatedUserSnapshot.val();

        // Update the state with the new data
        setCurrentStaff( updatedUser );

        closeEditModal();

      } else {
        alert( 'User not found for editing.' );
      }
    } catch ( error ) {
      alert( 'Error editing user:', error.message );
    }
  };

  // Function to fetch staff data
  const fetchStaffData = () => {
    fetchStaffDetails();
    Object.keys( staffData ).forEach( ( username ) => {
      if ( username === user ) {
        setCurrentStaff( staffData[ username ] );
      }
    } );
  };

  // Effect hook to fetch staff data
  useEffect( () => {
    fetchStaffData();
  }, [] );

  return (
    <SafeAreaView  style={ { flex: 1 } }>

      <ImageBackground
        source={ require( '../../images/dashboardheader.png' ) }
        style={ style.background }
        accessible={ true }
        accessibilityLabel="Dashboard Header Image"
      >
        <Text style={ style.heading } accessibilityRole="header" accessibilityLevel={ 1 }>
          My Profile
        </Text>
      </ImageBackground>

      <ScrollView
        style={ {
          flex: 1,
          width: '100%',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          overflow: 'hidden',
        } }
      >
        { currentStaff && (

          <View style={ { paddingLeft: 50, paddingRight: 50, paddingTop: 20, } }>
            <View style={ { ...style.row, } }>
              <Image source={ require( '../../images/profile.png' ) } style={ { width: 100, height: 100 } } />
              <Text style={ { fontSize: 40, textAlign: 'left', marginLeft: '5%', width: '95%' } }>{ currentStaff.fullname }</Text>
            </View>
            <View style={ { alignItems: 'left' } }>

              <Text style={ style.label }>Username</Text>

              <Text style={ { lineHeight: 50, ...style.input } }>{ currentStaff.username}</Text>

              <Text style={ style.label }>Position</Text>
              <Text style={ { lineHeight: 50, ...style.input } }>{ currentStaff.position }</Text>
              <TouchableOpacity style={ { left: '90%', bottom: '10%' } } onPress={ () => openEditModal( 'position' ) }>
                <Image source={ require( '../../images/edit.png' ) } style={ { width: 20, height: 20 } } />
              </TouchableOpacity>


              <Text style={ style.label }>Email</Text>
              <Text style={ { lineHeight: 50, ...style.input } }>{ currentStaff.email }</Text>
              <TouchableOpacity style={ { left: '90%', bottom: '10%' } } onPress={ () => openEditModal( 'email' ) }>
                <Image source={ require( '../../images/edit.png' ) } style={ { width: 20, height: 20 } } />
              </TouchableOpacity>

              <Text style={ style.label }>Phone</Text>
              <Text style={ { lineHeight: 50, ...style.input } }>{ currentStaff.phone }</Text>
              <TouchableOpacity style={ { left: '90%', bottom: '10%' } } onPress={ () => openEditModal( 'phone' ) }>
                <Image source={ require( '../../images/edit.png' ) } style={ { width: 20, height: 20 } } />
              </TouchableOpacity>



            </View>

          </View>
        ) }

        <Modal animationType="slide" transparent={ true } visible={ isModalVisible } >
          <View style={ { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' } }>
            <View style={ { backgroundColor: '#BFBFBF', padding: 20, borderRadius: 10, elevation: 5, width: '80%', alignItems: 'center' } }>
              <TouchableOpacity onPress={ closeEditModal } style={ { alignItems: 'flex-end', left: 125 } }>
                <Image source={ require( '../../images/cross.png' ) } style={ { width: 20, height: 20 } } />

              </TouchableOpacity>

              <Text style={ { fontSize: 30, fontWeight: 'bold', marginBottom: 10 } }>Change { field }</Text>
              { ( () => {
                switch ( field ) {
                  case "email":
                    return <Image source={ require( '../../images/editEmail.png' ) } style={ { width: 75, height: 60 } } />;
                  case "phone":
                    return <Image source={ require( '../../images/changePhoneIcon.png' ) } style={ { width: 60, height: 60 } } />;
                  default:
                    return null; // or another default component if needed
                }
              } )() }
              <TextInput
                style={ { backgroundColor: 'white', marginTop: '5%', width: '80%', height: 40, borderBottomWidth: 1, paddingVertical: 8 } }
                placeholder="New Value"
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

      </ScrollView>

      <View style={ style.backIcon }>
        <TouchableOpacity onPress={ () => navigation.navigate( 'Dashboard', { user: user } ) } accessibilityLabel="Navigate back to Dashboard">
          <Image source={ require( '../../images/arrow-back-black.png' ) } style={ { width: 55, height: 55 } } />
        </TouchableOpacity>
      </View>

    </SafeAreaView>

  );

};

export default StaffDetails;
