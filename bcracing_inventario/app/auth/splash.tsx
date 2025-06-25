import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  StyleSheet, 
  StatusBar,
  Dimensions 
} from 'react-native';
import { router } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');

export default function Splash() {
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    // Mostrar logo después de un delay
    const logoTimer = setTimeout(() => {
      setShowLogo(true);
    }, 800);

    // Navegar al login después de 4 segundos
    const navigationTimer = setTimeout(() => {
      router.replace("/auth/login");
    }, 4000);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(navigationTimer);
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1a1a2e" barStyle="light-content" />
      
      {/* Logo BC.RACING */}
      {showLogo && (
        <View style={styles.logoContainer}>
          <Text style={styles.title}>BC.RACING</Text>
          <Text style={styles.subtitle}>Automotriz</Text>
          <View style={styles.loadingContainer}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#6B73FF',
    letterSpacing: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#87CEEB',
    letterSpacing: 2,
    marginTop: 5,
    fontWeight: '300',
  },
  loadingContainer: {
    flexDirection: 'row',
    marginTop: 30,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6B73FF',
    marginHorizontal: 5,
  },
});