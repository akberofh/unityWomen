import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
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
                        ...(adminRes?.data?.users || []),
                        ...(userRes?.data?.users || [])
                    ];

                    setAllReferredUsers(combinedUsers);
                } catch (error) {
                    console.error("Referral fetch error:", error);
                }
            };

            fetchAllReferredUsers();
        }
    }, [userInfo]);

    const renderUser = (user, level = 0, renderedUsers = new Set()) => {
        // Aynı kullanıcıyı tekrar gösterme
        if (renderedUsers.has(user._id)) return null;
        renderedUsers.add(user._id);

        const childUsers = allReferredUsers
            .filter((u) => u.referredBy === user.referralCode)
            .slice(0, 2);

        const getColor = (level) => {
            if (level === 0) return 'bg-blue-100';
            if (level === 1) return 'bg-green-100';
            return 'bg-orange-100';
        };

        return (
            <div key={user._id} className="flex flex-col items-center relative">
                <div className={`${getColor(level)} p-4 w-52 rounded-xl shadow text-center border`}>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.faze}</p>
                    <p className="text-xs text-gray-500">Kod: {user.referralCode}</p>
                </div>

                {childUsers.length > 0 && (
                    <div className="w-0.5 h-6 bg-gray-400"></div>
                )}

                {childUsers.length > 0 && (
                    <div className="flex justify-center items-start relative mt-2">
                        {childUsers.length === 2 && (
                            <div className="absolute top-3 left-1/2 w-full h-0.5 bg-gray-400 transform -translate-x-1/2 z-0"></div>
                        )}

                        {childUsers.map((childUser) => (
                            <div key={childUser._id} className="flex flex-col items-center px-6 z-10">
                                <div className="w-0.5 h-6 bg-gray-400"></div>
                                {renderUser(childUser, level + 1, renderedUsers)}
                            </div>
                        ))}
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
                {userInfo && renderUser(userInfo, 0, new Set())}
            </div>
        </div>
    );
};

export default ReferralTree;
