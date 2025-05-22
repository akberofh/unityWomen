import React, { useEffect } from "react";
import { useGetConfirmedQuery } from "../../redux/slices/ConfirmedApiSlice";
import { setConfirmed } from "../../redux/slices/confirmedSlice";
import { useDispatch } from "react-redux";

const Confirmed = () => {
    const dispatch = useDispatch();
    const { data, isLoading, refetch } = useGetConfirmedQuery();

    useEffect(() => {
        if (data) {
            dispatch(setConfirmed(data));
            refetch();
        }
    }, [data, dispatch]);

    return (
        <div className="max-w-7xl mx-auto min-h-screen px-4 py-12">
            <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-12">
                Təsdiqlənmiş Sifarişlər
            </h1>

            {isLoading ? (
                <p className="text-center text-gray-500 dark:text-gray-400 text-lg">Yüklənir...</p>
            ) : data?.length > 0 ? (
                data.map((cart) => (
                    <div
                        key={cart._id}
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm mb-12 p-6"
                    >
                        <div className="grid md:grid-cols-3 gap-6 border-b dark:border-gray-700 pb-6 mb-6">
                            <div>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Ödəmə Vəziyyəti</p>
                                <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                                    {cart.paymentStatus === 'pending'
                                        ? 'Ödəniş Gözlənilir'
                                        : cart.paymentStatus === 'paid'
                                            ? 'Ödəndi'
                                            : cart.paymentStatus === 'failed'
                                                ? 'Ödənmədi'
                                                : ''}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Sifariş Kodu</p>
                                <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                                    {cart.orderCode}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Toplam Məhsul</p>
                                <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                                    {cart.products.length} Məhsul
                                </p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Şəkil</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Ad</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Ədəd</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Toplam Qiymət</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800">
                                    {cart.products.map((product) => (
                                        <tr key={product._id} className="border-b dark:border-gray-700">
                                            <td className="px-4 py-3">
                                                {product?.photo ? (
                                                    <img
                                                        src={Array.isArray(product.photo) ? product.photo[0] : product.photo}
                                                        alt={product.title}
                                                        className="w-16 h-16 rounded-lg object-cover border dark:border-gray-600"
                                                    />
                                                ) : (
                                                    <div className="w-16 h-16 flex items-center justify-center border rounded bg-gray-100 dark:bg-gray-700 text-gray-400 text-sm">
                                                        N/A
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-gray-800 dark:text-gray-200 font-medium">
                                                {product.title}
                                            </td>
                                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300 text-center">
                                                {product.quantity}
                                            </td>
                                            <td className="px-4 py-3 text-green-600 dark:text-green-400 font-semibold text-center">
                                                {(product.price * product.quantity).toFixed(2)} AZN
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 text-lg">
                    Sifarişiniz yoxdur.
                </p>
            )}
        </div>

    );
};

export default Confirmed;
