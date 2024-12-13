import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';  // Path parametrelerini almak için

const ResertPass = () => {
  const [newPassword, setNewPassword] = useState('');
  const { token } = useParams();  // URL'den token'ı almak

  // Eğer token alınamadıysa hata mesajı göster
  useEffect(() => {
    if (!token) {
      toast.error('Geçerli bir bağlantı kullanın.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error('Token bulunamadı. Lütfen bağlantınızı kontrol edin.');
      return;
    }

    try {
      const response = await axios.post('https://unity-women-backend.vercel.app/api/users/reset-password', {
        token,
        newPassword,
      });

      // Başarılı mesajı göster
      toast.success(response.data.message || 'Şifre başarıyla sıfırlandı.');

      // 2 saniye sonra yönlendirme yap
      setTimeout(() => {
        window.location.href = '/dashboard';  // Kullanıcıyı /dashboard sayfasına yönlendiriyoruz
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
            type="text"
            value={token || ''}
            readOnly  // Token'ı kullanıcıya gösteriyoruz ancak değiştirmelerini engelliyoruz
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
