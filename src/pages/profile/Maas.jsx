import React, { useEffect, useState } from "react";
import axios from "axios";

const Maas = () => {
  const LIMIT = 15;
  const [currentPage, setCurrentPage] = useState(1);
  const [cachedData, setCachedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  // Veriyi getiren fonksiyon
  const fetchSalaries = async (page) => {
    try {
      const response = await axios.get(`https://unitywomen-48288fd0e24a.herokuapp.com/api/users/oral/allUsers?page=${page}&limit=${LIMIT}`);
      const data = response.data.results;
      setCachedData((prev) => ({ ...prev, [page]: data }));
      if (data.length < LIMIT) setHasMore(false);
    } catch (error) {
      console.error("Maaşlar alınamadı:", error);
    }
  };

  // İlk sayfa yüklensin
  useEffect(() => {
    const loadFirstPage = async () => {
      setLoading(true);
      await fetchSalaries(1);
      setLoading(false);
    };
    loadFirstPage();
  }, []);

  // Yeni sayfa yüklendiğinde sonraki sayfayı arka planda al
  useEffect(() => {
    const preloadNextPage = async () => {
      if (hasMore && !cachedData[currentPage + 1]) {
        await fetchSalaries(currentPage + 1);
      }
    };
    preloadNextPage();
  }, [currentPage, cachedData, hasMore]);

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
  };

  const totalPages = Object.keys(cachedData).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Aylık Maaş Raporu</h1>

      {loading ? (
        <div className="text-center text-xl p-8">Yükleniyor...</div>
      ) : (
        <>
          <div className="overflow-x-auto">
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
                {(cachedData[currentPage] || []).map((user, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="p-4">{user.name}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">{user.rank}</td>
                    <td className="p-4">{user.total} ₺</td>
                    <td className="p-4">{user.rightTotal} ₺</td>
                    <td className="p-4">{user.leftTotal} ₺</td>
                    <td className="p-4 font-semibold text-green-600">{user.salary} ₺</td>
                    <td className="p-4">{user.mode}{user.side ? ` (${user.side})` : ""}</td>
                    <td className="p-4">{user.rate?.toFixed(1)}%</td>
                    <td className="p-4">{user.splitFactor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Sayfalama */}
          <div className="flex justify-center mt-6 flex-wrap gap-2">
            {totalPages > 1 &&
              Array.from({ length: totalPages }, (_, index) => index + 1)
                .filter((pageNum) => {
                  return (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    Math.abs(pageNum - currentPage) <= 1
                  );
                })
                .reduce((acc, pageNum, index, array) => {
                  if (index > 0 && pageNum - array[index - 1] > 1) {
                    acc.push("...");
                  }
                  acc.push(pageNum);
                  return acc;
                }, [])
                .map((page, index) =>
                  page === "..." ? (
                    <span key={index} className="px-3 py-2 text-gray-500 select-none">...</span>
                  ) : (
                    <button
                      key={index}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded ${currentPage === page
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                        }`}
                    >
                      {page}
                    </button>
                  )
                )}
          </div>

        </>
      )}
    </div>
  );
};

export default Maas;
