import { Dimensions, StyleSheet } from 'react-native';

const bannerWidth = 375;

const styles = StyleSheet.create( {
  icons: {
    width: 140,
    height: 130,
    marginBottom: 5,
    ...shadowStyle(),
  },

  background: {
    width: '100%',
    height: 215,
    alignItems: 'center',
  },
  backgroundStaff: {
    width: '100%',
    height: '40%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  heading: {
    fontSize: 42,
    fontFamily: 'Roboto',
    textAlign: 'center',
    color: 'black',
    fontStyle: 'italic',
    fontWeight: 'bold',
    ...positionStyle( 110, 20 ),
  },
  trainHeading: {
    fontSize: 40,
    fontFamily: 'Roboto',
    textAlign: 'center',
    color: 'black',
    fontStyle: 'italic',
    fontWeight: 'bold',
    ...positionStyle( 110, 20 ),
  },
  activeHeading: {
    fontSize: 18,
    fontFamily: 'Roboto',
    textAlign: 'center',
    color: 'black',
    fontStyle: 'italic',
    ...positionStyle( 165, 20 ),
  },
  headingStaff: {
    fontSize: 25,
    fontFamily: 'Roboto',
    textAlign: 'center',
    color: '#ffffff',
    fontStyle: 'italic',
    fontWeight: 'bold',
    ...positionStyle( 30, 30 ),
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F7F7',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  defibMap: {
    width: '90%',
    height: '90%',
    marginBottom: '10%'
  },
  defibMapContainer: {
    width:'100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderBottomWidth: 1,
    paddingHorizontal: 10,

  },
  backIcon: {
    ...iconStyle( undefined, 20, undefined, undefined ),
    bottom: 20,
  },
  backIconInfoPages: {
    ...iconStyle( undefined, 20, undefined, undefined ),
    top: '100%',
  },
  backIconDefib: {
    ...iconStyle( undefined, 5, undefined, undefined ),
    top: '108%',
  },
  sosIcon: {
    ...iconStyle( undefined, undefined, 20, 'red' ),
    bottom: 20,
  },
  microIcon: {
    ...iconStyle( 140, 20, undefined, undefined ),
  },
  zoomInIcon: {
    ...iconStyle( 205, 20,  undefined, undefined ),
  },
  personIcon: {
    ...iconStyle( 50, undefined, 20, undefined, 30 ),
  },
  dropDownInfo: {
    ...iconStyle( '5%', undefined, '5%', undefined ),

  },
  callIcon: {
    ...iconStyle( 40, undefined, 20, undefined ),

  },
  map: {
    width: '100%',
    height: '76%',
    top: '3%'
  },

  button: {
    ...buttonStyle( '#00B050', 250, '10%', '80%', '10%' ),

  },

  instruct: {
    ...buttonStyle( '#00B050', 250, 40, 200, undefined, ),
    padding: '1%',
    marginTop: '4%',
  },
  menuButtons: {
    ...buttonStyle( '#FFD966', 20, '15%', '100%', '5%' ),

  },
  infoHeader: {
    ...buttonStyle( '#FFD966', 20, '10%', '95%', undefined, 10 ),

  },
  buttonPressed: {
    ...buttonStyle( '#00592D80', 250, 90 ),
  },
  buttonText: {

    ...textStyle( '#FFFFFF', 30, 'Roboto', 'bold', 'italic', 0.25, undefined, undefined, 'center' ),
  },
  QR: {
    ...textStyle( 'black', 30, 'Roboto', 'bold', 'italic', 0.25, '5%', undefined, 'center' ),
    marginBottom: '5%',
  },
  emergencyTextContainer: {
    ...positionStyle( undefined, undefined, 0, 0 ),
  },
  emergencyText: {
    ...textStyle( 'black', 15, 'Roboto', 'italic', 0.25, undefined, undefined, undefined, 'center' ),
  },
  banner: {
    ...bannerStyle( '5%', ( Dimensions.get( 'window' ).width - bannerWidth ) / 2, '#00A34A', 85, bannerWidth ),
  },
  durationBanner: {
    ...bannerStyle( '80%', undefined, '#00A34A', '10%', '35%' ),
    alignSelf: 'center',
  },
  bannerText: {
    ...textStyle( 'white', bannerWidth * 0.05, 'Roboto', 'bold', undefined, undefined, undefined, 80, 'center' ),
  },
  overlayContainer: {
    ...overlayContainerStyle( 'rgba(128, 128, 128, 0.4)' ),
  },
  overlay: {
    ...overlayContainerStyle( 'rgba(128, 128, 128, 0.4)' ),
  },
  emergencyYesNoText: {
    ...textStyle( 'black', 35, 'Roboto', 'bold', 'italic', 0.25, undefined, undefined, 'center' ),
  },
  startText: {
    ...textStyle( 'black', 21, 'Roboto', 'bold', 'italic', 0.25, undefined, undefined, 'center' ),
  },
  isThisAnEmergency: {
    ...textStyle( 'black', 35, 'Roboto', 'bold', 'italic', 0.25, undefined, undefined, 'center' ),
  },


  incidentFoundContainer: {
    ...containerStyle( '#FFD966', 15, 'absolute', undefined, undefined, undefined, '10%' ),
    height: '30%',
  },
  emergencyContainer: {
    ...containerStyle( '#FFD966', 15, 'absolute', undefined, undefined, undefined, '1%' ),
    height: '30%',
  },

  startUpScreen: {
    ...containerStyle( '#FFD966', 15, 'absolute', undefined, undefined, undefined, '10%' ),
    height: '85%',
  },
  floorPickerText: {
    ...textStyle( 'black', 35, 'Roboto', 'bold', undefined, 0.20, undefined, undefined, 'center' ),
    marginBottom: '5%',
  },
  infoText: {
    ...textStyle( 'black', 35, 'Roboto', 'bold', undefined, 0.20, undefined, undefined, 'left' ),
  },
  yesNoContainer: {
    ...containerStyle( '#FFD966', 15, 'absolute', undefined, undefined, undefined, '10%' ),
  },
  yesButton: {
    ...buttonStyle( '#00B050', 15, 80, 150, 10 ),
    margin: 25,
  },
  yesStartNav: {
    ...buttonStyle( '#0074b3', 15, 80, '100%' ),
  },
  noButton: {
    ...buttonStyle( '#0074b3', 15, 80, 150, 10, undefined ),
    margin: 25,
  },
  yesText: {
    ...textStyle( 'white', 25, 'Roboto', 'bold', undefined, undefined, undefined, undefined, 'center' ),
  },

  yesBeforeLocate: {
    ...textStyle( 'white', 35, 'Roboto', 'bold', undefined, undefined, undefined, undefined, 'center' ),
  },

  noText: {
    ...textStyle( 'white', 30, 'Roboto', 'bold', undefined, undefined, undefined, undefined, 'center' ),
  },
  noTextBeforeLocate: {
    ...textStyle( 'white', 35, 'Roboto', 'bold', undefined, undefined, undefined, undefined, 'center' ),
  },
  AEDImageContainer: {
    ...containerStyle( '#FFD966', 15, 'absolute', undefined, undefined, undefined, '10%' ),

    height: '65%',
  },
  yesAEDButton: {
    ...buttonStyle( '#0074b3', 15, 70, 200, 10 ),
  },

  floorPicker: {
    ...containerStyle( '#FFD966', 15, 'absolute', '250', '375', '250' ),
    height: '40%',
    width: '80%',
  },
  infoMenu: {
    ...containerStyle( '#D9D9D9', 15, 'absolute', '250', '20%', '20%' ),
    height: '100%',
    width: '80%',
  },

  incidentContainer: {
    ...containerStyle( '#FFD966', 15, 'absolute', '250', '375', '250' ),
    height: '30%',
    width: '90%',
  },
  incidentButton: {
    ...buttonStyle( '#00B050', 15, 70, 200, 15 ),
  },
  incidentText: {
    ...textStyle( 'black', 20, 'Roboto', undefined, 'italic', undefined, undefined, undefined, 'center' ),
  },
  incidentTitle: {
    ...textStyle( 'black', 32, 'Roboto', 'bold', 'italic', undefined, undefined, undefined, 'center' ),
  },
  row: {
    ...flexDirectionStyle( 'row', 'left', undefined ),

  },
  label: {
    ...textStyle( 'black', 20, 'Roboto', 'bold', undefined, 0.25, '5%', undefined, 'left' ),
  },
  infoLabel: {
    ...textStyle( 'black', 20, 'Roboto', 'bold', undefined, 0.25, undefined, undefined, undefined ),
  },
  value: {
    ...textStyle( '#3E4550', 18, 'Roboto', undefined, undefined, undefined, 1, undefined ),

  },
  scanButton: {
    ...buttonStyle( '#00B050', 250, 70, 55 ),
  },
  scanText: {
    ...textStyle( '#F1F3F4', 30, 'Roboto', 'bold', 0.25, undefined, undefined, undefined, 'center' ),
  },
  checkIn: {
    ...portalIconStyle( 30, 20, '#00B050', 20, 90, 150, 20 ),
  },
  checkInText: {
    ...textStyle( 'black', 25, 'Roboto', 'bold', 'italic', undefined, undefined, undefined, 'center' ),
    marginLeft: '5%',
  },
  reports: {
    ...portalIconStyle( 50, 20, '#00B050', 25, 140, 200, undefined ),

  },
  logOut: {
    ...portalIconStyle( 25, 20, '#FFD966', 25, 140, 90, undefined ),
  },
  logOutText: {
    ...textStyle( 'black', 25, 'Roboto', 'bold', 'italic', undefined, undefined, undefined, 'center' ),
  },
  trainIcon: {
    ...portalIconStyle( undefined, undefined, '#00B050', 25, 140, 140, 20 ),
    marginBottom: 20,
  },
  trainIconText: {
    ...textStyle( 'black', 25, 'Roboto', 'bold', 'italic', undefined, undefined, undefined, 'center' ),
  },
  profileIconText: {
    ...textStyle( 'black', 20, 'Roboto', 'bold', 'italic', undefined, undefined, undefined, 'center' ),
  },
  dashboardIconStaff: {
    ...portalIconStyle( 30, 20, '#FFD966', 25, 190, 150, 30 ),
    marginBottom: 20,
  },
  dashboardTextStaff: {
    ...textStyle( 'black', 30, 'Roboto', 'bold', 'italic', undefined, undefined, undefined, 'center' ),
  },
  dashboardIconAED: {
    ...portalIconStyle( undefined, undefined, '#FFD966', 25, 140, 140, 20 ),
    marginBottom: 20,
  },
  dashboardTextAED: {
    ...textStyle( 'black', 25, 'Roboto', 'bold', 'italic', undefined, undefined, undefined, 'center' ),
  },
  dashboardTextReports: {
    ...textStyle( 'black', 30, 'Roboto', 'bold', 'italic', undefined, undefined, undefined, 'center' ),
    marginLeft: '5%',
  },
  column: {
    ...alignItemsStyle( 'center', 'center' ),
    marginLeft: 10,
  },
  column1: {
    ...alignItemsStyle( 'center', 'center' ),
    marginRight: 10,
  },

  contentText: {

    ...textStyle( '#3E4550', 20, 'Roboto', 'bold', undefined, undefined, 10, undefined, 'center' ),
  },
  stepText: {

    ...textStyle( '#3E4550', 20, 'Roboto', undefined, undefined, undefined, undefined, undefined, 'center' ),
  },
} );

