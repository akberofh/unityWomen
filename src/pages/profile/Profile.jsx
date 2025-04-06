import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { logout, setCredentials } from "../../redux/slices/authSlice";
import { useLogoutMutation, useUpdateUserMutation } from "../../redux/slices/usersApiSlice";
import axios from "axios";

const Profile = () => {

  const [selectedUser, setSelectedUser] = useState(null);
  const [ownerInfo, setOwnerInfo] = useState(null);
  const [referralChain, setReferralChain] = useState([]);

  const handleUserClick = async (user) => {
    setSelectedUser(user);
    setOwnerInfo(null);
    setReferralChain([]);

    try {
      // referredBy üçün owner məlumatını al
      const ownerRes = await axios.get(`https://unity-women-backend.vercel.app/api/users/admin/${userInfo.referralCode}`);
      setOwnerInfo(ownerRes.data.owner);

      // referralChain məlumatını al
      const chainRes = await axios.get(`https://unity-women-backend.vercel.app/api/users/user/${userInfo.referralCode}`);
      setReferralChain(chainRes.data.users);
    } catch (error) {
      console.error("Məlumatlar alınarkən xəta baş verdi:", error);
    }
  };

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
        .get(`https://unity-women-backend.vercel.app/api/users/admin/${userInfo.referralCode}`)
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
        .get(`https://unity-women-backend.vercel.app/api/users/user/${userInfo.referralCode}`)
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
    <div className="max-w-full mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => navigate("/")}
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
          <button
            onClick={() => navigate("/cedvel")}
            className="text-blue-500 hover:text-white hover:bg-blue-600 hover:shadow-md px-6 py-2 border border-blue-500 rounded-full transition-all duration-300"
          >
            Cədvələ Keçin➡
          </button>

          <h2 className="text-2xl font-semibold mb-4">Sağ-Sol Qollar</h2>

          {(referredUsers?.length || 0) > 0 ? (
            <table className="min-w-full border-collapse text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border-b">Ad</th>
                  <th className="px-4 py-2 border-b">Kod</th>
                  <th className="px-4 py-2 border-b">Email</th>
                  <th className="px-4 py-2 border-b">Ödəniş</th>
                  <th className="px-4 py-2 border-b">Kayıt Tarixi</th>
                </tr>
              </thead>
              <tbody>
                {(referredUsers || []).map((user) => (
                  <tr key={user._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleUserClick(user)}
                        className="text-blue-600 hover:underline"
                      >
                        {user.name}
                      </button>
                    </td>
                    <td className="px-4 py-2">{user.referralCode}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`text-3xl ${user.payment ? "text-green-500" : "text-red-500"}`}
                      >
                        {user.payment ? "+" : "-"}
                      </span>
                    </td>
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

          {/* Seçilmiş istifadəçi üçün əlavə məlumatlar */}
          {selectedUser && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl relative">
      <button
        onClick={() => setSelectedUser(null)}
        className="absolute top-2 right-2 text-2xl text-red-500 hover:text-red-700"
      >
        ❌
      </button>

      <h3 className="text-xl font-semibold text-center mb-4">İstifadəçi Məlumatları</h3>

      {ownerInfo && (
        <div className="mb-4">
          <h4 className="text-lg font-medium">👑 Dəvət edən Şəxs:</h4>
          <p><strong>Ad:</strong> {ownerInfo.name}</p>
          <p><strong>Email:</strong> {ownerInfo.email}</p>
        </div>
      )}

      {referralChain.length > 0 && (
        <div>
          <h4 className="text-lg font-medium">🔗 Referral Zənciri:</h4>
          <ul className="list-disc ml-5 text-sm text-gray-700 mt-2">
            {referralChain.map((person, index) => (
              <li key={index}>
                {person.name} ({person.email})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </div>
)}

        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Qruplar</h2>
          {referredUserss.length > 0 ? (
            <table className="min-w-full border-collapse text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border-b">Ad Soyad</th>
                  <th className="px-4 py-2 border-b">Kod</th>
                  <th className="px-4 py-2 border-b">Email</th>
                  <th className="px-4 py-2 border-b">Ödəniş</th>
                  <th className="px-4 py-2 border-b">Kayıt Tarihi</th>
                </tr>
              </thead>
              <tbody>
                {referredUserss.map((user) => (
                  <tr key={user._id} className="border-b">
                    <td className="px-4 py-2">  <button
                        onClick={() => handleUserClick(user)}
                        className="text-blue-600 hover:underline"
                      >
                        {user.name}
                      </button></td>
                    <td className="px-4 py-2">{user.referralCode}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2 ">
                      <span
                        className={`${user.payment ? "text-green-500" : "text-red-500"
                          } text-5xl`}
                      >
                        {user.payment ? "+" : "-"}
                      </span>
                    </td>
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
