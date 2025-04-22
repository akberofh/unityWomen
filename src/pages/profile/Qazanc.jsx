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
                const response = await axios.get("https://unity-women-backend.vercel.app/api/mane", {
                    withCredentials: true,
                });
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
                item.referrerName.toLowerCase().includes(search.toLowerCase())
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

    const handleSuggestionClick = (referrerName) => {
        setSearch(referrerName);
    };

    const filterButton = (label, key, value) => (
        <button
            onClick={() => toggleFilter(key, value)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${filters[key] === value
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                }`}
        >
            {label}
        </button>
    );

    return (
        <div className="max-w-full mx-auto px-4 py-8 bg-white dark:bg-gray-900">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">Mükafat Raporu</h1>

            {/* Arama ve Öneri Alanı */}
            <div className="relative flex flex-col items-center mb-4">
                <input
                    type="text"
                    placeholder="Adla ara..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full max-w-md p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:focus:ring-blue-500"
                />

                {/* Öneri listesi */}
                {search && (
                    <div className="absolute top-full mt-1 w-full max-w-md bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-y-auto z-50 dark:bg-gray-800 dark:border-gray-700">
                        {allData
                            .filter((item) =>
                                item.referrerName.toLowerCase().includes(search.toLowerCase())
                            )
                            .slice(0, 10)
                            .map((item, idx) => (
                                <div
                                    key={idx}
                                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm text-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
                                    onClick={() => handleSuggestionClick(item.referrerName)}
                                >
                                    {item.referrerName} <span className="text-gray-400 text-xs dark:text-gray-400">({item.referrerEmail})</span>
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
                <div className="text-center text-xl p-8 text-gray-900 dark:text-gray-100">Yüklənir...</div>
            ) : (
                <>
                    <div className="overflow-x-auto max-h-[600px] overflow-y-auto border rounded-xl shadow-lg dark:border-gray-700">
                        <table className="min-w-full bg-white text-sm dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                            <thead className="bg-gray-100 sticky top-0 z-10 text-gray-700 text-left dark:bg-gray-700 dark:text-gray-200">
                                <tr>
                                    <th className="px-4 py-2">#</th>
                                    <th className="p-4">İstifadəçi</th>
                                    <th className="p-4">Email</th>
                                    <th className="p-4">Toplam Qazanc</th>
                                    <th className="p-4">Dəvət Edilən</th>
                                    <th className="p-4">Ödəniş Edənlər</th>
                                    <th className="p-4">Periyot Qazancı</th> {/* Yeni kolon */}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((user, i) => (
                                    <tr key={i} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-4 py-2 font-bold text-gray-700 dark:text-gray-200">{i + 1}</td>
                                        <td className="p-4 text-gray-700 dark:text-gray-200">{user.referrerName}</td>
                                        <td className="p-4 text-gray-700 dark:text-gray-200">{user.referrerEmail}</td>
                                        <td className="p-4 text-gray-700 dark:text-gray-200">{user.totalEarned} AZN</td>
                                        <td className="p-4 text-gray-700 dark:text-gray-200">{user.count}</td>
                                        <td className="p-4 text-gray-700 dark:text-gray-200">{user.totalInvited}</td>
                                        <td className="p-4 text-gray-700 dark:text-gray-200">
                                            {user.periodEarnings?.map((period, index) => (
                                                <div key={index}>
                                                    <strong>{period.periodLabel}:</strong> {period.earned} AZN
                                                </div>
                                            ))}
                                        </td> {/* Periyot kazançları */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Toplam veriler */}
                    <div className="mt-4 text-gray-700 dark:text-gray-200">
                        <p><strong>Toplam Dəvət Edilən:</strong> {filteredData.reduce((acc, user) => acc + user.totalInvited, 0)}</p>
                        <p><strong>Toplam Qazanc:</strong> {filteredData.reduce((acc, user) => acc + user.totalEarned, 0)} AZN</p>
                    </div>

                    {filteredData.length === 0 && (
                        <p className="text-center text-gray-500 mt-6 dark:text-gray-400">Mükafat yoxdur.</p>
                    )}
                </>
            )}
        </div>
    );
};

export default Qazanc;
