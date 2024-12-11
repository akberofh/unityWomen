import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from './Login.module.css';
import { useLoginMutation } from "../../redux/slices/usersApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../../redux/slices/authSlice";
import { toast } from "react-toastify";
import 'react-toastify/ReactToastify.css'
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";



const Login = () => {
  const [email, setEmail] = useState('');
  const [referralCode, setReferralCode] = useState();
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigation = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const { userInfo } = useSelector(state => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigation('/dashboard');
    }
  }, [navigation, userInfo]);

  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password, referralCode }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigation('/dashboard');
    } catch (error) {
      toast.error('Sehv email ya sifre')
    }
  }

  return (
    <section className={styles.container}>
      <div className={styles.auth}>
        <h1>Giriş</h1>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            name="email"
            placeholder="Email or Referral Code"
            value={email || referralCode} // Hangisi doluysa onu gösterir
            onChange={(e) => {
              const value = e.target.value;
              setEmail(value); // Email değerini güncelle
              setReferralCode(value); // ReferralCode değerini güncelle
            }}
          />
          <div className="password-container" style={{ position: 'relative' }}>
            <input
              type={isPasswordVisible ? "text" : "password"}
              name="password"
              placeholder="Şifrə"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 1rem',
                border: '1px solid #ccc',
                borderRadius: '0.375rem',
                outline: 'none',
                fontSize: '1rem',
              }}
            />
            <span
              className="password-icon"
              onClick={() => setIsPasswordVisible((prev) => !prev)}
              style={{
                position: 'absolute',
                top: '60%',
                right: '0.75rem',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                color: '#6b6b6b',
                fontSize: '16px'
              }}
            >
              {isPasswordVisible ? <IoEyeOutline /> : <IoEyeOffOutline />}
            </span>
          </div>
          <button style={{ backgroundColor: "transparent", color: "grey", fontWeight: "600", padding: "0" }} onClick={() => navigation('/request-password-reset')}>
            Şifrəni Unutdum
          </button>
          {loginError && <div className={styles.error}>{loginError}</div>}
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Giriş edilir...' : 'Giriş'}
          </button>
        </form>
        <p className={styles.loginmessage} onClick={() => navigation('/register')}>
          <span>Qeydiyyat</span>
        </p>
      </div>
    </section>
  );
};

export default Login;
