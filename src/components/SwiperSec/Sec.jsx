import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; 
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation"; 
import { EffectCoverflow, Navigation, Autoplay } from "swiper/modules";

const Sec = () => {
  const images = [
    "https://i.ibb.co/BV5BSqD8/Whats-App-kil-2025-05-01-saat-21-26-41-4998bc2f.jpg",
    "https://i.ibb.co/whJDLVRd/Whats-App-kil-2025-05-01-saat-21-26-41-099a80b4.jpg",
    "https://i.ibb.co/KcK9tYGK/Whats-App-kil-2025-05-01-saat-21-26-41-6dbb6de3.jpg",
    "https://i.ibb.co/0yQC38hN/Whats-App-kil-2025-05-01-saat-21-26-43-8883a49c.jpg",
    "https://i.ibb.co/MD92wyjB/Whats-App-kil-2025-05-01-saat-21-26-42-ee5cc419.jpg",
    "https://i.ibb.co/N6MSqQfL/Whats-App-kil-2025-05-01-saat-21-26-42-c4198946.jpg",
    "https://i.ibb.co/v6y6GFgS/Whats-App-kil-2025-05-01-saat-21-26-42-75d82e2f.jpg",
  ];

  const photo = [
    "https://i.ibb.co/TBLnz8Pr/Whats-App-kil-2025-05-01-saat-21-26-43-ea8baf9d.jpg",
    "https://i.ibb.co/M5Z4zS6F/Whats-App-kil-2025-05-01-saat-21-26-43-493f8e15.jpg",
  ];

  return (
    <section className="p-6 md:p-12 dark:bg-black dark:text-white text-black">
      <h2 className="text-3xl font-bold text-center mb-12">Fotoğraf Galerisi</h2>
      <div className="flex flex-wrap justify-center gap-6">
        <div className="w-full md:w-[97%] lg:w-[60%]">
          <Swiper
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
            coverflowEffect={{
              rotate: 50,
              stretch: 20,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            speed={1000}
            loop={true}
            pagination={false}
            navigation={true}
            modules={[EffectCoverflow, Autoplay, Navigation]}
            className="rounded-lg shadow-lg"
          >
            {images.map((src, index) => (
              <SwiperSlide key={index}>
                <div className="p-3 relative h-96 w-full group  aspect-w-4 aspect-h-3 flex items-center overflow-hidden bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg">
                  <img
                    src={src}
                    alt={`Image ${index + 1}`}
                    className="w-full h-full object-contain transition-transform duration-500 transform group-hover:scale-105"
                  />


                </div>

              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="w-full md:w-[90%] lg:w-[35%] flex flex-col gap-6">
          {photo.map((src, index) => (
            <div
              key={index}
              className="relative group overflow-hidden rounded-lg shadow-lg border border-gray-300 dark:border-gray-700"
            >
              <img
                src={src}
                alt={`Photo ${index + 1}`}
                className="w-full h-[200px] sm:h-[250px] lg:h-[238px] object-cover object-center transition-transform duration-500 transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Sec;
