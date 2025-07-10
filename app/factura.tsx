import { Link } from 'expo-router';
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
} from 'react-native';

interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  precio_venta: number;
  stock_actual: number;
}

interface ItemBoleta {
  producto: Producto;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

interface DatosCliente {
  nombre: string;
  dni: string;
  direccion: string;
}

const factura: React.FC = () => {
  const [items, setItems] = useState<ItemBoleta[]>([]);
  const [cliente, setCliente] = useState<DatosCliente>({
    nombre: '',
    dni: '',
    direccion: '',
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [numeroBoleta, setNumeroBoleta] = useState('0001-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'));

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
      const nuevoItem: ItemBoleta = {
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

  // NUEVO: Compartir resumen tipo boleta térmica
  const compartirBoleta = () => {
    if (items.length === 0) {
      Alert.alert('Error', 'Debe agregar al menos un producto');
      return;
    }

    if (!cliente.nombre) {
      Alert.alert('Error', 'Debe ingresar el nombre del cliente');
      return;
    }

    const { subtotal, igv, total } = calcularTotales();
    const fecha = new Date().toLocaleDateString('es-PE');

    let resumen = `🧾 BOLETA DE VENTA\n\n`;
    resumen += `BODEGA MIRIAM\n`;
    resumen += `LIMA - LIMA\n`;
    resumen += `Tel: 987654321\n`;
    resumen += `R.U.C. N° 10106192281\n`;
    resumen += `N° ${numeroBoleta}\n\n`;

    resumen += `Cliente: ${cliente.nombre}\n`;
    if (cliente.dni) resumen += `DNI: ${cliente.dni}\n`;
    if (cliente.direccion) resumen += `Dirección: ${cliente.direccion}\n`;
    resumen +=` \n----------------------------------------\n`;
    resumen +=` Descripción              Cant P.Unit Total\n`;

    items.forEach(item => {
      const nombre = item.producto.nombre.length > 22
        ? item.producto.nombre.substring(0, 22) + '…'
        : item.producto.nombre.padEnd(23, ' ');

      const cantidad = String(item.cantidad).padStart(4, ' ');
      const precio = item.precio_unitario.toFixed(2).padStart(6, ' ');
      const totalLinea = item.subtotal.toFixed(2).padStart(6, ' ');
      resumen +=` ${nombre}${cantidad}${precio}${totalLinea}\n`;
    });

    resumen +=` ----------------------------------------\n`;
    resumen +=` TOTAL: S/. ${total.toFixed(2)}\n\n`;
    resumen +=` Lima, ${fecha}\n`;
    resumen +=` Gracias por su compra`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(resumen).then(() => {
        Alert.alert('Éxito', 'Resumen de la boleta copiado al portapapeles');
      }).catch(() => {
        Alert.alert('Resumen de Boleta', resumen);
      });
    } else {
      Alert.alert('Resumen de Boleta', resumen);
    }
  };

  const { subtotal, igv, total } = calcularTotales();

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <ScrollView>
        <Link href="/" asChild>
          <TouchableOpacity>
            <Text style={{ color: 'blue', marginBottom: 10 }}>← Volver</Text>
          </TouchableOpacity>
        </Link>

        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>
          Generar Boleta
        </Text>

        <TextInput
          placeholder="Nombre del cliente"
          value={cliente.nombre}
          onChangeText={(text) => setCliente({ ...cliente, nombre: text })}
          style={styles.input}
        />
        <TextInput
          placeholder="DNI (opcional)"
          value={cliente.dni}
          onChangeText={(text) => setCliente({ ...cliente, dni: text })}
          style={styles.input}
        />
        <TextInput
          placeholder="Dirección (opcional)"
          value={cliente.direccion}
          onChangeText={(text) => setCliente({ ...cliente, direccion: text })}
          style={styles.input}
        />

        <TextInput
          placeholder="Número de boleta"
          value={numeroBoleta}
          onChangeText={setNumeroBoleta}
          style={styles.input}
        />

        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.agregarBtn}>
          <Text style={{ color: 'white' }}>+ Agregar producto</Text>
        </TouchableOpacity>

        {items.map(item => (
          <View key={item.producto.id} style={styles.productoCard}>
            <Text>{item.producto.nombre}</Text>
            <Text>Cant: {item.cantidad} | S/ {item.subtotal.toFixed(2)}</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity onPress={() => actualizarCantidad(item.producto.id, item.cantidad - 1)}>
                <Text>-</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => actualizarCantidad(item.producto.id, item.cantidad + 1)}>
                <Text>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {items.length > 0 && (
          <>
            <Text style={{ fontWeight: 'bold', marginTop: 16 }}>
              TOTAL: S/ {total.toFixed(2)}
            </Text>

            <TouchableOpacity style={styles.botonCompartir} onPress={compartirBoleta}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>📤 Compartir Resumen</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide">
        <View style={{ flex: 1, padding: 16 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Seleccionar producto</Text>
          <FlatList
            data={productos}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.productoCard}
                onPress={() => agregarProducto(item)}
              >
                <Text>{item.nombre}</Text>
                <Text>S/ {item.precio_venta.toFixed(2)}</Text>
                <Text>Stock: {item.stock_actual}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text style={{ marginTop: 10, color: 'red' }}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  agregarBtn: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 6,
    marginVertical: 10,
    alignItems: 'center',
  },
  productoCard: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginBottom: 10,
  },
  botonCompartir: {
    backgroundColor: '#16429E',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
});

export default factura;