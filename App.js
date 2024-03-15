import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import map from './navigation/map.js';
import home from './screens/home.js';
import defibMap from './screens/map/defibMap.js';
import emergencyContacts from './screens/map/emergencyContacts.js';
import howToUseDefib from './screens/map/howToUseDefib.js';
import info from './screens/map/info.js';
import userManual from './screens/map/userManual.js';
import aeds from './screens/staff/aeds.js';
import log from './screens/staff/login.js';
import dashboard from './screens/staff/portal.js';
import staffDetails from './screens/staff/profile.js';
import reports from './screens/staff/reports.js';
import staff from './screens/staff/staff_members.js';
import training from './screens/staff/training.js';
const Stack = createNativeStackNavigator();

export default function App() {
  useEffect( () => {

    // fetchDataFromDatabase();
    // updateDatabase();
    // updateandFetch();
  }, [] );

  return (
   <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={ home } options={ { headerShown: false } } />
        <Stack.Screen name="NearestAED" component={ map } options={ { headerShown: false } } />
        <Stack.Screen name="Login" component={ log } options={ { headerShown: false } } />
        <Stack.Screen name="Info" component={ info } options={ { headerShown: false } } />
        <Stack.Screen name="EmergencyContacts" component={ emergencyContacts } options={ { headerShown: false } } />
        <Stack.Screen name="UserManual" component={ userManual } options={ { headerShown: false } } />
        <Stack.Screen name="HowToUseDefib" component={ howToUseDefib } options={ { headerShown: false } } />
        <Stack.Screen name="Dashboard" component={ dashboard } options={ { headerShown: false } } />
        <Stack.Screen name="AEDStatus" component={ aeds } options={ { headerShown: false } } />
        <Stack.Screen name="Staff" component={ staff } options={ { headerShown: false } } />
        <Stack.Screen name="StaffDetails" component={ staffDetails } options={ { headerShown: false } } />
        <Stack.Screen name="Reports" component={ reports } options={ { headerShown: false } } />
       <Stack.Screen name="Training" component={ training } options={ { headerShown: false } } />
        <Stack.Screen name="DefibMap" component={ defibMap } options={ { headerShown: false } } />

      </Stack.Navigator>
    </NavigationContainer>
  );
}