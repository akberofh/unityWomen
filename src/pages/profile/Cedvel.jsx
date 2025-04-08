import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ReferralTree = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const [allReferredUsers, setAllReferredUsers] = useState([]);
    const containerRef = useRef(null);
    const treeRef = useRef(null);
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

    useLayoutEffect(() => {
        const container = containerRef.current;
        const tree = treeRef.current;
        if (container && tree) {
            const center = (tree.scrollWidth - container.clientWidth) / 2;
            container.scrollLeft = center;
        }
    }, [allReferredUsers]);

    const renderUser = (user, level = 0, visited = new Set()) => {
        if (!user || visited.has(user._id)) return null;
        visited.add(user._id);

        const childUsers = allReferredUsers
            .filter((u) => u.referredBy === user.referralCode)
            .slice(0, 2);

        const getColor = (level) => {
            if (level === 0) return 'bg-blue-100';
            if (level === 1) return 'bg-green-100';
            return 'bg-orange-100';
        };

        return (
            <div key={user._id} className="flex flex-col items-center relative min-w-[200px]">
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
                            <div className="absolute top-3 left-0 right-0 h-0.5 bg-gray-400 z-0"></div>
                        )}

                        {childUsers.map((child) => (
                            <div key={child._id} className="flex flex-col items-center px-6 z-10">
                                <div className="w-0.5 h-6 bg-gray-400"></div>
                                {renderUser(child, level + 1, visited)}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <h2 className="text-3xl font-bold text-center mb-6">Referans Ağacı 🌳</h2>

            <div className="flex justify-center mb-4">
                <button
                    onClick={() => navigate("/profile")}
                    className="text-blue-500 hover:bg-blue-500 hover:text-white px-4 py-2 border border-blue-500 rounded-full transition"
                >
                    Geri
                </button>
            </div>

            <div
                ref={containerRef}
                className="overflow-x-auto overflow-y-auto w-full min-h-screen"
                style={{
                    touchAction: "pinch-zoom", // Sadece pinch-zoom izni veriliyor
                    WebkitOverflowScrolling: "touch", // iOS için düzgün scroll
                }}
            >
                <div
                    ref={treeRef}
                    className="inline-block min-w-full justify-center"
                >
                    {userInfo && renderUser(userInfo, 0, new Set())}
                </div>
            </div>
        </div>
    );
};

export default ReferralTree;
