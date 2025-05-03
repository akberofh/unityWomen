import React, { useEffect } from "react";
import { useGetConfirmedQuery } from "../../redux/slices/ConfirmedApiSlice";
import { setConfirmed } from "../../redux/slices/confirmedSlice";
import { useDispatch } from "react-redux";

const Confirmed = () => {
    const dispatch = useDispatch();
    const { data, isLoading } = useGetConfirmedQuery();

    useEffect(() => {
        if (data?.confirmedCarts) {
            dispatch(setConfirmed(data.confirmedCarts));
        }
    }, [data, dispatch]);

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
                Təsdiqlənmiş Sifarişlər
            </h1>

            {isLoading ? (
                <p className="text-center text-gray-500 text-lg">Yüklənir...</p>
            ) : data?.confirmedCarts?.length > 0 ? (
                data.confirmedCarts.map((cart) => (
                    <div
                        key={cart._id}
                        className="bg-white border border-gray-200 rounded-xl shadow-sm mb-12 p-6"
                    >
                        <div className="grid md:grid-cols-3 gap-6 border-b pb-6 mb-6">
                            <div>
                                <p className="text-gray-500 text-sm">Ödəmə Vəziyyəti</p>
                                <p className="text-lg font-semibold text-blue-600">
                                    {cart.paymentStatus}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Təsdiqlənmə Tarixi</p>
                                <p className="text-lg font-semibold text-gray-700">
                                    {new Date(cart.confirmedAt).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Toplam Məhsul</p>
                                <p className="text-lg font-semibold text-gray-700">
                                    {cart.products.length} Məhsul
                                </p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Şəkil</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Ad</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Ədəd</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Toplam Qiymət</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {cart.products.map((product) => (
                                        <tr key={product._id} className="border-b">
                                            <td className="px-4 py-3">
                                                <img
                                                    src={
                                                        Array.isArray(product.productId.photo)
                                                            ? product.productId.photo[0]
                                                            : product.productId.photo
                                                    }
                                                    alt={product.title}
                                                    className="w-16 h-16 rounded-lg object-cover border"
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-gray-800 font-medium">{product.title}</td>
                                            <td className="px-4 py-3 text-gray-700 text-center">{product.quantity}</td>
                                            <td className="px-4 py-3 text-green-600 font-semibold text-center">
                                                {product.totalPrice} AZN
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </div>
                ))
            ) : (
                <p className="text-center text-gray-500 text-lg">
                    Sifarişiniz yoxdur.
                </p>
            )}
        </div>
    );
};

export default Confirmed;
