const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const userId = 'react-next-shop';

export default {
    async getProducts() {
        const response = await fetch(`${API_URL}/products`);
        return response.json();
    },

    async getProductById(id: string)  {
        console.log("Fetching product from:", `${API_URL}/products/${id}`);
        const response = await fetch(`${API_URL}/products/${id}`);
        console.log("Response status:", response.status);
        const data = await response.json();
        console.log("Response data:", data);
        return data;
    },

    async getCart() {
        const response = await fetch(`${API_URL}/cart/${userId}`);
        return response.json();
    },

    async addToCart(productId: string, quantity: number) {
        const requestBody = { userId, productId, quantity };
        console.log("API addToCart request body:", requestBody);
        const response = await fetch(`${API_URL}/cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });
        return response.json();
    },

    async removeFromCart(productId: string)  {
        try {
            const response = await fetch(`${API_URL}/cart/${userId}/items/${productId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to remove item from cart');
            }

            const data = await response.json();

            return data;
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    },

    async createOrder(email: string, cartItems: any[]) {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, email, items: cartItems }),
        });
        return response.json();
    }
};
