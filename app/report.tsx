import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  Modal,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

// Tipos basados en el esquema MongoDB
interface Producto {
  _id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: {
    id: string;
    nombre: string;
  };
  marca: string;
  precio_compra: number;
  precio_venta: number;
  stock_minimo: number;
  stock_actual: number;
  ubicacion: string;
  activo: boolean;
  fecha_creacion: Date;
  compatibilidad: Array<{
    marca_vehiculo: string;
    modelo_vehiculo: string;
    anio_inicio: number;
    anio_fin: number;
  }>;
}

interface MovimientoInventario {
  _id: string;
  producto: {
    id: string;
    codigo: string;
    nombre: string;
  };
  tipo_movimiento: 'entrada' | 'salida' | 'ajuste' | 'devolucion';
  cantidad: number;
  stock_anterior: number;
  stock_nuevo: number;
  motivo: string;
  usuario: {
    id: string;
    nombre: string;
  };
  fecha_movimiento: Date;
}

interface Factura {
  _id: string;
  numero_factura: string;
  cliente: {
    nombre: string;
    ruc: string;
  };
  total: number;
  estado: 'pendiente' | 'pagado' | 'anulado';
  fecha_factura: Date;
  detalle: Array<{
    producto: {
      codigo: string;
      nombre: string;
    };
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
  }>;
}

interface AlertaStock {
  _id: string;
  producto: {
    codigo: string;
    nombre: string;
  };
  stock_actual: number;
  stock_minimo: number;
  fecha_alerta: Date;
  estado: 'pendiente' | 'revisado';
}

type ReportType = 'inventario' | 'movimientos' | 'ventas' | 'alertas' | 'productos_categoria';

