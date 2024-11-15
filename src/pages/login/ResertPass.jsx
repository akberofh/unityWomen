import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResertPass =() => {
  const [newPassword, setNewPassword] = useState('');
  const [token, setToken] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:8000/api/users/reset-password', {
        token,
        newPassword,
      });
      
      // Başarılı mesajı göster
      toast.success(response.data.message || 'Şifre başarıyla sıfırlandı.');
  
      // 2 saniye sonra yönlendirme yap
      setTimeout(() => {
        window.location.href = '/dashboard'; // Kullanıcıyı /login sayfasına yönlendiriyoruz
      }, 2000);
  
    } catch (error) {
      // Hata mesajını göster
      toast.error(error.response?.data?.message || 'Bir hata oluştu.');
    }
  };
  

  return (
    <div>
      <h2>Yeni Şifre Belirle</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Token:
          <input
            type="token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
          />
        </label>
        <label>
          Yeni Şifre:
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Şifreyi Güncelle</button>
      </form>
    </div>
  );
}

export default ResertPass;
