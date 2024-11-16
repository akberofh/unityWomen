import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiSolidSun, BiSolidMoon } from "react-icons/bi";
import { FaSearch, FaUser, FaBars, FaTimes, FaShoppingCart, FaHeart, FaStar } from "react-icons/fa";
import UnityWomen from './1722665487WhatsApp_Görsel_2024-08-03_saat_10.08.37_83e97437-removebg.png';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import axios from "axios";
import { FaBarsStaggered } from "react-icons/fa6";
import { useSelector } from "react-redux";
import AOS from "aos";
import "aos/dist/aos.css";



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


  // Kategoriler Dropdown içeriği
  const categories = [
    { name: "Dəst", link: "/dest" },
    { name: "Qolbaq", link: "/qolbaq" },
    { name: "Temizleyici", link: "/temizleyici" },
    { name: "Boyunbağı", link: "/boyunbagi" },
    { name: "Sırğa", link: "/sirga" },
    { name: "Saat", link: "/saat" },
    { name: "Üzük", link: "/uzuk" },
    { name: "Ətir", link: "/etir" },
    { name: "Qızıl", link: "/qizil" },
    { name: "Saç üçün", link: "/sac-ucun" },
    { name: "Baxim mehsullari", link: "/baxim" },
    { name: "Saç şanpunları", link: "/sac-sanpun" },
    { name: "Duş geli", link: "/dus-geli" },
    { name: "Dodaq boyasi", link: "/dodaq" },
    { name: "Göz üçün", link: "/goz-ucun" },
    { name: "Qaş üçün", link: "/qas-ucun" },
    { name: "Uşaqlar üçün", link: "/usaq-ucun" },
    { name: "Makiyaj", link: "/makiaj" },
  ];


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleCategoryMenu = () => {
    setIsCategoryMenuOpen(!isCategoryMenuOpen);
  };






  return (
    <header className="relative h-[160px] z-10  shadow-md w-full dark:bg-black dark:text-white duration-300 ">
      <div className="w-full h-[80px] mx-auto dark:border-b dark:bg-black dark:text-white flex justify-between items-center bg-gray-800">
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
              <div className="relative group">
                <button
                  onClick={toggleCategoryMenu} // Kategoriler menüsünü açıp kapatma
                  className="text-white dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                  data-aos="custom-border"
                  data-aos-duration="1000">
                  Kategoriler
                  {isCategoryMenuOpen ? (
                    <MdKeyboardArrowUp className="inline" />
                  ) : (
                    <MdKeyboardArrowDown className="inline" />
                  )}
                </button>
                {isCategoryMenuOpen && (
                  <div className="absolute border-t border-l border-b z-10 left-0 h-[200px] bg-white dark:bg-black text-gray-700 dark:text-white shadow-md rounded-lg mt-2 w-48 overflow-y-auto">
                    {categories.map((category) => (
                      <Link
                        key={category.name}
                        to={category.link}
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
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
            <div className="md:hidden flex items-center space-x-4 z-20">
  <button className="text-white dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
    <Link to='/basket'>
      <FaShoppingCart className="w-6 h-6" />
    </Link>
  </button>
  <button className="text-white dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
    <FaHeart className="w-6 h-6" />
  </button>
  {theme === "dark" ? (
    <BiSolidSun
      onClick={() => setTheme("light")}
      className="text-2xl cursor-pointer"
    />
  ) : (
    <BiSolidMoon
      onClick={() => setTheme("dark")}
      className="text-2xl text-white cursor-pointer"
    />
  )}
  <button onClick={toggleMenu} className="text-white dark:text-white">
    {isMenuOpen ? (
      <FaBarsStaggered size={24} />
    ) : (
      <FaBars size={24} />
    )}
  </button>
</div>

          </div>
        </div>

        {/* CSS: Mobilde butonları gizleme */}
        <style jsx>{`
    .salamiconn {
      display: none; /* Varsayılan olarak gizle */
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
          <button
            onClick={toggleCategoryMenu}
            className="w-full text-left py-3 px-5 text-lg font-semibold text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 mt-6 rounded-lg"
          >
            Kategoriler
          </button>
          {isCategoryMenuOpen && (
            <div
              className="absolute left-0 bg-white dark:bg-black text-gray-700 dark:text-white shadow-lg rounded-lg mt-2 w-60 overflow-y-auto max-h-60"
            >
              {categories.map((category) => (
                <Link
                  key={category.name}
                  to={category.link}
                  className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}


          {/* Linkler */}
          <div className="space-y-4 mt-6">
            <Link to="/about" className="block text-lg text-gray-700 dark:text-white py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">Haqqımızda</Link>
            <Link to="/contact" className="block text-lg text-gray-700 dark:text-white py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">Əlaqə</Link>
            <Link to="/confirmed" className="block text-lg text-gray-700 dark:text-white py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">Sifarişlərim</Link>
          </div>
        </div>
      )}





      <div className="w-full bg-gray-700 mx-auto dark:border-b  dark:bg-black dark:text-white    h-[80px] flex justify-between items-center">
        <div className="w-[90%] mx-auto  flex justify-between items-center">
          {/* Arama Inputu Sol Taraf */}
          <div className="search-containerr   w-[600px] relative">
            <input
              type="text"
              placeholder="Arama yap..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Input değiştiğinde queryyi güncelle
              className="search-input  dark:text-white  dark:bg-black p-2 w-full border rounded-md"
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
            <button className=" text-white dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
              <Link to="/register"> <FaUser size={20} /> </Link>
            </button>
            <button className=" text-white dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
              <Link to='/basket'> <FaShoppingCart size={20} /></Link>
            </button>
            <button className="text-white dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
              <FaHeart size={20} />
            </button>
            {theme === "dark" ? (
              <BiSolidSun
                onClick={() => setTheme("light")}
                className="text-2xl  cursor-pointer"
              />
            ) : (
              <BiSolidMoon
                onClick={() => setTheme("dark")}
                className="text-2xl text-white cursor-pointer"
              />
            )}
            <style jsx>{`
  @media (max-width: 840px) {
    .salamicon {
      display: none;
    }
        .search-containerr {
      width: 100% !important;  /* Arama kutusunun tam genişlikte olmasını sağla */
    }
  }
`}</style>
          </div>
        </div>
      </div>


    </header>
  );
};

export default Header;
