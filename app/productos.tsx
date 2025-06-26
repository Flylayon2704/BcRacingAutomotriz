import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  SafeAreaView,
  StatusBar,
  FlatList,
  Dimensions,
} from 'react-native';
import { Link } from 'expo-router';

const { width } = Dimensions.get('window');

// Interfaces
interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria_id: number;
  categoria_nombre: string;
  marca: string;
  precio_compra: number;
  precio_venta: number;
  stock_minimo: number;
  stock_actual: number;
  ubicacion: string;
}

interface FormData {
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria_id: string;
  marca: string;
  precio_compra: string;
  precio_venta: string;
  stock_minimo: string;
  stock_actual: string;
  ubicacion: string;
}

interface StockStatus {
  color: string;
  text: string;
  bgColor: string;
}

interface ProductosProps {
  navigation?: any;
}

// Datos de productos como JSON
const PRODUCTOS_DATA: Producto[] = [
  {
    id: 1,
    codigo: 'BC001',
    nombre: 'Coilover BC Racing BR Series',
    descripcion: 'Sistema de suspensión ajustable para competición',
    categoria_id: 1,
    categoria_nombre: 'Suspensión',
    marca: 'BC Racing',
    precio_compra: 800.00,
    precio_venta: 1200.00,
    stock_minimo: 5,
    stock_actual: 12,
    ubicacion: 'Almacén A - Estante 1'
  },
  {
    id: 2,
    codigo: 'BC002',
    nombre: 'Pastillas de Freno BC Racing',
    descripcion: 'Pastillas de alto rendimiento para pista',
    categoria_id: 2,
    categoria_nombre: 'Frenos',
    marca: 'BC Racing',
    precio_compra: 120.00,
    precio_venta: 180.00,
    stock_minimo: 10,
    stock_actual: 8,
    ubicacion: 'Almacén B - Estante 2'
  },
  {
    id: 3,
    codigo: 'BC003',
    nombre: 'Kit Turbo BC Racing',
    descripcion: 'Kit completo de turbo para mayor potencia',
    categoria_id: 3,
    categoria_nombre: 'Motor',
    marca: 'BC Racing',
    precio_compra: 2500.00,
    precio_venta: 3500.00,
    stock_minimo: 2,
    stock_actual: 1,
    ubicacion: 'Almacén A - Estante 5'
  },
  {
    id: 4,
    codigo: 'BC004',
    nombre: 'Barra Estabilizadora',
    descripcion: 'Barra anti-roll para mejor estabilidad',
    categoria_id: 1,
    categoria_nombre: 'Suspensión',
    marca: 'BC Racing',
    precio_compra: 350.00,
    precio_venta: 500.00,
    stock_minimo: 3,
    stock_actual: 7,
    ubicacion: 'Almacén A - Estante 3'
  },
  {
    id: 5,
    codigo: 'BC005',
    nombre: 'Discos de Freno Deportivos',
    descripcion: 'Discos ventilados para mejor refrigeración',
    categoria_id: 2,
    categoria_nombre: 'Frenos',
    marca: 'BC Racing',
    precio_compra: 280.00,
    precio_venta: 420.00,
    stock_minimo: 6,
    stock_actual: 4,
    ubicacion: 'Almacén B - Estante 1'
  }
];

const CATEGORIAS: Record<number, string> = {
  1: 'Suspensión',
  2: 'Frenos',
  3: 'Motor',
  4: 'Exterior',
  5: 'Interior',
  6: 'Accesorios'
};

