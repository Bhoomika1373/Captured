import React from 'react';
import { AppRegistry } from 'react-native';
import App from './App';

// Register the main component (App) with the application
AppRegistry.registerComponent('captured', () => App);

// Required for running the app in development mode or in the simulator
AppRegistry.runApplication('captured', {
  initialProps: {},
  rootTag: document.getElementById('root'),
});
