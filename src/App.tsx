import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from './screens/Welcome/WelcomeScreen';
import CameraScreen from './screens/Camera';
import './i18n';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export type RootStackNavigatorParams = {
  Welcome: undefined;
  Camera: undefined;
};

const App = () => {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <StatusBar
          barStyle="dark-content"
          translucent
          backgroundColor="transparent"
        />
        <Stack.Navigator
          screenOptions={{
            header: () => <></>,
          }}
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Camera" component={CameraScreen} />
        </Stack.Navigator>
      </SafeAreaProvider>
    </NavigationContainer>
  );
};

export default App;
