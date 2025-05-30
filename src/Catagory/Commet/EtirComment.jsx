import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';

const EtirComment = () => {
  const [charms, setCharms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { catagory } = useParams();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  useEffect(() => {
    const fetchreviews = async () => {
      try {
        const res = await axios.get(`https://unitywomenbackend-94ca2cb93fbd.herokuapp.com/api/reviews/${catagory}`);
        setCharms(res.data.reviews);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setCharms([]); // Yorum yok durumunda boş liste olarak ayarla
        } else {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchreviews();
  }, [catagory]);
  

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Yüklənir...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen">Xəta: {error}</div>;
  }

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-gray-100 py-14 sm:pb-24">
      <div className="container px-4 mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 sm:text-4xl">
          Müşdəri Rəyləri ve Qiyməntləndirməsi
          </h2>
          <p className="text-center text-gray-600">
          Müşdərilərimizin məhsul ve xidmətlərimizlə bağlı rəyləri burada yer alır.
          </p>
        </div>

        {charms.length === 0 ? (
          <div className="text-center text-gray-700">
            <p>Bu kateqoriye aid rəy yoxdur.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {charms.map((review, index) => (
              <div
                key={index}
                className="bg-white dark:bg-black border dark:text-white rounded-lg shadow-md p-6"
              >
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    <div className="rounded-full w-12 h-12 bg-gray-300 dark:text-white flex items-center justify-center">
                      {review.name.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-800 dark:text-white">{review.name}</p>
                    <p className="text-sm text-gray-600 sm:w-[377px] dark:text-white">{review.email}</p>
                  </div>
                </div>
                <div className="border-t border-gray-300 dark:border-gray-600 my-4"></div>

                <div className="flex items-center mb-2">
                  {[...Array(parseInt(review.rating))].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.543L0 6.908l6.561-.955L10 0l3.439 5.953L20 6.908l-5.245 4.639 1.123 6.543z" />
                    </svg>
                  ))}
                </div>
                <div className="border-t border-gray-300 dark:border-gray-600 my-4"></div>

                <p className="text-gray-700 dark:text-white">
                  Rəy: {truncateText(review.review, 40)}
                </p>
                <div className="border-t border-gray-300 dark:border-gray-600 my-4"></div>

                <p className="text-gray-700 dark:text-white">Kateqoriya: {review.catagory}</p>
                <div className="border-t border-gray-300 dark:border-gray-600 my-4"></div>

                <p className="text-sm text-gray-500 mt-2 dark:text-white">
                  Göndərilmə Tarixi:{' '}
                  {review.addedAt ? new Date(review.addedAt).toLocaleString() : 'Belirtilmemiş'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EtirComment;
