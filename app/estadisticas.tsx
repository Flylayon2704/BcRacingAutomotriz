import { Link } from 'expo-router';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Area, Bar, CartesianChart, Line, Pie, PolarChart } from 'victory-native';

const { width } = Dimensions.get('window');
const chartWidth = width - 40;

// Datos para gráfico de stock por categoría
const stockData = [
  { categoria: 'Frenos', stock: 25, minimo: 10, x: 'Frenos', y: 25 },
  { categoria: 'Motor', stock: 50, minimo: 20, x: 'Motor', y: 50 },
  { categoria: 'Suspensión', stock: 12, minimo: 5, x: 'Suspensión', y: 12 },
  { categoria: 'Transmisión', stock: 8, minimo: 3, x: 'Transmisión', y: 8 },
  { categoria: 'Eléctrico', stock: 15, minimo: 5, x: 'Eléctrico', y: 15 }
];

// Datos para ventas por mes
const ventasData = [
  { mes: 'Ene', ventas: 45000, x: 1, y: 45000 },
  { mes: 'Feb', ventas: 52000, x: 2, y: 52000 },
  { mes: 'Mar', ventas: 48000, x: 3, y: 48000 },
  { mes: 'Abr', ventas: 61000, x: 4, y: 61000 },
  { mes: 'May', ventas: 58000, x: 5, y: 58000 },
  { mes: 'Jun', ventas: 67000, x: 6, y: 67000 }
];

// Datos para productos populares
const productosData = [
  { producto: 'Pastillas', cantidad: 45, x: 1, y: 45 },
  { producto: 'Filtros', cantidad: 38, x: 2, y: 38 },
  { producto: 'Amortiguadores', cantidad: 25, x: 3, y: 25 },
  { producto: 'Embragues', cantidad: 18, x: 4, y: 18 },
  { producto: 'Baterías', cantidad: 32, x: 5, y: 32 }
];

// Datos para gráfico circular
const categoriasData = [
  { label: 'Frenos', value: 28, color: '#FF6B6B' },
  { label: 'Motor', value: 22, color: '#4ECDC4' },
  { label: 'Eléctrico', value: 18, color: '#45B7D1' },
  { label: 'Suspensión', value: 16, color: '#96CEB4' },
  { label: 'Transmisión', value: 16, color: '#FECA57' }
];

// Datos para movimientos de inventario
const movimientosData = [
  { dia: 1, entradas: 20, salidas: 15, x: 1, entradas_y: 20, salidas_y: 15 },
  { dia: 2, entradas: 25, salidas: 18, x: 2, entradas_y: 25, salidas_y: 18 },
  { dia: 3, entradas: 15, salidas: 22, x: 3, entradas_y: 15, salidas_y: 22 },
  { dia: 4, entradas: 30, salidas: 12, x: 4, entradas_y: 30, salidas_y: 12 },
  { dia: 5, entradas: 18, salidas: 25, x: 5, entradas_y: 18, salidas_y: 25 },
  { dia: 6, entradas: 22, salidas: 20, x: 6, entradas_y: 22, salidas_y: 20 },
  { dia: 7, entradas: 28, salidas: 16, x: 7, entradas_y: 28, salidas_y: 16 }
];

