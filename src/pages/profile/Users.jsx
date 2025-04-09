import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchReferral, setSearchReferral] = useState('');

  // API-dən istifadəçiləri çək
  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://unity-women-backend.vercel.app/api/users');
      setUsers(response.data.allUsers); // ← allUsers içindən alırıq
    } catch (error) {
      console.error('İstifadəçilər alınarkən xəta:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // İstifadəçini sil
  const handleDelete = async (id) => {
    if (!window.confirm('Bu istifadəçini silmək istədiyinizə əminsiniz?')) return;

    try {
      const response = await fetch(`https://unity-women-backend.vercel.app/api/users/delete/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUsers(users.filter((user) => user._id !== id));
      } else {
        console.error('Silinmə zamanı xəta');
      }
    } catch (error) {
      console.error('Silinmə zamanı xəta:', error);
    }
  };

  // Axtarış filteri
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchName.toLowerCase()) &&
    user.referralCode.toLowerCase().includes(searchReferral.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">İstifadəçi Siyahısı</h1>

      {/* Axtarış inputları */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          placeholder="Ada görə axtar..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="p-3 rounded-xl border shadow w-full"
        />
        <input
          type="text"
          placeholder="Referral koda görə axtar..."
          value={searchReferral}
          onChange={(e) => setSearchReferral(e.target.value)}
          className="p-3 rounded-xl border shadow w-full"
        />
      </div>

      {/* İstifadəçi cədvəli */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-4">Ad</th>
              <th className="p-4">Email</th>
              <th className="p-4">Referral Kodu</th>
              <th className="p-4">Əməliyyat</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="p-4">{user.name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">{user.referralCode}</td>
                <td className="p-4">
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  Heç bir istifadəçi tapılmadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
