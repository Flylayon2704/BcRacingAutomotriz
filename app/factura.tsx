import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  FlatList,
  Linking,
} from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  precio_venta: number;
  stock_actual: number;
}

interface ItemFactura {
  producto: Producto;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

interface DatosCliente {
  nombre: string;
  ruc: string;
  direccion: string;
}

const factura: React.FC = () => {
  const [items, setItems] = useState<ItemFactura[]>([]);
  const [cliente, setCliente] = useState<DatosCliente>({
    nombre: '',
    ruc: '',
    direccion: '',
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [numeroFactura, setNumeroFactura] = useState('FAC-2025-0001');

  // Productos de ejemplo basados en tu BD
  const productos: Producto[] = [
    {
      id: 1,
      codigo: 'BRK001',
      nombre: 'Pastillas de Freno Delanteras Toyota Corolla',
      precio_venta: 75.00,
      stock_actual: 25,
    },
    {
      id: 2,
      codigo: 'MOT001',
      nombre: 'Filtro de Aceite Toyota',
      precio_venta: 20.00,
      stock_actual: 50,
    },
    {
      id: 3,
      codigo: 'SUS001',
      nombre: 'Amortiguador Delantero Nissan Sentra',
      precio_venta: 140.00,
      stock_actual: 12,
    },
    {
      id: 4,
      codigo: 'TRA001',
      nombre: 'Kit de Embrague Honda Civic',
      precio_venta: 300.00,
      stock_actual: 8,
    },
    {
      id: 5,
      codigo: 'ELE001',
      nombre: 'Batería 12V 60Ah',
      precio_venta: 200.00,
      stock_actual: 15,
    },
  ];

  const agregarProducto = (producto: Producto) => {
    const itemExistente = items.find(item => item.producto.id === producto.id);
    
    if (itemExistente) {
      setItems(items.map(item =>
        item.producto.id === producto.id
          ? {
              ...item,
              cantidad: item.cantidad + 1,
              subtotal: (item.cantidad + 1) * item.precio_unitario,
            }
          : item
      ));
    } else {
      const nuevoItem: ItemFactura = {
        producto,
        cantidad: 1,
        precio_unitario: producto.precio_venta,
        subtotal: producto.precio_venta,
      };
      setItems([...items, nuevoItem]);
    }
    setModalVisible(false);
  };

  const actualizarCantidad = (id: number, nuevaCantidad: number) => {
    if (nuevaCantidad <= 0) {
      setItems(items.filter(item => item.producto.id !== id));
      return;
    }

    setItems(items.map(item =>
      item.producto.id === id
        ? {
            ...item,
            cantidad: nuevaCantidad,
            subtotal: nuevaCantidad * item.precio_unitario,
          }
        : item
    ));
  };

  const calcularTotales = () => {
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const igv = subtotal * 0.18;
    const total = subtotal + igv;
    return { subtotal, igv, total };
  };

  // Función para generar HTML de la factura
  const generarHTMLFactura = () => {
    const fecha = new Date().toLocaleDateString('es-PE');
    const { subtotal, igv, total } = calcularTotales();

    const itemsHTML = items.map(item => `
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.producto.codigo}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${item.producto.nombre}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.cantidad}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">S/ ${item.precio_unitario.toFixed(2)}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">S/ ${item.subtotal.toFixed(2)}</td>
      </tr>
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Factura ${numeroFactura}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            font-size: 12px;
            line-height: 1.4;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 15px;
            margin-bottom: 20px;
          }
          .company-name {
            font-size: 20px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 5px;
          }
          .company-info {
            font-size: 12px;
            color: #666;
            margin-bottom: 2px;
          }
          .factura-title {
            font-size: 16px;
            font-weight: bold;
            color: #e74c3c;
            margin-top: 10px;
          }
          .info-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
          }
          .info-left, .info-right {
            width: 48%;
          }
          .info-title {
            font-size: 14px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 8px;
            border-bottom: 1px solid #bdc3c7;
            padding-bottom: 3px;
          }
          .info-text {
            font-size: 12px;
            margin-bottom: 3px;
          }
          .table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          .table-header {
            background-color: #34495e;
            color: white;
            font-weight: bold;
          }
          .table-header th {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: center;
          }
          .totales {
            width: 250px;
            margin-left: auto;
            margin-bottom: 20px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            padding: 4px 0;
          }
          .final-total {
            background-color: #ecf0f1;
            margin-top: 5px;
            padding: 8px;
            font-weight: bold;
            font-size: 14px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            border-top: 1px solid #bdc3c7;
            padding-top: 15px;
          }
          .footer-text {
            font-size: 10px;
            color: #7f8c8d;
            margin-bottom: 2px;
          }
        </style>
      </head>
      <body>
        <!-- Header -->
        <div class="header">
          <div class="company-name">BC RACING REPUESTOS</div>
          <div class="company-info">RUC: 20123456789</div>
          <div class="company-info">Av. Ejemplo 123, Lima - Perú</div>
          <div class="company-info">Teléfono: (01) 123-4567</div>
          <div class="factura-title">FACTURA ELECTRÓNICA</div>
        </div>

        <!-- Información -->
        <div class="info-section">
          <div class="info-left">
            <div class="info-title">DATOS DEL CLIENTE</div>
            <div class="info-text">Nombre: ${cliente.nombre || 'N/A'}</div>
            <div class="info-text">RUC: ${cliente.ruc || 'N/A'}</div>
            <div class="info-text">Dirección: ${cliente.direccion || 'N/A'}</div>
          </div>
          <div class="info-right">
            <div class="info-title">DATOS DE LA FACTURA</div>
            <div class="info-text">Número: ${numeroFactura}</div>
            <div class="info-text">Fecha: ${fecha}</div>
            <div class="info-text">Moneda: Soles (PEN)</div>
          </div>
        </div>

        <!-- Tabla de productos -->
        <table class="table">
          <thead class="table-header">
            <tr>
              <th style="width: 15%;">Código</th>
              <th style="width: 45%;">Descripción</th>
              <th style="width: 10%;">Cant.</th>
              <th style="width: 15%;">P. Unit.</th>
              <th style="width: 15%;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>

        <!-- Totales -->
        <div class="totales">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>S/ ${subtotal.toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span>IGV (18%):</span>
            <span>S/ ${igv.toFixed(2)}</span>
          </div>
          <div class="total-row final-total">
            <span>TOTAL:</span>
            <span>S/ ${total.toFixed(2)}</span>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <div class="footer-text">Gracias por su compra</div>
          <div class="footer-text">Esta es una representación impresa de la factura electrónica</div>
        </div>
      </body>
      </html>
    `;
  };

  const generarPDF = async () => {
    if (items.length === 0) {
      Alert.alert('Error', 'Debe agregar al menos un producto');
      return;
    }

    if (!cliente.nombre) {
      Alert.alert('Error', 'Debe ingresar el nombre del cliente');
      return;
    }

    try {
      const htmlContent = generarHTMLFactura();
      
      const options = {
        html: htmlContent,
        fileName: `Factura_${numeroFactura}`,
        directory: 'Documents',
        width: 612,
        height: 792,
        padding: 20,
      };

      const file = await RNHTMLtoPDF.convert(options);
      
      Alert.alert(
        'PDF Generado',
        `Factura generada exitosamente en: ${file.filePath}`,
        [
          {
            text: 'Abrir PDF',
            onPress: () => {
              Linking.openURL(`file://${file.filePath}`).catch(err => {
                console.error('Error al abrir PDF:', err);
                Alert.alert('Error', 'No se pudo abrir el PDF');
              });
            }
          },
          {
            text: 'OK',
            onPress: () => {
              // Limpiar formulario
              setItems([]);
              setCliente({ nombre: '', ruc: '', direccion: '' });
              // Generar nuevo número de factura
              const num = parseInt(numeroFactura.split('-')[2]) + 1;
              setNumeroFactura(`FAC-2025-${num.toString().padStart(4, '0')}`);
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo generar el PDF');
      console.error('Error generando PDF:', error);
    }
  };

  const { subtotal, igv, total } = calcularTotales();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Generar Factura</Text>
        
        {/* Información del cliente */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos del Cliente</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre del cliente"
            value={cliente.nombre}
            onChangeText={(text) => setCliente({...cliente, nombre: text})}
          />
          <TextInput
            style={styles.input}
            placeholder="RUC (opcional)"
            value={cliente.ruc}
            onChangeText={(text) => setCliente({...cliente, ruc: text})}
          />
          <TextInput
            style={styles.input}
            placeholder="Dirección (opcional)"
            value={cliente.direccion}
            onChangeText={(text) => setCliente({...cliente, direccion: text})}
            multiline
          />
        </View>

        {/* Número de factura */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Número de Factura</Text>
          <TextInput
            style={styles.input}
            value={numeroFactura}
            onChangeText={setNumeroFactura}
          />
        </View>

        {/* Productos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Productos</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.addButtonText}>+ Agregar</Text>
            </TouchableOpacity>
          </View>

          {items.map((item) => (
            <View key={item.producto.id} style={styles.itemCard}>
              <Text style={styles.itemName}>{item.producto.nombre}</Text>
              <Text style={styles.itemCode}>Código: {item.producto.codigo}</Text>
              <View style={styles.itemDetails}>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => actualizarCantidad(item.producto.id, item.cantidad - 1)}
                  >
                    <Text style={styles.quantityButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantity}>{item.cantidad}</Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => actualizarCantidad(item.producto.id, item.cantidad + 1)}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.price}>S/ {item.subtotal.toFixed(2)}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Totales */}
        {items.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resumen</Text>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal:</Text>
              <Text style={styles.totalValue}>S/ {subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>IGV (18%):</Text>
              <Text style={styles.totalValue}>S/ {igv.toFixed(2)}</Text>
            </View>
            <View style={[styles.totalRow, styles.finalTotal]}>
              <Text style={styles.finalTotalLabel}>TOTAL:</Text>
              <Text style={styles.finalTotalValue}>S/ {total.toFixed(2)}</Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[styles.generateButton, items.length === 0 && styles.generateButtonDisabled]}
          onPress={generarPDF}
          disabled={items.length === 0}
        >
          <Text style={styles.generateButtonText}>Generar PDF</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal para seleccionar productos */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar Producto</Text>
            <FlatList
              data={productos}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.productItem}
                  onPress={() => agregarProducto(item)}
                >
                  <Text style={styles.productName}>{item.nombre}</Text>
                  <Text style={styles.productCode}>{item.codigo}</Text>
                  <Text style={styles.productPrice}>S/ {item.precio_venta.toFixed(2)}</Text>
                  <Text style={styles.productStock}>Stock: {item.stock_actual}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2c3e50',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  itemCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemCode: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#e74c3c',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 15,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  totalLabel: {
    fontSize: 16,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  finalTotal: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 8,
    marginTop: 8,
  },
  finalTotalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  finalTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  generateButton: {
    backgroundColor: '#27ae60',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  generateButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  generateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  productItem: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productCode: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 2,
  },
  productStock: {
    fontSize: 14,
    color: '#666',
  },
  closeButton: {
    backgroundColor: '#e74c3c',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default factura;