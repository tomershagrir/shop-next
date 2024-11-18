// pages/products/[id].ts

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "@/services/api";
import { Card, CardContent } from "@mui/material";
import {GetServerSideProps} from "next";
import Head from "next/head";

const ProductPage = () => {
    const router = useRouter();
    const { id } = router.query; // Access the product ID from the URL
    const [product, setProduct] = useState(null);

    useEffect(() => {
        if (id) {
            fetchProduct(id as string);
        }
    }, [id]);

    const fetchProduct = async (productId: string) => {
        try {
            const productData = await api.getProductById(productId);
            setProduct(productData);
        } catch (error) {
            console.error("Error fetching product:", error);
        }
    };

    const addToCart = async (productId) => {
        try {
            const updatedCart = await api.addToCart(productId, 1);
            router.push('/');
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    if (!product) {
        return <p>Loading...</p>;
    }

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

                {/* Product Section */}
                <div className="max-w-6xl mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-96 object-cover rounded-lg shadow-md"
                            />
                        </div>
                        <div className="flex flex-col justify-center">
                            <h2 className="text-3xl font-semibold text-gray-800">{product.name}</h2>
                            <p className="text-gray-600 mt-2">{product.description}</p>
                            <p className="text-xl font-bold text-gray-800 mt-4">₪{product.price}</p>
                            <div className="mt-6">
                                <button
                                    onClick={() => addToCart(product.id)}
                                    className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-all"
                                >
                                    הוסף לסל
                                </button>
                            </div>
                        </div>
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
            </>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id } = context.params;
    const product = await api.getProductById(id)

    if (!product) {
        return { notFound: true };
    }

    return {
        props: { product },
    };
};

export default ProductPage;