const productos: React.FC<ProductosProps> = ({ navigation }) => {
  const [productos, setProductos] = useState<Producto[]>(PRODUCTOS_DATA);
  const [filteredProductos, setFilteredProductos] = useState<Producto[]>(PRODUCTOS_DATA);
  const [searchText, setSearchText] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
  const [formData, setFormData] = useState<FormData>({
    codigo: '',
    nombre: '',
    descripcion: '',
    categoria_id: '',
    marca: '',
    precio_compra: '',
    precio_venta: '',
    stock_minimo: '',
    stock_actual: '',
    ubicacion: ''
  });

  useEffect(() => {
    filterProducts();
  }, [searchText, productos]);

  const filterProducts = (): void => {
    if (searchText.trim() === '') {
      setFilteredProductos(productos);
    } else {
      const filtered = productos.filter(producto =>
        producto.codigo.toLowerCase().includes(searchText.toLowerCase()) ||
        producto.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
        producto.marca.toLowerCase().includes(searchText.toLowerCase()) ||
        producto.categoria_nombre.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredProductos(filtered);
    }
  };

  const getStockStatus = (stockActual: number, stockMinimo: number): StockStatus => {
    if (stockActual <= stockMinimo) {
      return { color: '#ff5252', text: 'Bajo', bgColor: '#ffebee' };
    } else if (stockActual <= stockMinimo * 2) {
      return { color: '#ff9800', text: 'Medio', bgColor: '#fff3e0' };
    } else {
      return { color: '#4caf50', text: 'Alto', bgColor: '#e8f5e8' };
    }
  };

  const openModal = (product?: Producto): void => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        codigo: product.codigo,
        nombre: product.nombre,
        descripcion: product.descripcion,
        categoria_id: product.categoria_id.toString(),
        marca: product.marca,
        precio_compra: product.precio_compra.toString(),
        precio_venta: product.precio_venta.toString(),
        stock_minimo: product.stock_minimo.toString(),
        stock_actual: product.stock_actual.toString(),
        ubicacion: product.ubicacion
      });
    } else {
      setEditingProduct(null);
      setFormData({
        codigo: '',
        nombre: '',
        descripcion: '',
        categoria_id: '',
        marca: '',
        precio_compra: '',
        precio_venta: '',
        stock_minimo: '',
        stock_actual: '',
        ubicacion: ''
      });
    }
    setModalVisible(true);
  };

  const closeModal = (): void => {
    setModalVisible(false);
    setEditingProduct(null);
  };

  const saveProduct = (): void => {
    // Validaciones básicas
    if (!formData.codigo || !formData.nombre || !formData.categoria_id || !formData.marca) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    const newProduct: Producto = {
      id: editingProduct ? editingProduct.id : Date.now(),
      codigo: formData.codigo,
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      categoria_id: parseInt(formData.categoria_id),
      categoria_nombre: CATEGORIAS[parseInt(formData.categoria_id)],
      marca: formData.marca,
      precio_compra: parseFloat(formData.precio_compra) || 0,
      precio_venta: parseFloat(formData.precio_venta) || 0,
      stock_minimo: parseInt(formData.stock_minimo) || 0,
      stock_actual: parseInt(formData.stock_actual) || 0,
      ubicacion: formData.ubicacion
    };

    if (editingProduct) {
      // Editar producto existente
      setProductos(productos.map(p => p.id === editingProduct.id ? newProduct : p));
    } else {
      // Agregar nuevo producto
      setProductos([...productos, newProduct]);
    }

    closeModal();
    Alert.alert('Éxito', `Producto ${editingProduct ? 'actualizado' : 'agregado'} correctamente`);
  };

  const deleteProduct = (id: number): void => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar este producto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setProductos(productos.filter(p => p.id !== id));
            Alert.alert('Éxito', 'Producto eliminado correctamente');
          }
        }
      ]
    );
  };

  const renderProductItem = ({ item }: { item: Producto }) => {
    const stockStatus = getStockStatus(item.stock_actual, item.stock_minimo);
    
    return (
      <View style={styles.productCard}>
        <View style={styles.productHeader}>
          <Text style={styles.productCode}>{item.codigo}</Text>
          <View style={[styles.stockBadge, { backgroundColor: stockStatus.bgColor }]}>
            <Text style={[styles.stockText, { color: stockStatus.color }]}>
              Stock: {item.stock_actual}
            </Text>
          </View>
        </View>
        
        <Text style={styles.productName}>{item.nombre}</Text>
        <Text style={styles.productDescription}>{item.descripcion}</Text>
        
        <View style={styles.productDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Categoría:</Text>
            <Text style={styles.detailValue}>{item.categoria_nombre}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Marca:</Text>
            <Text style={styles.detailValue}>{item.marca}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Precio Compra:</Text>
            <Text style={styles.detailValue}>${item.precio_compra.toFixed(2)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Precio Venta:</Text>
            <Text style={styles.detailValue}>${item.precio_venta.toFixed(2)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Ubicación:</Text>
            <Text style={styles.detailValue}>{item.ubicacion}</Text>
          </View>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.editBtn]}
            onPress={() => openModal(item)}
          >
            <Text style={styles.actionBtnText}>✏️ Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.deleteBtn]}
            onPress={() => deleteProduct(item.id)}
          >
            <Text style={styles.actionBtnText}>🗑️ Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const updateFormData = (key: keyof FormData, value: string): void => {
    setFormData({ ...formData, [key]: value });
  };

  const renderFormField = (
    label: string, 
    key: keyof FormData, 
    options: {
      required?: boolean;
      placeholder?: string;
      keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
      multiline?: boolean;
      numberOfLines?: number;
    } = {}
  ) => (
    <View style={styles.formGroup}>
      <Text style={styles.formLabel}>{label} {options.required && '*'}</Text>
      <TextInput
        style={[styles.formInput, options.multiline && styles.formInputMultiline]}
        value={formData[key]}
        onChangeText={(text) => updateFormData(key, text)}
        placeholder={options.placeholder || `Ingrese ${label.toLowerCase()}`}
        keyboardType={options.keyboardType || 'default'}
        multiline={options.multiline || false}
        numberOfLines={options.numberOfLines || 1}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Link href={"/"} asChild>
            <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation?.goBack()}
          >
            <Text style={styles.backButtonText}>← Volver</Text>
          </TouchableOpacity>
          </Link>
          <Text style={styles.headerTitle}>📦 PRODUCTOS</Text>
        </View>
      </View>

      {/* Search and Add Button */}
      <View style={styles.actionsBar}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="🔍 Buscar productos..."
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => openModal()}
        >
          <Text style={styles.addButtonText}>+ Agregar</Text>
        </TouchableOpacity>
      </View>

      {/* Products List */}
      <FlatList
        data={filteredProductos}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.productsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.productsListContent}
      />

      {/* Modal for Add/Edit Product */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingProduct ? 'Editar Producto' : 'Agregar Producto'}
              </Text>
              <TouchableOpacity onPress={closeModal}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {renderFormField('Código', 'codigo', { required: true })}
              {renderFormField('Nombre', 'nombre', { required: true })}
              {renderFormField('Descripción', 'descripcion', { 
                multiline: true, 
                numberOfLines: 3,
                placeholder: 'Descripción detallada del producto'
              })}
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Categoría *</Text>
                <View style={styles.pickerContainer}>
                  {Object.entries(CATEGORIAS).map(([id, nombre]) => (
                    <TouchableOpacity
                      key={id}
                      style={[
                        styles.pickerOption,
                        formData.categoria_id === id && styles.pickerOptionSelected
                      ]}
                      onPress={() => updateFormData('categoria_id', id)}
                    >
                      <Text style={[
                        styles.pickerOptionText,
                        formData.categoria_id === id && styles.pickerOptionTextSelected
                      ]}>
                        {nombre}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {renderFormField('Marca', 'marca', { required: true })}
              {renderFormField('Precio Compra', 'precio_compra', { 
                keyboardType: 'numeric',
                required: true 
              })}
              {renderFormField('Precio Venta', 'precio_venta', { 
                keyboardType: 'numeric',
                required: true 
              })}
              {renderFormField('Stock Mínimo', 'stock_minimo', { 
                keyboardType: 'numeric',
                required: true 
              })}
              {renderFormField('Stock Actual', 'stock_actual', { 
                keyboardType: 'numeric',
                required: true 
              })}
              {renderFormField('Ubicación', 'ubicacion', { 
                placeholder: 'Ej: Almacén A - Estante 3' 
              })}

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={closeModal}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={saveProduct}
                >
                  <Text style={styles.saveButtonText}>
                    {editingProduct ? 'Actualizar' : 'Guardar'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#667eea',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginRight: 80,
  },
  actionsBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchContainer: {
    flex: 1,
    marginRight: 15,
  },
  searchInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  addButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  productsList: {
    flex: 1,
  },
  productsListContent: {
    padding: 20,
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  productCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  stockBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  stockText: {
    fontSize: 12,
    fontWeight: '600',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  productDetails: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  editBtn: {
    backgroundColor: '#e3f2fd',
  },
  deleteBtn: {
    backgroundColor: '#ffebee',
  },
  actionBtnText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: width * 0.9,
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    backgroundColor: '#667eea',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  modalTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalBody: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  formInputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  pickerOption: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  pickerOptionSelected: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  pickerOptionText: {
    fontSize: 14,
    color: '#666',
  },
  pickerOptionTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 15,
    marginRight: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: '#667eea',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default productos;