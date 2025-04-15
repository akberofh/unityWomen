import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // Swiper'ın CSS'i
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation"; // Navigation için CSS
import { EffectCoverflow, Navigation, Autoplay } from "swiper/modules";

const Sec = () => {
  const images = [
    "https://unitywomen.com/assets/images/1740237994Minimalist%20Website%20Launch%20Computer%20Mockup%20Instagram%20Post.png",
    "https://unitywomen.com/assets/images/1740238098%C3%9Cz%20baxim%20vasi.png",
    "https://unitywomen.com/assets/images/1740239328%C3%9Cz%20baxim%20vasi.png",
    "https://unitywomen.com/assets/images/1740240107%C3%9Cz%20baxim%20vasi.png",
    "https://unitywomen.com/assets/images/1740240181Minimalist%20Website%20Launch%20Computer%20Mockup%20Instagram%20Post.png",
    "https://unitywomen.com/assets/images/1740240274Untitled%20design.png",
    "https://unitywomen.com/assets/images/1740240641%C3%9Cz%20baxim%20vasi.png",
  ];

  const photo = [
    "https://unitywomen.com/assets/images/2AqG2125.jpg",
    "https://unitywomen.com/assets/images/U8hd44.jpg",
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
                <div className="p-3 relative group  aspect-w-4 aspect-h-3 flex items-center overflow-hidden bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg">
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
