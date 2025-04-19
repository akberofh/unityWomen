import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setTodos } from "../../redux/slices/todoSlice";
import { useGetsTodosQuery } from "../../redux/slices/todoApiSlice";
import { useNavigate } from "react-router-dom";


const Favorie = () => {
    const dispatch = useDispatch();
    const { data, isLoading } = useGetsTodosQuery();
   const navigate = useNavigate();

    useEffect(() => {
  
        if (data) {
            dispatch(setTodos(data));
        }
    }, [data, dispatch]);
    

    return (
        <div className="container min-h-[740px] mx-auto p-6">
            {isLoading ? (
                <p className="text-center text-gray-600">Yükleniyor...</p>
            ) : (
                data && data.map(product => (
                    <div className=" dark:bg-black border shadow-lg rounded-lg p-6 mb-6 flex flex-col md:flex-row items-center hover:shadow-xl transition-all duration-300 ease-in-out">
                        <img  onClick={() => navigate(`/product/${product.productId}`)} src={product.photo} alt="Thumbnail" className="w-32 h-32 object-cover rounded-full mb-4 md:mb-0 md:mr-6 border border-gray-200" />
                        <div className="w-full flex flex-col items-center">
                            <h3 className="text-lg font-semibold dark:text-white  text-gray-800">{product.title}</h3>
                        </div>
                        <div className="flex w-full dark:text-white items-center justify-center space-x-4 mt-4">
                         
                            <span className="text-lg dark:text-white font-medium text-gray-700">{product.catagory}</span>
                        </div>
                        <div className="flex flex-col w-full items-center mt-4">
                            <p className="text-xl dark:text-white font-bold text-gray-800 mb-2">Fiyat: {product.price} ₺</p>
                            {product.stock === 1 ? (
                                <p className="text-red-500 mb-2">Son 1 ürün kaldı!</p>
                            ) : product.stock === 0 ? (
                                <p className="text-red-500 mb-2">Bu ürün stokta yok!</p>
                            ) : null}
                        </div>
                    </div>
                ))
            )}

        </div>

    );
};

export default Favorie;
