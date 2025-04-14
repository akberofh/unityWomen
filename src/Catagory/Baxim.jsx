import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';
import EtirComment from './Commet/EtirComment';

const Baxim = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { catagory } = useParams(); // URL'den kategori bilgisini alıyoruz
    const navigate = useNavigate();

    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);

 

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await axios.get(`https://unity-women-backend.vercel.app/api/qolbaq/${catagory}`);
                setItems(res.data.allQolbaq); // API'den doğrudan filtrelenmiş veriyi alıyoruz
                setLoading(false);
            }   catch (error) {
                if (error.response && error.response.status === 404) {
                    setItems([]); // Yorum yok durumunda boş liste olarak ayarla
                } else {
                  setError(error.message);
                }
              } finally {
                setLoading(false);
              }
        };
        

        fetchItems();
    }, [catagory]); // Kategori değiştiğinde yeniden veri çeker

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Yükleniyor...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen">Hata: {error}</div>;
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
                            {item.photo && (
                                <img
                                    src={item.photo}
                                    alt="Thumbnail"
                                    className="w-full h-40 object-cover rounded-md mb-4"
                                />
                            )}
                            {item.thumbnail && (
                                <img
                                    src={item.thumbnail}
                                    alt="Thumbnail"
                                    className="w-full h-40 object-cover rounded-md mb-4"
                                />
                            )}
                            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                            <p className="text-gray-600 mb-4">{item.price}</p>
                            <button
                                onClick={() => navigate(`/product/${item._id}`)}
                                className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded"
                            >
                                Details
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="text-center col-span-full">Ürün bulunamadı.</div>
                )}
            </div>
            <EtirComment/>
        </div>
    );
};

export default Baxim;
