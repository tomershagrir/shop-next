const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/graphql';

const fetchGraphQL = async (query: string, variables: Record<string, any> = {}) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, variables }),
    });

    const { data, errors } = await response.json();

    if (errors) {
        console.error('GraphQL errors:', errors);
        throw new Error(errors[0]?.message || 'GraphQL error occurred');
    }

    return data;
};

export default {
    async getProducts() {
        const query = `
            query {
                products {
                    id
                    name
                    description
                    price
                    imageUrl
                }
            }
        `;
        const data = await fetchGraphQL(query);
        return data.products;
    },

    async getProductById(id: number) {
        const query = `
            query ($id: Float!) {
                product(id: $id) {
                    id
                    name
                    description
                    price
                    imageUrl
                }
            }
        `;
        const data = await fetchGraphQL(query, { id });
        return data.product;
    },

    async getCart() {
        const query = `
            query {
                cart {
                    id
                    product {
                        id
                        name
                        price
                        imageUrl
                    }
                    quantity
                }
            }
        `;
        const data = await fetchGraphQL(query);
        return data.cart;
    },

    async addToCart(productId: number, quantity: number) {
        const mutation = `
            mutation ($productId: Float!, $quantity: Float!) {
                addToCart(productId: $productId, quantity: $quantity) {
                    id
                    product {
                        id
                        name
                        price
                    }
                    quantity
                }
            }
        `;
        const data = await fetchGraphQL(mutation, { productId, quantity });
        return data.addToCart;
    },

    async removeFromCart(productId: number) {
        const mutation = `
            mutation ($productId: Float!) {
                removeFromCart(productId: $productId) {
                    id
                    product {
                        id
                        name
                        price
                        imageUrl
                    }
                    quantity
                }
            }
        `;
        const data = await fetchGraphQL(mutation, { productId });
        return data.removeFromCart;
    },
};
