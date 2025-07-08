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
    View
} from 'react-native';
import { styles } from './styles';

const register = () => {

    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const authService = new AuthService();

    const handleRegister = async () => {
        try {
            const response = await authService.register(usuario, contrasena);
            console.log('Registro:', response);
            if (response.user) {
                Alert.alert('Registro exitoso', 'Bienvenido a BC.RACING');
                // Aquí puedes redirigir al usuario a la pantalla de inicio o login
            }else{
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
                        <Text style={styles.loginButtonText}>Ingresar</Text>
                    </TouchableOpacity>

                </View>
            </SafeAreaView>
        </ImageBackground>
    )
}

export default register