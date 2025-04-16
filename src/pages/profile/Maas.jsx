import React, { useEffect, useState } from "react";
import axios from "axios";

const LIMIT = 15;

const Maas = () => {
  const [cachedData, setCachedData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [maxPage, setMaxPage] = useState(1);

  const fetchSalaries = async (page) => {
    if (cachedData[page]) return; // önceden çekilmişse yeniden çekme

    setLoading(true);
    try {
      const response = await axios.get(`https://unitywomen-48288fd0e24a.herokuapp.com/api/users/oral/allUsers?page=${page}&limit=${LIMIT}`);
      const newSalaries = response.data.results;

      setCachedData((prev) => ({
        ...prev,
        [page]: newSalaries,
      }));

      if (newSalaries.length < LIMIT) {
        setHasMore(false);
      } else {
        setMaxPage((prev) => Math.max(prev, page + 1)); // bir sonraki sayfayı hazırlamak için
      }

    } catch (error) {
      console.error("Maaşlar alınamadı:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalaries(currentPage);
  }, [currentPage]);

  // Arka planda önceden verileri getir
  useEffect(() => {
    const preloadNextPage = async () => {
      if (hasMore && !cachedData[currentPage + 1]) {
        await fetchSalaries(currentPage + 1);
      }
    };
    preloadNextPage();
  }, [currentPage, cachedData, hasMore]);

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const salaries = cachedData[currentPage] || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Aylık Maaş Raporu</h1>

      {loading && salaries.length === 0 ? (
        <div className="text-center text-xl p-8">Yükleniyor...</div>
      ) : (
        <>
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full bg-white shadow-md rounded-xl overflow-hidden">
              <thead className="bg-gray-100">
                <tr className="text-left text-sm text-gray-700">
                  <th className="p-4">Kullanıcı</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Unvan</th>
                  <th className="p-4">Kazanç Toplamı</th>
                  <th className="p-4">Sağ Toplamı</th>
                  <th className="p-4">Sol Toplamı</th>
                  <th className="p-4">Maaş</th>
                  <th className="p-4">Mod</th>
                  <th className="p-4">Oran (%)</th>
                  <th className="p-4">Bölme Faktörü</th>
                </tr>
              </thead>
              <tbody>
                {salaries.map((user, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="p-4">{user.name}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">{user.rank}</td>
                    <td className="p-4">{user.total} ₺</td>
                    <td className="p-4">{user.rightTotal} ₺</td>
                    <td className="p-4">{user.leftTotal} ₺</td>
                    <td className="p-4 font-semibold text-green-600">{user.salary} ₺</td>
                    <td className="p-4">{user.mode}{user.side ? ` (${user.side})` : ""}</td>
                    <td className="p-4">{user.rate.toFixed(1)}%</td>
                    <td className="p-4">{user.splitFactor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Sayfa numaraları */}
          <div className="flex justify-center gap-2">
            {Array.from({ length: maxPage }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                className={`px-4 py-2 rounded ${pageNum === currentPage ? "bg-blue-600 text-white" : "bg-gray-200 text-black"} hover:bg-blue-500`}
                onClick={() => handlePageClick(pageNum)}
              >
                {pageNum}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Maas;
