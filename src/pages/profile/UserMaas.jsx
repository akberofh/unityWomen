import React, { useEffect, useState } from "react";
import axios from "axios";

const UserMaas = () => {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalaries = async () => {
      try {
        const response = await axios.get("https://unitywomen-48288fd0e24a.herokuapp.com/api/mine", {
          withCredentials: true,
        });
        setAllData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error("Maaşlar alınamadı:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSalaries();
  }, []);

  useEffect(() => {
    const filtered = allData.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredData(filtered);
  }, [search, allData]);

  const handleSuggestionClick = (name) => {
    setSearch(name);
  };

  return (
    <div className="max-w-full mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Aylık Maaş Raporu</h1>

      {/* Arama ve Öneri Alanı */}
      <div className="relative flex flex-col items-center mb-4">
        <input
          type="text"
          placeholder="İsimle ara..."
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
                  {item.name}{" "}
                  <span className="text-gray-400 text-xs">({item.email})</span>
                </div>
              ))}
          </div>
        )}
      </div>

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
                  <th className="p-4">Unvan</th>
                  <th className="p-4">Rütbə</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((user, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 font-bold text-gray-700">{i + 1}</td>
                    <td className="p-4">{user.name}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">{user.rank || "-"}</td>
                    <td className="p-4 font-semibold text-green-600">{user.salary} AZN</td>
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

export default UserMaas;
