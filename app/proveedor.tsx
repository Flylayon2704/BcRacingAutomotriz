import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  FlatList,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Link } from 'expo-router';

interface ProveedorData {
  id: string;
  nombre: string;
  contacto: string;
  telefono: string;
  email: string;
  direccion: string;
  ruc: string;
}

const proveedor: React.FC = () => {
  const [proveedores, setProveedores] = useState<ProveedorData[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  
  const [formData, setFormData] = useState({
    nombre: '',
    contacto: '',
    telefono: '',
    email: '',
    direccion: '',
    ruc: '',
  });

  const resetForm = () => {
    setFormData({
      nombre: '',
      contacto: '',
      telefono: '',
      email: '',
      direccion: '',
      ruc: '',
    });
    setEditingId(null);
  };

  const validateForm = (): boolean => {
    if (!formData.nombre.trim()) {
      Alert.alert('Error', 'El nombre de la empresa es requerido');
      return false;
    }
    if (!formData.contacto.trim()) {
      Alert.alert('Error', 'El contacto es requerido');
      return false;
    }
    if (!formData.telefono.trim()) {
      Alert.alert('Error', 'El teléfono es requerido');
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert('Error', 'El email es requerido');
      return false;
    }
    if (!formData.ruc.trim() || formData.ruc.length !== 11) {
      Alert.alert('Error', 'El RUC debe tener 11 dígitos');
      return false;
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'El formato del email no es válido');
      return false;
    }

    // Validar RUC único
    const existingRuc = proveedores.find(p => p.ruc === formData.ruc && p.id !== editingId);
    if (existingRuc) {
      Alert.alert('Error', 'Ya existe un proveedor con este RUC');
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (editingId) {
      // Actualizar proveedor existente
      setProveedores(prev => 
        prev.map(p => 
          p.id === editingId 
            ? { ...formData, id: editingId }
            : p
        )
      );
      Alert.alert('Éxito', 'Proveedor actualizado correctamente');
    } else {
      // Crear nuevo proveedor
      const newProveedor: ProveedorData = {
        ...formData,
        id: Date.now().toString(),
      };
      setProveedores(prev => [...prev, newProveedor]);
      Alert.alert('Éxito', 'Proveedor registrado correctamente');
    }

    resetForm();
    setModalVisible(false);
  };

  const handleEdit = (proveedor: ProveedorData) => {
    setFormData({
      nombre: proveedor.nombre,
      contacto: proveedor.contacto,
      telefono: proveedor.telefono,
      email: proveedor.email,
      direccion: proveedor.direccion,
      ruc: proveedor.ruc,
    });
    setEditingId(proveedor.id);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar este proveedor?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setProveedores(prev => prev.filter(p => p.id !== id));
            Alert.alert('Éxito', 'Proveedor eliminado correctamente');
          },
        },
      ]
    );
  };

  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const filteredProveedores = proveedores.filter(proveedor =>
    proveedor.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
    proveedor.contacto.toLowerCase().includes(searchText.toLowerCase()) ||
    proveedor.ruc.includes(searchText) ||
    proveedor.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderProveedor = ({ item }: { item: ProveedorData }) => (
    <View style={styles.proveedorCard}>
      <View style={styles.proveedorHeader}>
        <Text style={styles.proveedorNombre}>{item.nombre}</Text>
        <Text style={styles.proveedorRuc}>RUC: {item.ruc}</Text>
      </View>
      
      <View style={styles.proveedorInfo}>
        <Text style={styles.infoLabel}>Contacto:</Text>
        <Text style={styles.infoValue}>{item.contacto}</Text>
      </View>
      
      <View style={styles.proveedorInfo}>
        <Text style={styles.infoLabel}>Teléfono:</Text>
        <Text style={styles.infoValue}>{item.telefono}</Text>
      </View>
      
      <View style={styles.proveedorInfo}>
        <Text style={styles.infoLabel}>Email:</Text>
        <Text style={styles.infoValue}>{item.email}</Text>
      </View>
      
      <View style={styles.proveedorInfo}>
        <Text style={styles.infoLabel}>Dirección:</Text>
        <Text style={styles.infoValue}>{item.direccion}</Text>
      </View>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEdit(item)}
        >
          <Text style={styles.actionButtonText}>Editar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.actionButtonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
            <Link href={"/"} asChild>
                <TouchableOpacity
                style={styles.backButton}
                >
            <Text style={styles.backButtonText}>← Volver</Text>
            </TouchableOpacity>
            </Link>
        <Text style={styles.headerTitle}>🏁 BC Racing Automotriz</Text>
        <Text style={styles.headerSubtitle}>Gestión de Proveedores</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{proveedores.length}</Text>
          <Text style={styles.statLabel}>Total Proveedores</Text>
        </View>
      </View>

      {/* Search and Add Button */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Buscar proveedores..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
          <Text style={styles.addButtonText}>+ Agregar</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Proveedores */}
      {filteredProveedores.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>
            {searchText ? 'No se encontraron resultados' : 'No hay proveedores registrados'}
          </Text>
          <Text style={styles.emptyStateSubtitle}>
            {searchText 
              ? `No hay proveedores que coincidan con "${searchText}"`
              : 'Comience agregando su primer proveedor'
            }
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredProveedores}
          renderItem={renderProveedor}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Modal de Formulario */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoid}
          >
            <View style={styles.modalContent}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.modalTitle}>
                  {editingId ? 'Editar Proveedor' : 'Nuevo Proveedor'}
                </Text>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Nombre de la Empresa *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.nombre}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, nombre: text }))}
                    placeholder="Ingrese el nombre de la empresa"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Persona de Contacto *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.contacto}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, contacto: text }))}
                    placeholder="Ingrese el nombre del contacto"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Teléfono *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.telefono}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, telefono: text }))}
                    placeholder="Ingrese el teléfono"
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Email *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.email}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                    placeholder="Ingrese el email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Dirección *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.direccion}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, direccion: text }))}
                    placeholder="Ingrese la dirección"
                    multiline
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>RUC *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.ruc}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, ruc: text }))}
                    placeholder="Ingrese el RUC (11 dígitos)"
                    keyboardType="numeric"
                    maxLength={11}
                  />
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => {
                      resetForm();
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.modalButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.modalButton, styles.submitButton]}
                    onPress={handleSubmit}
                  >
                    <Text style={styles.modalButtonText}>
                      {editingId ? 'Actualizar' : 'Guardar'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#2f3542',
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#a4b0be',
  },
  statsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  statCard: {
    backgroundColor: '#3742fa',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 15,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  addButton: {
    backgroundColor: '#3742fa',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  proveedorCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  proveedorHeader: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f6',
  },
  proveedorNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2f3542',
    marginBottom: 4,
  },
  proveedorRuc: {
    fontSize: 14,
    color: '#57606f',
    fontWeight: '500',
  },
  proveedorInfo: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2f3542',
    width: 80,
  },
  infoValue: {
    fontSize: 14,
    color: '#57606f',
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f2f6',
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  editButton: {
    backgroundColor: '#3742fa',
  },
  deleteButton: {
    backgroundColor: '#ff3838',
  },
  actionButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#57606f',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#a4b0be',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  keyboardAvoid: {
    flex: 1,
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2f3542',
    marginBottom: 20,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2f3542',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#a4b0be',
  },
  submitButton: {
    backgroundColor: '#3742fa',
  },
  modalButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default proveedor;