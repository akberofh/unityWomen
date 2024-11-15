import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAddTodoMutation } from "../../redux/slices/productApiSlice";
import { useDispatch } from "react-redux";
import axios from "axios";

const Cart = () => {
    const dispatch = useDispatch();
    const [addTodo] = useAddTodoMutation();
    const navigate = useNavigate();
    const [data, setData] = useState([]);

    // Fetch products from backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/qolbaq/');
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
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-semibold text-center mb-6">Sepete Ürün Ekle</h2>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {data.length > 0 ? (
                    data.map((product) => (
                        <div
                            key={product._id}
                            className="bg-white shadow-md rounded-lg overflow-hidden p-4 flex flex-col items-center"
                        >
                            <img
                                src={product.thumbnail}
                                alt={product.title}
                                className="h-48 w-full object-cover mb-4 rounded-md"
                            />
                            <h3 className="text-lg font-medium mb-2 text-gray-800">{product.title}</h3>
                            <p className="text-gray-600 mb-2">Stok: {product.stock}</p>
                            <button
                                onClick={() => handleAddToCart(product)}
                                disabled={product.stock === 0}
                                className={`px-4 py-2 mt-auto rounded text-white ${
                                    product.stock === 0
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700"
                                }`}
                            >
                                {product.stock === 0 ? "Stokta Yok" : "Sepete Ekle"}
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-600">Ürünler yükleniyor...</p>
                )}
            </div>
        </div>
    );
};

export default Cart;
