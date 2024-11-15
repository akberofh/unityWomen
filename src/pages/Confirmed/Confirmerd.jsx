import React, { useEffect } from "react";
import { useGetConfirmedQuery } from "../../redux/slices/ConfirmedApiSlice";
import { setConfirmed } from "../../redux/slices/confirmedSlice";
import { useDispatch } from "react-redux";

const Confirmed = () => {
    const dispatch = useDispatch();
    const { data, isLoading } = useGetConfirmedQuery();

    useEffect(() => {
        if (data && data[0]?.confirmedCarts) {
            dispatch(setConfirmed(data[0].confirmedCarts)); // Veriyi doğru şekilde al
        }
    }, [data, dispatch]);

    // Verinin doğru şekilde alınmasını kontrol et
    console.log("Data:", data); 
    console.log("Confirmed Carts:", data?.[0]?.confirmedCarts); 
 

    return (
        <div className="container mx-auto p-4">
            {isLoading ? (
                <p className="text-center text-gray-600">Yükleniyor...</p>
            ) : (
                <>
                    {data?.confirmedCarts?.length > 0 ? (
                        data.confirmedCarts.map((cart) => (
                            <div key={cart._id} className="border p-4 my-2">
                
                                <p>Payment Status: {cart.paymentStatus}</p>
                                <p>Confirmed At: {new Date(cart.confirmedAt).toLocaleString()}</p>
    
                                <h2>Products:</h2>
                                {cart.products.length > 0 ? (
                                    cart.products.map((product) => (
                                        <div key={product._id} className="border-t mt-2 pt-2">
                                            <p>Quantity: {product.quantity}</p> {/* number */}
                                            {product.thumbnail && typeof product.thumbnail === "string" ? (
                                                <img src={product.thumbnail} alt="Product Thumbnail" className="w-16 h-16" />
                                            ) : (
                                                <p>No Thumbnail Available</p>
                                            )}
                                            <p>Price: {product.totalPrice}</p> {/* number */}
                                        </div>
                                    ))
                                ) : (
                                    <p>No Products Available</p>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-600">No confirmed carts available.</p>
                    )}
                </>
            )}
        </div>
    );
    
    
    
};

export default Confirmed;
