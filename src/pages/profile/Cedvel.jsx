import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { BsArrowDown } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const ReferralTree = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [allReferredUsers, setAllReferredUsers] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    if (userInfo) {
      const fetchAllReferredUsers = async () => {
        try {
          const [adminRes, userRes] = await Promise.all([
            axios.get(`https://unity-women-backend.vercel.app/api/users/admin/${userInfo.referralCode}`),
            axios.get(`https://unity-women-backend.vercel.app/api/users/user/${userInfo.referralCode}`)
          ]);

          const combinedUsers = [
            ...adminRes?.data?.users || [],
            ...userRes?.data?.users || []
          ];

          setAllReferredUsers(combinedUsers);
        } catch (error) {
          console.error("Referral fetch error:", error);
        }
      };

      fetchAllReferredUsers();
    }
  }, [userInfo]);

  // Kullanıcıları dinamik olarak render et
  const renderUser = (user, level = 0) => {
    // Alt seviyede sadece 2 kullanıcı gösterilecek
    const childUsers = allReferredUsers.filter((u) => u.referredBy === user.referralCode).slice(0, 2);

    return (
      <div key={user._id} className="relative flex flex-col items-center">
  
        {/* Kullanıcı */}
        <div className={`bg-${level === 0 ? 'blue' : level === 1 ? 'green' : 'orange'}-100 p-4 w-52 rounded-xl shadow text-center border`}>
          <p className="font-semibold">{user.name}</p>
          <p className="text-sm text-gray-600">{user.faze}</p>
          <p className="text-xs text-gray-500">Kod: {user.referralCode}</p>
        </div>

        {/* Oklar */}
        {childUsers.length > 0 && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 mt-4">
            <BsArrowDown className="text-2xl text-gray-500" />
          </div>
        )}

        {/* Çocuk Kullanıcılar */}
        {childUsers.length > 0 && (
          <div className="flex justify-between gap-12 mt-8">
            {childUsers.map((childUser) => renderUser(childUser, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="overflow-x-auto overflow-y-auto min-h-screen p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-8">Referans Ağacı 🌳</h2>
      <div className="flex justify-center items-center ">
                <button
                    onClick={() => navigate("/profile")}
                    className="text-blue-500 m-10 hover:text-white hover:bg-blue-600 hover:shadow-lg px-6 py-2 rounded-full border border-blue-500 transition-all duration-300"
                >
                    Geri
                </button>
            </div>
      <div className="flex flex-col items-center space-y-6">
     

        {renderUser(userInfo, 0)}
      </div>
    </div>
  );
};

export default ReferralTree;
