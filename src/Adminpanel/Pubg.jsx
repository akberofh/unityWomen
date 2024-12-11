import React, { useEffect, useState } from "react";
import axios from "axios";

function ValorantProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("https://grez-shop.vercel.app/api/pubg")
      .then((response) => setProducts(response.data.allPubges))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="border-b py-6 flex flex-col sm:flex-row items-center sm:items-start gap-6"
        >
          <img
            src={`data:image/jpeg;base64,${product.image}`}
            alt={product.title}
            className="w-40 h-40 object-cover rounded-md shadow-md"
          />
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-bold">{product.title}</h3>
            <p className="text-lg text-gray-700">Fiyat: {product.price} Azn</p>
            <p className="text-sm text-green-600">Stok: {product.stock}</p>
            <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Sepete Ekle
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ValorantProducts;
