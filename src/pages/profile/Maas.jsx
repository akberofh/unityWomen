import React, { useEffect, useState } from "react";
import axios from "axios";

const Maas = () => {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    salary: null,
    mode: null,
  });

  useEffect(() => {
    const fetchSalaries = async () => {
      try {
        const response = await axios.get("https://unitywomen-48288fd0e24a.herokuapp.com/api/maas");
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
    applyFilters();
  }, [search, filters, allData]);

  const applyFilters = () => {
    let tempData = [...allData];

    if (search) {
      tempData = tempData.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filters.salary !== null) {
      tempData = tempData.filter((item) =>
        filters.salary ? item.salary > 0 : item.salary <= 0
      );
    }

    if (filters.mode) {
      tempData = tempData.filter((item) =>
        item.mode?.toLowerCase().includes(filters.mode.toLowerCase())
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
    setFilters((prev) => ({ ...prev })); // tetikle
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
      <h1 className="text-3xl font-bold mb-6 text-center">Aylıq Maaş Raporu</h1>

      {/* Arama ve Öneri Alanı */}
      <div className="relative flex flex-col items-center mb-4">
        <input
          type="text"
          placeholder="Adın axtar..."
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
        {filterButton("Maaş Alanlar", "salary", true)}
        {filterButton("Maaş Almayanlar", "salary", false)}
        {filterButton("İki Qol", "mode", "Dual Side")}
        {filterButton("Tək Qol", "mode", "Single Side")}
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
                  <th className="p-4">Rütbə</th>
                  <th className="p-4">Qazanc Toplamı</th>
                  <th className="p-4">Sağ Toplamı</th>
                  <th className="p-4">Sol Toplamı</th>
                  <th className="p-4">Maaş</th>
                  <th className="p-4">Mod</th>
                  <th className="p-4">Dərəcəsi (%)</th>
                  <th className="p-4">Bölme Faktoru</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((user, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 font-bold text-gray-700">{i + 1}</td>
                    <td className="p-4">{user.name}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">{user.rank || "-"}</td>
                    <td className="p-4">{user.total} AZN</td>
                    <td className="p-4">{user.rightTotal} AZN</td>
                    <td className="p-4">{user.leftTotal} AZN</td>
                    <td className="p-4 font-semibold text-green-600">{user.salary} AZN</td>
                    <td className="p-4">{user.mode}</td>
                    <td className="p-4">{user.rate?.toFixed(1)}%</td>
                    <td className="p-4">{user.splitFactor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredData.length === 0 && (
            <p className="text-center text-gray-500 mt-6">Tapılmadı.</p>
          )}
        </>
      )}
    </div>
  );
};

export default Maas;
