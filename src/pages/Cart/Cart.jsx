import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAddTodoMutation } from "../../redux/slices/productApiSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import { FaRegHeart } from "react-icons/fa";

const Cart = () => {
    const dispatch = useDispatch();
    const [addTodo] = useAddTodoMutation();
    const navigate = useNavigate();
    const [data, setData] = useState([]);

    const [visibleItems, setVisibleItems] = useState(8);
    const [visibleLength, setVisibleLength] = useState(17); // Başlangıçta 100 karakter göster

    // Başlangıçta görünen ürün sayısı

    const loadMore = () => {
        setVisibleItems(visibleItems + 8); // Her tıklamada 8 ürün daha göster
    };

    // Fetch products from backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://unity-women-backend.vercel.app/api/qolbaq/');
                setData(response.data.allQolbaq); // Set data with fetched products
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    // Function to handle adding product to cart
    const handleAddToCart = async (product) => {
        try {
            const itemWithDetails = { productId: product._id }; // Use product._id dynamically

            // Add the product to the cart using addTodo mutation
            const newTodo = await addTodo(itemWithDetails).unwrap();

            // Dispatch the new item to Redux state
            dispatch({ type: 'product/addTodo', payload: newTodo });

            // Navigate to dashboard after adding product to the cart
            navigate('/basket');
        } catch (err) {
            console.error('Failed to add the product to cart:', err);
            alert('Ürün sepete eklenemedi. Lütfen tekrar deneyin.');
        }
    };

    return (
        <div className="w-[95%] mx-auto p-6">
            <div className="grid gap-6 dark:text-white grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                {data.length > 0 ? (
                    data.slice(0, visibleItems).map((product) => (
                        <div
                            key={product._id}
                            className="bg-white shadow-lg rounded-xl dark:bg-black border overflow-hidden p-6 flex flex-col items-center transition-transform transform hover:scale-105 relative" 
                        
                            
                        >
                            {/* Favori Ikonu */}
                            <button className="absolute top-4 right-4 p-2 rounded-full dark:text-white text-gray-950">
                                <FaRegHeart className="h-8 w-8 hover:text-blue-900" />
                            </button>

                            {/* Ürün Görseli */}
                            <img
                                src={product.thumbnail}
                                alt={product.title}
                                className="h-40 w-40 object-cover mb-6 rounded-lg"
                                onClick={() => navigate(`/product/${product._id}`)}
                            />

                            {/* Ürün Başlık ve Fiyat */}
                            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white text-center h-12 overflow-hidden">
                            {(product.title || "").slice(0, visibleLength)}
                            {visibleLength < (product.title || "").length && "..."}                            </h3>
                           
                            <h4 className="text-lg font-semibold mb-4 dark:text-white text-gray-800">{product.price}₼</h4>

                            {/* Stok Durumu */}
                            <p
                                className={`text-base font-medium mb-4 ${product.stock > 0 ? "text-green-600" : "text-red-600"
                                    }`}
                            >
                                {product.stock > 0 ? "Stokta Var" : "Stokta Yok"}
                            </p>

                            {/* Sepete Ekle Butonu */}
                            <button
                                onClick={() => handleAddToCart(product)}
                                disabled={product.stock === 0}
                                className={`w-full py-3 rounded-lg text-white ${product.stock === 0
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700"
                                    } transition-colors duration-200`}
                            >
                                {product.stock === 0 ? "Stokta Yok" : "Sepete Ekle"}
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-center dark:text-white text-gray-600">Ürünler yükleniyor...</p>
                )}
            </div>

            {/* Daha Fazla Göster butonu */}
            {visibleItems < data.length && (
                <div className="flex justify-center mt-6">
                    <button
                        onClick={loadMore}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                        Daha Fazla Göster
                    </button>
                </div>
            )}
        </div>

    );
};









export default Cart;