function shadowStyle() {
  return {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3,
  };
}

function positionStyle( top, left, bottom, right ) {
  return {
    position: 'absolute',
    top: top !== undefined ? top : 'auto',
    left: left !== undefined ? left : 'auto',
    bottom: bottom !== undefined ? bottom : 'auto',
    right: right !== undefined ? right : 'auto',
  };
}

function iconStyle( top, left, right, backgroundColor, borderRadius = 15 ) {
  return {
    position: 'absolute',
    top,
    left,
    right,
    backgroundColor,
    borderRadius,
    alignItems: 'center',
    justifyContent: 'center',
    height: 55,
    width: 55,
    ...shadowStyle(),
  };
}

function textStyle( color, fontSize, fontFamily, fontWeight, fontStyle, letterSpacing, marginTop, lineHeight, textAlign ) {
  return {
    color,
    fontSize,
    fontFamily,
    fontWeight,
    fontStyle,
    letterSpacing,
    marginTop,
    lineHeight,
    textAlign,
  };
}

function bannerStyle( top, left, backgroundColor, height, width ) {
  return {
    position: 'absolute',
    top,
    left,
    backgroundColor,
    borderRadius: 15,
    height,
    width,
    zIndex: 2,
    ...shadowStyle(),
  };
}

function overlayContainerStyle( backgroundColor ) {
  return {
    ...StyleSheet.absoluteFillObject,
    backgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  };
}

function containerStyle( backgroundColor, borderRadius, position, top, left, right, bottom ) {
  return {
    backgroundColor,
    borderRadius,
    position,
    top,
    left,
    right,
    bottom,
    alignItems: 'center',
    justifyContent: 'center',
    height: '25%',
    width: '95%',
    ...shadowStyle(),
  };
}

function buttonStyle( backgroundColor, borderRadius, height, width, marginTop = 0, marginBottom = 0, margin ) {
  return {
    backgroundColor,
    borderRadius,
    justifyContent: 'center',
    width,
    height,
    marginTop,
    marginBottom,
    ...shadowStyle(),
  };
}

function portalIconStyle( right, marginTop, backgroundColor, borderRadius, height, width, marginBottom ) {
  return {
    right,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor,
    borderRadius,
    padding: 10,
    width,
    height,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
    marginBottom,
  };
}

function flexDirectionStyle( direction, alignItems, marginTop ) {
  return {
    flexDirection: direction,
    alignItems,
    marginTop,
  };
}

function alignItemsStyle( alignItems, justifyContent ) {
  return {
    alignItems,
    justifyContent,
  };
}

export default styles;
