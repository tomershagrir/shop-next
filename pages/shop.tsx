"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@mui/material";
import api from "@/services/api";
import CartPopup from "@/components/CartPopup";

const ShopApp = () => {
    const [cartItems, setCartItems] = useState([]);
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); // Add search query state

    useEffect(() => {
        fetchCart();
        (async () => {
            setProducts(await api.getProducts());
        })();
    }, []);

    const fetchCart = async () => {
        try {
            const  items  = await api.getCart();
            setCartItems(items);
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    };

    const addToCart = async (productId: number) => {
        try {
            const updatedCart = await api.addToCart(Number(productId), 1);
            setCartItems(updatedCart.items);
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    // Filter products based on search query
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartItemsCount, setCartItemsCount] = useState(0); // Track the number of items in the cart

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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <Card key={product.id} className="overflow-hidden">
                                <Link href={`/products/${product.id}`} passHref>
                                    <img
                                        src={product.imageUrl || "/api/placeholder/400/300"}
                                        alt={product.name}
                                        className="w-full h-48 object-cover cursor-pointer"
                                    />
                                </Link>
                                <CardContent className="p-4">
                                    <Link href={`/products/${product.id}`} passHref>
                                        <h3 className="text-lg font-semibold text-gray-800 cursor-pointer">
                                            {product.name}
                                        </h3>
                                    </Link>
                                    <p className="text-gray-600 mt-2">{product.description}</p>
                                    <div className="mt-4 flex justify-between items-center">
                                        <span className="text-xl font-bold text-gray-800">₪{product.price}</span>
                                        <button
                                            onClick={() => addToCart(product.id)}
                                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                        >
                                            הוסף לסל
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <p className="text-gray-600">לא נמצאו מוצרים תואמים.</p>
                    )}
                </div>
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
                                <li className="mb-2">דוא"ל: your@email.com</li>
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
