import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import {  Navigation, Scrollbar } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import { toast } from 'react-toastify';
import {
  useGetCatagoryQuery,
  useRemoveCatagoryMutation,
  useUpdateCatagoryMutation,
} from '../redux/slices/catagoryApiSlice';
import {
  removeCatagory,
  setCatagory,
  updateCatagory as updateCatagoryAction,
} from '../redux/slices/catagorySlice';

const Catagory = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data, error, isLoading } = useGetCatagoryQuery();
  const [deleteTodo] = useRemoveCatagoryMutation();
  const [updateCatagory] = useUpdateCatagoryMutation();

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
    if (data?.allCatagory) {
      dispatch(setCatagory(data.allCatagory));
    }
  }, [navigate, userInfo, data, dispatch]);

  if (isLoading) return <p>Yükleniyor...</p>;
  if (error) return <p>Hata: {error.message}</p>;
  if (!data?.allCatagory) {
    return <p>Kategori bulunamadı.</p>;
  }

  const categoryList = data.allCatagory;

  return (
    <div className="dark:bg-black bg-white w-full h-[120px] py-4 border-b flex justify-center items-center">
      <div className="w-[97%] flex justify-center items-center">
        <Swiper
          modules={[Navigation, Scrollbar]}
          navigation={false}
          spaceBetween={15}
          slidesPerView={10}
          loop={true}
          breakpoints={{
            300: { slidesPerView: 3 },
            340: { slidesPerView: 4 },
            440: { slidesPerView: 4 },
            640: { slidesPerView: 5 },
            768: { slidesPerView: 7 },
            1024: { slidesPerView: 10 },
          }}
        >
          {categoryList.map((category, index) => (
            <SwiperSlide
              key={category._id}
              className="flex justify-center h-[110px] flex-col items-center"
            >
              <a
                href={`/catagory/${category.title}`}
                className="text-center hover:scale-105 transition-transform duration-200"
              >
                <img
                  src={category.photo}
                  alt={category.title}
                  className="w-10 h-10 object-cover rounded-full shadow-lg mb-2 border-2 border-gray-300"
                />
                <p className="text-xs font-medium dark:text-white text-gray-700">
                  {category.title}
                </p>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Catagory;
