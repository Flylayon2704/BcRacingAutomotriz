import { FormData } from "@/dto/storeProduct";
import { Producto } from "@/interfaces/product";

export class ProductService {
    private URL: string = 'http://10.0.2.2:3000/api/products';

    async getAllProducts(): Promise<Producto[]> {
        try {
            const response = await fetch(`${this.URL}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                throw new Error('Error fetching products');
            }
            return response.json();
        } catch (error) {
            console.error('Error in getAllProducts:', error);
            throw error;
        }
    }

    async getProductsByName(name: string): Promise<Producto[]> {
        try {
            const response = await fetch(`${this.URL}/search/${name}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                throw new Error('Error fetching products by name');
            }
            return response.json();
        } catch (error) {
            console.error('Error in getProductsByName:', error);
            throw error;
        }
    }

    async createProduct(productData: FormData): Promise<Producto> {
        try {
            const response = await fetch(`${this.URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.message || 'Error creating product';
                throw new Error(errorMessage);
            }

            return response.json();
        } catch (error) {
            console.error('Error in createProduct:', error);
            throw error;
        }
    }

    async updateProduct(id: string, productData: Producto): Promise<Producto> {
        try {
            const response = await fetch(`${this.URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.message || 'Error updating product';
                throw new Error(errorMessage);
            }

            return response.json();
        } catch (error) {
            console.error('Error in updateProduct:', error);
            throw error;
        }
    }



    

}