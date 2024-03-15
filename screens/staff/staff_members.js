import { useRoute } from '@react-navigation/native';
import { onValue, ref, set } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { Image, ImageBackground, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../config.js';
import style from '../../styles/default.js';

// Component for Staff screen
const Staff = ( { navigation } ) => {
  const route = useRoute();

  const { user } = route.params;
  console.log( "user", user );

  const [ fullName, setFullName ] = useState( '' );
  const [ username, setUsername ] = useState( '' );
  const [ phone, setPhone ] = useState( '' );
  const [ password, setPassword ] = useState( '' );
  const [ email, setEmail ] = useState( '' );
  const [ position, setPosition ] = useState( '' );
  const [ trainingExpiry, setTrainingExpiry ] = useState( '' );
  const [ isModalVisible, setModalVisible ] = useState( false );
  const [ isDetailsModalVisible, setDetailsModalVisible ] = useState( false );
  const [ selectedUser, setSelectedUser ] = useState( {} );
  const [ toggleSwitch, setToggleSwitch ] = useState( false );
  const [ userData, setUserData ] = useState( [] );
  const activeUserCount = userData.filter( ( user ) => user.active === true ).length;

  // Function to toggle the modal visibility for adding a new staff member
  const toggleModal = () => {
    //look through user data and if the user is the same as user
    //and they are admin allow them to toggle
    const isAdmin = userData.some( staff => staff.admin === true && staff.username === user );

    if ( isAdmin ){
      setModalVisible( !isModalVisible );
    }
    else{
      alert( 'Only admin can add a new staff member' );

    };

  };

  // Function to toggle the modal visibility for staff member details
  const toggleDetailsModal = () => {
    setDetailsModalVisible( !isDetailsModalVisible );
  };

  // Function to open the details modal for a specific user
  const openDetailsModal = ( user ) => {
    setSelectedUser( user );
    setToggleSwitch( user.active ); // Set toggle switch state based on user active status
    toggleDetailsModal();
  };

  // Function to add a new staff member to the database
  const addNewStaffToDB = () => {
    const isValidPhoneNumber = ( phone ) => {
      // Check if the phone number is exactly 11 digits
      const regex = /^\d{11}$/;
      return regex.test( phone );
    };
    console.log( "isValidPhoneNumber",isValidPhoneNumber );

    if ( fullName && position && username && trainingExpiry && email && isValidPhoneNumber(phone) == true ) {

      set( ref( db, 'staff/' + username ), {
        active: false,
        admin: false,
        awayToIncident: false,
        username: username,
        fullname: fullName,
        email: email,
        phone: phone,
        trainingExpiry: trainingExpiry,
        password: password,
        position: position,
        stationed: "none",
      } );
      setTrainingExpiry( '' );
      setPosition( '' );
      setUsername( '' ),
      setFullName( '' );
      setEmail( '' );
      setPhone( '' );
      setPassword( '' );
      toggleModal();
    }
    else if ( isValidPhoneNumber( phone ) == false ) {
      // Handle the case when mandatory fields are not filled
      alert( 'Please ensure the phone number is 11 numeric digits' );
    }
    else{
      alert( 'Please fill in all the fields' );
    }
  };

  useEffect( () => {
    const userRef = ref( db, 'staff/' );
    onValue( userRef, ( snapshot ) => {
      const data = snapshot.val();
      const newUsers = Object.keys( data ).map( ( key ) => ( {
        ...data[ key ],
        username: key,
      } ) );
      setUserData( newUsers );
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
          Staff
        </Text>
        <Text style={ style.activeHeading }>Active Staff: { activeUserCount }/{ userData.length }</Text>
      </ImageBackground>
      <ScrollView style={ { marginTop: 10, flex: 1, width: '100%', borderTopLeftRadius: 50, borderTopRightRadius: 50, overflow: 'hidden' } }>
        <View style={ { flexDirection: 'row', flexWrap: 'wrap', margin: 10, justifyContent: 'space-around' } }>
          {
            userData.length === 0 ? (
              <Text>No AED available</Text>
            ) : ( userData.map( ( user, index ) => (
            <View key={ index } style={ { height: 100, width: '100%', borderRadius: 20, backgroundColor: "#FFD966", justifyContent: 'center', alignItems: 'center', marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3, elevation: 5 } } accessibilityLabel={ `User ${ index + 1 }` }>
              <TouchableOpacity onPress={ () => openDetailsModal( user ) } style={ { position: 'absolute', top: 5, right: 10 } }>
                <Image source={ require( '../../images/threedots.png' ) } style={ { width: 30, height: 30 } } />
              </TouchableOpacity>
              { user.active ? (

                <Image source={ require( '../../images/staffIconGreen.png' ) } style={ { width: 75, height: 80 } } />
              ) : (
                <Image source={ require( '../../images/staffIconRed.png' ) } style={ { width: 80, height: 80 } } />
              ) }
              <Text style={ { justifyContent: 'center', color: '#3E4550', fontFamily: 'Roboto', fontSize: 18, fontStyle: 'italic' } }>{ user.fullname }</Text>
            </View>
            ) )
            )
          }
          <TouchableOpacity title="Add a User" onPress={ toggleModal } style={ { height: 100, width: "100%", borderRadius: 20, backgroundColor: "lightgrey", justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3, elevation: 5 } } accessibilityLabel={ "User" }>
            <Image source={ require( '../../images/addStaff.png' ) } style={ { width: 66, height: 62 } } />
            <Text style={ { justifyContent: 'center', color: '#3E4550', fontFamily: 'Roboto', fontSize: 18, fontStyle: 'italic' } }>Add New Staff</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={ style.backIcon }>
        <TouchableOpacity onPress={ () => navigation.navigate( 'Dashboard', { user: user } ) } accessibilityLabel="Navigate back to Dashboard">
          <Image source={ require( '../../images/arrow-back-black.png' ) } style={ { width: 55, height: 55 } } />
        </TouchableOpacity>
      </View>

      <Modal animationType="slide" transparent={ true } visible={ isModalVisible }>
        <View style={ { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' } }>
          <View style={ { backgroundColor: '#BFBFBF', padding: 20, borderRadius: 10, elevation: 5, width: '90%' } }>
            <TouchableOpacity onPress={ toggleModal } style={ { alignItems: 'flex-end', marginBottom: 10 } }>
              <Image source={ require( '../../images/cross.png' ) } style={ { width: 20, height: 20 } } />
            </TouchableOpacity>
            <ScrollView>
              <View style={ { justifyContent: 'center', alignItems: 'center' } }>

                <Image source={ require( '../../images/addStaff.png' ) } style={ { width: 66, height: 63 } } />

                <Text style={ { fontSize: 30, fontWeight: 'bold', fontStyle: 'italic', } }>Add Staff Member</Text>
              </View>

              <View style={ { marginBottom: 5, marginTop: 20 } }>
                <Text style={ { marginBottom: 5, fontSize: 20, fontWeight: 'bold', fontStyle: 'italic', } }>Staff Member:</Text>
                <TextInput
                  placeholder="Enter Staff's Fullname"
                  value={ fullName }
                  onChangeText={ ( text ) => setFullName( text ) }
                  style={ { backgroundColor: 'white', borderBottomWidth: 1, paddingVertical: 8 } }
                />
              </View>

              <View style={ { marginBottom: 10 } }>
                <Text style={ { marginBottom: 5, fontSize: 20, fontWeight: 'bold', fontStyle: 'italic', } }>Staff Position:</Text>
                <TextInput
                  placeholder="Enter staff position"
                  value={ position }
                  onChangeText={ ( text ) => setPosition( text ) }
                  style={ { backgroundColor: 'white', borderBottomWidth: 1, paddingVertical: 8 } }
                />
              </View>

              <View style={ { marginBottom: 10, } }>
                <Text style={ { marginBottom: 5, fontSize: 20, fontWeight: 'bold', fontStyle: 'italic', } }>Username:</Text>
                <TextInput
                  placeholder="Create a username"
                  value={ username }
                  onChangeText={ ( text ) => setUsername( text ) }
                  style={ { backgroundColor: 'white', borderBottomWidth: 1, paddingVertical: 8 } }
                />
              </View>
              <View style={ { marginBottom: 10 } }>
                <Text style={ { marginBottom: 5, fontSize: 20, fontWeight: 'bold', fontStyle: 'italic', } }>Password:</Text>
                <TextInput
                  placeholder="Create a password"
                  value={ password }
                  onChangeText={ ( text ) => setPassword( text ) }
                  style={ { backgroundColor: 'white', borderBottomWidth: 1, paddingVertical: 8 } }
                />
              </View>

              <View style={ { marginBottom: 10 } }>
                <Text style={ { marginBottom: 5, fontSize: 20, fontWeight: 'bold', fontStyle: 'italic', } }>Expiry of AED training :</Text>
                <TextInput
                  placeholder="DD/MM/YYYY"
                  value={ trainingExpiry }
                  onChangeText={ ( text ) => setTrainingExpiry( text ) }
                  style={ { backgroundColor: 'white', borderBottomWidth: 1, paddingVertical: 8 } }
                />
              </View>
              <View style={ { marginBottom: 10 } }>
                <Text style={ { marginBottom: 5, fontSize: 20, fontWeight: 'bold', fontStyle: 'italic', } }>Enter Email:</Text>
                <TextInput
                  placeholder="Enter email of staff member"
                  value={ email }
                  onChangeText={ ( text ) => setEmail( text ) }
                  style={ { backgroundColor: 'white', borderBottomWidth: 1, paddingVertical: 8 } }
                />
              </View>

              <View style={ { marginBottom: 10 } }>
                <Text style={ { marginBottom: 5, fontSize: 20, fontWeight: 'bold', fontStyle: 'italic', } }>Enter Phone:</Text>
                <TextInput
                  placeholder="Enter phone of staff member"
                  value={ phone }
                  onChangeText={ ( text ) => setPhone( text ) }
                  style={ { backgroundColor: 'white', borderBottomWidth: 1, paddingVertical: 8 } }
                  keyboardType="numeric"
                />
              </View>



              <TouchableOpacity onPress={ addNewStaffToDB } style={ { backgroundColor: '#00A34A', padding: 10, borderRadius: 5, alignItems: 'center' } }>
                <Text style={ { color: 'white', fontSize: 20, fontWeight: 'bold' } }>Add</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>


      <Modal animationType="slide" transparent={ true } visible={ isDetailsModalVisible }>
        <View style={ { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' } }>

          <View style={ { alignItems: 'left', backgroundColor: '#BFBFBF', padding: 20, borderRadius: 10, elevation: 5, width: '80%' } }>
            <View style={ { alignItems: 'center' } }>


              <TouchableOpacity onPress={ toggleDetailsModal } style={ { left: '45%' } }>
                <Image source={ require( '../../images/cross.png' ) } style={ { width: 20, height: 20 } } />
              </TouchableOpacity>

              <Image source={ require( '../../images/staffID.png' ) } style={ { width: 150, height: 110 } } />
              <Text style={ { fontSize: 30, fontWeight: 'bold', } }>{ selectedUser.fullname }</Text>
            </View>

            <Text style={ { fontSize: 20, fontWeight: 'bold', color: 'black' } }>Position:</Text>
            <Text style={ { fontSize: 20 } }>{ selectedUser.position }</Text>



            <Text style={ { fontSize: 20, fontWeight: 'bold', color: 'black', marginTop: 10 } }>Contact:</Text>
            <Text style={ { fontSize: 20 } }>{ selectedUser.phone }</Text>


            <Text style={ { fontSize: 20, fontWeight: 'bold', color: 'black', marginTop: 10 } }>Email:</Text>
            <Text style={ { fontSize: 20 } }>{ selectedUser.email }</Text>


          </View>
        </View>
      </Modal>



    </SafeAreaView>
  );
};

export default Staff;
