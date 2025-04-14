import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAddTodoMutation } from "../../redux/slices/productApiSlice";
import {  useAddsTodoMutation } from "../../redux/slices/todoApiSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import { FaRegHeart } from "react-icons/fa";

const Cart = () => {
    const dispatch = useDispatch();
    const [addTodo] = useAddTodoMutation();
    const [addTodoo] = useAddsTodoMutation();
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
            console.log(response.data); // Gelen veriyi kontrol et
            setData(response.data.allQolbaq || []); // Eğer undefined ise boş dizi ata
        } catch (error) {
            console.error('Error fetching data:', error);
            setData([]); // Hata durumunda boş dizi ata
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



    const handleAddToFavorie = async (product) => {
   
  
      try {
          const itemWithDetails = { productId: product._id };
  
          // API çağrısı
          const newFavorie = await addTodoo(itemWithDetails).unwrap();
  
          // Redux'a ekle
          dispatch({ type: 'favorie/add', payload: newFavorie });
  
          // Favoriler sayfasına yönlendir
          navigate('/favorie');
      } catch (err) {
          console.error('Failed to add the product to favorie:', err);
          alert(err.data?.error || 'Ürün favorilere eklenemedi. Lütfen tekrar deneyin.');
      }
  };
  
  

    return (
<div className="w-[97%] mx-auto p-4 sm:p-6">
  <div className="grid gap-4 sm:gap-6 dark:text-white grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
    {data.length > 0 ? (
      data.slice(0, visibleItems).map((product) => (
        <div
          key={product._id}
          className="bg-white shadow-lg rounded-lg dark:bg-gray-800 border overflow-hidden p-4 sm:p-6 flex flex-col items-center transition-transform transform hover:scale-105 relative"
        >
          {/* Favori Ikonu */}
          <button onClick={() => handleAddToFavorie(product)} className="absolute top-4 right-4 p-2 rounded-full dark:text-white text-gray-950">
            <FaRegHeart className="h-6 w-6 sm:h-8 sm:w-8 hover:text-blue-900" />
          </button>

          {/* Ürün Görseli */}
          <img
            src={product.photo}
            alt={product.title}
            className="h-28 w-28 sm:h-40 sm:w-40 object-cover mb-4 sm:mb-6 rounded-md"
            onClick={() => navigate(`/product/${product._id}`)}
          />

          {/* Ürün Başlık ve Fiyat */}
          <h3 className="text-sm sm:text-lg font-semibold mb-2 text-gray-800 dark:text-white text-center h-10 overflow-hidden">
            {(product.title || "").slice(0, visibleLength)}
            {visibleLength < (product.title || "").length && "..."}
          </h3>

          <h4 className="text-sm sm:text-lg font-semibold mb-4 dark:text-white text-gray-800">
            {product.price}₼
          </h4>

          {/* Stok Durumu */}
          <p
            className={`text-sm sm:text-base font-medium mb-4 ${product.stock > 0 ? "text-green-600" : "text-red-600"
              }`}
          >
            {product.stock > 0 ? "Stokta Var" : "Stokta Yok"}
          </p>

          {/* Sepete Ekle Butonu */}
          <button
            onClick={() => handleAddToCart(product)}
            disabled={product.stock === 0}
            className={`w-full py-2 sm:py-3 rounded-lg text-white ${product.stock === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
              } transition-colors duration-200`}
          >
            {product.stock === 0 ? "Stokta Yok" : "Sepete Ekle"}
          </button>
        </div>
      ))
    ) : (
      <p className="text-center dark:text-white text-gray-600">
        Ürünler yükleniyor...
      </p>
    )}
  </div>

  {/* Daha Fazla Göster Butonu */}
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
