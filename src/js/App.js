/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  useColorScheme,
} from 'react-native';
import RootScreen from './ui/screens/RootScreen';

export default () => {
  const colorScheme = useColorScheme();
  return (
    <RootScreen/>
  );
};
