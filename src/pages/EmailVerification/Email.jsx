import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Email = () => {
  const [email, setEmail] = useState("");
  const [verficationToken, setVerficationToken] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/api/users/verifyEmail", {
        email,
        verficationToken,
      });

      if (response.status === 200) {
        // Başarılı olursa dashboard'a yönlendir
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("E-posta doğrulama hatası:", error);
      // Hata durumunda bir uyarı gösterilebilir
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center">E-posta Doğrulama</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-posta:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            />
          </div>
          <div>
            <label htmlFor="verificationToken" className="block text-sm font-medium text-gray-700">Doğrulama Token'ı:</label>
            <input
              type="text"
              id="verificationToken"
              value={verficationToken}
              onChange={(e) => setVerficationToken(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Doğrula
          </button>
        
        </form>
      </div>
    </div>
  );
};

export default Email;
