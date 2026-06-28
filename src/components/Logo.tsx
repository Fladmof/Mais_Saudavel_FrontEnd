import React from 'react';
import { Image } from 'react-native';

export function Logo() {
  return <Image source={require('../../assets/images/mais-saudavel-logo.png')} resizeMode="contain" />;
}
