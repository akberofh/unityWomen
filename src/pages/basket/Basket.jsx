import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setTodos } from "../../redux/slices/productSlice";
import {
  useAddConfirmMutation,
  useGetTodosQuery,
  useDeleteTodoMutation,
  useUpdateTodoMutation,
} from "../../redux/slices/productApiSlice";
import { useNavigate } from "react-router-dom";

const Basket = () => {
  const dispatch = useDispatch();
  const { data, isLoading, refetch } = useGetTodosQuery();
  const [updateTodo] = useUpdateTodoMutation();
  const [addConfirm] = useAddConfirmMutation();
  const [removeTodo] = useDeleteTodoMutation();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const navigate = useNavigate();

  // Ürün seçimini toggle et
  const toggleProductSelection = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      await updateTodo({ productId, quantity }).unwrap();
      await refetch();
    } catch (err) {
      console.error("Məhsul yenilənmədi:", err);
    }
  };

  const removeProduct = async (_id) => {
    try {
      await removeTodo(_id).unwrap();
      alert("Məhsul səbətdən silindi!");
      await refetch();
    } catch (err) {
      console.error("Məhsul silinmədi:", err);
      alert("Məhsul səbətdən silinmədi!");
    }
  };

  // Sadece seçilen ürünleri gönder
  const handleConfirmCart = async () => {
    try {
      const selectedItems = data.filter((product) =>
        selectedProducts.includes(product._id)
      );
  
      console.log("Seçili ürün ID'leri:", selectedProducts);
      console.log("Gönderilecek ürünler:", selectedItems);
  
      if (selectedItems.length === 0) {
        alert("Zəhmət olmasa ən azı bir məhsul seçin.");
        return;
      }
  
      const response = await addConfirm({ products: selectedItems }).unwrap();
      const confirmedCartId = response.confirmedCartId;
  
      alert("Səbət təsdiqləndi! Ödəmə hissəsinə yönləndirilir.");
      setTimeout(() => {
        navigate(`/payment?confirmedCartId=${confirmedCartId}`);
      }, 1000);
    } catch (error) {
      console.error("Sepeti onaylarken hata oluştu:", error);
      alert(error?.data?.error || "Sepeti onaylarken bir hata oluştu.");
    }
  };
  

  useEffect(() => {
    if (data) {
      dispatch(setTodos(data));
      refetch();
    }
  }, [data, dispatch]);

  // Sadece seçilen ürünlerin toplamı
  const totalPrice = Array.isArray(data)
    ? Math.round(
      data
        .filter((product) => selectedProducts.includes(product._id))
        .reduce(
          (total, product) => total + product.price * product.quantity,
          0
        ) * 100
    ) / 100
    : 0;

  // %10 endirimli qiymət
  const discountedPrice = Math.round((totalPrice * 0.9) * 100) / 100;

  const isStockAvailable =
    data &&
    Array.isArray(data) &&
    !data
      .filter((product) => selectedProducts.includes(product._id))
      .some((product) => product.stock === 0);

  return (
    <div className="container min-h-[740px] mx-auto p-6">
      {isLoading ? (
        <p className="text-center text-gray-600">Yüklənir...</p>
      ) : (
        data &&
        data.map((product) => (
          <div
            key={product._id}
            className="dark:bg-black bg-white border shadow-md rounded-2xl p-6 mb-6 flex flex-col md:flex-row md:items-center gap-6 hover:shadow-xl transition-all duration-300"
          >
            {/* Checkbox */}
            <input
              type="checkbox"
              checked={selectedProducts.includes(product._id)}
              onChange={() => toggleProductSelection(product._id)}
              className="w-5 h-5 accent-green-600"
            />

            {/* Ürün Fotoğrafı */}
            <div
              className="w-full md:w-auto flex justify-center"
              onClick={() => navigate(`/product/${product.productId}`)}
            >
              <img
                src={
                  Array.isArray(product.photo) && product.photo.length > 0
                    ? product.photo[0]
                    : product.photo
                }
                alt={product.title}
                className="w-32 h-32 object-cover rounded-full border border-gray-300 cursor-pointer"
              />
            </div>

            {/* Ürün Bilgileri */}
            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                {product.title}
              </h3>

              {/* Adet ve Butonlar */}
              <div className="flex items-center justify-center md:justify-start space-x-4 mb-2">
                {product.quantity > 1 ? (
                  <button
                    onClick={() =>
                      updateQuantity(product.productId, product.quantity - 1)
                    }
                    className="px-4 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                  >
                    -
                  </button>
                ) : (
                  <button
                    onClick={() => removeProduct(product._id)}
                    className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Sil
                  </button>
                )}
                <span className="text-lg font-medium dark:text-white text-gray-800">
                  {product.quantity}
                </span>
                <button
                  onClick={() =>
                    updateQuantity(product.productId, product.quantity + 1)
                  }
                  className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  +
                </button>
              </div>

              {/* Fiyat ve Stok Durumu */}
              <p className="text-lg font-semibold dark:text-white text-gray-900 mt-2">
                Toplam Qiymət:{" "}
                {(Math.round(product.price * 100) / 100).toFixed(2)} ₼
              </p>

              {product.stock === 1 && (
                <p className="text-red-500 font-medium mt-1">
                  Son 1 məhsul qaldı!
                </p>
              )}
              {product.stock === 0 && (
                <p className="text-red-500 font-medium mt-1">
                  Bu məhsul stokta yoxdur!
                </p>
              )}
            </div>
          </div>
        ))
      )}

 <div className="flex flex-col items-end mt-6">
        <p className="text-xl font-semibold dark:text-white text-gray-800">
          Seçilən Məhsulların Cəmi: {totalPrice.toFixed(2)} ₼
        </p>
        <p className="text-xl font-semibold text-green-600 mt-1">
          Endirimli Qiymət (%10): {discountedPrice.toFixed(2)} ₼
        </p>
        <button
          onClick={handleConfirmCart}
          disabled={!isStockAvailable}
          className={`mt-3 px-6 py-2 rounded text-white ${!isStockAvailable
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600 transition-all"
            }`}
        >
          Səbəti Təsdiqlə
        </button>
      </div>
    </div>
  );
};

export default Basket;
