export class AuthService {
    private URL: string = 'http://10.0.2.2/api/auth';
    async login(email: string, password: string): Promise<any> {
        const response = await fetch(`${this.URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.message || 'Login failed';
            throw new Error(errorMessage);
        }

        const data = await response.json();
        return data;

    }
    async register(email: string, password: string): Promise<any> {
        try {
            const response = await fetch(`${this.URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error during registration:', error);
            throw error;
        }
    }
}