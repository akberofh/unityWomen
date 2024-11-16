import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiSolidSun, BiSolidMoon } from "react-icons/bi";
import { FaSearch, FaUser, FaBars, FaTimes, FaShoppingCart, FaHeart, FaStar } from "react-icons/fa";
import UnityWomen from './1722665487WhatsApp_Görsel_2024-08-03_saat_10.08.37_83e97437-removebg.png';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import axios from "axios";


const Header = ({ theme, setTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // API'den ürünleri al
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
  }, [searchQuery]); // searchQuery değiştikçe bu effect çalışacak


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

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen); // Arama input'unu açma/kapama
    if (isSearchOpen) {
      setSearchQuery(''); // Input kapanınca arama sıfırlansın
    }
  };

  return (
    <header className="relative h-20 z-10 shadow-md w-full dark:bg-black dark:text-white duration-300 ">
      <div className="w-[90%] mx-auto flex justify-between items-center">
        {/* Logo ve Menü */}
        <div className="flex h-20 items-center space-x-8">
          <div className={`text-xl font-bold text-blue-600 ${isSearchOpen ? 'hidden' : ''}`}>
            <Link to='/'>
              <img
                src={UnityWomen}
                alt="Unity Women"
                className="w-auto h-20 object-cover bg-transparent"
              />
            </Link>
          </div>

          {/* Ana Menü ve Kategoriler */}
          <nav className="hidden anakat md:flex space-x-6">
            <div className="relative group">
              <button
                onClick={toggleCategoryMenu} // Kategoriler menüsünü açıp kapatma
                className="text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
              >
                Kategoriler
                {isCategoryMenuOpen ? (
                  <MdKeyboardArrowUp className="inline" />
                ) : (
                  <MdKeyboardArrowDown className="inline" />
                )}
              </button>
              {isCategoryMenuOpen && (
                <div
                  className="absolute left-0 h-[200px] bg-white dark:bg-black text-gray-700 dark:text-white shadow-md rounded-lg mt-2 w-48 overflow-y-auto"
                >
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
            <Link to="/about" className="text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">Haqqımızda</Link>
            <Link to="/contact" className="text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">Əlaqə</Link>
            <Link to="/confirmed" className="text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">Sifarişlərim</Link>
          </nav>
        </div>

        <style jsx>{`
  @media (max-width: 1431px) {
    .anakat {
      display: none;
    }
  }
`}</style>



        {/* Ortada Arama Input'u */}
        <div className="search-container w-[400px] md:hidden relative flex items-center">
          {isSearchOpen ? (
            <div className="flex items-center space-x-2 w-full">
              <input
                type="text"
                placeholder="Arama yap..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} // Input değiştiğinde queryyi güncelle
                className="search-input p-2 w-full border rounded-md"
              />
              <button onClick={toggleSearch} className="flex items-center justify-center">
                <FaTimes size={24} className="text-gray-700 dark:text-white" />
              </button>
            </div>
          ) : (
            <button onClick={toggleSearch} className="text-gray-700 dark:text-white">
              <FaSearch size={24} />
            </button>
          )}

          {loading ? (
            <p className="text-center">Yükleniyor...</p>
          ) : (
            <ul className="search-results absolute top-full left-0 w-full bg-white dark:bg-black shadow-md rounded-lg max-h-80 overflow-y-auto mt-1 z-10">
              {Array.isArray(items) && items.length > 0 ? (
                items.map((item, index) => (
                  <li
                    key={item.id}
                    className={`flex items-center space-x-2 p-4 hover:bg-gray-950 dark:hover:bg-gray-800 ${index < items.length - 1 ? "border-b border-black dark:border-gray-700" : ""} cursor-pointer`}
                    onClick={() => navigate(`/product/${item._id}`)}
                     >
                    <img src={item.thumbnail} alt={item.title} className="w-16 h-16 object-cover rounded" />
                    <div className="flex flex-col flex-grow">
                      <h2 className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</h2>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-600 dark:text-gray-300">{item.price}</p>
                        <div className="flex items-center space-x-1 text-yellow-400">
                          {[...Array(5)].map((_, index) => (
                            <FaStar key={index} className={index < item.rating ? "text-yellow-500" : "text-gray-300"} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className=""></li>
              )}
            </ul>
          )}


        </div>


        <div className="search-containerr w-[600px] relative px">
          <input
            type="text"
            placeholder="Arama yap..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Input değiştiğinde queryyi güncelle
            className="search-input p-2 w-full border rounded-md"
          />
          {loading ? (
            <p className="text-center">Yükleniyor...</p>
          ) : (
            <ul className="search-results absolute top-full left-0 w-full bg-white dark:bg-black shadow-md rounded-lg max-h-80 overflow-y-auto mt-1 z-10">
              {Array.isArray(items) && items.length > 0 ? (
                items.map((item, index) => (
                  <li
                  key={item.id}
                  className={`flex items-center space-x-2 p-4 hover:bg-gray-950 dark:hover:bg-gray-800 ${index < items.length - 1 ? "border-b border-black dark:border-gray-700" : ""} cursor-pointer`}
                  onClick={() => navigate(`/product/${item._id}`)}
                   >                    <img src={item.thumbnail} alt={item.title} className="w-12 h-12 object-cover rounded" />
                    <div className="flex flex-col flex-grow">
                      <h2 className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</h2>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-600 dark:text-gray-300">{item.price}</p>
                        <div className="flex items-center space-x-1 text-yellow-400">
                          {[...Array(5)].map((_, index) => (
                            <FaStar key={index} className={index < item.rating ? "text-yellow-500" : "text-gray-300"} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className=""></li>
              )}
            </ul>
          )}
        </div>

        {/* Ekran genişliği 978px veya daha küçük olduğunda gizleme */}
        <div className="hidden sm:block">
          {/* Bu alan yalnızca sm (en küçük ekranlar) ve daha büyük ekranlarda görünür */}
        </div>

        {/* Tailwind'de özel 978px için CSS */}
        <style jsx>{`
  @media (max-width: 770px) {
    .search-containerr {
      display: none;
    }
  }
`}</style>


        <style jsx>{`
  @media (max-width: 843px) {
    .search-containerr {
      Width: 500px;
    }
  }
`}</style>


        {/* Mobil Menü Butonu */}
        <div className="md:hidden verygod flex items-center z-20">
          <button onClick={toggleMenu} className="text-gray-700 dark:text-white">
            {isMenuOpen ? (
              <FaTimes size={24} />
            ) : (
              <FaBars size={24} />
            )}
          </button>
        </div>

        <style jsx>{`
  @media (max-width: 1431px) {
    .verygod {
      display: block;
    }
  }
`}</style>


        {/* Arama, Kullanıcı ve Sepet İkonları (Masaüstü) */}
        <div className="hidden md:flex  salam space-x-6 items-center">
          <button className="text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
            <Link to="/register"> <FaUser size={20} /> </Link>
          </button>
          <button className="text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
            <Link to='/basket'> <FaShoppingCart size={20} /></Link>
          </button>
          <button className="text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
            <FaHeart size={20} />
          </button>
          {theme === "dark" ? (
            <BiSolidSun
              onClick={() => setTheme("light")}
              className="text-2xl cursor-pointer"
            />
          ) : (
            <BiSolidMoon
              onClick={() => setTheme("dark")}
              className="text-2xl cursor-pointer"
            />
          )}
        </div>
      </div>
      <style jsx>{`
  @media (max-width: 1431px) {
    .salam {
      display: none;
    }
  }
`}</style>

      {/* Mobil Menü Açıldığında Görüntülenen Kategoriler ve İkonlar */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-black py-4 px-6 space-y-4">
          <div className="relative group">
            <button
              onClick={toggleCategoryMenu} // Kategoriler menüsünü açıp kapatma
              className="w-full text-left py-2 px-4 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Kategoriler
            </button>
            {isCategoryMenuOpen && (
              <div
                className="absolute left-0 h-[200px] bg-white dark:bg-black text-gray-700 dark:text-white shadow-md rounded-lg mt-2 w-48 overflow-y-auto"
              >
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

          <Link to="/about" className="block text-gray-700 dark:text-white py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800">Haqqımızda</Link>
          <Link to="/contact" className="block text-gray-700 dark:text-white py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800">Əlaqə</Link>
          <Link to="/confirmed" className="block text-gray-700 dark:text-white py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800">Sifarişlərim</Link>

          {/* Mobil Arama ve İkonlar */}
          <div className="flex space-x-6 mt-4">
            <button className="text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
              <FaUser size={20} />
            </button>
            <button className="text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
              <FaShoppingCart size={20} />
            </button>
            <button className="text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
              <FaHeart size={20} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
