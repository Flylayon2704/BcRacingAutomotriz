import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  Animated,
  Dimensions,
  ImageBackground, // Importar ImageBackground
} from 'react-native';
import { Link } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  
  // Animaciones del splash
  const carPosition = new Animated.Value(-100);
  const logoOpacity = new Animated.Value(0);
  const logoScale = new Animated.Value(0.8);
  
  // Animaciones para los dots de carga
  const dot1Opacity = new Animated.Value(0.4);
  const dot2Opacity = new Animated.Value(0.4);
  const dot3Opacity = new Animated.Value(0.4);

  useEffect(() => {
    // Iniciar animaciones del splash
    startSplashAnimation();
    startDotsAnimation();
  }, []);

  const startDotsAnimation = () => {
    const animateDot = (dotOpacity: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(dotOpacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(dotOpacity, {
            toValue: 0.4,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        { iterations: -1 }
      ).start();
    };

    // Iniciar animación de cada dot con delay
    setTimeout(() => animateDot(dot1Opacity, 0), 0);
    setTimeout(() => animateDot(dot2Opacity, 200), 200);
    setTimeout(() => animateDot(dot3Opacity, 400), 400);
  };

  const startSplashAnimation = () => {
    // Animación del carro pasando
    Animated.timing(carPosition, {
      toValue: screenWidth + 100,
      duration: 2500,
      useNativeDriver: true,
    }).start();

    // Animación del logo apareciendo
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    }, 800);

    // Transición al login después de 4 segundos
    setTimeout(() => {
      setCurrentScreen('login');
    }, 4000);
  };

  const handleLogin = () => {
    if (usuario.trim() === '' || contrasena.trim() === '') {
      Alert.alert('Error', 'Por favor complete todos los campos');
      return;
    }
    
    // Aquí puedes agregar la lógica de autenticación
    // Por ahora, solo navegamos al menú principal
    setCurrentScreen('menu');
  };

  const handleForgotPassword = () => {
    Alert.alert('Recuperar Contraseña', 'Funcionalidad en desarrollo');
  };

  const handleMenuOption = (option: string) => {
    try {
      Alert.alert('Navegación', `Ir a: ${option}`);
      // Aquí puedes agregar la navegación a cada pantalla específica
      console.log(`Navegando a: ${option}`);
    } catch (error) {
      console.error('Error en handleMenuOption:', error);
    }
  };

  const handleLogout = () => {
    setCurrentScreen('login');
    setUsuario('');
    setContrasena('');
  };

  // Renderizar Splash Screen
  if (currentScreen === 'splash') {
    return (
      <SafeAreaView style={styles.splashContainer}>
        <StatusBar backgroundColor="#1a1a2e" barStyle="light-content" />

        {/* Carro animado */}
        <Animated.View 
          style={[
            styles.carContainer,
            {
              transform: [{ translateX: carPosition }]
            }
          ]}
        >
          <Text style={[styles.carEmoji, { transform: [{ scaleX: -1 }] }]}>🏎️</Text>
        </Animated.View>

        {/* Logo BC.RACING */}
        <Animated.View 
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }]
            }
          ]}
        >
          <Text style={styles.splashTitle}>BC.RACING</Text>
          <Text style={styles.splashSubtitle}>Automotriz</Text>
          <View style={styles.loadingDots}>
            <Animated.View style={[styles.dot, { opacity: dot1Opacity }]} />
            <Animated.View style={[styles.dot, { opacity: dot2Opacity }]} />
            <Animated.View style={[styles.dot, { opacity: dot3Opacity }]} />
          </View>
        </Animated.View>
      </SafeAreaView>
    );
  }

  if (currentScreen === 'login') {
    return (
      <ImageBackground
        source={require('../assets/images/login.jpg')} // Ruta a tu imagen
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.loginContainerWithBackground}>
          <StatusBar backgroundColor="#6B73FF" barStyle="light-content" />
          
          {/* Overlay para oscurecer la imagen si es necesario */}
          <View style={styles.overlay} />
          
          {/* Header */}
          <View style={styles.headerWithBackground}>
            <Text style={styles.headerTitle}>BC.RACING</Text>
          </View>

          {/* Login Form */}
          <View style={styles.loginFormContainer}>
            <Text style={styles.inputLabelWithBackground}>USUARIO</Text>
            <TextInput
              style={styles.inputWithBackground}
              value={usuario}
              onChangeText={setUsuario}
              placeholder="Ingrese su usuario"
              placeholderTextColor="#999"
            />

            <Text style={styles.inputLabelWithBackground}>CONTRASEÑA</Text>
            <TextInput
              style={styles.inputWithBackground}
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
              <Text style={styles.forgotPasswordTextWithBackground}>¿olvidó su contraseña?</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  // Menu Principal
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
          <Link href="/productos" asChild>
            <TouchableOpacity 
            style={styles.menuOption}
          >
            <Text style={styles.menuOptionText}>Productos</Text>
          </TouchableOpacity>
          </Link>

          <Link href="/estadisticas" asChild>
            <TouchableOpacity 
            style={styles.menuOption}
          >
            <Text style={styles.menuOptionText}>Estadísticas</Text>
          </TouchableOpacity>
          </Link>
        </View>

        <Link href="/proveedor" asChild>
          <TouchableOpacity 
            style={styles.menuOptionWide}
          >
            <Text style={styles.menuOptionText}>Gestión de{'\n'}Proveedores</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/gestorproduct" asChild>
        <TouchableOpacity 
          style={styles.menuOptionWide}
        >
          <Text style={styles.menuOptionText}>Gestión de{'\n'}productos</Text>
        </TouchableOpacity>
        </Link>

        <Link href="/factura" asChild>
          <TouchableOpacity 
          style={styles.menuOptionWide}
        >
          <Text style={styles.menuOptionText}>Factura</Text>
        </TouchableOpacity>
        </Link>
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  // Splash Screen Styles
  splashContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  carContainer: {
    position: 'absolute',
    top: '45%',
  },
  carEmoji: {
    fontSize: 60,
    transform: [{ rotate: '15deg' }],
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  splashTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#6B73FF',
    letterSpacing: 4,
    textShadowColor: 'rgba(107, 115, 255, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  splashSubtitle: {
    fontSize: 18,
    color: '#87CEEB',
    letterSpacing: 2,
    marginTop: 5,
    fontWeight: '300',
  },
  loadingDots: {
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
  
  // Login Styles (originales)
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

  // Nuevos estilos para el login con fondo
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  loginContainerWithBackground: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Overlay oscuro para mejorar legibilidad
  },
  headerWithBackground: {
    backgroundColor: 'rgba(107, 115, 255, 0.8)', // Semi-transparente
    paddingTop: 60,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
  },
  loginFormContainer: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 80,
    zIndex: 1, // Asegura que esté sobre el overlay
  },
  inputLabelWithBackground: {
    fontSize: 12,
    color: '#fff', // Texto blanco para mejor contraste
    marginBottom: 8,
    marginTop: 20,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  inputWithBackground: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparente
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  forgotPasswordTextWithBackground: {
    textAlign: 'center',
    marginTop: 20,
    color: '#fff',
    fontSize: 14,
    textDecorationLine: 'underline',
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  // Menu Styles
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

export default App;