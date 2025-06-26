import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  FlatList,
  Dimensions,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Link } from 'expo-router';

const { width } = Dimensions.get('window');

interface Product {
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

interface StockStatus {
  class: 'stock-low' | 'stock-medium' | 'stock-high';
  text: string;
}

const categorias = {
  1: 'Suspensión',
  2: 'Frenos',
  3: 'Motor',
  4: 'Exterior',
  5: 'Interior',
  6: 'Accesorios'
};

const gestorproduct: React.FC = () => {
  const [productos, setProductos] = useState<Product[]>([
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
  ]);

  const [filteredProductos, setFilteredProductos] = useState<Product[]>([]);
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    categoria_id: 1,
    marca: '',
    precio_compra: '',
    precio_venta: '',
    stock_minimo: '',
    stock_actual: '',
    ubicacion: ''
  });

  useEffect(() => {
    setFilteredProductos(productos);
  }, [productos]);

  useEffect(() => {
    filterProducts();
  }, [searchText, categoryFilter, stockFilter, productos]);

  const getStockStatus = (stockActual: number, stockMinimo: number): StockStatus => {
    if (stockActual <= stockMinimo) {
      return { class: 'stock-low', text: 'Bajo' };
    } else if (stockActual <= stockMinimo * 2) {
      return { class: 'stock-medium', text: 'Medio' };
    } else {
      return { class: 'stock-high', text: 'Alto' };
    }
  };

  const filterProducts = () => {
    let filtered = productos.filter(producto => {
      const matchesSearch = !searchText || 
        producto.codigo.toLowerCase().includes(searchText.toLowerCase()) ||
        producto.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
        producto.marca.toLowerCase().includes(searchText.toLowerCase()) ||
        producto.categoria_nombre.toLowerCase().includes(searchText.toLowerCase());

      const matchesCategory = !categoryFilter || producto.categoria_id.toString() === categoryFilter;

      let matchesStock = true;
      if (stockFilter === 'low') {
        matchesStock = producto.stock_actual <= producto.stock_minimo;
      } else if (stockFilter === 'medium') {
        matchesStock = producto.stock_actual > producto.stock_minimo && producto.stock_actual <= producto.stock_minimo * 2;
      } else if (stockFilter === 'high') {
        matchesStock = producto.stock_actual > producto.stock_minimo * 2;
      }

      return matchesSearch && matchesCategory && matchesStock;
    });

    setFilteredProductos(filtered);
  };

  const getStats = () => {
    const totalProducts = productos.length;
    const lowStockCount = productos.filter(p => p.stock_actual <= p.stock_minimo).length;
    const totalValue = productos.reduce((sum, p) => sum + (p.precio_venta * p.stock_actual), 0);
    const categoriesCount = new Set(productos.map(p => p.categoria_id)).size;

    return { totalProducts, lowStockCount, totalValue, categoriesCount };
  };

  const openModal = (productId?: number) => {
    if (productId) {
      const product = productos.find(p => p.id === productId);
      if (product) {
        setEditingProductId(productId);
        setFormData({
          codigo: product.codigo,
          nombre: product.nombre,
          descripcion: product.descripcion,
          categoria_id: product.categoria_id,
          marca: product.marca,
          precio_compra: product.precio_compra.toString(),
          precio_venta: product.precio_venta.toString(),
          stock_minimo: product.stock_minimo.toString(),
          stock_actual: product.stock_actual.toString(),
          ubicacion: product.ubicacion
        });
      }
    } else {
      setEditingProductId(null);
      setFormData({
        codigo: '',
        nombre: '',
        descripcion: '',
        categoria_id: 1,
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

  const closeModal = () => {
    setModalVisible(false);
    setEditingProductId(null);
  };

  const saveProduct = () => {
    if (!formData.codigo || !formData.nombre || !formData.marca || !formData.precio_compra || !formData.precio_venta || !formData.stock_minimo || !formData.stock_actual) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    const productData: Product = {
      id: editingProductId || Date.now(),
      codigo: formData.codigo,
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      categoria_id: formData.categoria_id,
      categoria_nombre: categorias[formData.categoria_id as keyof typeof categorias],
      marca: formData.marca,
      precio_compra: parseFloat(formData.precio_compra),
      precio_venta: parseFloat(formData.precio_venta),
      stock_minimo: parseInt(formData.stock_minimo),
      stock_actual: parseInt(formData.stock_actual),
      ubicacion: formData.ubicacion
    };

    if (editingProductId) {
      setProductos(prev => prev.map(p => p.id === editingProductId ? productData : p));
      Alert.alert('Éxito', 'Producto actualizado correctamente');
    } else {
      setProductos(prev => [...prev, productData]);
      Alert.alert('Éxito', 'Producto agregado correctamente');
    }

    closeModal();
  };

  const deleteProduct = (id: number) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar este producto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setProductos(prev => prev.filter(p => p.id !== id));
            Alert.alert('Éxito', 'Producto eliminado correctamente');
          }
        }
      ]
    );
  };

  const stats = getStats();

  const renderProductCard = ({ item }: { item: Product }) => {
    const stockStatus = getStockStatus(item.stock_actual, item.stock_minimo);
    
    return (
      <View style={styles.productCard}>
        <View style={styles.productHeader}>
          <Text style={styles.productCode}>{item.codigo}</Text>
          <View style={[styles.stockBadge, styles[stockStatus.class]]}>
            <Text style={styles.stockBadgeText}>Stock: {item.stock_actual}</Text>
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
            <Text style={[styles.detailValue, styles.priceHighlight]}>${item.precio_venta.toFixed(2)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Ubicación:</Text>
            <Text style={styles.detailValue}>{item.ubicacion}</Text>
          </View>
        </View>
        
        <View style={styles.productActions}>
          <TouchableOpacity style={styles.editBtn} onPress={() => openModal(item.id)}>
            <Text style={styles.editBtnText}>✏️ Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteProduct(item.id)}>
            <Text style={styles.deleteBtnText}>🗑️ Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
            <Link href={"/"} asChild>
                <TouchableOpacity
                style={styles.backButton}
                >
                <Text style={styles.backButtonText}>← Volver</Text>
                </TouchableOpacity>
            </Link>
          <Text style={styles.headerTitle}>🏎️ BC RACING AUTOMOTRIZ</Text>
          <Text style={styles.headerSubtitle}>Sistema de Gestión de Productos e Inventario</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalProducts}</Text>
            <Text style={styles.statLabel}>Total Productos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.lowStockCount}</Text>
            <Text style={styles.statLabel}>Stock Bajo</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>${stats.totalValue.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Valor Inventario</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.categoriesCount}</Text>
            <Text style={styles.statLabel}>Categorías</Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por código, nombre, marca o categoría..."
            value={searchText}
            onChangeText={setSearchText}
          />
          
          <View style={styles.filterContainer}>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={categoryFilter}
                onValueChange={setCategoryFilter}
                style={styles.picker}
              >
                <Picker.Item label="Todas las categorías" value="" />
                <Picker.Item label="Suspensión" value="1" />
                <Picker.Item label="Frenos" value="2" />
                <Picker.Item label="Motor" value="3" />
                <Picker.Item label="Exterior" value="4" />
                <Picker.Item label="Interior" value="5" />
                <Picker.Item label="Accesorios" value="6" />
              </Picker>
            </View>
            
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={stockFilter}
                onValueChange={setStockFilter}
                style={styles.picker}
              >
                <Picker.Item label="Todos los stocks" value="" />
                <Picker.Item label="Stock bajo" value="low" />
                <Picker.Item label="Stock medio" value="medium" />
                <Picker.Item label="Stock alto" value="high" />
              </Picker>
            </View>
          </View>
          
          <TouchableOpacity style={styles.addBtn} onPress={() => openModal()}>
            <Text style={styles.addBtnText}>+ Agregar Producto</Text>
          </TouchableOpacity>
        </View>

        {/* Products List */}
        <FlatList
          data={filteredProductos}
          renderItem={renderProductCard}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
      </ScrollView>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingProductId ? 'Editar Producto' : 'Agregar Producto'}
              </Text>
              <TouchableOpacity onPress={closeModal}>
                <Text style={styles.closeBtn}>×</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Código <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.codigo}
                  onChangeText={text => setFormData({...formData, codigo: text})}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Nombre <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.nombre}
                  onChangeText={text => setFormData({...formData, nombre: text})}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Descripción</Text>
                <TextInput
                  style={[styles.formInput, styles.formTextarea]}
                  value={formData.descripcion}
                  onChangeText={text => setFormData({...formData, descripcion: text})}
                  multiline
                  numberOfLines={3}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Categoría <Text style={styles.required}>*</Text></Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={formData.categoria_id}
                    onValueChange={(value: number) => setFormData({...formData, categoria_id: value})}
                    style={styles.picker}
                  >
                    <Picker.Item label="Suspensión" value={1} />
                    <Picker.Item label="Frenos" value={2} />
                    <Picker.Item label="Motor" value={3} />
                    <Picker.Item label="Exterior" value={4} />
                    <Picker.Item label="Interior" value={5} />
                    <Picker.Item label="Accesorios" value={6} />
                  </Picker>
                </View>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Marca <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.marca}
                  onChangeText={text => setFormData({...formData, marca: text})}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Precio de Compra <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.precio_compra}
                  onChangeText={text => setFormData({...formData, precio_compra: text})}
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Precio de Venta <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.precio_venta}
                  onChangeText={text => setFormData({...formData, precio_venta: text})}
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Stock Mínimo <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.stock_minimo}
                  onChangeText={text => setFormData({...formData, stock_minimo: text})}
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Stock Actual <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.stock_actual}
                  onChangeText={text => setFormData({...formData, stock_actual: text})}
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Ubicación</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.ubicacion}
                  onChangeText={text => setFormData({...formData, ubicacion: text})}
                  placeholder="Ej: Almacén A - Estante 3"
                />
              </View>
              
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelBtn} onPress={closeModal}>
                  <Text style={styles.cancelBtnText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={saveProduct}>
                  <Text style={styles.saveBtnText}>
                    {editingProductId ? 'Actualizar' : 'Guardar'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#e3f2fd',
    marginBottom: 10,
  },
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 30,
    margin: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    minWidth: (width - 60) / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#667eea',
    marginBottom: 5,
  },
  statLabel: {
    color: '#666',
    fontWeight: '600',
    textAlign: 'center',
  },
  controls: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 25,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
    marginBottom: 15,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  pickerContainer: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    backgroundColor: 'white',
  },
  picker: {
    height: 50,
  },
  addBtn: {
    backgroundColor: '#667eea',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  addBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  productCode: {
    backgroundColor: '#667eea',
    color: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    fontWeight: '700',
    fontSize: 14,
  },
  stockBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  stockBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  'stock-high': {
    backgroundColor: '#e8f5e8',
  },
  'stock-medium': {
    backgroundColor: '#fff3e0',
  },
  'stock-low': {
    backgroundColor: '#ffebee',
  },
  productName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  productDescription: {
    color: '#666',
    marginBottom: 20,
    lineHeight: 22,
  },
  productDetails: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingVertical: 5,
  },
  detailLabel: {
    fontWeight: '600',
    color: '#666',
  },
  detailValue: {
    fontWeight: '700',
    color: '#333',
  },
  priceHighlight: {
    color: '#667eea',
    fontSize: 16,
  },
  productActions: {
    flexDirection: 'row',
    gap: 10,
  },
  editBtn: {
    flex: 1,
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  editBtnText: {
    color: '#1976d2',
    fontWeight: '600',
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteBtnText: {
    color: '#d32f2f',
    fontWeight: '600',
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
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    backgroundColor: '#667eea',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  closeBtn: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalBody: {
    padding: 20,
    maxHeight: '80%',
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: '#f44336',
  },
  formInput: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  formTextarea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 20,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#666',
    fontWeight: '600',
  },
  saveBtn: {
    flex: 1,
    backgroundColor: '#667eea',
    padding: 15,
    borderRadius: 10,
  },
  backButtonText: {
    color: '#1976d2',
    fontWeight: '600',
    fontSize: 16,
  },
  saveBtnText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default gestorproduct;