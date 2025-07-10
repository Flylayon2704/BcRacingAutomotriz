import { ProveedorData } from '@/interfaces/proveedor';
import { ProveedorService } from '@/services/proveedorService';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { styles } from './styleProveedor';

const proveedor: React.FC = () => {
  const [proveedores, setProveedores] = useState<ProveedorData[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const proveedorService = new ProveedorService();
  
  const getProveedores = async () => {
    try {
      const data = await proveedorService.getAllProveedores();
      setProveedores(data);
    }
    catch (error) {
      console.error('Error fetching proveedores:', error);
      Alert.alert('Error', 'No se pudieron cargar los proveedores');
    }
  }

  useEffect(() => {
    getProveedores();
  }, []);

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
      {proveedores.length === 0 ? (
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
          data={proveedores}
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



export default proveedor;