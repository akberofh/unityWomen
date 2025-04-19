import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setTodos } from "../../redux/slices/productSlice";
import {
  useAddConfirmMutation,
  useAddPaymentMutation,
  useGetTodosQuery,
  useDeleteTodoMutation,
  useUpdateTodoMutation,
} from "../../redux/slices/productApiSlice";
import { useNavigate } from "react-router-dom";

const Basket = () => {
  const dispatch = useDispatch();
  const { data, isLoading } = useGetTodosQuery();
  const [updateTodo] = useUpdateTodoMutation();
  const [addConfirm] = useAddConfirmMutation();
  const [addPayment] = useAddPaymentMutation();
  const [removeTodo] = useDeleteTodoMutation();
  const [outOfStock, setOutOfStock] = useState([]);
    const navigate = useNavigate();
  

  // Update product quantity
  const updateQuantity = async (productId, quantity) => {
    try {
      await updateTodo({ productId, quantity }).unwrap();
    } catch (err) {
      console.error("Failed to update the quantity:", err);
    }
  };

  // Remove product from basket
  const removeProduct = async (_id) => {
    try {
      await removeTodo(_id).unwrap();
      alert("Ürün sepetten silindi!");
    } catch (err) {
      console.error("Failed to remove the product:", err);
    }
  };

  // Confirm cart
  const handleConfirmCart = async () => {
    try {
      await addConfirm().unwrap();
      alert("Sepet başarıyla onaylandı!");
      setTimeout(() => {
        navigate('/payment');
      }, 3000);
    } catch (error) {
      console.error("Sepeti onaylarken hata oluştu:", error);
      alert("Sepeti onaylarken bir hata oluştu.");
    }
  };

  // Handle payment
  const handlePayment = async () => {
    try {
      const response = await addPayment().unwrap();
      console.log("Ödeme başarılı", response);
      alert("Para ödendi!");
    } catch (error) {
      console.error("Ödeme hatası:", error);
      alert("Ödeme işlemi başarısız.");
    }
  };

  // Check stock availability
  const checkStock = (productId, quantity) => {
    const product = data.find((item) => item.productId === productId);
    if (product) {
      if (product.stock < quantity) {
        if (!outOfStock.includes(productId)) {
          setOutOfStock((prev) => [...prev, productId]);
        }
        return true;
      } else {
        return false;
      }
    }
    return false;
  };

  useEffect(() => {
    if (data) {
      dispatch(setTodos(data));
    }
  }, [data, dispatch]);

  const calculateTotalPrice = Array.isArray(data)
    ? data.reduce((total, product) => total + product.price * product.quantity, 0)
    : 0;

  const isStockAvailable = data && Array.isArray(data) && !data.some((product) => product.stock === 0);

  return (
    <div className="container min-h-[740px] mx-auto p-6">
      {isLoading ? (
        <p className="text-center text-gray-600">Yüklənir...</p>
      ) : (
        data && data.map((product) => (
          <div key={product._id} className=" dark:bg-black border shadow-lg rounded-lg p-6 mb-6 flex flex-col md:flex-row items-center hover:shadow-xl transition-all duration-300 ease-in-out">
            <img src={product.photo} alt="Thumbnail" className="w-32 h-32 object-cover rounded-full mb-4 md:mb-0 md:mr-6 border border-gray-200" />
            <div className="w-full flex flex-col items-center">
              <h3 className="text-lg font-semibold dark:text-white  text-gray-800">{product.title}</h3>
            </div>
            <div className="flex w-full dark:text-white items-center justify-center space-x-4 mt-4">
              {product.quantity > 1 ? (
                <button onClick={() => updateQuantity(product.productId, product.quantity - 1)} className="px-4 py-2  bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition">-</button>
              ) : (
                <button onClick={() => removeProduct(product._id)} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition">Sil</button>
              )}
              <span className="text-lg dark:text-white font-medium text-gray-700">{product.quantity}</span>
              <button onClick={() => updateQuantity(product.productId, product.quantity + 1)} className="px-4  py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">+</button>
            </div>
            <div className="flex flex-col w-full items-center mt-4">
              <p className="text-xl dark:text-white font-bold text-gray-800 mb-2">Toplam Fiyat: {product.totalPrice} ₼</p>
              {product.stock === 1 ? (
                <p className="text-red-500 mb-2">Son 1 məhsul qaldı!</p>
              ) : product.stock === 0 ? (
                <p className="text-red-500 mb-2">Bu məhsul stokda yoxdur!</p>
              ) : null}
            </div>
          </div>
        ))
      )}

      <div className="flex justify-between items-center mt-6">
        <p className="text-xl font-semibold dark:text-white text-gray-800">Səbət Toplamı: {calculateTotalPrice} ₼</p>
        <button onClick={handleConfirmCart} disabled={!isStockAvailable} className={`px-6 py-2 rounded text-white ${!isStockAvailable ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 transition-all"}`}>Səbəti Təsdiqlə</button>
      </div>
    </div>

  );
};

export default Basket;
