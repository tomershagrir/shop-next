"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@mui/material";
import CartPopup from "@/components/CartPopup";
import { useProducts, useCart, useAddToCart } from "@/services/api-hooks";

// Define types for product and cart items
interface Product {
  _id: string;
  id?: string; // Keep for backward compatibility
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
}

const ShopApp = () => {
    const [searchQuery, setSearchQuery] = useState(""); // Add search query state
    const [isCartOpen, setIsCartOpen] = useState(false);
    
    // Use TanStack Query hooks
    const { data: products = [], isLoading: isLoadingProducts, error: productsError } = useProducts();
    const { data: cartItems = [] } = useCart();
    const { mutate: addToCartMutation, isPending: isAddingToCart } = useAddToCart();

    const handleAddToCart = (productId: string) => {
        addToCartMutation({ productId, quantity: 1 });
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    // Filter products based on search query
    const filteredProducts = products.filter((product: Product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleCart = () => {
        setIsCartOpen((prev) => !prev);
    };

    return (
        <div className="min-h-screen bg-gray-50" dir="rtl">
            {/* Navigation */}
            <nav className="bg-white shadow-lg">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex justify-between items-center py-4">
                        <h1 className="text-2xl font-bold text-gray-800">החנות שלי</h1>
                        <div className="flex space-x-4 space-x-reverse">
                            <a href="#" className="text-gray-700 hover:text-gray-900">דף הבית</a>
                            <a href="#" className="text-gray-700 hover:text-gray-900">מוצרים</a>
                            <a href="#" className="text-gray-700 hover:text-gray-900">אודות</a>
                            <a href="#" className="text-gray-700 hover:text-gray-900">צור קשר</a>
                        </div>
                        <div className="relative" onClick={toggleCart} style={{cursor: "pointer"}}>
                            <ShoppingCart className="h-6 w-6 text-gray-700" />
                            {cartItems?.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                    {cartItems.length}
                                </span>
                            )}
                            {/* Shopping Cart Popup */}
                            <CartPopup isOpen={isCartOpen} onClose={toggleCart} />
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="bg-gray-100 py-12">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">ברוכים הבאים לחנות שלנו</h2>
                    <p className="text-gray-600 text-lg">גלו את המוצרים המדהימים שלנו</p>
                </div>
            </div>

            {/* Search Box */}
            <div className="max-w-6xl mx-auto px-4 py-6">
                <input
                    type="text"
                    placeholder="חפש מוצרים..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full p-3 border rounded-md shadow-sm"
                />
            </div>

            {/* Products Grid */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-8">מוצרים מובחרים</h2>
                
                {isLoadingProducts ? (
                    <div className="flex justify-center items-center h-64">
                        <p className="text-gray-600">טוען מוצרים...</p>
                    </div>
                ) : productsError ? (
                    <div className="flex justify-center items-center h-64">
                        <p className="text-red-600">שגיאה בטעינת המוצרים. אנא נסה שוב מאוחר יותר.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product: Product) => {
                                console.log("Product in shop:", product);
                                return (
                                <Card key={product._id} className="overflow-hidden">
                                    <Link href={`/products/${product._id}`} passHref>
                                        <img
                                            src={product.imageUrl || "/api/placeholder/400/300"}
                                            alt={product.name}
                                            className="w-full h-48 object-cover cursor-pointer"
                                        />
                                    </Link>
                                    <CardContent className="p-4">
                                        <Link href={`/products/${product._id}`} passHref>
                                            <h3 className="text-lg font-semibold text-gray-800 cursor-pointer">
                                                {product.name}
                                            </h3>
                                        </Link>
                                        <p className="text-gray-600 mt-2">{product.description}</p>
                                        <div className="mt-4 flex justify-between items-center">
                                            <span className="text-xl font-bold text-gray-800">₪{product.price}</span>
                                            <button
                                                onClick={() => handleAddToCart(product._id)}
                                                disabled={isAddingToCart}
                                                className={`${
                                                    isAddingToCart ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                                                } text-white px-4 py-2 rounded transition-colors`}
                                            >
                                                {isAddingToCart ? "מוסיף..." : "הוסף לסל"}
                                            </button>
                                        </div>
                                    </CardContent>
                                </Card>
                                );
                            })
                        ) : (
                            <p className="text-gray-600">לא נמצאו מוצרים תואמים.</p>
                        )}
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">אודותינו</h3>
                            <p className="text-gray-400">הוסף כאן את תיאור החנות שלך.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">קישורים מהירים</h3>
                            <ul className="text-gray-400">
                                <li className="mb-2"><a href="#" className="hover:text-white">דף הבית</a></li>
                                <li className="mb-2"><a href="#" className="hover:text-white">מוצרים</a></li>
                                <li className="mb-2"><a href="#" className="hover:text-white">אודות</a></li>
                                <li className="mb-2"><a href="#" className="hover:text-white">צור קשר</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">פרטי התקשרות</h3>
                            <ul className="text-gray-400">
                                <li className="mb-2">דוא&ldquo;ל: your@email.com</li>
                                <li className="mb-2">טלפון: 03-1234567</li>
                                <li className="mb-2">כתובת: הכתובת שלך כאן</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ShopApp;
