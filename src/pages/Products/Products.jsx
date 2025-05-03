import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAddTodoMutation } from "../../redux/slices/productApiSlice";
import { useAddsTodoMutation } from "../../redux/slices/todoApiSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { FaRegHeart } from "react-icons/fa";
import { useGetCatagoryQuery } from "../../redux/slices/catagoryApiSlice";
import { setCatagory } from "../../redux/slices/catagorySlice";

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [addTodo] = useAddTodoMutation();
  const [addTodoo] = useAddsTodoMutation();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [inStock, setInStock] = useState("all"); // Yeni filter for stock status
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const { data: categoryData } = useGetCatagoryQuery();

  useEffect(() => {
    if (categoryData?.allCatagory) {
      dispatch(setCatagory(categoryData.allCatagory));
    }
  }, [categoryData, dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://unity-women-backend.vercel.app/api/qolbaq/");
        setProducts(response.data.allQolbaq || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setProducts([]);
      }
    };
    fetchData();
  }, []);

  const handleAddToCart = async (product) => {
    try {
      const newTodo = await addTodo({ productId: product._id }).unwrap();
      dispatch({ type: "product/addTodo", payload: newTodo });
      navigate("/basket");
    } catch (err) {
      console.error("Failed to add product to cart:", err);
    }
  };

  const handleAddToFavorite = async (product) => {
    try {
      const newFavorie = await addTodoo({ productId: product._id }).unwrap();
      dispatch({ type: "favorie/add", payload: newFavorie });
      navigate("/favorie");
    } catch (err) {
      console.error("Failed to add product to favorite:", err);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.catagory === selectedCategory;
    const matchesPrice =
      priceRange === "all" ||
      (priceRange === "low" && product.price <= 50) ||
      (priceRange === "mid" && product.price > 50 && product.price <= 150) ||
      (priceRange === "high" && product.price > 150);
    const matchesStock = inStock === "all" || (inStock === "inStock" && product.stock > 0) || (inStock === "outOfStock" && product.stock === 0);
    return matchesSearch && matchesCategory && matchesPrice && matchesStock;
  });

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
<div className="w-full mx-auto flex flex-col lg:flex-row gap-6 mt-4">
  {/* Filter Sidebar */}
  <div className="lg:w-1/4 w-full lg:sticky lg:top-4 h-fit space-y-6 bg-white dark:bg-gray-800 p-4 rounded shadow mb-4 lg:mb-0">
    <div>
      <h2 className="font-bold text-lg mb-2 dark:text-white">Axtarış</h2>
      <input
        type="text"
        placeholder="Ad ilə axtar"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border rounded dark:bg-gray-900 dark:text-white"
      />
    </div>

    <div>
      <h2 className="font-bold text-lg mb-2 dark:text-white">Kateqoriya</h2>
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="w-full p-2 border rounded dark:bg-gray-900 dark:text-white"
      >
        <option value="all">Hamısı</option>
        {categoryData?.allCatagory?.map((cat) => (
          <option key={cat._id} value={cat.title}>
            {cat.title}
          </option>
        ))}
      </select>
    </div>

    <div>
      <h2 className="font-bold text-lg mb-2 dark:text-white">Qiymət Aralığı</h2>
      <select
        value={priceRange}
        onChange={(e) => setPriceRange(e.target.value)}
        className="w-full p-2 border rounded dark:bg-gray-900 dark:text-white"
      >
        <option value="all">Hamısı</option>
        <option value="low">0 - 50₼</option>
        <option value="mid">51 - 150₼</option>
        <option value="high">151₼+</option>
      </select>
    </div>

    <div>
      <h2 className="font-bold text-lg mb-2 dark:text-white">Stok Durumu</h2>
      <select
        value={inStock}
        onChange={(e) => setInStock(e.target.value)}
        className="w-full p-2 border rounded dark:bg-gray-900 dark:text-white"
      >
        <option value="all">Hamısı</option>
        <option value="inStock">Stokda Olanlar</option>
        <option value="outOfStock">Stokda Olmayanlar</option>
      </select>
    </div>
  </div>

  {/* Product Grid */}
  <div className="lg:w-3/4 w-full overflow-x-auto mt-4 lg:mt-0">
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {paginatedProducts.map((product) => (
        <div key={product._id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 relative">
          <button
            onClick={() => handleAddToFavorite(product)}
            className="absolute top-2 right-2 text-gray-700 dark:text-white"
          >
            <FaRegHeart className="w-6 h-6 hover:text-red-600" />
          </button>
          <img
            src={Array.isArray(product.photo) ? product.photo[0] : product.photo}
            alt={product.title}
            className="w-full h-48 object-cover rounded cursor-pointer"
            onClick={() => navigate(`/product/${product._id}`)}
          />
          <h3 className="mt-2 font-semibold dark:text-white truncate">{product.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-300">{product.price}₼</p>
          <button
            onClick={() => handleAddToCart(product)}
            disabled={product.stock === 0}
            className={`w-full mt-2 py-2 rounded text-white ${product.stock === 0 ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {product.stock === 0 ? "Stokda Yoxdur" : "Səbətə Əlavə Et"}
          </button>
        </div>
      ))}
    </div>

    {/* Pagination */}
    <div className="flex justify-center mt-6 space-x-2">
      {currentPage > 3 && (
        <button
          onClick={() => setCurrentPage(1)}
          className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-200 dark:bg-gray-700 dark:text-white"
        >
          1
        </button>
      )}

      {currentPage > 4 && (
        <span className="px-3 py-1 rounded-full text-sm font-semibold text-gray-500 dark:text-gray-300">
          ...
        </span>
      )}

      {Array.from({ length: totalPages }, (_, i) => i + 1)
        .slice(Math.max(currentPage - 2, 0), Math.min(currentPage + 2, totalPages))
        .map((num) => (
          <button
            key={num}
            onClick={() => setCurrentPage(num)}
            className={`px-3 py-1 rounded-full text-sm font-semibold ${currentPage === num ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 dark:text-white"}`}
          >
            {num}
          </button>
        ))}

      {currentPage < totalPages - 3 && (
        <span className="px-3 py-1 rounded-full text-sm font-semibold text-gray-500 dark:text-gray-300">
          ...
        </span>
      )}

      {currentPage < totalPages - 2 && (
        <button
          onClick={() => setCurrentPage(totalPages)}
          className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-200 dark:bg-gray-700 dark:text-white"
        >
          {totalPages}
        </button>
      )}
    </div>
  </div>
</div>

  );
};

export default Products;
