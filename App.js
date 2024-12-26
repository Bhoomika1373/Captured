import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CaptureCameraImage = () => {
  return (
    <View style={styles.container}>
      <Text>Capture Camera Image Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CaptureCameraImage;
