import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './Detalp.module.scss';
import { FaStar } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductCard from '../../pages/Cart/Cart';
import { useAddTodoMutation } from "../../redux/slices/productApiSlice";
import { useDispatch } from "react-redux";

const Detalp = () => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { qolbaq_id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [visibleLength, setVisibleLength] = useState(100); // Başlangıçta 100 karakter göster

    const handleShowMore = () => {
        setVisibleLength((prev) => prev + 700); // Her tıklamada 100 karakter daha ekle
    };

    const handleShowLess = () => {
        setVisibleLength(100); // Reset to the default 100 characters
    };

    const isFullVisible = visibleLength >= product?.description?.length;

    const [addTodo] = useAddTodoMutation();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`https://unity-women-backend.vercel.app/api/qolbaq/${qolbaq_id}`);
                const data = response.data;
                if (data && data.getById) {
                    setProduct(data.getById);
                } else {
                    setError('Ürün bulunamadı.');
                }
            } catch (error) {
                console.error('Ürün alınırken hata oluştu:', error);
                setError('Ürün detayları alınırken bir hata oluştu.');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [qolbaq_id]);

    const handleAddToCart = async (product) => {
        try {
            const itemWithDetails = { productId: product._id }; // Ürün ID'si ile sepete ekleme

            // Sepete ekleme işlemi
            const newTodo = await addTodo(itemWithDetails).unwrap();

            // Redux'a yeni öğeyi ekle
            dispatch({ type: 'product/addTodo', payload: newTodo });

            // Sepete ekleme işlemi başarılıysa, sepete yönlendir
            navigate('/basket');
        } catch (err) {
            console.error('Sepete ekleme hatası:', err);
            toast.error('Ürün sepete eklenemedi. Lütfen tekrar deneyin.');
        }
    };

    // Yükleniyor, hata, veya ürün bulunamadı durumları
    if (loading) {
        return <div className={styles.loading}>Yükleniyor...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    if (!product) {
        return <div className={styles.error}>Ürün bulunamadı.</div>;
    }

    return (
        <div className="dark:bg-black text-gray-800 min-h-screen">
            <div className="container mx-auto px-4 lg:px-16 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Ürün Görseli */}
                    <div className="flex  justify-center items-center">
                        <img
                            src={product.thumbnail}
                            alt={product.title}
                            className="w-full max-w-md lg:max-w-lg object-cover rounded-lg shadow-md"
                        />
                    </div>

                    {/* Ürün Detayları */}
                    <div className="flex dark:text-white flex-col justify-center">
                        <h1 className="text-3xl font-semibold mb-4">{product.title}</h1>
                        <p className="text-xl text-blue-600 font-semibold mb-6">Fiyat: {product.price}$</p>
                        <p className="text-lg mb-4">Stok Durumu: {product.stock > 0 ? "Var" : "Yok"}</p>
                        <div className="text-gray-700 dark:text-white mb-6">
                            {/* Açıklama Metni */}
                            <p>
                                {(product.description || "").slice(0, visibleLength)}
                                {visibleLength < (product.description || "").length && "..."}
                            </p>


                            {/* Butonlar */}
                            <div className="mt-2">
                                {!isFullVisible && (
                                    <button
                                        onClick={handleShowMore}
                                        className="text-blue-600 font-semibold mr-4"
                                    >
                                        Daha Fazla Göster
                                    </button>
                                )}
                                {visibleLength > 100 && (
                                    <button
                                        onClick={handleShowLess}
                                        className="text-blue-600 font-semibold"
                                    >
                                        Daha Az Göster
                                    </button>
                                )}
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 italic mb-6">Kategori: {product.catagory}</p>
                        <div className="flex items-center gap-1 text-yellow-500 text-xl mb-8">
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                        </div>
                        <button
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stock === 0}
                            className={`py-3 w-[250px] px-6 rounded-lg  font-semibold text-white shadow-md transition ${product.stock === 0
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                                }`}
                        >
                            {product.stock === 0 ? "Stokta Yok" : "Sepete Ekle"}
                        </button>
                        <div className='h-[20px]'></div>
                        <button
                            onClick={() => (product)}
                            className="py-3 w-[250px] px-6 bg-green-700  hover:bg-green-900  rounded-lg font-semibold text-white shadow-md transition"
                          >
                           Sevimlilere Ekle
                        </button>
                    </div>
                </div>

                {/* Diğer Ürünler */}
            </div>
                <div className="mt-16 dark:text-white w-[95%]">
                    <h2 className="text-2xl dark:text-white font-semibold mb-8">Diğer Ürünler</h2>
                    <ProductCard />
                </div>

            {/* Toast Bildirimi */}
            <ToastContainer />
        </div>
    );
};

export default Detalp;
