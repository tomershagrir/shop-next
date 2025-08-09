import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './api';

// Query keys
export const queryKeys = {
  products: ['products'] as const,
  product: (id: string) => ['product', id] as const,
  cart: ['cart'] as const,
};

// Products hooks
export function useProducts() {
  return useQuery({
    queryKey: queryKeys.products,
    queryFn: () => api.getProducts(),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: queryKeys.product(id),
    queryFn: () => api.getProductById(id),
    enabled: !!id,
  });
}

// Cart hooks
export function useCart() {
  return useQuery({
    queryKey: queryKeys.cart,
    queryFn: () => api.getCart(),
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) => 
      api.addToCart(productId, quantity),
    onSuccess: () => {
      // Invalidate cart query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (productId: string) => api.removeFromCart(productId),
    onSuccess: () => {
      // Invalidate cart query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
  });
}

// This hook is for the updateQuantity function in CartPopup
// Note: The API service doesn't have this method, so we'll need to add it or adapt
export function useUpdateCartQuantity() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) => {
      // If the API has an updateCartQuantity method, use it
      // Otherwise, we can use addToCart as a workaround
      return api.addToCart(productId, quantity);
    },
    onSuccess: () => {
      // Invalidate cart query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
  });
}