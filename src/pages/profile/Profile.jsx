import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { logout, setCredentials } from "../../redux/slices/authSlice";
import { useLogoutMutation, useUpdateUserMutation } from "../../redux/slices/usersApiSlice";
import axios from "axios";

const Profile = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [card, setCard] = useState("");
  const [referralLink, setReferralLink] = useState("");
  const [photo, setPhoto] = useState(null);
  const [updateUser] = useUpdateUserMutation(); 
   const [referredUsers, setReferredUsers] = useState([]); 

   const [referredUserss, setReferredUserss] = useState([]); 

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Eğer "card" değeri yoksa hata mesajı göster
    if (!card) {
      toast.error("Kart bilgisi gereklidir!");
      return;
    }
  
    const formData = new FormData();
    formData.append("card", card);
  
    if (photo) {
      formData.append("photo", photo);
    }
  
    try {
      const res = await updateUser(formData).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("Profil başarıyla güncellendi!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.data?.message || error.message || "Bir hata oluştu.");
    }
  };
  
  

  // Fetch user information and referral data
  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
      setPhoto(userInfo.photo);
      setReferralLink(userInfo.referralCode); // referralCode from user info

      // Fetch referred users using referralCode
      axios
      .get(`https://unity-women.vercel.app/api/users/admin/${userInfo.referralCode}`)
      .then((res) => {
        setReferredUsers(res?.data?.users || []);
      })
      .catch((error) => {
        console.error("Referred users fetch error:", error);
      });
    
    }
  }, [userInfo]);

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
      setPhoto(userInfo.photo);
      setReferralLink(userInfo.referralCode); // referralCode from user info

      // Fetch referred users using referralCode
      axios
      .get(`https://unity-women.vercel.app/api/users/user/${userInfo.referralCode}`)
      .then((res) => {
        setReferredUserss(res?.data?.users || []);
      })
      .catch((error) => {
        console.error("Referred users fetch error:", error);
      });
    
    }
  }, [userInfo]);


  const copyReferralLink = () => {
    navigator.clipboard.writeText(`https://unity-women.vercel.app/register?referral=${referralLink}`)
      .then(() => {
        toast.success("Referral linkiniz kopyalandı!");
      })
      .catch((error) => {
        toast.error("Referral linkiniz kopyalanmadı");
        console.error(error);
      });
  };

  const copyReferralLinke = () => {
    navigator.clipboard.writeText(`${referralLink}`)
      .then(() => {
        toast.success("İstifadəçi kodunuz kopyalandı!");
      })
      .catch((error) => {
        toast.error("İstifadəçi kodunuz kopyalanmadı");
        console.error(error);
      });
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-blue-500 hover:text-blue-700"
        >
          Geri
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Çıkış
        </button>
      </div>

      <div className="space-y-6">
      <div className="text-center">
          <h1 className="text-3xl font-bold">Profil</h1>
          {photo && (
            <img
              src={`data:image/jpeg;base64,${photo}`}
              alt="Profile"
              className="w-32 h-32 object-cover mx-auto rounded-full mt-4"
            />
          )}
          {photo && (
            <img
              src={photo}
              alt="Profile"
              className="w-32 h-32 object-cover mx-auto rounded-full mt-4"
            />
          )}
          <div className="mt-4">
            <input
              type="file"
              onChange={handlePhotoChange}
              className="border-2 border-gray-300 p-2 rounded-lg"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="text-lg font-semibold">Card</label>
            <input
              type="text"
              value={card}
              onChange={(e) => setCard(e.target.value)}
              className="border-2 border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
       
          <h1 className="mt-4 text-lg font-semibold">İstifadəçi kodunuz:</h1>
            {referralLink && (
              <div className="flex items-center space-x-4 mt-2">
                <a
                >
                  {`${referralLink}`}
                </a>
                <button
                  type="button"
                  onClick={copyReferralLinke}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Kopyala
                </button>
              </div>
            )}
          <h1 className="mt-4 text-lg font-semibold">Referans Linkiniz:</h1>
            {referralLink && (
              <div className="flex items-center space-x-4 mt-2">
                <a
                  href={`/register?referral=${referralLink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {`https://unity-women.vercel.app/register?referral=${referralLink}`}
                </a>
                <button
                  type="button"
                  onClick={copyReferralLink}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Kopyala
                </button>
              </div>
            )}
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
          >
            Güncelle
          </button>
        </form>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Saq Sol Qollar.</h2>
          {referredUsers.length > 0 ? (
            <table className="min-w-full border-collapse text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border-b">Ad</th>
                  <th className="px-4 py-2 border-b">Email</th>
                  <th className="px-4 py-2 border-b">Kayıt Tarihi</th>
                </tr>
              </thead>
              <tbody>
                {referredUsers.map((user) => (
                  <tr key={user._id} className="border-b">
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">Qol yoxdur.</p>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Qruplar</h2>
          {referredUserss.length > 0 ? (
            <table className="min-w-full border-collapse text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border-b">Ad</th>
                  <th className="px-4 py-2 border-b">Email</th>
                  <th className="px-4 py-2 border-b">Kayıt Tarihi</th>
                </tr>
              </thead>
              <tbody>
                {referredUserss.map((user) => (
                  <tr key={user._id} className="border-b">
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">Qrup yoxdur.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