const report: React.FC = () => {
  const [reportType, setReportType] = useState<ReportType>('inventario');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [filtros, setFiltros] = useState({
    fechaInicio: '',
    fechaFin: '',
    categoria: '',
    marca: '',
    proveedor: '',
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [marcas, setMarcas] = useState<string[]>([]);

  // Simular datos iniciales (en una app real, estos vendrían de MongoDB)
  const datosEjemplo = {
    inventario: [
      {
        _id: '1',
        codigo: 'BRK001',
        nombre: 'Pastillas de Freno Delanteras Toyota Corolla',
        categoria: { nombre: 'Frenos' },
        marca: 'BOSCH',
        stock_actual: 25,
        stock_minimo: 10,
        precio_venta: 75.00,
        ubicacion: 'A-01-001',
        activo: true,
      },
      {
        _id: '2',
        codigo: 'MOT001',
        nombre: 'Filtro de Aceite Toyota',
        categoria: { nombre: 'Filtros' },
        marca: 'TOYOTA',
        stock_actual: 50,
        stock_minimo: 20,
        precio_venta: 20.00,
        ubicacion: 'B-02-003',
        activo: true,
      },
      {
        _id: '3',
        codigo: 'SUS001',
        nombre: 'Amortiguador Delantero Nissan Sentra',
        categoria: { nombre: 'Suspensión' },
        marca: 'MONROE',
        stock_actual: 12,
        stock_minimo: 5,
        precio_venta: 140.00,
        ubicacion: 'C-01-005',
        activo: true,
      },
    ],
    movimientos: [
      {
        _id: '1',
        producto: { codigo: 'BRK001', nombre: 'Pastillas de Freno' },
        tipo_movimiento: 'entrada',
        cantidad: 15,
        stock_anterior: 10,
        stock_nuevo: 25,
        usuario: { nombre: 'Juan Pérez' },
        fecha_movimiento: new Date('2024-01-15'),
      },
      {
        _id: '2',
        producto: { codigo: 'MOT001', nombre: 'Filtro de Aceite' },
        tipo_movimiento: 'salida',
        cantidad: 5,
        stock_anterior: 55,
        stock_nuevo: 50,
        usuario: { nombre: 'María García' },
        fecha_movimiento: new Date('2024-01-16'),
      },
    ],
    ventas: [
      {
        _id: '1',
        numero_factura: 'F001-00001',
        cliente: { nombre: 'Cliente ABC', ruc: '12345678901' },
        total: 295.00,
        estado: 'pagado',
        fecha_factura: new Date('2024-01-15'),
        detalle: [
          {
            producto: { codigo: 'BRK001', nombre: 'Pastillas Freno' },
            cantidad: 2,
            precio_unitario: 75.00,
            subtotal: 150.00,
          },
          {
            producto: { codigo: 'SUS001', nombre: 'Amortiguador' },
            cantidad: 1,
            precio_unitario: 140.00,
            subtotal: 140.00,
          },
        ],
      },
    ],
    alertas: [
      {
        _id: '1',
        producto: { codigo: 'TRA001', nombre: 'Kit Embrague Honda' },
        stock_actual: 2,
        stock_minimo: 3,
        fecha_alerta: new Date('2024-01-16'),
        estado: 'pendiente',
      },
    ],
  };

  useEffect(() => {
    // Cargar categorías y marcas para filtros
    setCategorias(['Frenos', 'Motor', 'Suspensión', 'Transmisión', 'Eléctrico']);
    setMarcas(['BOSCH', 'TOYOTA', 'MONROE', 'LUK', 'ETNA']);
  }, []);

  const generarReporte = async () => {
    setLoading(true);
    try {
      // Simular llamada a API/MongoDB
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      switch (reportType) {
        case 'inventario':
          setData(datosEjemplo.inventario);
          break;
        case 'movimientos':
          setData(datosEjemplo.movimientos);
          break;
        case 'ventas':
          setData(datosEjemplo.ventas);
          break;
        case 'alertas':
          setData(datosEjemplo.alertas);
          break;
        default:
          setData([]);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo generar el reporte');
    } finally {
      setLoading(false);
    }
  };

  const renderInventarioItem = ({ item }: { item: any }) => (
    <View style={styles.reportItem}>
      <Text style={styles.itemCode}>{item.codigo}</Text>
      <Text style={styles.itemName}>{item.nombre}</Text>
      <Text style={styles.itemCategory}>{item.categoria.nombre}</Text>
      <View style={styles.itemRow}>
        <Text style={styles.itemLabel}>Stock:</Text>
        <Text style={[
          styles.itemValue,
          item.stock_actual <= item.stock_minimo ? styles.lowStock : null
        ]}>
          {item.stock_actual}/{item.stock_minimo}
        </Text>
      </View>
      <View style={styles.itemRow}>
        <Text style={styles.itemLabel}>Precio:</Text>
        <Text style={styles.itemValue}>S/ {item.precio_venta.toFixed(2)}</Text>
      </View>
      <Text style={styles.itemLocation}>Ubicación: {item.ubicacion}</Text>
    </View>
  );

  const renderMovimientoItem = ({ item }: { item: MovimientoInventario }) => (
    <View style={styles.reportItem}>
      <Text style={styles.itemCode}>{item.producto.codigo}</Text>
      <Text style={styles.itemName}>{item.producto.nombre}</Text>
      <View style={styles.itemRow}>
        <Text style={styles.itemLabel}>Tipo:</Text>
        <Text style={[
          styles.itemValue,
          styles[item.tipo_movimiento as 'entrada' | 'salida' | 'ajuste' | 'devolucion']
        ]}>
          {item.tipo_movimiento.toUpperCase()}
        </Text>
      </View>
      <View style={styles.itemRow}>
        <Text style={styles.itemLabel}>Cantidad:</Text>
        <Text style={styles.itemValue}>{item.cantidad}</Text>
      </View>
      <View style={styles.itemRow}>
        <Text style={styles.itemLabel}>Stock:</Text>
        <Text style={styles.itemValue}>
          {item.stock_anterior} → {item.stock_nuevo}
        </Text>
      </View>
      <Text style={styles.itemUser}>Usuario: {item.usuario.nombre}</Text>
      <Text style={styles.itemDate}>
        {new Date(item.fecha_movimiento).toLocaleDateString()}
      </Text>
    </View>
  );

  const renderVentaItem = ({ item }: { item: Factura }) => (
    <View style={styles.reportItem}>
      <Text style={styles.itemCode}>{item.numero_factura}</Text>
      <Text style={styles.itemName}>{item.cliente.nombre}</Text>
      <Text style={styles.itemCategory}>RUC: {item.cliente.ruc}</Text>
      <View style={styles.itemRow}>
        <Text style={styles.itemLabel}>Total:</Text>
        <Text style={styles.totalAmount}>S/ {item.total.toFixed(2)}</Text>
      </View>
      <View style={styles.itemRow}>
        <Text style={styles.itemLabel}>Estado:</Text>
        <Text style={[
          styles.itemValue,
          styles[item.estado as 'pagado' | 'pendiente' | 'anulado']
        ]}>
          {item.estado.toUpperCase()}
        </Text>
      </View>
      <Text style={styles.itemDate}>
        {new Date(item.fecha_factura).toLocaleDateString()}
      </Text>
    </View>
  );

  const renderAlertaItem = ({ item }: { item: any }) => (
    <View style={[styles.reportItem, styles.alertItem]}>
      <Text style={styles.itemCode}>{item.producto.codigo}</Text>
      <Text style={styles.itemName}>{item.producto.nombre}</Text>
      <View style={styles.itemRow}>
        <Text style={styles.itemLabel}>Stock Actual:</Text>
        <Text style={styles.lowStock}>{item.stock_actual}</Text>
      </View>
      <View style={styles.itemRow}>
        <Text style={styles.itemLabel}>Stock Mínimo:</Text>
        <Text style={styles.itemValue}>{item.stock_minimo}</Text>
      </View>
      <Text style={styles.itemDate}>
        Alerta: {new Date(item.fecha_alerta).toLocaleDateString()}
      </Text>
    </View>
  );

  const renderItem = ({ item }: { item: any }) => {
    switch (reportType) {
      case 'inventario':
        return renderInventarioItem({ item });
      case 'movimientos':
        return renderMovimientoItem({ item });
      case 'ventas':
        return renderVentaItem({ item });
      case 'alertas':
        return renderAlertaItem({ item });
      default:
        return null;
    }
  };

  const getReportTitle = () => {
    switch (reportType) {
      case 'inventario':
        return 'Reporte de Inventario';
      case 'movimientos':
        return 'Reporte de Movimientos';
      case 'ventas':
        return 'Reporte de Ventas';
      case 'alertas':
        return 'Alertas de Stock';
      default:
        return 'Reporte';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>BC Racing - Reportes</Text>
        
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Tipo de Reporte:</Text>
          <Picker
            selectedValue={reportType}
            style={styles.picker}
            onValueChange={(value) => setReportType(value)}
          >
            <Picker.Item label="Inventario" value="inventario" />
            <Picker.Item label="Movimientos" value="movimientos" />
            <Picker.Item label="Ventas" value="ventas" />
            <Picker.Item label="Alertas Stock" value="alertas" />
          </Picker>
        </View>

        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.filterButtonText}>Filtros</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.generateButton}
          onPress={generarReporte}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.generateButtonText}>Generar Reporte</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.reportTitle}>{getReportTitle()}</Text>
      
      {data.length > 0 ? (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          style={styles.reportList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>
            {loading ? 'Cargando...' : 'No hay datos para mostrar'}
          </Text>
        </View>
      )}

      {/* Modal de Filtros */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filtros</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Fecha Inicio (YYYY-MM-DD)"
              value={filtros.fechaInicio}
              onChangeText={(text) => setFiltros({...filtros, fechaInicio: text})}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Fecha Fin (YYYY-MM-DD)"
              value={filtros.fechaFin}
              onChangeText={(text) => setFiltros({...filtros, fechaFin: text})}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.applyButton]}
                onPress={() => {
                  setModalVisible(false);
                  generarReporte();
                }}
              >
                <Text style={styles.applyButtonText}>Aplicar</Text>
              </TouchableOpacity>
            </View>
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
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  filterContainer: {
    marginBottom: 15,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  picker: {
    height: 50,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  filterButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  generateButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  reportTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  reportList: {
    flex: 1,
    padding: 15,
  },
  reportItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alertItem: {
    borderLeftWidth: 4,
    borderLeftColor: '#ff6b6b',
  },
  itemCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  itemName: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  itemCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  itemLabel: {
    fontSize: 14,
    color: '#666',
  },
  itemValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  lowStock: {
    color: '#ff6b6b',
    fontWeight: 'bold',
  },
  itemLocation: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  itemUser: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  itemDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
  },
  entrada: {
    color: '#28a745',
  },
  salida: {
    color: '#dc3545',
  },
  ajuste: {
    color: '#ffc107',
  },
  devolucion: {
    color: '#17a2b8',
  },
  pagado: {
    color: '#28a745',
  },
  pendiente: {
    color: '#ffc107',
  },
  anulado: {
    color: '#dc3545',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  applyButton: {
    backgroundColor: '#007AFF',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default report;