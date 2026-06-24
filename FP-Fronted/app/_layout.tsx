import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { Colors as AppColors } from '@/src/constants/colors';
import { AppStoreProvider } from '@/src/store/app-store';

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: AppColors.background,
    card: AppColors.surface,
    text: AppColors.text,
    border: AppColors.soft,
    primary: AppColors.primary,
    notification: AppColors.primary,
  },
};

export default function RootLayout() {
  return (
    <AppStoreProvider>
      <ThemeProvider value={navigationTheme}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: AppColors.background },
          }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </ThemeProvider>
      <StatusBar style="auto" />
    </AppStoreProvider>
  );
}
