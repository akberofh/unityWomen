import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchReferral, setSearchReferral] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [editedPayment, setEditedPayment] = useState(false);
  const [editedPassword, setEditedPassword] = useState('');
  const [editedPhoto, setEditedPhoto] = useState('');
  const [editedReferralLinkOwner, setEditedReferralLinkOwner] = useState('');


  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://unitywomen-48288fd0e24a.herokuapp.com/api/users/');
      setUsers(response.data.allUsers);
    } catch (error) {
      console.error('İstifadəçilər alınarkən xəta:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Bu istifadəçini silmək istədiyinizə əminsiniz?')) return;

    try {
      const response = await fetch(`https://unitywomen-48288fd0e24a.herokuapp.com/api/users/delete/${id}`, {
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

  const handleEdit = (user) => {
    setEditingUserId(user._id);
    setEditedName(user.name);
    setEditedEmail(user.email);
    setEditedPayment(user.payment);
    setEditedPassword('');
    setEditedPhoto(user.photo || '');
    setEditedReferralLinkOwner(user.referralLinkOwner);

  };

  const handleSave = async (id) => {
    try {
      const formData = new FormData();
      formData.append('name', editedName);
      formData.append('email', editedEmail);
      formData.append('payment', editedPayment);
      if (editedPassword) formData.append('password', editedPassword);
      if (editedPhoto) formData.append('photo', editedPhoto);
      formData.append('referralLinkOwner', editedReferralLinkOwner);

  
      const response = await axios.put(`https://unitywomen-48288fd0e24a.herokuapp.com/api/users/update/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.data.success) {
        const updatedUsers = users.map((user) =>
          user._id === id
            ? { ...user, name: editedName, email: editedEmail, payment: editedPayment, photo: editedPhoto ,referralLinkOwner : editedReferralLinkOwner }
            : user
        );
        setUsers(updatedUsers);
        setEditingUserId(null);
        setEditedPassword('');
      }
    } catch (error) {
      console.error('Güncelleme hatası:', error);
    }
  };
  

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setEditedPhoto(acceptedFiles[0]); // Base64 değil, direkt File
    }
    
  });

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchName.toLowerCase()) &&
    user.referralCode.toLowerCase().includes(searchReferral.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">İstifadəçi Siyahısı</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          placeholder="Ada görə axtar..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="p-3 rounded-lg border shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
        />
        <input
          type="text"
          placeholder="Referral koda görə axtar..."
          value={searchReferral}
          onChange={(e) => setSearchReferral(e.target.value)}
          className="p-3 rounded-lg border shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
        />
      </div>

      <div className="overflow-x-auto rounded-lg bg-white shadow-md">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-indigo-600 text-white">
              <th className="px-4 py-2 border-b">#</th>
              <th className="p-4">Foto</th>
              <th className="p-4">Ad</th>
              <th className="p-4">Email</th>
              <th className="p-4">Referral Kodu</th>
              <th className="p-4">Dəvət Sahibi</th>

              <th className="p-4">Ödəniş Durumu</th>
              <th className="p-4">Əməliyyat</th>
              <th className="p-4">pul</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user._id} className="border-t hover:bg-gray-100">
                <td className="px-4 py-2 font-bold text-gray-700">{index + 1}</td>
                <td className="p-4">
                  <img
                    src={user.photo || 'https://via.placeholder.com/40'}
                    alt="Profil"
                    className="w-12 h-12 rounded-full object-cover border"
                  />
                </td>
                <td className="p-4">
                  {editingUserId === user._id ? (
                    <input
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="p-2 border rounded-lg w-full"
                    />
                  ) : (
                    <span onClick={() => handleEdit(user)} className="cursor-pointer text-indigo-600 hover:underline">
                      {user.name}
                    </span>
                  )}
                </td>
                <td className="p-4">
                  {editingUserId === user._id ? (
                    <input
                      value={editedEmail}
                      onChange={(e) => setEditedEmail(e.target.value)}
                      className="p-2 border rounded-lg w-full"
                    />
                  ) : (
                    <span onClick={() => handleEdit(user)} className="cursor-pointer text-indigo-600 hover:underline">
                      {user.email}
                    </span>
                  )}
                </td>
                <td className="p-4">{user.referralCode}</td>
                <td>
                  {editingUserId === user._id ? (
                    <input
                      placeholder="Referral Link Sahibi"
                      value={editedReferralLinkOwner}
                      onChange={(e) => setEditedReferralLinkOwner(e.target.value)}
                      className="p-2 border rounded-lg w-full mb-2"
                    />
                  ) : (
                    <span onClick={() => handleEdit(user)} className="cursor-pointer text-indigo-600 hover:underline">
                    {user.referralLinkOwner}
                  </span>// Və ya boş saxlamaq istəyirsənsə '' yaza bilərsən
                  )}
                </td>
                <td className="p-4">
                  {editingUserId === user._id ? (
                    <select
                      value={editedPayment}
                      onChange={(e) => setEditedPayment(e.target.value === 'true')}
                      className="p-2 border rounded-lg w-full"
                    >
                      <option value={true}>Ödendi</option>
                      <option value={false}>Ödenmedi</option>
                    </select>
                  ) : (
                    <span>{user.payment ? 'Ödendi' : 'Ödenmedi'}</span>
                  )}
                </td>
                <td className="p-4 space-y-2">
                  {editingUserId === user._id ? (
                    <>
                      <input
                        type="password"
                        placeholder="Yeni şifrə"
                        value={editedPassword}
                        onChange={(e) => setEditedPassword(e.target.value)}
                        className="p-2 border rounded-lg w-full mb-2"
                      />
                      <div {...getRootProps()} className="cursor-pointer text-center p-2 border rounded-lg bg-gray-100">
                        <input {...getInputProps()} />
                        <p className="text-sm text-gray-600">Yeni foto yüklə</p>
                      </div>
                      {editedPhoto && (
                        <img src={editedPhoto} alt="Yeni Foto" className="w-12 h-12 rounded-full mt-2 mx-auto" />
                      )}
                      <button
                        onClick={() => handleSave(user._id)}
                        className="bg-green-500 text-white px-4 py-2 mt-2 rounded-lg hover:bg-green-600 focus:outline-none w-full"
                      >
                        Yadda saxla
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none"
                    >
                      Sil
                    </button>
                  )}
                </td>
                <td className="p-4">{user.dailyEarnings}</td>

              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500">
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
