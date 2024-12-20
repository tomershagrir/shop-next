// src/pages/CheckoutPage.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '@/services/api';
import Head from "next/head";

const CheckoutPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [email, setEmail] = useState('');
    const router = useRouter();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const items = await api.getCart();
            setCartItems(items);
            calculateTotal(items);
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    const calculateTotal = (items) => {
        const total = Math.round(items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)*100)/100;
        setTotal(total);
    };

    const handleCheckout = async () => {
        try {
            const response = await api.createOrder(email, cartItems);
            if (response) {
                alert('ההזמנה בוצעה בהצלחה!');
                router.push('/thank-you');
            }
        } catch (error) {
            console.error('Error during checkout:', error);
            alert('הייתה שגיאה בהזמנה שלך. אנא נסה שוב.');
        }
    };

    return (
        <>
            <Head>
                <link rel="stylesheet" href="/_next/static/css/app/layout.css" />
            </Head>
            <div className="min-h-screen bg-gray-50" dir="rtl">
                {/* Navigation */}
                <nav className="bg-white shadow-lg">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="flex justify-between items-center py-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">החנות שלי</h1>
                            </div>
                            <div className="flex space-x-4 space-x-reverse">
                                <a href="#" className="text-gray-700 hover:text-gray-900">דף הבית</a>
                                <a href="#" className="text-gray-700 hover:text-gray-900">מוצרים</a>
                                <a href="#" className="text-gray-700 hover:text-gray-900">אודות</a>
                                <a href="#" className="text-gray-700 hover:text-gray-900">צור קשר</a>
                            </div>
                        </div>
                    </div>
                </nav>
            <div className="max-w-3xl mx-auto p-4 text-gray-800" dir="rtl">
                <h1 className="text-2xl font-bold mb-4 ">עמוד תשלום</h1>

                {/* Cart Items List */}
                <div className="bg-white shadow-md rounded-lg p-4 mb-4 ">
                    {cartItems.map((item) => (
                        <div key={item.product.id} className="flex items-center justify-between border-b py-4">
                            {/* Product Image */}
                            <img
                                src={item.product.imageUrl || "/api/placeholder/150/150"}
                                alt={item.product.name}
                                className="w-16 h-16 object-cover rounded mr-4"
                            />
                            <div className="flex-1">
                                <h2 className="font-semibold text-lg">{item.product.name}</h2>
                                <p className="text-gray-600">₪{item.product.price} x {item.quantity}</p>
                            </div>
                            <span className="font-bold">₪{item.product.price * item.quantity}</span>
                        </div>
                    ))}
                    <div className="text-right font-bold mt-4">
                        סה"כ לתשלום: ₪{total}
                    </div>
                </div>

                {/* Email Input */}
                <div className="mb-4">
                    <label className="block font-semibold mb-2">כתובת אימייל:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="הכנס את כתובת האימייל שלך"
                    />
                </div>

                {/* Checkout Button */}
                <button
                    onClick={handleCheckout}
                    className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
                >
                    בצע הזמנה
                </button>
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
            </>
    );
};

export default CheckoutPage;
