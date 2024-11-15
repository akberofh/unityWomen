import React, { useState } from 'react';
import axios from 'axios';

const RequestPass = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://unity-women-backend.vercel.app/api/users/request-password-reset', {
        email,
      });
      setMessage(response.data.message);

      setTimeout(() => {
        window.location.href = '/reset-password';
      }, 2000);

    } catch (error) {
      setMessage(error.response?.data?.message || 'Bir hata oluştu.');
    }
  };

  return (
    <div>
      <h2>Şifre Sıfırlama İsteği</h2>
      <form onSubmit={handleSubmit}>
        <label>
          E-posta:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <button type="submit">Sıfırlama Bağlantısı Gönder</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default RequestPass;
