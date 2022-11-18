import {SafeAreaView, Text, View} from 'react-native';
import React from 'react';
import global_styles from './assets/css/global_styles';
import {NavigationContainer} from '@react-navigation/native';
import Stack_navigation from './src/navigation/stack_navigation/stack_navigation';
import {AuthProvider} from './hooks/useAuth';
import {store} from './src/store/store';
import {Provider} from 'react-redux';

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        {/* HOC - Higher Order Compoonent */}
        <AuthProvider>
          <Stack_navigation />
        </AuthProvider>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
