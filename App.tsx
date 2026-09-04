import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { CalculatorPage } from './src/features/calculator/components/CalculatorPage';

export default function App() {
  return (
    <SafeAreaProvider>
      <CalculatorPage />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
