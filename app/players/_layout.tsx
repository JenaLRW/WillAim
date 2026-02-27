import { Stack } from 'expo-router';
import { COLORS } from '../../src/constants/theme';

export default function PlayersLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.bg },
        animation: 'slide_from_right',
      }}
    />
  );
}
