import React, { useEffect, useState } from "react";
import Tree from "react-d3-tree";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const ReferralTreeBinary = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [treeData, setTreeData] = useState(null);
  const [translate, setTranslate] = useState({
    x: window.innerWidth / 2,
    y: 100,
  });
  const [zoom, setZoom] = useState(1);
  const [allUsers, setAllUsers] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!userInfo) return;

      try {
        const [adminRes, userRes] = await Promise.all([
          axios.get(`https://unitywomen-48288fd0e24a.herokuapp.com/api/users/admin/${userInfo.referralCode}`),
          axios.get(`https://unitywomen-48288fd0e24a.herokuapp.com/api/users/user/${userInfo.referralCode}`),
        ]);

        const all = [...(adminRes.data?.users || []), ...(userRes.data?.users || [])];

        const unique = {};
        all.forEach((u) => {
          if (!unique[u._id]) unique[u._id] = u;
        });

        const users = Object.values(unique);
        setAllUsers(users);
        buildTree(selectedUser || userInfo, users);
      } catch (err) {
        console.error("Referral ağacı yüklenemedi:", err);
      }
    };

    fetchData();
  }, [userInfo, selectedUser]);

  const buildTree = (rootUser, users) => {
    const assigned = new Set();

    const buildBinaryTree = (parent) => {
      if (!parent || assigned.has(parent._id)) return null;
      assigned.add(parent._id);

      const children = users.filter((u) => u.referredBy === parent.referralCode);
      const [left, right] = children;

      const node = {
        name: parent.name,
        attributes: {
          Ata: parent.faze,
          Kod: parent.referralCode,
        },
      };

      const childNodes = [];
      if (left) {
        const leftNode = buildBinaryTree(left);
        if (leftNode) childNodes.push(leftNode);
      }
      if (right) {
        const rightNode = buildBinaryTree(right);
        if (rightNode) childNodes.push(rightNode);
      }

      if (childNodes.length > 0) {
        node.children = childNodes;
      }

      return node;
    };

    const rootTree = buildBinaryTree(rootUser);
    setTreeData(rootTree);
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    const filtered = allUsers.filter((user) =>
      user.name.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filtered);
  };

  const handleSuggestionClick = (user) => {
    setSearchInput(user.name);
    setSuggestions([]);
  };

  const handleSearch = () => {
    const found = allUsers.find((u) => u.name === searchInput);
    if (found) {
      setLoading(true);
      setSelectedUser(found);
      setTimeout(() => setLoading(false), 1000); // Simülasyon için
    }
  };

  const handleReset = () => {
    setSelectedUser(null);
    setSearchInput("");
    setSuggestions([]);
  };

  const handleBackClick = () => {
    navigate("/profile");
  };

  const renderCustomNode = ({ nodeDatum }) => {
    const randomColor = getRandomColor();
    const rectWidth = Math.max(120, nodeDatum.name.length * 8, 200);
    const rectX = -(rectWidth / 2);

    return (
      <g>
        <rect
          width={rectWidth}
          height="65"
          x={rectX}
          y="-30"
          fill={randomColor}
          stroke="black"
          strokeWidth="2"
        />
        <text
          textAnchor="middle"
          x="0"
          y="-12"
          fontSize="14"
          fill="black"
          stroke="black"
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
          stroke="white"
          strokeWidth="0.5"
        >
          Kod: {nodeDatum.attributes?.Kod}
        </text>
      </g>
    );
  };

  const handleWheel = (e) => {
    const zoomFactor = 0.1;
    const newZoom = e.deltaY < 0 ? zoom + zoomFactor : zoom - zoomFactor;
    setZoom(Math.max(0.1, Math.min(newZoom, 3)));
  };

  const handleMouseMove = (e) => {
    if (e.buttons === 1) {
      setTranslate((prev) => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY,
      }));
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("wheel", handleWheel);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <h2 className="text-3xl font-bold text-center mt-4 mb-2">Referans Ağacı 🌳</h2>

      <div className="flex items-center justify-between p-4 gap-4 flex-wrap">
        <button
          onClick={handleBackClick}
          className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-900"
        >
          ← Geri Dön
        </button>

        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={searchInput}
            onChange={handleSearchInputChange}
            placeholder="Kullanıcı ara..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          {suggestions.length > 0 && (
            <ul className="absolute left-0 right-0 max-h-[200px] overflow-y-auto bg-white border border-gray-300 rounded-md shadow-md z-10">
            {suggestions.map((user) => (
                <li
                  key={user._id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSuggestionClick(user)}
                >
                  {user.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-800"
        >
          Ara
        </button>

        <button
          onClick={handleReset}
          className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
        >
          Sıfırla
        </button>
      </div>

      {loading && (
        <p className="text-center text-lg text-blue-600 font-semibold mb-4 animate-pulse">
          🔍 Aranıyor...
        </p>
      )}

      {treeData && (
        <Tree
          data={treeData}
          orientation="vertical"
          translate={translate}
          zoom={zoom}
          collapsible={false}
          pathFunc="step"
          separation={{ siblings: 2, nonSiblings: 3 }}
          renderCustomNodeElement={renderCustomNode}
          zoomable={true}
          draggable={true}
        />
      )}
    </div>
  );
};

export default ReferralTreeBinary;
