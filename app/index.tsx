import { AuthService } from '@/services/authService';
import { Link, router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image
} from 'react-native';
import { styles } from './styles';

const { width: screenWidth } = Dimensions.get('window');

const App = () => {

  const [currentScreen, setCurrentScreen] = useState('splash');
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const authService = new AuthService();

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

  const handleLogin = async () => {
    if (usuario.trim() === '' || contrasena.trim() === '') {
      Alert.alert('Error', 'Por favor complete todos los campos');
      return;
    }

    try {
      const response = await authService.login(usuario, contrasena);
      console.log('Respuesta   login:', response);
      if (response && response.token) {
        setCurrentScreen('menu');
        setUsuario('');
        setContrasena('');
      } else {
        Alert.alert('Error', 'Usuario o contraseña incorrectos');
      }
    } catch (error) {
      console.error('Error en handleLogin:', error);
      Alert.alert('Error', `${error}`);
      return;
    }
  }
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

            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={styles.forgotPasswordTextWithBackground}>Registrate!</Text>
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
          <Text style={styles.menuButtonText}>
            <Image source={require('../assets/images/icon.jpg')} style={{ borderRadius: 12 }}></Image>
          </Text>
        </View>
        <Text style={styles.headerTitle}>BC.RACING</Text>
        <Text style={styles.menuButtonText}></Text>

      </View>

      {/* Menu Options */}
      <View style={styles.menuContainer}>
        <Link href="/productos" asChild>
          <TouchableOpacity
            style={styles.menuOption}
          >
            <Text style={styles.menuOptionText}>Productos🚓</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/estadisticas" asChild>
          <TouchableOpacity
            style={styles.menuOption}
          >
            <Text style={styles.menuOptionText}>Estadísticas📊</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/proveedor" asChild>
          <TouchableOpacity
            style={styles.menuOptionWide}
          >
            <Text style={styles.menuOptionText}>Gestión de{'\n'}Proveedores👨‍💼</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/gestorproduct" asChild>
          <TouchableOpacity
            style={styles.menuOptionWide}
          >
            <Text style={styles.menuOptionText}>Gestión de{'\n'}productos🕵️‍♂️</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/factura" asChild>
          <TouchableOpacity
            style={styles.menuOptionWide}
          >
            <Text style={styles.menuOptionText}>Factura📃</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <Link href="/report" asChild>
          <TouchableOpacity
            style={styles.bottomNavButton}
          >
            <Text style={styles.bottomNavText}>Reporte</Text>
          </TouchableOpacity>
        </Link>


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

export default App;