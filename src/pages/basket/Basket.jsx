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

const Basket = () => {
  const dispatch = useDispatch();
  const { data, isLoading } = useGetTodosQuery();
  const [updateTodo] = useUpdateTodoMutation();
  const [addConfirm] = useAddConfirmMutation();
  const [addPayment] = useAddPaymentMutation();
  const [removeTodo] = useDeleteTodoMutation();
  const [outOfStock, setOutOfStock] = useState([]);

  // Function to update quantity
  const updateQuantity = async (productId, quantity) => {
    try {
      await updateTodo({ productId, quantity }).unwrap();
    } catch (err) {
      console.error("Failed to update the quantity:", err);
    }
  };

  // Function to remove product from the basket
  const removeProduct = async (_id) => {
    try {
      await removeTodo(_id).unwrap();
      alert("Ürün sepetten silindi!");
    } catch (err) {
      console.error("Failed to remove the product:", err);
    }
  };

  // Confirm cart function for all products
  const handleConfirmCart = async () => {
    try {
      await addConfirm().unwrap();
      alert("Sepet başarıyla onaylandı!");
    } catch (error) {
      console.error("Sepeti onaylarken hata oluştu:", error);
      alert("Sepeti onaylarken bir hata oluştu.");
    }
  };

  // Handle payment for all products in the cart
  const handlePayment = async () => {
    try {
      const response = await addPayment().unwrap(); // API çağrısını buraya ekleyin
      console.log("Ödeme başarılı", response); // Yanıtı kontrol edin
      alert("Para ödendi!");
    } catch (error) {
      console.error("Ödeme hatası:", error); // Hata mesajını daha ayrıntılı yazdırın
      alert("Ödeme işlemi başarısız.");
    }
  };

  // Check stock status for all products
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

  // Check if 'data' exists and is an array before using .some
  const isStockAvailable = data && Array.isArray(data) && !data.some((product) => product.stock === 0);

  return (
    <div className="container mx-auto p-6">
      {isLoading ? (
        <p className="text-center text-gray-600">Yükleniyor...</p>
      ) : (
        data &&
        data.map((product) => (
          <div
            key={product._id}
            className="bg-white shadow-lg rounded-lg p-6 mb-4 flex flex-col items-center"
          >
            <img
              src={product.thumbnail}
              alt="Thumbnail"
              className="w-32 h-32 object-cover rounded mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-800">{product.title}</h3>
            <p className="text-gray-600 mb-2">{product.description}</p>
            <p className="text-xl font-bold text-gray-800 mb-2">
              Toplam Fiyat: {product.totalPrice} ₺
            </p>

            {/* Stock status */}
            {product.stock === 1 ? (
              <p className="text-red-500 mb-2">Son 1 ürün kaldı!</p>
            ) : product.stock === 0 ? (
              <p className="text-red-500 mb-2">Bu ürün stokta yok!</p>
            ) : null}

            <div className="flex items-center space-x-4">
              {product.quantity > 1 ? (
                <button
                  onClick={() => updateQuantity(product.productId, product.quantity - 1)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded"
                >
                  -
                </button>
              ) : (
                <button
                  onClick={() => removeProduct(product._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  Sil
                </button>
              )}
              <span className="text-lg font-medium">{product.quantity}</span>
              <button
                onClick={() => updateQuantity(product.productId, product.quantity + 1)}
                disabled={checkStock(product.productId, product.quantity + 1)}
                className={`px-4 py-2 rounded ${checkStock(product.productId, product.quantity + 1)
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
              >
                +
              </button>
            </div>
          </div>
        ))
      )}


    <div>
    <p className="text-xl font-semibold text-gray-800 mb-4">
          Sepet Toplamı: {calculateTotalPrice} ₺
        </p>
      <button



        onClick={handleConfirmCart}
        disabled={!isStockAvailable} // Disable if any product is out of stock
        className={`mt-4 px-6 py-2 rounded text-white ${
          !isStockAvailable
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-600"
        }`}
      >
        Sepeti Onayla
      </button>

      {/* Button to make payment */}
      <button
      
        onClick={handlePayment}
        disabled={!isStockAvailable } // Disable if any product is out of stock
        className={`mt-4 px-6 py-2 rounded text-white ${
          !isStockAvailable 
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-600"
        }`}
      >
        Ödeme Yap
      </button>

    </div>

      {/* Button to confirm all items in the cart */}
    </div>
  );
};

export default Basket;
