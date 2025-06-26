import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { router } from 'expo-router';

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');

  const handleLogin = () => {
    if (usuario.trim() === '' || contrasena.trim() === '') {
      Alert.alert('Error', 'Por favor complete todos los campos');
      return;
    }
    
    // Navegar al menú principal
    router.replace("/tabs/home");
  };

  const handleForgotPassword = () => {
    Alert.alert('Recuperar Contraseña', 'Funcionalidad en desarrollo');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#6B73FF" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>BC.RACING</Text>
      </View>

      {/* Login Form */}
      <View style={styles.loginContainer}>
        <Text style={styles.inputLabel}>USUARIO</Text>
        <TextInput
          style={styles.input}
          value={usuario}
          onChangeText={setUsuario}
          placeholder="Ingrese su usuario"
          placeholderTextColor="#999"
        />

        <Text style={styles.inputLabel}>CONTRASEÑA</Text>
        <TextInput
          style={styles.input}
          value={contrasena}
          onChangeText={setContrasena}
          placeholder="Ingrese su contraseña"
          placeholderTextColor="#999"
          secureTextEntry
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Ingresar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPasswordText}>¿olvidó su contraseña?</Text>
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
  header: {
    backgroundColor: '#6B73FF',
    paddingTop: 60,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 2,
  },
  loginContainer: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 80,
  },
  inputLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    marginTop: 20,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#E0E0E0',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#87CEEB',
    borderRadius: 25,
    paddingVertical: 15,
    marginTop: 40,
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  forgotPasswordText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});