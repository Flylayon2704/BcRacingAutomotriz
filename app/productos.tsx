import { FormData } from '@/dto/storeProduct';
import { Producto } from '@/interfaces/product';
import { ProductService } from '@/services/productService';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { styles } from './stylesProduct';

const { width } = Dimensions.get('window');


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
    _id: 1,
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
    _id: 2,
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
    _id: 3,
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
    _id: 4,
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
    _id: 5,
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
  const productService = new ProductService();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filteredProductos, setFilteredProductos] = useState<Producto[]>([]);
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

  const fetchProducts = async () => {
      try {
        const data = await productService.getAllProducts();
        console.log('Productos cargados:', data);
        setProductos(data);
        setFilteredProductos(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        Alert.alert('Error', 'No se pudieron cargar los productos');
      }
    };

  const fetchProductsByName = async (name: string) => {
    try {
      const data = await productService.getProductsByName(name);
      setProductos(data);
      setFilteredProductos(data);
    } catch (error) {
      console.error('Error fetching products by name:', error);
      Alert.alert('Error', 'No se pudieron cargar los productos');
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
        fetchProductsByName(searchText);
    }
    , 300); 
    return () => clearTimeout(timer);
  }, [searchText]);

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
      _id: editingProduct ? editingProduct._id : Date.now(),
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
      setProductos(productos.map(p => p._id === editingProduct._id ? newProduct : p));
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



export default productos;