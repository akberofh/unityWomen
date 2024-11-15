import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styles from './Detalp.module.scss';
import { FaStar } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductCard from '../../pages/Cart/Cart';
import { useAddTodoMutation } from "../../redux/slices/productApiSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";


const Detalp = () => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { qolbaq_id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

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
        <div className={styles.detailContent}>
            <div className={styles.productDetails}>
                <img src={product.thumbnail} alt={product.title} className={styles.image} />
                <div className={styles.info}>
                    <h1 className={styles.title}>{product.title}</h1>
                    <p className={styles.price}>Fiyat: {product.price}$</p>
                    <p className={styles.price}>Stock: {product.stock}</p>
                    <p className={styles.description}>{product.description}</p>
                    <p className={styles.category}>Kategori: {product.catagory}</p>
                    <div className={styles.ratings}>
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                    </div>
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
            </div>
            <div className={styles.otherProducts}>
                <h1>DİĞER ÜRÜNLERİMİZİ GÖRÜNTÜLE</h1>
                <div className={styles.cards}>
                    <ProductCard />
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Detalp;
