import React, { useEffect, useState } from "react";
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
    const [translate, setTranslate] = useState({ x: window.innerWidth / 2, y: 100 }); // Başlangıç pozisyonu
    const [zoom, setZoom] = useState(1); // Başlangıç zoom seviyesi

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
        const nameLength = nodeDatum.name.length;

        // Metnin uzunluğuna göre dinamik kutu genişliği (maksimum 200px, minimum 120px)
        const rectWidth = Math.max(120, nameLength * 8, 200);  // Minimum 120px ve maksimum 200px genişlik ekledim

        // Kutu X koordinatını ortalamak için
        const rectX = -(rectWidth / 2);  // Kutuyu ortalamak için X koordinatını dinamik olarak ayarlıyoruz

        return (
            <g>
                <rect
                    width={rectWidth}
                    height="65"
                    x={rectX} // Kutuyu ortalamak için X koordinatını ayarlıyoruz
                    y="-30"
                    fill={randomColor} // Rengi burada ayarlıyoruz
                    stroke="black"
                    strokeWidth="2"
                />
                <text
                    textAnchor="middle"
                    x="0"
                    y="-12"
                    fontSize="14"
                    fill="black"
                    fontWeight="normal"
                    stroke="black"
                    fontFamily="sans-serif"
                    strokeWidth="0.5"
                >
                    {nodeDatum.name}
                </text>
                <text
                    textAnchor="middle"
                    x="0"
                    y="10"
                    fontSize="14"
                    fill="white"
                    fontWeight="normal"
                    stroke="white"
                    strokeWidth="0.5"
                >
                    Ata: {nodeDatum.attributes?.Ata}
                </text>
                <text
                    textAnchor="middle"
                    x="0"
                    y="25"
                    fontSize="14"
                    fill="white"
                    fontWeight="normal"
                    stroke="white"
                    strokeWidth="0.5"
                >
                    Kod: {nodeDatum.attributes?.Kod}
                </text>
            </g>
        );
    };

    // Zoom işlevselliği
    const handleWheel = (e) => {
        const zoomFactor = 0.1;
        const newZoom = e.deltaY < 0 ? zoom + zoomFactor : zoom - zoomFactor;
        setZoom(Math.max(0.1, Math.min(newZoom, 3))); // Zoom seviyesini sınırla
    };

    // Kaydırma işlemi için işlev
    const handleMouseMove = (e) => {
        if (e.buttons === 1) {
            const deltaX = e.movementX;
            const deltaY = e.movementY;
            setTranslate((prev) => ({
                x: prev.x + deltaX,
                y: prev.y + deltaY,
            }));
        }
    };

    useEffect(() => {
        // Mouse sürükleme işlemi için event listener ekle
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("wheel", handleWheel);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("wheel", handleWheel);
        };
    }, [handleMouseMove, handleWheel]);

    return (
        <div style={{ width: "100%", height: "100vh" }}>
            <h2 className="text-3xl font-bold text-center mt-4 mb-2">Referans Ağacı 🌳</h2>
            {treeData && (
                <Tree
                    data={treeData}
                    orientation="vertical"
                    translate={translate} // Sürükleme işlemi ile kaydırma
                    zoom={zoom} // Zoom seviyesini uygula
                    collapsible={false}
                    pathFunc="step"
                    separation={{ siblings: 2, nonSiblings: 3 }}  // Burada kutular arasındaki mesafeyi arttırıyoruz
                    renderCustomNodeElement={renderCustomNode} // Burada özel node bileşenini kullanıyoruz
                    zoomable={true} // Zoom özelliğini etkinleştiriyoruz
                    draggable={true} // Sürüklenebilir özelliği etkinleştiriyoruz
                />
            )}
        </div>
    );
};

export default ReferralTreeBinary;
