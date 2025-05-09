import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';
import EtirComment from './Commet/EtirComment';
import { useSelector } from 'react-redux';

const Baxim = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { catagory } = useParams(); // URL'den kategori bilgisini alıyoruz
    const navigate = useNavigate();

    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);
   

    const { userInfo } = useSelector((state) => state.auth);

 

    useEffect(() => {
        const fetchItems = async () => {
          try {
            let url = `https://unitywomenbackend-94ca2cb93fbd.herokuapp.com/api/qolbaq/catagory/${catagory}`;
      
            if (userInfo && userInfo._id) {
              url += `/${userInfo._id}`;
            }
      
            const res = await axios.get(url);
            setItems(res.data.allQolbaq);
          } catch (error) {
            if (error.response && error.response.status === 404) {
              setItems([]);
            } else {
              setError(error.message);
            }
          } finally {
            setLoading(false);
          }
        };
      
        fetchItems();
      }, [catagory, userInfo]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Yüklənir...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen">Xəta: {error}</div>;
    }

    return (
        <div className="container mx-auto py-12">
            <h1 className="text-3xl font-bold text-center mb-10" data-aos="fade-up">
                {catagory} Kategorisi
            </h1>
            <div
                style={{ marginBottom: "60px" }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
                {items.length > 0 ? (
                    items.map((item) => (
                        <div
                            key={item._id}
                            className="bg-white shadow-lg rounded-lg p-6"
                            data-aos="fade-up"
                        >
                              <div className="flex justify-center mb-4 sm:mb-6 w-full">
                                {Array.isArray(item.photo) && item.photo.length > 0 ? (
                                    <div className="relative w-full h-64 sm:h-80">
                                        <img
                                            src={item.photo[0]} // Sadece ilk fotoğrafı göster
                                            alt={`item-image`}
                                            className="object-cover w-full h-full rounded-md cursor-pointer"
                                            onClick={() => navigate(`/product/${item._id}`)} // Fotoğrafa tıklandığında ürün sayfasına git
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full h-64 sm:h-80 flex items-center justify-center">
                                        <img
                                            src={item.photo}
                                            alt={item.title}
                                            className="object-cover w-full h-full rounded-md cursor-pointer"
                                            onClick={() => navigate(`/product/${item._id}`)} // Fotoğrafa tıklandığında ürün sayfasına git
                                        />
                                    </div>
                                )}
                            </div>
                    
                            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                            <p className="text-gray-600 mb-4">Qiymət: {item.discountApplied ? (
                                <>
                                    <span className="text-red-500 line-through mr-2">
                                        {item.originalPrice}₼
                                    </span>
                                    <span className="text-green-600">{item.price}₼</span>
                                </>
                            ) : (
                                <span>{item.price}₼</span>
                            )}</p>                            <button
                                onClick={() => navigate(`/product/${item._id}`)}
                                className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded"
                            >
                                Məhsul Haqqında.
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="text-center col-span-full">Məhsul yoxdu.</div>
                )}
            </div>
            <EtirComment/>
        </div>
    );
};

export default Baxim;