export const estadisticas: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
        <Link href="/" asChild>
                    <TouchableOpacity

                  >
                    <Text >← Volver</Text>
                  </TouchableOpacity>
                  </Link>
      <Text style={styles.titulo}>Dashboard - BC Racing Inventario</Text>
      
      {/* Gráfico de Stock por Categoría */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Stock Actual por Categoría</Text>
        <View style={{ height: 250 }}>
          <CartesianChart
            data={stockData}
            xKey="x"
            yKeys={["y"]}
          >
            {({ points, chartBounds }) => (
              <Bar
                points={points.y}
                chartBounds={chartBounds}
                color="#4CAF50"
                roundedCorners={{ topLeft: 5, topRight: 5 }}
              />
            )}
          </CartesianChart>
        </View>
      </View>

      {/* Gráfico de Ventas por Mes (Área) */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Evolución de Ventas Mensuales</Text>
        <View style={{ height: 250 }}>
          <CartesianChart
            data={ventasData}
            xKey="x"
            yKeys={["y"]}
          >
            {({ points, chartBounds }) => (
              <Area
                points={points.y}
                color="#2196F3"
                opacity={0.6}
                y0={0}
              />
            )}
          </CartesianChart>
        </View>
      </View>

      {/* Gráfico de Productos Más Vendidos */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Productos Más Vendidos</Text>
        <View style={{ height: 280 }}>
          <CartesianChart
            data={productosData}
            xKey="x"
            yKeys={["y"]}
          >
            {({ points, chartBounds }) => (
              <Bar
                points={points.y}
                chartBounds={chartBounds}
                color="#9C27B0"
                roundedCorners={{ topLeft: 5, topRight: 5 }}
              />
            )}
          </CartesianChart>
        </View>
        <View style={styles.etiquetasProductos}>
          {productosData.map((item, index) => (
            <Text key={index} style={styles.etiquetaProducto}>
              {item.producto}: {item.cantidad}
            </Text>
          ))}
        </View>
      </View>

      {/* Gráfico Circular - Distribución por Categorías */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Distribución de Inventario por Categoría</Text>
        <View style={{ height: 300 }}>
          <PolarChart
            data={categoriasData}
            labelKey="label"
            valueKey="value"
            colorKey="color"
          >
            <Pie.Chart />
          </PolarChart>
        </View>
      </View>

      {/* Gráfico de Movimientos de Inventario */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Movimientos de Inventario (Última Semana)</Text>
        <View style={{ height: 250 }}>
          <CartesianChart
            data={movimientosData}
            xKey="x"
            yKeys={["entradas_y", "salidas_y"]}
          >
            {({ points, chartBounds }) => (
              <>
                <Line
                  points={points.entradas_y}
                  color="#4CAF50"
                  strokeWidth={3}
                />
                <Line
                  points={points.salidas_y}
                  color="#F44336"
                  strokeWidth={3}
                />
              </>
            )}
          </CartesianChart>
        </View>
        <View style={styles.leyenda}>
          <View style={styles.leyendaItem}>
            <View style={[styles.leyendaColor, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.leyendaTexto}>Entradas</Text>
          </View>
          <View style={styles.leyendaItem}>
            <View style={[styles.leyendaColor, { backgroundColor: '#F44336' }]} />
            <Text style={styles.leyendaTexto}>Salidas</Text>
          </View>
        </View>
      </View>

      {/* Ventas como Línea */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Tendencia de Ventas</Text>
        <View style={{ height: 250 }}>
          <CartesianChart
            data={ventasData}
            xKey="x"
            yKeys={["y"]}
          >
            {({ points, chartBounds }) => (
              <Line
                points={points.y}
                color="#FF5722"
                strokeWidth={3}
                curveType="natural"
              />
            )}
          </CartesianChart>
        </View>
        <View style={styles.etiquetasMeses}>
          {ventasData.map((item, index) => (
            <Text key={index} style={styles.etiquetaMes}>
              {item.mes}
            </Text>
          ))}
        </View>
      </View>

      {/* Métricas Rápidas */}
      <View style={styles.metricas}>
        <Text style={styles.chartTitle}>Métricas Rápidas</Text>
        <View style={styles.metricasContainer}>
          <View style={styles.metricaCard}>
            <Text style={styles.metricaNumero}>110</Text>
            <Text style={styles.metricaLabel}>Productos Total</Text>
          </View>
          <View style={styles.metricaCard}>
            <Text style={styles.metricaNumero}>8</Text>
            <Text style={styles.metricaLabel}>Stock Bajo</Text>
          </View>
          <View style={styles.metricaCard}>
            <Text style={styles.metricaNumero}>S/67,000</Text>
            <Text style={styles.metricaLabel}>Ventas del Mes</Text>
          </View>
          <View style={styles.metricaCard}>
            <Text style={styles.metricaNumero}>3</Text>
            <Text style={styles.metricaLabel}>Proveedores</Text>
          </View>
        </View>
      </View>

      {/* Alertas de Stock */}
      <View style={styles.alertas}>
        <Text style={styles.chartTitle}>⚠️ Alertas de Stock Bajo</Text>
        <View style={styles.alertaItem}>
          <Text style={styles.alertaProducto}>Kit de Embrague Honda Civic</Text>
          <Text style={styles.alertaStock}>Stock: 8 | Mínimo: 3</Text>
        </View>
        <View style={styles.alertaItem}>
          <Text style={styles.alertaProducto}>Amortiguador Delantero Nissan</Text>
          <Text style={styles.alertaStock}>Stock: 12 | Mínimo: 5</Text>
        </View>
        <View style={styles.alertaItem}>
          <Text style={styles.alertaProducto}>Pastillas de Freno Toyota</Text>
          <Text style={styles.alertaStock}>Stock: 25 | Mínimo: 10</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  leyenda: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  leyendaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  leyendaColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 5,
  },
  leyendaTexto: {
    fontSize: 12,
    color: '#666',
  },
  etiquetasProductos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  etiquetaProducto: {
    fontSize: 10,
    color: '#666',
    marginVertical: 2,
  },
  etiquetasMeses: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  etiquetaMes: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  metricas: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  metricasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricaCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  metricaNumero: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  metricaLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  alertas: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  alertaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  alertaProducto: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  alertaStock: {
    fontSize: 12,
    color: '#FF9800',
    fontWeight: '500',
  },
});

export default estadisticas;