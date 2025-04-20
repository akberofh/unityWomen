import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useAddTodoMutation } from '../../redux/slices/productApiSlice';
import { useNavigate } from 'react-router-dom';
import { FaRegHeart } from "react-icons/fa";



const Catos = ({ catagory }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visibleItems, setVisibleItems] = useState(8);
    const dispatch = useDispatch();
    const [addTodo] = useAddTodoMutation();
    const navigate = useNavigate();
    const [visibleLength, setVisibleLength] = useState(17); // Başlangıçta 100 karakter göster

    const loadMore = () => {
        setVisibleItems(visibleItems + 8); // Her tıklamada 8 ürün daha göster
    };

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

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('https://unity-women-backend.vercel.app/api/qolbaq'); // Ürünleri çek
                const data = response.data.allQolbaq;
                if (data && data.length > 0) {
                    // Gelen ürünleri kategoriye göre filtrele
                    const filteredProducts = data.filter((item) => item.catagory === catagory);
                    setProducts(filteredProducts);
                }
            } catch (error) {
                console.error('Ürünler alınırken hata oluştu:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [catagory]);

    if (loading) {
        return <div>Yüklənir...</div>;
    }

    if (products.length === 0) {
        return <div>Kateqoriyə uyğun başqa məhsul yoxdur.</div>;
    }

    return (

        <div className="w-[97%] mx-auto p-4 sm:p-6">
        <div className="grid gap-4 sm:gap-6 dark:text-white grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {products.length > 0 ? (
            products.slice(0, visibleItems).map((product) => (
              <div
                key={product._id}
                className="bg-white shadow-lg rounded-lg dark:bg-gray-800 border overflow-hidden p-4 sm:p-6 flex flex-col items-center transition-transform transform hover:scale-105 relative"
              >
                {/* Favori Ikonu */}
                <button className="absolute top-4 right-4 p-2 rounded-full dark:text-white text-gray-950">
                  <FaRegHeart className="h-6 w-6 sm:h-8 sm:w-8 hover:text-blue-900" />
                </button>
      
                {/* Ürün Görseli */}
                <div className="flex justify-center mb-4 sm:mb-6 w-full">
  {Array.isArray(product.photo) && product.photo.length > 0 ? (
    <div className="relative w-full h-64 sm:h-80">
      <img
        src={product.photo[0]} // Sadece ilk fotoğrafı göster
        alt={`product-image`}
        className="object-cover w-full h-full rounded-md cursor-pointer"
        onClick={() => navigate(`/product/${product._id}`)} // Fotoğrafa tıklandığında ürün sayfasına git
      />
    </div>
  ) : (
    <div className="w-full h-64 sm:h-80 flex items-center justify-center">
      <img
        src={product.photo}
        alt={product.title}
        className="object-cover w-full h-full rounded-md cursor-pointer"
        onClick={() => navigate(`/product/${product._id}`)} // Fotoğrafa tıklandığında ürün sayfasına git
      />
    </div>
  )}
</div>
      
                {/* Ürün Başlık ve Fiyat */}
                <h3 className="text-sm sm:text-lg font-semibold mb-2 text-gray-800 dark:text-white text-center h-10 overflow-hidden">
                  {(product.title || "").slice(0, visibleLength)}
                  {visibleLength < (product.title || "").length && "..."}
                </h3>
      
                <h4 className="text-sm sm:text-lg font-semibold mb-4 dark:text-white text-gray-800">
                  {product.price}₼
                </h4>
      
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
              Məhsullar yüklənir...
            </p>
          )}
        </div>
      
        {/* Daha Fazla Göster Butonu */}
        {visibleItems < products.length && (
          <div className="flex justify-center mt-6">
            <button
              onClick={loadMore}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Daha Çox Gösdər
            </button>
          </div>
        )}
      </div>
    );
};

export default Catos;
