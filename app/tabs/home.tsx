import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import { router } from 'expo-router';

export default function Home() {
  const handleMenuOption = (option: string) => {
    Alert.alert('Navegación', `Ir a: ${option}`);
  };

  const handleLogout = () => {
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#6B73FF" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.menuHeader}>
        <View style={styles.menuButton}>
          <Text style={styles.menuButtonText}>☰</Text>
        </View>
        <Text style={styles.headerTitle}>BC.RACING</Text>
        <View style={styles.profileButton}>
          <Text style={styles.profileButtonText}>👤</Text>
        </View>
      </View>

      {/* Menu Options */}
      <View style={styles.menuContainer}>
        <View style={styles.menuRow}>
          <TouchableOpacity 
            style={styles.menuOption}
            onPress={() => handleMenuOption('Productos')}
          >
            <Text style={styles.menuOptionText}>Productos</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuOption}
            onPress={() => handleMenuOption('Estadísticas')}
          >
            <Text style={styles.menuOptionText}>Estadísticas</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.menuOptionWide}
          onPress={() => handleMenuOption('Gestión de Proveedores')}
        >
          <Text style={styles.menuOptionText}>Gestión de{'\n'}Proveedores</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuOptionWide}
          onPress={() => handleMenuOption('Gestión de productos')}
        >
          <Text style={styles.menuOptionText}>Gestión de{'\n'}productos</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuOptionWide}
          onPress={() => handleMenuOption('Factura')}
        >
          <Text style={styles.menuOptionText}>Factura</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.bottomNavButton}
          onPress={() => handleMenuOption('Reporte')}
        >
          <Text style={styles.bottomNavText}>Reporte</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.bottomNavButton}
          onPress={() => handleMenuOption('Historial')}
        >
          <Text style={styles.bottomNavText}>Historial</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.bottomNavButton}
          onPress={handleLogout}
        >
          <Text style={styles.bottomNavText}>Salir</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  menuHeader: {
    backgroundColor: '#6B73FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  menuButton: {
    width: 30,
  },
  menuButtonText: {
    color: 'white',
    fontSize: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 2,
  },
  profileButton: {
    width: 30,
    alignItems: 'flex-end',
  },
  profileButtonText: {
    color: 'white',
    fontSize: 20,
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  menuOption: {
    backgroundColor: '#87CEEB',
    borderRadius: 20,
    width: '47%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuOptionWide: {
    backgroundColor: '#87CEEB',
    borderRadius: 20,
    width: '100%',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  menuOptionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#87CEEB',
    paddingVertical: 15,
  },
  bottomNavButton: {
    flex: 1,
    alignItems: 'center',
  },
  bottomNavText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});