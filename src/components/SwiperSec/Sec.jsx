import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // Swiper'ın CSS'i
import "swiper/css/effect-coverflow";
import 'swiper/css/pagination';
import 'swiper/css/navigation'; // Navigation için CSS
import { EffectCoverflow, Navigation ,Autoplay} from 'swiper/modules';

const Sec = () => {
    // Sabit resim bağlantıları
    const images = [
        "https://unitywomen.com/assets/images/17151633908ad27cd6-dcf2-4b52-9f37-80cfa57a695c.jpeg",
        "https://unitywomen.com/assets/images/1725358631Sage%20Green%20Minimalist%20Business%20Proposal%20Presentation.zip%20-%204.png",
        "https://unitywomen.com/assets/images/17151634310f9233f3-112b-4e14-a05f-83f1c1ec17df.jpeg",
        "https://unitywomen.com/assets/images/fLmDSage%20Green%20Minimalist%20Business%20Proposal%20Presentation.zip%20-%207.png",
        "https://unitywomen.com/assets/images/1725358661Sage%20Green%20Minimalist%20Business%20Proposal%20Presentation.zip%20-%201.png",
        "https://unitywomen.com/assets/images/1715163340f1989c4f-9a85-4fbd-b37e-10d9b6c52779.jpeg",
        "https://unitywomen.com/assets/images/1715163524e75e9c08-1477-42bd-bb24-0bd54db7650b.jpeg"
    ];

    const photo = [
        "https://unitywomen.com/assets/images/2AqG2125.jpg",
        "https://unitywomen.com/assets/images/U8hd44.jpg"
    ];

    return (
        <section className="p-6 md:p-12 dark:bg-black dark:text-white text-black">
            {/* Başlık */}
            <h2 className="text-3xl font-bold text-center mb-12">
                Fotoğraf Galerisi
            </h2>

            {/* Flex Container: Galerilerin yan yana gösterileceği container */}
            <div className="flex flex-wrap justify-center gap-6">

                {/* Ana Slider: Images Galerisi */}
                <div className="w-full md:w-[45%]">
                    <Swiper
                        effect={'coverflow'} // Coverflow efekti
                        grabCursor={true} // Kursoru 'drag' yapabilme
                        centeredSlides={true} // Slaytları ortalamak
                        slidesPerView={'auto'} // Slaytlar arasındaki genişliği otomatik yapmak
                        coverflowEffect={{
                            rotate: 50, // Döndürme açısı
                            stretch: 20, // Slaytlar arasındaki mesafe
                            depth: 100, // Derinlik
                            modifier: 1, // Efektin şiddeti
                            slideShadows: true, // Slayt gölgeleri
                        }}
                        autoplay={{
                            
                            delay: 4000, 
                            disableOnInteraction: false, // Kullanıcı etkileşimi olsa bile autoplay devam eder
                        }}
                        speed={2000}
                        loop={true} // Resimler arasında döngü yapılması
                        pagination={false} // Sayfalama özelliğini kapat
                        navigation={true} // Sağ ve sol ok simgelerini ekler
                        modules={[EffectCoverflow, Autoplay, Navigation]} // Swiper modülleri
                        className="rounded-lg shadow-lg"
                    >
                        {images.map((src, index) => (
                            <SwiperSlide key={index}>
                                <div className="p-3 relative group h-[400px] flex flex-col items-center overflow-hidden bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg">
                                    <div className="w-full h-full relative overflow-hidden rounded-lg">
                                        <img
                                            src={src} // Sabit resim URL'si
                                            alt={`Image ${index + 1}`}
                                            className="w-full h-full object-contain object-center transition-transform duration-500 transform group-hover:scale-105"
                                        />
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* İkinci Galeri: Photo Galerisi */}
                <div className="w-full md:w-[45%]">
                    <div className="flex flex-col gap-6">
                        {photo.map((src, index) => (
                            <div
                                key={index}
                                className="relative group overflow-hidden rounded-lg shadow-lg border border-gray-300 dark:border-gray-700"
                            >
                                <img
                                    src={src}
                                    alt={`Photo ${index + 1}`}
                                    className="w-full h-[185px] object-cover object-center transition-transform duration-500 transform group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity"></div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Sec;
