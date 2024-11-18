const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export default {
    async getProducts() {
        const response = await fetch(`${API_URL}/products`);
        return response.json();
    },

    async getProductById(id: string)  {
        const response = await fetch(`${API_URL}/products/${id}`);
        return response.json();
    },

    async getCart() {
        const response = await fetch(`${API_URL}/cart`);
        return response.json();
    },

    async addToCart(productId: number, quantity: number) {
        const response = await fetch(`${API_URL}/cart/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId, quantity }),
        });
        return response.json();
    },

    async removeFromCart(productId: number)  {
        try {
            const response = await fetch(`${API_URL}/cart/remove`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId }),
            });

            if (!response.ok) {
                throw new Error('Failed to remove item from cart');
            }

            const data = await response.json();

            return data;
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    }
};
