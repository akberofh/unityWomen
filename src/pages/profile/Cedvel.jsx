import React, { useEffect, useState, useRef } from "react";
import Tree from "react-d3-tree";
import axios from "axios";
import { useSelector } from "react-redux";

// Rastgele renk oluşturma fonksiyonu
const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const ReferralTreeBinary = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const [treeData, setTreeData] = useState(null);
    const treeRef = useRef();

    useEffect(() => {
        const fetchData = async () => {
            if (!userInfo) return;

            try {
                const [adminRes, userRes] = await Promise.all([
                    axios.get(`https://unity-women-backend.vercel.app/api/users/admin/${userInfo.referralCode}`),
                    axios.get(`https://unity-women-backend.vercel.app/api/users/user/${userInfo.referralCode}`)
                ]);

                const allUsers = [
                    ...(adminRes?.data?.users || []),
                    ...(userRes?.data?.users || []),
                ];

                const uniqueUsers = {};
                allUsers.forEach(user => {
                    if (!uniqueUsers[user._id]) {
                        uniqueUsers[user._id] = user;
                    }
                });

                const assigned = new Set();

                const buildBinaryTree = (parent) => {
                    if (!parent || assigned.has(parent._id)) return null;
                    assigned.add(parent._id);

                    // uşaqları tapırıq
                    const children = Object.values(uniqueUsers).filter(
                        u => u.referredBy === parent.referralCode
                    );

                    const [left, right] = children;

                    return {
                        name: parent.name,
                        attributes: {
                            Ata: parent.faze,
                            Kod: parent.referralCode,
                        },
                        children: [
                            left ? buildBinaryTree(left) : { name: "Boş Sol" },
                            right ? buildBinaryTree(right) : { name: "Boş Sağ" },
                        ],
                    };
                };

                const rootTree = buildBinaryTree(userInfo);
                setTreeData(rootTree);

            } catch (err) {
                console.error("Referral ağacı yüklənmədi:", err);
            }
        };

        fetchData();
    }, [userInfo]);

    // Kişisel kullanıcı bilgilerini sade şekilde göstermek için custom node
    const renderCustomNode = ({ nodeDatum }) => {
        const randomColor = getRandomColor(); // Rastgele renk oluştur
        return (
            <g>
                <rect
                    width="120"
                    height="60"
                    x="-60"
                    y="-30"
                    fill={randomColor} // Rengi burada ayarlıyoruz
                    stroke="black"
                    strokeWidth="2"
                />
                <text
                    textAnchor="middle"
                    x="0"
                    y="-10"
                    fontSize="10" // Daha küçük font boyutu
                    fill="black"
                
                    color="white"
                >
                    {nodeDatum.name}
                </text>
                <text
                    textAnchor="middle"
                    x="0"
                    y="10"
                    fontSize="9" // Daha küçük font boyutu
                    fill="white"
                >
                    Ata: {nodeDatum.attributes?.Ata}
                </text>
                <text
                    textAnchor="middle"
                    x="0"
                    y="20"
                    fontSize="8" // Daha küçük font boyutu
                    fill="white"
                >
                    Kod: {nodeDatum.attributes?.Kod}
                </text>
            </g>
        );
    };

    return (
        <div style={{ width: "100%", height: "100vh" }}>
            <h2 className="text-3xl font-bold text-center mt-4 mb-2">Referans Ağacı 🌳</h2>
            {treeData && (
                <Tree
                    data={treeData}
                    orientation="vertical"
                    translate={{ x: window.innerWidth / 2, y: 100 }}
                    collapsible={false}
                    pathFunc="step"
                    separation={{ siblings: 1, nonSiblings: 2 }}
                    zoomable
                    renderCustomNodeElement={renderCustomNode} // Burada özel node bileşenini kullanıyoruz
                />
            )}
        </div>
    );
};

export default ReferralTreeBinary;
