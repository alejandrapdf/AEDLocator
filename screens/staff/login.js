import { onValue, ref } from 'firebase/database';
import React, { useEffect, useRef, useState } from 'react';
import { Image, ImageBackground, Keyboard, KeyboardAvoidingView, Linking, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db,online } from '../../config.js';
import style from '../../styles/default.js';
import { fetchStaffDetails, staffData } from '../../utils/fetchDBs.js';

// Component for Login screen
const Login = ( { navigation } ) => {
  const [ username, setUsername ] = useState( '' );
  const [ password, setPassword ] = useState( '' );
  const [ email, setEmail ] = useState( '' );
  const [ isModalVisible, setIsModalVisible ] = useState( false );
  const emailInput = useRef( null );
  const [ showPassword, setShowPassword ] = useState( false );
  const [ keyboardVisible, setKeyboardVisible ] = useState( false );
  const [ currentStaff, setCurrentStaff ] = useState( '' );

  useEffect( () => {
    // Event listeners for showing and hiding keyboard
    const keyboardDidShowListener = Keyboard.addListener( 'keyboardDidShow', () => {
      setKeyboardVisible( true );
    } );
    const keyboardDidHideListener = Keyboard.addListener( 'keyboardDidHide', () => {
      setKeyboardVisible( false );
    } );

    // Cleanup listeners
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [] );

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword( !showPassword );
  };

  // Function to handle forgot credentials
  const handleForgotCredentials = () => {
    setIsModalVisible( true );
  };

  // Function to handle modal close
  const handleModalClose = () => {
    setIsModalVisible( false );
  };

  // // Function to handle reset password
const handleResetPassword = () => {
  const subject = 'Resetting Password Request';
  const body = 'Looking to reset Password';
  let foundEmail = false;
  let adminFound = false;
  let adminEmail = '';
  const userRef = ref( db, 'staff/' );

  onValue( userRef, ( snapshot ) => {
    const data = snapshot.val();

    if ( data ) {
      snapshot.forEach( ( childSnapshot ) => {
        const user = childSnapshot.val();

        if ( user.admin === false && user.email === email ) {
          foundEmail = true;
        } else if ( user.admin === true && user.email === email ) {
          adminFound = true;
          alert( 'Please contact system administrator to reset password' );
          setIsModalVisible( false );
        }

        if ( user.admin === true ) {
          adminEmail = user.email;
        }
      } );
    }
  } );

  if ( foundEmail === true ) {

    // Open email client to send reset username request
    Linking.openURL(
      `mailto:${ adminEmail }?subject=${ encodeURIComponent( subject ) }&body=${ encodeURIComponent( body ) }`
    );

    setIsModalVisible( false );
  } else if ( foundEmail === false ) {
    alert( 'This is not an email in the database, please try entering your email again' );
  }
  else if ( adminFound === false ) {
    alert( 'Please contact IT support' );

  }


  setEmail( "" );
};

  // Function to handle reset username
  const handleResetUsername = () => {
    const subject = 'Resetting Username Request';
    const body = 'Looking to reset Username';
    let foundEmail = false;
    let adminFound = false;
    let adminEmail = '';
    const userRef = ref( db, 'staff/' );

    onValue( userRef, ( snapshot ) => {
      const data = snapshot.val();

      if ( data ) {
        snapshot.forEach( ( childSnapshot ) => {
          const user = childSnapshot.val();

          if ( user.admin === false && user.email === email ) {
            foundEmail = true;
          } else if ( user.admin === true && user.email === email ) {
            adminFound = true;
            alert( 'Please contact system administrator to reset username' );
            setIsModalVisible( false );
          }

          if ( user.admin === true ) {
            adminEmail = user.email;
          }
        } );
      }
    } );

    if ( foundEmail === true ) {

      // Open email client to send reset username request
      Linking.openURL(
        `mailto:${ adminEmail }?subject=${ encodeURIComponent( subject ) }&body=${ encodeURIComponent( body ) }`
      );

      setIsModalVisible( false );
    } else if ( foundEmail === false ) {
      alert( 'This is not an email in the database, please try entering your email again' );
    }
    else if ( adminFound === false ) {
      alert( 'Please contact IT support' );

    }


    setEmail("");
  };

  // Function to check user credentials
  const dataCheck = async () =>  {
    if (online == true){
    await fetchStaffDetails();
    let loginSuccess = false;

    await Object.keys( staffData ).forEach( ( staff ) => {

      if ( staff === username && staffData[ username ].password === password ) {
        loginSuccess = true;
        setUsername("");
        setPassword( "" );
        navigation.navigate( 'Dashboard', { user: username } );
      }
    } );

    if ( loginSuccess == false ) {
      alert( 'Login Failed', 'Invalid username or password' );
    };
    } else{
      alert( "Application can't get online, please check connectivity, otherwise please contact IT" );
   }
  };

  return (
    <SafeAreaView style={ { flex: 1 } }>
      <KeyboardAvoidingView style={ { flex: 1 } } behavior="padding" enabled>
        <ImageBackground
          source={ require( '../../images/dashboardheader.png' ) }
          resizeMode="cover"
          style={ styles.container }
        >
          <Text style={ styles.heading } accessibilityRole="header" accessibilityLevel={ 1 }>
            Login
          </Text>
        </ImageBackground>

        <View style={ { marginTop: 20, flex: 1 } }>

          <View style={ { justifyContent: 'space-between', marginLeft: 40, marginRight: 40 } }>


            <Text style={ style.label }>Username</Text>
            <TextInput
              style={ { backgroundColor: 'white', ...style.input } }
              placeholder='Enter your username'
              value={ username }
              onChangeText={ ( text ) => setUsername( text ) }
            />


            <Text style={ { ...style.label, marginTop: '5%' } }>Password</Text>
            <TextInput
              style={ { backgroundColor: 'white', ...style.input } }
              placeholder='Enter your password'
              value={ password }
              onChangeText={ ( text ) => setPassword( text ) }
              secureTextEntry={ !showPassword }
            />
            <TouchableOpacity onPress={ togglePasswordVisibility } style={ { bottom: '15%', left: '85%' } }>
              { showPassword == true && (
                <Image source={ require( '../../images/eye-on.png' ) } style={ { width: 32, height: 25 } } />
              ) }
              { showPassword == false && (
                <Image source={ require( '../../images/eye-off.png' ) } style={ { width: 32, height: 25 } } />

              ) }
            </TouchableOpacity>

            <TouchableOpacity onPress={ dataCheck } style={ {} }>
              <Image source={ require( '../../images/login.png' ) } style={ { width: 230, height: 50 } } />
              <Text style={ { ...styles.buttonText, position: 'absolute', top: '5%', right: '55%', } }>Log In</Text>
            </TouchableOpacity>

            <TouchableOpacity style={ { position: 'absolute', top: "105%", left: 0, right: 0, alignItems: 'left' } } onPress={ handleForgotCredentials }>
              <Text style={ { color: '#262626', fontSize: 20, fontFamily: 'Roboto', fontStyle: 'italic', textDecorationLine: 'underline' } }>Forgot Username or Password</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Modal animationType="slide" transparent={ true } visible={ isModalVisible } onRequestClose={ handleModalClose }>
          <View style={ { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' } }>
            <View style={ { backgroundColor: 'white', padding: 20, borderRadius: 10, elevation: 5, width: '80%', alignItems: 'center' } }>
              <TouchableOpacity onPress={ handleModalClose } style={ { alignItems: 'flex-end', left: 125 } }>
                <Image source={ require( '../../images/cross.png' ) } style={ { width: 20, height: 20 } } />
              </TouchableOpacity>
              <Image source={ require( '../../images/editEmail.png' ) } style={ { width: 75, height: 60 } } />
              <Text style={ { fontSize: 20, marginBottom: 10 } }>Enter your email</Text>

              <TextInput
                style={ { height: 40, width: '80%', borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 5 } }
                placeholder="Email"
                value={ email }
                ref={ emailInput }
                onChangeText={ ( text ) => setEmail( text ) }
              />
              <View style={ { flexDirection: 'row', justifyContent: 'space-between' } }>
                <TouchableOpacity onPress={ handleResetPassword } style={ { backgroundColor: '#00A34A', justifyContent: 'center', margin: 5, padding: 10, borderRadius: 5 } } >
                  <Text style={ { color: 'black' } }>Reset Password</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={ handleResetUsername } style={ { margin: 5, justifyContent: 'center', backgroundColor: '#00A34A', padding: 10, borderRadius: 5 } } >
                  <Text style={ { color: 'black' } }>Reset Username</Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </Modal>

        { !keyboardVisible && (
          <TouchableOpacity style={ style.backIcon } onPress={ () => navigation.navigate( 'Home' ) }>
            <Image source={ require( '../../images/arrow-back-black.png' ) } style={ { width: 55, height: 55 } } />
          </TouchableOpacity>
        ) }
      </KeyboardAvoidingView>
    </SafeAreaView>

  );
};
const styles = StyleSheet.create( {
  container: {
    flex: 1,

  },





  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },



  loginButton: {
    backgroundColor: '#00A34A',
    marginTop: 10,
    padding: 10,
    borderRadius: 30,
    alignItems: 'center',
  },
  dashboardButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  heading: {

    fontSize: 42,
    fontFamily: 'Roboto',
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
    fontStyle: 'italic',
    position: 'absolute',
    top: 150,
    left: 20,
  }
} );

export default Login;