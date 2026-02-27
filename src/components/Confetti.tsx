import React, { useRef } from 'react';
import { Dimensions } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { CONFETTI_COLORS } from '../constants/scoring';

interface ConfettiProps {
  active: boolean;
}

export function Confetti({ active }: ConfettiProps) {
  const confettiRef = useRef<ConfettiCannon>(null);

  if (!active) return null;

  const { width } = Dimensions.get('window');
  return (
    <ConfettiCannon
      ref={confettiRef}
      count={150}
      origin={{ x: width / 2, y: -20 }}
      autoStart
      fadeOut
      fallSpeed={3000}
      explosionSpeed={350}
      colors={CONFETTI_COLORS}
      autoStartDelay={0}
    />
  );
}
