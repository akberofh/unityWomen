import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiSolidSun, BiSolidMoon } from "react-icons/bi";
import { FaUser, FaBars, FaShoppingCart, FaHeart, FaStar } from "react-icons/fa";
import UnityWomen from './1722665487WhatsApp_Görsel_2024-08-03_saat_10.08.37_83e97437-removebg.png';
import axios from "axios";
import { FaBarsStaggered } from "react-icons/fa6";
import { useSelector } from "react-redux";
import AOS from "aos";
import Catagory from "../../Catagory/Catagory";
import { useGetTodosQuery } from "../../redux/slices/productApiSlice";
import { useGetsTodosQuery } from "../../redux/slices/todoApiSlice";






const Header = ({ theme, setTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState(null);
  const { data: cartItems, isLoading } = useGetTodosQuery();
  const { data: favorites, isLoadingg } = useGetsTodosQuery();

  // Favorilerde kaç ürün olduğunu kontrol ediyoruz
  const favoriteCount = favorites?.length || 0;

  // Sepette ürün olup olmadığını kontrol ediyoruz
  const itemCount = cartItems?.length || 0;
  useEffect(() => {
    AOS.init();
  }, []);




  const { userInfo } = useSelector((state) => state.auth);


  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
      setPhoto(userInfo.photo);


    }
  }, [userInfo]);



  useEffect(() => {
    if (searchQuery.length >= 1) {
      setLoading(true);
      axios.get(`https://unity-women-backend.vercel.app/api/qolbaq?search=${searchQuery}`)
        .then(response => {
          setItems(response.data.allQolbaq); // API'den gelen verileri state'e kaydet
          setLoading(false);
        })

        .catch(error => {
          console.error('Error fetching items:', error);
          setLoading(false);
        });
    } else {
      setItems([]); // Arama yapılmazsa, sonuçları temizle
    }
  }, [searchQuery]);

  // Arama sonucunu harf bazında filtreleyin
  const filteredItems = items
    .filter((item) =>
      searchQuery.split("").every((letter) =>
        item.title.toLowerCase().includes(letter.toLowerCase())
      )
    )
    .map((item) => {
      // Her ürün için uyumlu harf sayısını hesapla
      const matchCount = searchQuery
        .split("")
        .reduce((acc, letter) => {
          return acc + (item.title.toLowerCase().includes(letter.toLowerCase()) ? 1 : 0);
        }, 0);

      return { ...item, matchCount };
    })
    .sort((a, b) => b.matchCount - a.matchCount); // searchQuery değiştikçe bu effect çalışacak




  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleCategoryMenu = () => {
    setIsCategoryMenuOpen(!isCategoryMenuOpen);
  };











  return (
    <header className="fixed top-0 left-0  h-[160px] z-10  shadow-md w-full dark:bg-black dark:text-white duration-300 ">










      <div className="w-full h-[80px] polsa mx-auto dark:border-b dark:bg-black dark:text-white flex justify-between items-center ">
        <div className="w-[90%] mx-auto flex justify-between items-center">
          {/* Logo ve Menü */}
          <div className="flex w-full items-center justify-between h-20">
            {/* Logo Sol Taraf */}
            <div className="text-xl font-bold text-blue-600">
              <Link to='/'>
                <img
                  src={UnityWomen}
                  alt="Unity Women"

                  className="w-auto h-20 object-cover bg-transparent"
                />
              </Link>
            </div>

            {/* Ana Menü ve Kategoriler Sağ Taraf */}
            <nav className="hidden md:flex space-x-6">
              <Link
                to="/favorie"
                className="text-white dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                data-aos="custom-border"
                data-aos-duration="1000"
              >
                Sevimliler
              </Link>
              <Link
                to="/about"
                className="text-white dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                data-aos="custom-border"
                data-aos-duration="1000"
              >
                Haqqımızda
              </Link>
              <Link
                to="/contact"
                className="text-white dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                data-aos="custom-border"
                data-aos-duration="1000"
              >
                Əlaqə
              </Link>
              <Link
                to="/confirmed"
                className="text-white dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                data-aos="custom-border"
                data-aos-duration="1000"
              >
                Sifarişlərim
              </Link>
            </nav>

            {/* Sağ Taraf - Sepet, Favoriler ve Tema Değiştirme */}


            {/* Mobil Menü Butonu */}
            <div className="md:hidden flex items-center justify-center gap-6 z-20">
              {/* Sepet */}
              <div className="relative group flex items-center">
                <button className="text-white dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                  <Link to="/basket">
                    <FaShoppingCart className="w-6 h-6" />
                  </Link>
                </button>

                {/* Sepette ürün varsa ürün sayısını göster */}
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {itemCount}
                  </span>
                )}

                {/* Sepet boşsa üzerine gelindiğinde "Sepet Boş" yazısını göster */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {isLoading ? "Yükleniyor..." : itemCount === 0 ? "Sepet Boş" : "Sepetinizde Ürün Var"}
                </div>
              </div>

              {/* Favoriler */}
              <div className="relative group flex items-center">
                <button className="text-white dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                  <Link to="/favorie">
                    <FaHeart className="w-6 h-6" />
                  </Link>
                </button>

                {/* Favoriler doluysa ürün sayısını göster */}
                {favoriteCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {favoriteCount}
                  </span>
                )}

                {/* Favoriler boşsa üzerine gelindiğinde "Favoriler Boş" yazısını göster */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {isLoadingg ? "Yükleniyor..." : favoriteCount === 0 ? "Favoriler Boş" : "Favorileriniz Var"}
                </div>
              </div>

              {/* Tema Değiştirme */}
              <div className="flex items-center">
                {theme === "dark" ? (
                  <BiSolidSun onClick={() => setTheme("light")} className="text-2xl cursor-pointer" />
                ) : (
                  <BiSolidMoon onClick={() => setTheme("dark")} className="text-2xl text-white cursor-pointer" />
                )}
              </div>

              {/* Menü Aç/Kapat */}
              <div className="flex items-center">
                <button onClick={toggleMenu} className="text-white dark:text-white">
                  {isMenuOpen ? <FaBarsStaggered size={24} /> : <FaBars size={24} />}
                </button>
              </div>
            </div>


          </div>
        </div>

        {/* CSS: Mobilde butonları gizleme */}
        <style jsx>{`
    .salamiconn {
      display: none; /* Varsayılan olarak gizle */
    }
      .vapo{
          background-color: #434A4F;

      }
  .polsa{
    background-color: #383E42;
  }

    @media (max-width: 768px) {
      .salamiconn {
        display: block; /* Ekran genişliği 768px veya daha küçükse göster */
      }
    }
  `}</style>
      </div>






      {/* Mobil Menü Açıldığında Görüntülenen Kategoriler ve İkonlar */}
      {isMenuOpen && (
        <div
          className={`md:hidden bg-white dark:bg-black py-6 px-8 space-y-6 transform transition-transform duration-300 ease-in-out fixed top-0 left-0 h-full z-20 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="relative text-center">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Profil</h1>

            {userInfo && userInfo.photo ? (
              userInfo.photo.startsWith('data:image/') ? (
                // Base64 formatında resim varsa
                <img
                  src={userInfo.photo}
                  alt="Profil"
                  className="w-32 h-32 object-cover mx-auto rounded-full mt-4"
                />
              ) : (
                // URL formatında resim varsa
                <img
                  src={`data:image/jpeg;base64,${userInfo.photo}`} // Elle base64 ekliyoruz
                  alt="Profil"
                  className="w-24 h-24 object-cover mx-auto rounded-full shadow-lg mb-4"
                />
              )
            ) : (
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4" />
            )}




            {userInfo && userInfo.name && userInfo.email ? (
              <>
                <div className="border-t border-gray-300 dark:border-gray-600 my-4"></div>

                {/* Ad Soyad */}
                <div className="flex flex-col space-y-1">
                  <label className="text-lg font-semibold text-gray-600 dark:text-gray-300">Ad</label>
                  <h2 className="text-xl text-gray-800 dark:text-white">{userInfo.name}</h2>
                </div>

                <div className="border-t border-gray-300 dark:border-gray-600 my-4"></div>

                {/* Email */}
                <div className="flex flex-col space-y-1 mt-4">
                  <label className="text-lg font-semibold text-gray-600 dark:text-gray-300">Email</label>
                  <h2 className="text-xl text-gray-800 dark:text-white">{userInfo.email}</h2>
                </div>
              </>
            ) : (
              <div className="mt-6">
                <Link
                  to="/login"
                  className="bg-blue-500  text-white px-6 py-3 rounded-lg text-xl hover:bg-blue-600"
                >
                  Giriş Et
                </Link>

                <div className=" h-6"></div>

                <div className="mt-4">
                  <Link
                    to="/register"
                    className="bg-green-500 text-white px-6 py-3 rounded-lg text-xl hover:bg-green-600"
                  >
                    Qeydiyyatdan Keç
                  </Link>
                </div>
              </div>
            )}
          </div>


          <div className="border-t border-gray-300 dark:border-gray-600 my-4"></div>


          {/* Kategoriler Menüsü */}



          {/* Linkler */}
          <div className="space-y-4 mt-6">
            <Link to="/favorie" className="block text-lg text-gray-700 dark:text-white py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" data-aos="custom-border"
              data-aos-duration="1000">Sevimliler</Link>
            <Link to="/about" className="block text-lg text-gray-700 dark:text-white py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" data-aos="custom-border"
              data-aos-duration="1000">Haqqımızda</Link>
            <Link to="/contact" className="block text-lg text-gray-700 dark:text-white py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" data-aos="custom-border"
              data-aos-duration="1000">Əlaqə</Link>
            <Link to="/confirmed" className="block text-lg text-gray-700 dark:text-white py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" data-aos="custom-border"
              data-aos-duration="1000">Sifarişlərim</Link>
          </div>
        </div>
      )}




      <div className="w-full bg-gray-700 mx-auto dark:border-b vapo  dark:bg-black dark:text-white    h-[80px] flex justify-between items-center">
        <div className="w-[90%] mx-auto  flex justify-between items-center">
          {/* Arama Inputu Sol Taraf */}
          <div className="search-containerr   w-[600px] relative">
            <input
              type="text"
              placeholder="Arama yap..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Input değiştiğinde queryyi güncelle
              className="search-input  dark:text-white  dark:bg-black p-2 w-full border rounded-md outline-none"
            />
            {searchQuery.length > 0 && (
              <ul className="search-results absolute top-full left-0 w-full bg-white dark:bg-black shadow-md rounded-lg max-h-80 overflow-y-auto mt-1 z-10">
                {loading ? (
                  <p className="text-center text-gray-500">Yükleniyor...</p>
                ) : filteredItems.length > 0 ? (
                  filteredItems.map((item, index) => (
                    <li
                      key={item.id}
                      className={`flex items-center space-x-2 p-4 hover:bg-gray-100 dark:hover:bg-gray-800 ${index < filteredItems.length - 1 ? "border-b border-gray-300 dark:border-gray-700" : ""
                        } cursor-pointer`}
                      onClick={() => navigate(`/product/${item._id}`)}
                    >
                      <img src={item.thumbnail} alt={item.title} className="w-12 h-12 object-cover rounded" />
                      <div className="flex flex-col flex-grow">
                        <h2 className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</h2>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-gray-600 dark:text-gray-300">{item.price}</p>
                          <div className="flex items-center space-x-1 text-yellow-400">
                            {[...Array(5)].map((_, index) => (
                              <FaStar
                                key={index}
                                className={index < item.rating ? "text-yellow-500" : "text-gray-300"}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="p-4 text-gray-600 dark:text-gray-300">Hiç ürün bulunamadı</li>
                )}
              </ul>
            )}

          </div>

          {/* İkonlar Sağ Taraf */}
          <div className="flex salamicon space-x-6 items-center">
            <button className="text-white dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
              <Link to="/profile">
                <FaUser size={24} />
              </Link>
            </button>

            <div className="relative group flex items-center">
              <button className="text-white dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                <Link to="/basket">
                  <FaShoppingCart size={24} />
                </Link>
              </button>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {itemCount}
                </span>
              )}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {isLoading ? "Yükleniyor..." : itemCount === 0 ? "Sepet Boş" : "Sepetinizde Ürün Var"}
              </div>
            </div>

            <div className="relative group flex items-center">
              <button className="text-white dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                <Link to="/favorie">
                  <FaHeart size={24} />
                </Link>
              </button>
              {favoriteCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {favoriteCount}
                </span>
              )}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {isLoadingg ? "Yükleniyor..." : favoriteCount === 0 ? "Favoriler Boş" : "Favorileriniz Var"}
              </div>
            </div>

            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="text-white dark:text-white cursor-pointer">
              {theme === "dark" ? <BiSolidSun size={24} /> : <BiSolidMoon size={24} />}
            </button>

            <style jsx>{`
    @media (max-width: 840px) {
      .salamicon {
        display: none;
      }
      .search-containerr {
        width: 100% !important;
      }
    }
  `}</style>
          </div>

        </div>
      </div>







      <div className="dark:bg-black bg-white w-full h-[120px] py-4 border-b flex justify-center items-center">
        <Catagory />
      </div>



    </header>
  );
};

export default Header;
