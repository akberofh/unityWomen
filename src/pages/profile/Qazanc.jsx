import React, { useEffect, useState } from "react";
import axios from "axios";

const Qazanc = () => {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    earnedAboveZero: null,
    invitedAboveZero: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://unity-women-backend.vercel.app/api/mane",
            {          withCredentials: true,
            }
        );
        setAllData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error("Veri alınamadı:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, filters, allData]);

  const applyFilters = () => {
    let tempData = [...allData];

    if (search) {
      tempData = tempData.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filters.earnedAboveZero !== null) {
      tempData = tempData.filter((item) =>
        filters.earnedAboveZero ? item.totalEarned > 0 : item.totalEarned <= 0
      );
    }

    if (filters.invitedAboveZero !== null) {
      tempData = tempData.filter((item) =>
        filters.invitedAboveZero ? item.totalInvited > 0 : item.totalInvited <= 0
      );
    }

    setFilteredData(tempData);
  };

  const toggleFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? null : value,
    }));
  };

  const handleSuggestionClick = (name) => {
    setSearch(name);
  };

  const filterButton = (label, key, value) => (
    <button
      onClick={() => toggleFilter(key, value)}
      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
        filters[key] === value
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-white text-gray-700 border-gray-300"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="max-w-full mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Mükafat Raporu</h1>

      {/* Arama ve Öneri Alanı */}
      <div className="relative flex flex-col items-center mb-4">
        <input
          type="text"
          placeholder="Adla ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Öneri listesi */}
        {search && (
          <div className="absolute top-full mt-1 w-full max-w-md bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-y-auto z-50">
            {allData
              .filter((item) =>
                item.name.toLowerCase().includes(search.toLowerCase())
              )
              .slice(0, 10)
              .map((item, idx) => (
                <div
                  key={idx}
                  className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm text-gray-700"
                  onClick={() => handleSuggestionClick(item.name)}
                >
                  {item.name} <span className="text-gray-400 text-xs">({item.email})</span>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Filtre Butonları */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {filterButton("Qazancı Olanlar", "earnedAboveZero", true)}
        {filterButton("Qazancı Olmayanlar", "earnedAboveZero", false)}
        {filterButton("Dəvət Etdiyi Olanlar", "invitedAboveZero", true)}
        {filterButton("Dəvet Etməyənler", "invitedAboveZero", false)}
      </div>

      {/* Tablo */}
      {loading ? (
        <div className="text-center text-xl p-8">Yükleniyor...</div>
      ) : (
        <>
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto border rounded-xl shadow-lg">
            <table className="min-w-full bg-white text-sm">
              <thead className="bg-gray-100 sticky top-0 z-10 text-gray-700 text-left">
                <tr>
                  <th className="px-4 py-2">#</th>
                  <th className="p-4">İstifadəçi</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Toplam Qazanc</th>
                  <th className="p-4">Dəvət Edilən</th>
                  <th className="p-4">Ödəniş Edənlər</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((user, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 font-bold text-gray-700">{i + 1}</td>
                    <td className="p-4">{user.name}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">{user.totalEarned} AZN</td>
                    <td className="p-4">{user.count}</td>
                    <td className="p-4">{user.totalInvited}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredData.length === 0 && (
            <p className="text-center text-gray-500 mt-6">Sonuç bulunamadı.</p>
          )}
        </>
      )}
    </div>
  );
};

export default Qazanc;
