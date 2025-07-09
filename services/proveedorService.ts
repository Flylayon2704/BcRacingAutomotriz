import { ProveedorData } from "@/interfaces/proveedor";

export class ProveedorService{
    private URL: string = 'http://10.0.2.2:3000/api/proveedores';

    async getAllProveedores(): Promise<ProveedorData[]> {
        try {
            const response = await fetch(`${this.URL}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                throw new Error('Error fetching proveedores');
            }
            return response.json();
        } catch (error) {
            console.error('Error in getAllProveedores:', error);
            throw error;
        }
    }

    async createProveedor(proveedorData: ProveedorData): Promise<ProveedorData> {
        try {
            const response = await fetch(`${this.URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(proveedorData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.message || 'Error creating proveedor';
                throw new Error(errorMessage);
            }

            return response.json();
        } catch (error) {
            console.error('Error in createProveedor:', error);
            throw error;
        }
    }

    async getProveedorById(id: string): Promise<ProveedorData> {
        try {
            const response = await fetch(`${this.URL}/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                throw new Error('Error fetching proveedor by ID');
            }
            return response.json();
        } catch (error) {
            console.error('Error in getProveedorById:', error);
            throw error;
        }
    }

    async updateProveedor(id: string, proveedorData: ProveedorData): Promise<ProveedorData> {
        try {
            const response = await fetch(`${this.URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(proveedorData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.message || 'Error updating proveedor';
                throw new Error(errorMessage);
            }

            return response.json();
        } catch (error) {
            console.error('Error in updateProveedor:', error);
            throw error;
        }
    }

    async deleteProveedor(id: string): Promise<void> {
        try {
            const response = await fetch(`${this.URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.message || 'Error deleting proveedor';
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('Error in deleteProveedor:', error);
            throw error;
        }
    }

}