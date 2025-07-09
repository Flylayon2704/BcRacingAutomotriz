export interface Producto {
  _id: number;
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