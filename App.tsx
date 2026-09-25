import React from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationProvider, useAppNavigation } from './src/navigation/NavigationContext';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { PatientDashboardScreen } from './src/screens/PatientDashboardScreen';
import { DoctorDashboardScreen } from './src/screens/DoctorDashboardScreen';
import { colors } from './src/theme/colors';

const { width } = Dimensions.get('window');
const isWebDesktop = Platform.OS === 'web' && width > 600;

const AppContent: React.FC = () => {
  const { currentRoute } = useAppNavigation();

  const renderScreen = () => {
    switch (currentRoute) {
      case 'Login':
        return <LoginScreen />;
      case 'Register':
        return <RegisterScreen />;
      case 'PatientDashboard':
        return <PatientDashboardScreen />;
      case 'DoctorDashboard':
        return <DoctorDashboardScreen />;
      default:
        return <LoginScreen />;
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      {renderScreen()}
    </View>
  );
};

export default function App() {
  return (
    <NavigationProvider>
      <View style={styles.appShell}>
        <AppContent />
      </View>
    </NavigationProvider>
  );
}

const styles = StyleSheet.create({
  appShell: {
    flex: 1,
    backgroundColor: colors.background,
  },
  root: {
    flex: 1,
  },
});
