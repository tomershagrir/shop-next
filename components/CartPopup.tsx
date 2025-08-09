import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { useCart, useRemoveFromCart, useUpdateCartQuantity } from '@/services/api-hooks';

interface CartPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CartItem {
  id: number;
  product: {
    _id: string;
    id?: string; // Keep for backward compatibility
    name: string;
    description: string;
    price: number;
    imageUrl?: string;
  };
  quantity: number;
}

const CartPopup = ({ isOpen, onClose }: CartPopupProps) => {
    const [total, setTotal] = useState(0);
    
    // Use TanStack Query hooks
    const { data: cartItems = [], refetch: refetchCart } = useCart();
    const { mutate: removeItemMutation } = useRemoveFromCart();
    const { mutate: updateQuantityMutation } = useUpdateCartQuantity();
    
    // Refetch cart when popup is opened
    useEffect(() => {
        if (isOpen) {
            refetchCart();
        }
    }, [isOpen, refetchCart]);
    
    // Calculate total whenever cart items change
    useEffect(() => {
        calculateTotal(cartItems);
    }, [cartItems]);

    const calculateTotal = (items: CartItem[]) => {
        const totalAmount = items.reduce((sum, item) => {
            return sum + item.product.price * item.quantity;
        }, 0);
        setTotal(totalAmount);
    };

    const handleRemoveFromCart = (productId: string) => {
        removeItemMutation(productId);
    };

    const handleUpdateQuantity = (productId: string, quantity: number) => {
        updateQuantityMutation({ productId, quantity });
    };

    return (
        <div
            className={`fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={onClose}
        >
            <div
                className="absolute top-0 right-0 w-full sm:w-2/3 md:w-1/2 lg:w-1/3 bg-white p-6 rounded-lg shadow-lg max-h-screen overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">הסל שלי</h2>

                {cartItems.length === 0 ? (
                    <p className="text-lg text-gray-600">הסל שלך ריק.</p>
                ) : (
                    <div className="max-h-[60vh] overflow-y-auto">
                        {cartItems.map((item: CartItem) => (
                            <div key={`${item.id}-${item.product._id}`} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-lg mb-4">
                                <div className="flex items-center">
                                    <img
                                        src={item.product.imageUrl || "/api/placeholder/400/300"}
                                        alt={item.product.name}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-800">{item.product.name}</h3>
                                        <p className="text-gray-600">{item.product.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        min="1"
                                        onChange={(e) => handleUpdateQuantity(item.product._id, parseInt(e.target.value))}
                                        className="w-16 px-2 py-1 border border-gray-300 rounded"
                                    />
                                    <span className="text-xl font-bold text-gray-800">₪{(item.product.price * item.quantity).toFixed(2)}</span>
                                    <button
                                        onClick={() => handleRemoveFromCart(item.product._id)}
                                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                    >
                                        הסר
                                    </button>
                                </div>
                            </div>
                        ))}
                        <div className="flex justify-between items-center mt-4">
                            <span className="text-xl font-semibold text-gray-800">סה"כ: ₪{total.toFixed(2)}</span>
                            <Link href="/CheckoutPage">
                                <button
                                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                                >
                                    עבר לתשלום
                                </button>
                            </Link>
                        </div>
                    </div>
                )}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 hover:bg-red-700"
                >
                    ×
                </button>
            </div>
        </div>
    );
};

export default CartPopup;
