import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Maas = () => {
  const [data, setData] = useState([]);
  const [allPeriods, setAllPeriods] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [filteredPeriodSalaries, setFilteredPeriodSalaries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [salaryData, setSalaryData] = useState(null);
  const [error, setError] = useState(null);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchSalaryData = async () => {
      try {
        const response = await axios.get(`https://unitywomenbackend-94ca2cb93fbd.herokuapp.com/api/users/salary/${userInfo.referralCode}`);
        setSalaryData(response.data);
        setError(null);
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Maaş verisi alınarkən bir xəta baş verdi.";
        setError(errorMessage);
      }
    };
    fetchSalaryData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://unitywomenbackend-94ca2cb93fbd.herokuapp.com/api/mine', { withCredentials: true });
        setData(response.data);

        const all = response.data.flatMap(user => user.periodSalaries.map(p => p.periodLabel));
        const uniquePeriods = [...new Set(all)];
        setAllPeriods(uniquePeriods);

        if (uniquePeriods.length > 0) {
          setSelectedPeriod(uniquePeriods[0]);
        }
      } catch (error) {
        console.error('Veri alınırken hata oluştu:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedPeriod && data.length > 0) {
      const filtered = data
        .map(user => {
          const matching = user.periodSalaries.find(p => p.periodLabel === selectedPeriod);
          return matching ? { ...matching, totalUserSalary: user.salary } : null;
        })
        .filter(Boolean);
      setFilteredPeriodSalaries(filtered);
    }
  }, [selectedPeriod, data]);

  const filteredSalaries = filteredPeriodSalaries.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white px-6 py-10 transition-colors">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Kendi maaş tablosu */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-2xl border border-gray-200 dark:border-white/10 transition-all duration-300">
          <h1 className="text-3xl font-bold mb-4 text-center">🧾 Şəxsi Maaş Paneli</h1>
          {error ? (
            <div className="text-center text-red-500 font-semibold py-4">{error}</div>
          ) : !salaryData || !salaryData.periodSalaries ? (
            <div className="text-center text-gray-500 dark:text-gray-300">Verilər yüklənir...</div>
          ) : (
            <div className="overflow-x-auto rounded-xl">
              <table className="w-full min-w-[800px] table-auto text-sm text-left">
                <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 sticky top-0 z-10">
                  <tr>
                    <th className="p-4">📸 Foto</th>
                    <th className="p-4">👤 Ad Soyad</th>
                    <th className="p-4">📅 Periyod</th>
                    <th className="p-4">🎖 Rütbə</th>
                    <th className="p-4">💸 Maaş</th>
                  </tr>
                </thead>
                <tbody>
                  {salaryData.periodSalaries.map((period, i) => (
                    <tr key={i} className="hover:bg-gray-200 dark:hover:bg-white/10 transition">
                      <td className="p-4">
                        <img src={period.photo} alt="Profil" className="w-12 h-12 rounded-full object-cover border" />
                      </td>
                      <td className="p-4">{period.name}</td>
                      <td className="p-4">{period.periodLabel}</td>
                      <td className="p-4">{period.rank}</td>
                      <td className="p-4 text-green-600 dark:text-green-400 font-semibold">{period.salary.toFixed(2)} ₼</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Filtre ve arama */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white p-3 rounded-xl shadow-sm"
          >
            {allPeriods.map((period, i) => (
              <option key={i} value={period}>
                {period}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="🔍 İstifadəçi ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white p-3 rounded-xl shadow-sm w-full md:w-1/2"
          />
        </div>

        {/* Tüm kullanıcıların maaş tablosu */}
        <div className="overflow-x-auto bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-white/10 shadow-lg">
          <div className="max-h-[550px] overflow-y-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="p-4">#</th>
                  <th className="p-4">📷 Fotoğraf</th>
                  <th className="p-4">👤 Ad</th>
                  <th className="p-4">📧 Email</th>
                  <th className="p-4">🎖 Rütbə</th>
                  <th className="p-4">📆 Tarix Maaşı</th>
                  <th className="p-4">💰 Toplam Maaş</th>
                </tr>
              </thead>
              <tbody>
                {filteredSalaries.map((user, i) => (
                  <tr key={i} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-white/10 transition">
                    <td className="p-4 font-semibold">{i + 1}</td>
                    <td className="p-4">
                      <img src={user.photo} alt={user.name} className="w-12 h-12 rounded-full border" />
                    </td>
                    <td className="p-4">{user.name}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">{user.rank}</td>
                    <td className="p-4 text-yellow-600 dark:text-yellow-400">{user.salary} AZN</td>
                    <td className="p-4 text-green-600 dark:text-green-400 font-semibold">{user.totalUserSalary} AZN</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Maas;
