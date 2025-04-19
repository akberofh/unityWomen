import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../redux/slices/usersApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../../redux/slices/authSlice";
import { toast } from "react-toastify";
import 'react-toastify/ReactToastify.css';
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

const Login = () => {
  const [email, setEmail] = useState('');
  const [referralCode, setReferralCode] = useState();
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const navigation = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector(state => state.auth);
  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    if (userInfo) {
      navigation('/');
    }
  }, [navigation, userInfo]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password, referralCode }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigation('/');
    } catch (error) {
      toast.error('Şifrə və ya email səhvdir');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Giriş</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Email və ya Referral Code"
            value={email || referralCode}
            onChange={(e) => {
              const value = e.target.value;
              setEmail(value);
              setReferralCode(value);
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="relative">
            <input
              type={isPasswordVisible ? "text" : "password"}
              placeholder="Şifrə"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <span
              className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 text-lg"
              onClick={() => setIsPasswordVisible(prev => !prev)}
            >
              {isPasswordVisible ? <IoEyeOutline /> : <IoEyeOffOutline />}
            </span>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:opacity-50"
          >
            {isLoading ? "Giriş edilir..." : "Giriş"}
          </button>
        </form>
        <p
          className="text-center text-sm text-gray-600 mt-4 cursor-pointer hover:text-blue-600"
          onClick={() => navigation('/register')}
        >
          Qeydiyyat
        </p>
      </div>
    </div>
  );
};

export default Login;
