import { AuthService } from '@/services/authService';
import { useState } from 'react';
import {
    Alert,
    ImageBackground,
    SafeAreaView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Modal,
    Animated,
} from 'react-native';
import { styles } from './styles';

const register = () => {

    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(0));
    const [scaleAnim] = useState(new Animated.Value(0.8));
    const authService = new AuthService();

    const showSuccessPanel = () => {
        setShowSuccessModal(true);

        // Animaciones para el panel
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 100,
                friction: 8,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const hideSuccessPanel = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 0.8,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setShowSuccessModal(false);
            // Resetear valores de animación para la próxima vez
            fadeAnim.setValue(0);
            scaleAnim.setValue(0.8);
        });
    };

    const handleRegister = async () => {
        try {
            const response = await authService.register(usuario, contrasena);
            console.log('Registro:', response);
            if (response.user) {
                showSuccessPanel();
                // Aquí puedes redirigir al usuario a la pantalla de inicio o login
            } else {
                Alert.alert('Error', 'No se pudo completar el registro. Inténtalo de nuevo.');
            }
        } catch (error) {
            console.error('Error en el registro:', error);
            // Aquí puedes mostrar un mensaje de error al usuario
        }
    };
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

                    <TouchableOpacity style={styles.loginButton} onPress={handleRegister}>
                        <Text style={styles.loginButtonText}>Registrar</Text>
                    </TouchableOpacity>

                </View>
                <Modal
                    visible={showSuccessModal}
                    transparent={true}
                    animationType="none"
                    onRequestClose={hideSuccessPanel}
                >
                    <View style={styles.modalOverlay}>
                        <Animated.View
                            style={[
                                styles.successPanel,
                                {
                                    opacity: fadeAnim,
                                    transform: [{ scale: scaleAnim }]
                                }
                            ]}
                        >
                            {/* Icono de éxito */}
                            <View style={styles.successIcon}>
                                <Text style={styles.checkmark}>✓</Text>
                            </View>

                            <Text style={styles.successTitle}>¡Registro Exitoso!</Text>
                            <Text style={styles.successMessage}>
                                Bienvenido a BC.RACING{'\n'}
                                Tu cuenta ha sido creada correctamente
                            </Text>

                            <TouchableOpacity
                                style={styles.successButton}
                                onPress={hideSuccessPanel}
                            >
                                <Text style={styles.successButtonText}>Continuar</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </Modal>
            </SafeAreaView>
        </ImageBackground>
    )
}

export default register