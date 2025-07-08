import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
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
