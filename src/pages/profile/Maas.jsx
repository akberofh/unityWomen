import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SalaryFilter = () => {
  const [data, setData] = useState([]);
  const [allPeriods, setAllPeriods] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [filteredPeriodSalaries, setFilteredPeriodSalaries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://unitywomenbackend-94ca2cb93fbd.herokuapp.com/api/mine',
          {withCredentials: true,}

        );
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

  // Arama filtresi
  const filteredSalaries = filteredPeriodSalaries.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <select
          className="p-3 rounded border shadow"
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
        >
          {allPeriods.map((period, i) => (
            <option key={i} value={period}>
              {period}
            </option>
          ))}
        </select>

  
      </div>

      {/* Arama inputu */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="İstifadəçi ara..."
          className="p-3 w-full rounded border shadow"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-lg rounded-xl">
          <thead>
            <tr className="border-b">
              <th className="p-4 text-left">Fotoğraf</th>
              <th className="p-4 text-left">Ad</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Tarix Maaşı</th>
              <th className="p-4 text-left">Toplam Maaş</th>
            </tr>
          </thead>
          <tbody>
            {filteredSalaries.map((user, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="p-4">
                  <img
                    src={user.photo}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover border"
                  />
                </td>
                <td className="p-4">{user.name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">{user.salary} AZN</td>
                <td className="p-4">{user.totalUserSalary} AZN</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalaryFilter;
