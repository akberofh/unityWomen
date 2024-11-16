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
        // React Icons'dan FaHeart'ı import ediyoruz

  
        <div className=" w-[95%] mx-auto p-6">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2  lg:grid-cols-4 xl:grid-cols-5">
          {data.length > 0 ? (
            data.map((product, index) => (
              <div
                key={product._id}
                className={`bg-white shadow-lg rounded-xl overflow-hidden p-6 flex flex-col items-center transition-transform transform hover:scale-105 relative`}
              >
                {/* Favori Ikonu */}
                <button className="absolute top-4 right-4 p-2 rounded-full text-gray-400">
  <FaRegHeart className="h-8 w-8  hover:text-red-600"/>
</button>

      
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="h-60 w-60 object-cover mb-6 rounded-lg"
                />
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{product.title}</h3>
                <p className={`text-lg font-semibold mb-4 ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                  {product.stock > 0 ? "Stokta Var" : "Stokta Yok"}
                </p>
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                  className={`px-6 py-3 rounded-lg text-white ${
                    product.stock === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  } transition-colors duration-200`}
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
