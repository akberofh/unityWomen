import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { logout, setCredentials } from "../../redux/slices/authSlice";
import { useLogoutMutation, useUpdateUserMutation } from "../../redux/slices/usersApiSlice";
import axios from "axios";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { FaCamera } from "react-icons/fa";


const Profile = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [card, setCard] = useState("");
  const [referralLink, setReferralLink] = useState("");
  const [photo, setPhoto] = useState(null);
  const [updateUser] = useUpdateUserMutation();
  const [referredUsers, setReferredUsers] = useState([]);
  const [showInfo, setShowInfo] = useState(false);
  const [solGrupSayisi, setSolGrupSayisi] = useState({ total: 0, paid: 0 });
  const [sagGrupSayisi, setSagGrupSayisi] = useState({ total: 0, paid: 0 });
  const [referrerInfo, setReferrerInfo] = useState(null);
  const [referrerInfoo, setReferrerInfoo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [referrerInf, setReferrerInf] = useState(null);
  const [referrerInfs, setReferrerInfs] = useState(null);
  const [showModa, setShowModa] = useState(false);
  const [referredUserss, setReferredUserss] = useState([]);
  const [referredUsersz, setReferredUsersz] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();
  const [paymentFilter, setPaymentFilter] = useState(null);
  const [stats, setStats] = useState(null);
  const [salaryData, setSalaryData] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTert, setSearchTert] = useState("");

  const { userInfo } = useSelector((state) => state.auth);
  const MySwal = withReactContent(Swal);


  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const { data } = await axios.get(
          `https://unitywomenbackend-94ca2cb93fbd.herokuapp.com/api/users/getuser/${userInfo._id}`
        );

        if (data.payment === false) {
          // Kullanıcı ödeme yapmamış, anasayfaya yönlendir
          navigate("/");
        }
      } catch (error) {
        console.error("Kullanıcı ödeme durumu kontrolü başarısız:", error);
        navigate("/"); // hata varsa da yönlendir
      }
    };

    if (userInfo) {
      checkPaymentStatus();
    } else {
      navigate("/"); // userInfo yoksa da yönlendir
    }
  }, [userInfo, navigate]);


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
      navigate("/");
    } catch (error) {
      toast.error(error?.data?.message || error.message || "Bir hata oluştu.");
    }
  };


  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
      setPhoto(userInfo.photo);
      setReferralLink(userInfo.referralCode); // referralCode from user info

      // Fetch referred users using referralCode
      axios
        .get(`https://unitywomenbackend-94ca2cb93fbd.herokuapp.com/api/users/user/${userInfo.referralCode}`)
        .then((res) => {
          setReferredUserss(res?.data?.users || []);
        })
        .catch((error) => {
          console.error("Referred users fetch error:", error);
        });

      axios
        .get(`https://unitywomenbackend-94ca2cb93fbd.herokuapp.com/api/users/refCode/${userInfo.referralCode}`)
        .then((res) => {
          setReferredUsersz(res?.data?.referredUsers || []);
        })
        .catch((error) => {
          console.error("Referred users fetch error:", error);
        });

      // Fetch referred users using referralCode for admin
      axios
        .get(`https://unitywomenbackend-94ca2cb93fbd.herokuapp.com/api/users/admin/${userInfo.referralCode}`)
        .then(async (res) => {
          setReferredUsers(res?.data?.users || []);

          const { users } = res.data;
          if (users.length >= 2) {
            const sagKol = users[0];
            const solKol = users[1];

            const [sagRes, solRes] = await Promise.all([
              axios.get(`https://unitywomenbackend-94ca2cb93fbd.herokuapp.com/api/users/user/${sagKol.referralCode}`),
              axios.get(`https://unitywomenbackend-94ca2cb93fbd.herokuapp.com/api/users/user/${solKol.referralCode}`),
            ]);

            // Qrup sayıları
            const solGroup = solRes.data.users || [];
            const sagGroup = sagRes.data.users || [];

            const solCount = solGroup.length;
            const sagCount = sagGroup.length;

            // Ödəniş edənlər
            const solPaid = solGroup.filter((u) => u.payment === true).length;
            const sagPaid = sagGroup.filter((u) => u.payment === true).length;

            setSolGrupSayisi({ total: solCount, paid: solPaid });
            setSagGrupSayisi({ total: sagCount, paid: sagPaid });
          }
        })
        .catch((error) => {
          console.error("Referred users fetch error:", error);
        });
    }
  }, [userInfo]);




  // Arama fonksiyonu
  const filteredUsers = referredUserss
    .filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.referralCode.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((user) => {
      if (paymentFilter === null) return true;
      return paymentFilter ? user.payment === true : user.payment === false;
    });


  const filteredUserz = referredUsersz
    .filter((user) =>
      user.name.toLowerCase().includes(searchTert.toLowerCase()) ||
      user.referralCode.toLowerCase().includes(searchTert.toLowerCase())
    )
    .filter((user) => {
      if (paymentFilter === null) return true;
      return paymentFilter ? user.payment === true : user.payment === false;
    });


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




  const handleNameClickl = async () => {
    try {
      // İki API çağrısını paralel olarak başlatıyoruz
      const [res1, res2] = await Promise.all([
        axios.get(`https://unitywomenbackend-94ca2cb93fbd.herokuapp.com/api/users/get-link-owner/${userInfo.referralCode}`),
        axios.get(`https://unitywomenbackend-94ca2cb93fbd.herokuapp.com/api/users/referredBykod/${userInfo.referralCode}`)
      ]);

      // Yanıtları set ediyoruz
      setReferrerInf(res1.data);
      setReferrerInfs(res2.data);

      // Modal'ı gösteriyoruz
      setShowModa(true);
    } catch (error) {
      // Hata durumunda kullanıcıyı bilgilendiriyoruz
      setReferrerInf({ error: "Asıl davetçi tapılmadı" });
      setReferrerInfs({ error: "Asıl davetçi tapılmadı" });
      setShowModa(true);
    }
  };

  const handleNameClick = async (referralCode) => {
    try {
      // İki API çağrısını paralel olarak başlatıyoruz
      const [res1, res2] = await Promise.all([
        axios.get(`https://unitywomenbackend-94ca2cb93fbd.herokuapp.com/api/users/get-link-owner/${referralCode}`),
        axios.get(`https://unitywomenbackend-94ca2cb93fbd.herokuapp.com/api/users/referredBykod/${referralCode}`)
      ]);

      // Yanıtları set ediyoruz
      setReferrerInfo(res1.data);
      setReferrerInfoo(res2.data);

      // Modal'ı gösteriyoruz
      setShowModal(true);
    } catch (error) {
      // Hata durumunda kullanıcıyı bilgilendiriyoruz
      setReferrerInfo({ error: "Asıl davetçi tapılmadı" });
      setReferrerInfoo({ error: "Asıl davetçi tapılmadı" });
      setShowModal(true);
    }
  };




  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        // 1. İstifadəçi məlumatını al
        const { data } = await axios.get(
          `https://unitywomenbackend-94ca2cb93fbd.herokuapp.com/api/users/getuser/${userInfo._id}`
        );

        // 2. Ödəniş yoxdursa, kart məlumatını da al
        if (data.payment === false) {
          const response = await axios.get('https://unitywomenbackend-94ca2cb93fbd.herokuapp.com/api/kart');
          const kartlar = response.data.allKart || [];

          // 3. Kart nömrələrini HTML formatına sal
          const kartHtml = kartlar.map((item) => {
            return `
              <div class="bg-gray-100 p-4 rounded-lg flex items-center justify-between cursor-pointer border border-gray-300 mb-2 copyCard" data-kart="${item.kart}">
                <span class="font-mono text-lg">${item.kart}</span>
                <button class="text-blue-600 font-semibold text-sm ml-4">Kopyala</button>
              </div>
            `;
          }).join('');

          // 4. SweetAlert ilə göstər
          MySwal.fire({
            title: `💳 Salam, ${data.name}!`,
            html: `
              <p class="text-lg mb-2">Qeydiyyatınızı tamamlamaq üçün zəhmət olmasa ödəniş edin.
		Ödəniş ayda cəmi 1 dəfə – 12 AZN təşkil edir.
		Ödənişdən sonra şəxsi kabinetiniz aktivləşir və qazancınız avtomatik hesablanmağa başlayır.
		Maaş hesablaması yalnız ödəniş edən üzvlər üçün açıqdır.
		Diqqət: Ödəniş geri qaytarılmır.Komandamıza xoş gəlmisiniz – uğura gedən yol buradan başlayır!</p>
              ${kartHtml}
              <p class="text-sm text-gray-500 mt-2">Qeyd: Ödəniş etdikdən sonra qəbzi öz rəhbərinizə mütləq göndərin ✅</p>
            `,
            icon: 'warning',
            showCancelButton: true,
            showConfirmButton: false,
            cancelButtonText: 'Sonra',
            cancelButtonColor: '#F87171',
            background: '#f9fafb',
            customClass: {
              popup: 'rounded-2xl shadow-2xl border border-gray-200',
              title: 'text-2xl font-semibold text-gray-800',
            },
            didOpen: () => {
              const cards = document.querySelectorAll('.copyCard');
              cards.forEach((cardDiv) => {
                cardDiv.addEventListener('click', () => {
                  const kart = cardDiv.getAttribute('data-kart');
                  navigator.clipboard.writeText(kart.replace(/\s/g, ''));
                  Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Kart nömrəsi kopyalandı!',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                    background: '#ecfdf5',
                    color: '#065f46',
                  });
                });
              });
            },
          });
        }
      } catch (error) {
        console.error('Xəta:', error);
      }
    };

    if (userInfo?._id) {
      checkPaymentStatus();
    }
  }, [userInfo]);


  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          `https://unitywomenbackend-94ca2cb93fbd.herokuapp.com/api/users/referral-stats/${userInfo.referralCode}`
        );
        setStats(res.data);
        setError(null);
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Veriler alınamadı.";
        setError(errorMessage);
      }
    };

    if (userInfo?.referralCode) fetchStats();
  }, [userInfo]);

  useEffect(() => {
    const fetchSalaryData = async () => {
      try {
        const response = await axios.get(
          `https://unitywomenbackend-94ca2cb93fbd.herokuapp.com/api/users/salary/${userInfo.referralCode}`
        );
        setSalaryData(response.data);
        setError(null);
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Maaş verisi alınarkən bir xəta baş verdi.";
        setError(errorMessage);
      }
    };

    if (userInfo?.referralCode) fetchSalaryData();
  }, [userInfo]);


  useEffect(() => {
    const fetchUserData = async () => {
      if (!userInfo?._id) return;

      try {
        const { data } = await axios.get(`https://unitywomenbackend-94ca2cb93fbd.herokuapp.com/api/users/getuser/${userInfo._id}`);

        const currentMonth = new Date().getFullYear() + "-" + (new Date().getMonth() + 1);
        const shownMonth = localStorage.getItem("paymentShownMonth");

        if (data.payment) {
          if (shownMonth !== currentMonth) {
            MySwal.fire({
              title: "Təbriklər!",
              html: `
    <p>Uğura xoş gəlmisiniz!<br />
    Artıq siz rəsmi şəkildə sistemə daxil oldunuz və bu, həyatınızda yeni bir başlanğıcdır!</p>

    <p><strong>Buradan sonrası sizdən asılıdır.</strong><br />
    12 AZN ilə başlanan bu yol – sizi yüzlərlə qazanan qadın arasında görmək üçün atılmış ilk addımdır.</p>

    <p>📌 <strong>İndi nə etməli?</strong><br />
    1. WhatsApp qrupuna qoşul – dəstək və yönləndirmə üçün.<br />
    2. Gündəlik təlimləri izləməyə başla.<br />
    3. İlk qazancını elə bu gün qazan!</p>

    <p>🔗 <a href="https://chat.whatsapp.com/FohUxmClFmN5SwBunsUydh" target="_blank" style="color: #1d72f3; font-weight: bold;">WhatsApp Qrupuna Qoşul</a></p>
  `,
              icon: "success",
              confirmButtonText: "Bağla"
            });


            localStorage.setItem("paymentShownMonth", currentMonth);
          }
        } else {
          // eğer payment false ise, localStorage temizlensin
          localStorage.removeItem("paymentShownMonth");
        }

      } catch (error) {
        console.error("Payment kontrol hatası:", error);
      }
    };

    fetchUserData();
  }, [userInfo]);

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
          Çıxış
        </button>
      </div>

      <div className="space-y-6">
        <div className="min-h-[300px] flex items-center justify-center bg-gradient-to-br dark:from-gray-800 dark:to-black px-4 py-10">
          <div className="bg-white dark:bg-gray-900 shadow-2xl rounded-3xl p-10 flex flex-col md:flex-row items-center gap-10 w-full max-w-5xl transition-all duration-300">

            {/* Profil Fotoğrafı */}
            <div className="relative w-44 h-44 group">
              <img
                src={photo}
                alt="Profil"
                className="w-full h-full object-cover rounded-full border-4 border-blue-500 shadow-xl"
              />
              <label className="absolute bottom-2 right-2 bg-blue-500 p-2 rounded-full shadow-md cursor-pointer hover:scale-110 transition duration-200">
                <FaCamera className="text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Kullanıcı Bilgileri */}
            <div className="flex-1 w-full text-center md:text-left">
              <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white tracking-tight mb-2">
                {name}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                {email}
              </p>

              {/* İstatistikler */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Maaş */}
                <div className="bg-gradient-to-tr from-green-200 to-green-400 dark:from-green-800 dark:to-green-600 p-6 rounded-2xl shadow-xl transform transition hover:scale-105">
                  <h2 className="text-lg font-semibold text-green-900 dark:text-green-100">
                    Maaş
                  </h2>
                  <p className="text-3xl font-bold mt-2 text-green-900 dark:text-green-100">
                    {salaryData?.salary || 0} ₼
                  </p>
                </div>

                {/* Qazanc */}
                <div className="bg-gradient-to-tr from-blue-200 to-blue-400 dark:from-blue-800 dark:to-blue-600 p-6 rounded-2xl shadow-xl transform transition hover:scale-105">
                  <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                    Pul Mükafatı
                  </h2>
                  <p className="text-3xl font-bold mt-2 text-blue-900 dark:text-blue-100">
                    {stats?.totalEarned || 0} ₼
                  </p>
                </div>

                {/* Rütbəsi - Vurgulu kutu */}
                <div className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-indigo-600 dark:from-purple-800 dark:to-indigo-700 p-6 rounded-2xl shadow-xl transform transition hover:scale-105">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
                  <div className="flex flex-col items-center text-white">
                    <div className="text-5xl mb-2">
                      🏅
                    </div>
                    <h2 className="text-lg font-bold tracking-wider  opacity-80">
                      Rütbəsi
                    </h2>
                    <p className="text-2xl font-extrabold mt-1">
                      {salaryData?.rank || "—"}
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-red-500 mt-4 font-semibold">{error}</p>
              )}
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8 w-full max-w-2xl mx-auto space-y-6"
        >
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-4">
            Kart və Referans Məlumatları
          </h2>

          {/* Kart Girişi */}
          <div className="flex flex-col space-y-2">
            <label className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Kart Nömrəsi
            </label>
            <input
              type="text"
              value={card}
              onChange={(e) => setCard(e.target.value)}
              placeholder="0000 0000 0000 0000"
              className="border-2 border-gray-300 dark:border-gray-700 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* İstifadəçi Kodu */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              İstifadəçi Kodunuz:
            </h3>
            {referralLink && (
              <div className="flex items-center justify-between mt-2 bg-gray-100 dark:bg-gray-800 p-3 rounded-xl shadow">
                <span className="text-sm md:text-base break-all text-gray-700 dark:text-gray-300">
                  {referralLink}
                </span>
                <button
                  type="button"
                  onClick={copyReferralLinke}
                  className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Kopyala
                </button>
              </div>
            )}
          </div>

          {/* Referans Linki */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Referans Linkiniz:
            </h3>
            {referralLink && (
              <div className="flex items-center justify-between mt-2 bg-gray-100 dark:bg-gray-800 p-3 rounded-xl shadow">
                <a
                  href={`/register?referral=${referralLink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline break-all text-sm md:text-base"
                >
                  https://unity-women.vercel.app/register?referral={referralLink}
                </a>
                <button
                  type="button"
                  onClick={copyReferralLink}
                  className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Kopyala
                </button>
              </div>
            )}
          </div>

          {/* Güncelle Butonu */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition shadow-md"
            >
              Güncelle
            </button>
          </div>
        </form>








        <div className="bg-gradient-to-br from-white via-gray-100 to-white shadow-2xl p-6 rounded-2xl w-full max-w-3xl mx-auto mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">👤 Şəxsi Məlumatlar</h2>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-all duration-300 text-sm sm:text-base"
            >
              {showInfo ? "🔒 Gizlət" : "👁️ Göstər"}
            </button>
          </div>

          {showInfo && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm sm:text-base">
              <div className="bg-white rounded-xl p-4 shadow">
                <strong className="block text-gray-500 mb-1">Ad Soyad</strong>
                <p onClick={() => handleNameClickl(userInfo.referralCode)}
                  className="px-4 py-2 text-blue-600 cursor-pointer hover:underline">{userInfo.name}</p></div>
              <div className="bg-white rounded-xl p-4 shadow">
                <strong className="block text-gray-500 mb-1">Email</strong>
                <p>{userInfo.email}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow">
                <strong className="block text-gray-500 mb-1">Telefon</strong>
                <p>{userInfo.phone}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow">
                <strong className="block text-gray-500 mb-1">FIN Kod</strong>
                <p>{userInfo.finCode}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow">
                <strong className="block text-gray-500 mb-1">Kart</strong>
                <p>{userInfo.card}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow">
                <strong className="block text-gray-500 mb-1">Ödəniş</strong>
                <p>{userInfo.payment ? "Ödəniş edilib" : "Ödəniş edilməyib"}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow">
                <strong className="block text-gray-500 mb-1">Ata Adı</strong>
                <p>{userInfo.faze}</p>
              </div>
            </div>
          )}
          {showModa && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-xl shadow-xl relative w-[90%] max-w-lg">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl"
                  onClick={() => setShowModa(false)}
                >
                  ❌
                </button>

                <div className="mb-6">
                  <h4 className="text-2xl font-semibold text-center text-indigo-600 mb-4">✨ Dəvət edən Şəxs:</h4>

                  {referrerInf?.error ? (
                    <p className="text-red-500 text-center">{referrerInf.error}</p>
                  ) : (
                    <div className="text-center">
                      <p><strong className="text-lg">Ad:</strong> {referrerInf.referrerName}</p>
                      <p><strong className="text-lg">Email:</strong> {referrerInf.referrerEmail}</p>
                      {referrerInf.referrerPhoto && (
                        <div className="mt-4">
                          {/* Fotoğraf Base64 veya URL kontrolü ile */}
                          {typeof referrerInf.referrerPhoto === 'string' && !referrerInf.referrerPhoto.startsWith("https://") && (
                            <img
                              src={`data:image/jpeg;base64,${referrerInf.referrerPhoto}`}
                              alt="Referrer"
                              className="w-32 h-32 object-cover mx-auto rounded-full"
                            />
                          )}
                          {typeof referrerInf.referrerPhoto === 'string' && referrerInf.referrerPhoto.startsWith("https://") && (
                            <img
                              src={referrerInf.referrerPhoto}
                              alt="Referrer"
                              className="w-32 h-32 object-cover mx-auto rounded-full"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-2xl font-semibold text-center text-indigo-600 mb-4">✨ Lider:</h4>

                  {referrerInfs?.error ? (
                    <p className="text-red-500 text-center">{referrerInfs.error}</p>
                  ) : (
                    <div className="text-center">
                      <p><strong className="text-lg">Ad:</strong> {referrerInfs.referrerName}</p>
                      <p><strong className="text-lg">Email:</strong> {referrerInfs.referrerEmail}</p>
                      {referrerInfs.referrerPhoto && (
                        <div className="mt-4">
                          {/* Fotoğraf Base64 veya URL kontrolü ile */}
                          {typeof referrerInfs.referrerPhoto === 'string' && !referrerInfs.referrerPhoto.startsWith("https://") && (
                            <img
                              src={`data:image/jpeg;base64,${referrerInfs.referrerPhoto}`}
                              alt="Lider"
                              className="w-32 h-32 object-cover mx-auto rounded-full"
                            />
                          )}
                          {typeof referrerInfs.referrerPhoto === 'string' && referrerInfs.referrerPhoto.startsWith("https://") && (
                            <img
                              src={referrerInfs.referrerPhoto}
                              alt="Lider"
                              className="w-32 h-32 object-cover mx-auto rounded-full"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <button
            onClick={() => navigate("/cedvel")}
            className="text-blue-500 hover:text-white m-10 hover:bg-blue-600 hover:shadow-md px-6 py-2 border border-blue-500 rounded-full transition-all duration-300"
          >
            Cədvələ Keçin➡
          </button>

          <h2 className="text-2xl font-semibold mb-4">Sağ Sol Qollar</h2>

          {referredUsers.length > 0 ? (
            <div className="overflow-x-auto max-w-full">
              <table className="min-w-[600px] border-collapse text-left w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 border-b">#</th>
                    <th className="px-4 py-2 border-b">Ad</th>
                    <th className="px-4 py-2 border-b">Kod</th>
                    <th className="px-4 py-2 border-b">Email</th>
                    <th className="px-4 py-2 border-b">Phone</th>
                    <th className="px-4 py-2 border-b">Ödəniş</th>
                    <th className="px-4 py-2 border-b">Qrup Sayı</th>
                    <th className="px-4 py-2 border-b">Qeydiyyat Tarixi</th>
                  </tr>
                </thead>
                <tbody>
                  {referredUsers.map((user, index) => (
                    <tr key={user._id} className="border-b">
                      <td className="px-4 py-2 font-bold text-gray-700">{index + 1}</td>
                      <td
                        onClick={() => handleNameClick(user.referralCode)}
                        className="px-4 py-2 text-blue-600 cursor-pointer hover:underline"
                      >
                        {user.name}
                      </td>
                      <td className="px-4 py-2">{user.referralCode}</td>
                      <td className="px-4 py-2">{user.email}</td>
                      <td className="px-4 py-2">{user.phone}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`text-5xl ${user.payment ? "text-green-500" : "text-red-500"}`}
                        >
                          {user.payment ? "+" : "-"}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        {index === 0 && referredUsers.length >= 2
                          ? `${sagGrupSayisi.total} nəfər (${sagGrupSayisi.paid} ödənişli)`
                          : index === 1 && referredUsers.length >= 2
                            ? `${solGrupSayisi.total} nəfər (${solGrupSayisi.paid} ödənişli)`
                            : "-"}
                      </td>

                      <td className="px-4 py-2">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">Qol yoxdur.</p>
          )}

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-xl shadow-xl relative w-[90%] max-w-lg">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl"
                  onClick={() => setShowModal(false)}
                >
                  ❌
                </button>

                <div className="mb-6">
                  <h4 className="text-2xl font-semibold text-center text-indigo-600 mb-4">✨ Dəvət edən Şəxs:</h4>

                  {referrerInfo?.error ? (
                    <p className="text-red-500 text-center">{referrerInfo.error}</p>
                  ) : (
                    <div className="text-center">
                      <p><strong className="text-lg">Ad:</strong> {referrerInfo.referrerName}</p>
                      <p><strong className="text-lg">Email:</strong> {referrerInfo.referrerEmail}</p>
                      {referrerInfo.referrerPhoto && (
                        <div className="mt-4">
                          {/* Fotoğraf Base64 veya URL kontrolü ile */}
                          {typeof referrerInfo.referrerPhoto === 'string' && !referrerInfo.referrerPhoto.startsWith("https://") && (
                            <img
                              src={`data:image/jpeg;base64,${referrerInfo.referrerPhoto}`}
                              alt="Referrer"
                              className="w-32 h-32 object-cover mx-auto rounded-full"
                            />
                          )}
                          {typeof referrerInfo.referrerPhoto === 'string' && referrerInfo.referrerPhoto.startsWith("https://") && (
                            <img
                              src={referrerInfo.referrerPhoto}
                              alt="Referrer"
                              className="w-32 h-32 object-cover mx-auto rounded-full"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-2xl font-semibold text-center text-indigo-600 mb-4">✨ Lider:</h4>

                  {referrerInfoo?.error ? (
                    <p className="text-red-500 text-center">{referrerInfoo.error}</p>
                  ) : (
                    <div className="text-center">
                      <p><strong className="text-lg">Ad:</strong> {referrerInfoo.referrerName}</p>
                      <p><strong className="text-lg">Email:</strong> {referrerInfoo.referrerEmail}</p>
                      {referrerInfoo.referrerPhoto && (
                        <div className="mt-4">
                          {/* Fotoğraf Base64 veya URL kontrolü ile */}
                          {typeof referrerInfoo.referrerPhoto === 'string' && !referrerInfoo.referrerPhoto.startsWith("https://") && (
                            <img
                              src={`data:image/jpeg;base64,${referrerInfoo.referrerPhoto}`}
                              alt="Lider"
                              className="w-32 h-32 object-cover mx-auto rounded-full"
                            />
                          )}
                          {typeof referrerInfoo.referrerPhoto === 'string' && referrerInfoo.referrerPhoto.startsWith("https://") && (
                            <img
                              src={referrerInfoo.referrerPhoto}
                              alt="Lider"
                              className="w-32 h-32 object-cover mx-auto rounded-full"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Qruplar</h2>

          {/* Arama kutusu */}
          <input
            type="text"
            placeholder="Ad və ya Referral Kodu ilə ara"
            className="p-2 border border-gray-300 rounded mb-4 w-full max-w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Arama terimi güncelleme
          />

          <select
            value={paymentFilter === null ? "" : paymentFilter ? "paid" : "unpaid"}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "paid") setPaymentFilter(true);
              else if (val === "unpaid") setPaymentFilter(false);
              else setPaymentFilter(null);
            }}
            className="p-2 border ml-2 mb-2 border-gray-300 rounded"
          >
            <option value="">Bütün ödənişlər</option>
            <option value="paid">Ödəniş edənlər</option>
            <option value="unpaid">Ödəniş etməyənlər</option>
          </select>


          {filteredUsers.length > 0 ? (
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto border rounded-xl shadow-lg">
              <table className="min-w-full bg-white text-sm">
                <thead className="bg-gray-100 sticky top-0 z-10 text-gray-700 text-left">
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 border-b">#</th>
                    <th className="px-4 py-2 border-b">Ad Soyad</th>
                    <th className="px-4 py-2 border-b">Kod</th>
                    <th className="px-4 py-2 border-b">Email</th>
                    <th className="px-4 py-2 border-b">Phone</th>
                    <th className="px-4 py-2 border-b">Ödəniş</th>
                    <th className="px-4 py-2 border-b">Qeydiyyat Tarixi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr key={user._id} className="border-b">
                      <td className="px-4 py-2 font-bold text-gray-700">{index + 1}</td> {/* Sıra nömrəsi */}
                      <td
                        onClick={() => handleNameClick(user.referralCode)}
                        className="px-4 py-2 text-blue-600 cursor-pointer hover:underline"
                      >
                        {user.name}
                      </td>
                      <td className="px-4 py-2">{user.referralCode}</td>
                      <td className="px-4 py-2">{user.email}</td>
                      <td className="px-4 py-2">{user.phone}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`${user.payment ? "text-green-500" : "text-red-500"} text-5xl`}
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
            </div>
          ) : (
            <p className="text-gray-500">Qrup yoxdur.</p>
          )}




        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Şəxsi Dəvətlilər</h2>



          <input
            type="text"
            placeholder="Ad və ya Referral Kodu ilə ara"
            className="p-2 border border-gray-300 rounded mb-4 w-full max-w-[300px]"
            value={searchTert}
            onChange={(e) => setSearchTert(e.target.value)} // Arama terimi güncelleme
          />

          <select
            value={paymentFilter === null ? "" : paymentFilter ? "paid" : "unpaid"}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "paid") setPaymentFilter(true);
              else if (val === "unpaid") setPaymentFilter(false);
              else setPaymentFilter(null);
            }}
            className="p-2 border ml-2 mb-2 border-gray-300 rounded"
          >
            <option value="">Bütün ödənişlər</option>
            <option value="paid">Ödəniş edənlər</option>
            <option value="unpaid">Ödəniş etməyənlər</option>
          </select>


          {filteredUserz.length > 0 ? (
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto border rounded-xl shadow-lg">
              <table className="min-w-full bg-white text-sm">
                <thead className="bg-gray-100 sticky top-0 z-10 text-gray-700 text-left">
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 border-b">#</th>
                    <th className="px-4 py-2 border-b">Ad Soyad</th>
                    <th className="px-4 py-2 border-b">Kod</th>
                    <th className="px-4 py-2 border-b">Email</th>
                    <th className="px-4 py-2 border-b">Phone</th>
                    <th className="px-4 py-2 border-b">Ödəniş</th>
                    <th className="px-4 py-2 border-b">Qeydiyyat Tarixi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUserz.map((user, index) => (
                    <tr key={user._id} className="border-b">
                      <td className="px-4 py-2 font-bold text-gray-700">{index + 1}</td> {/* Sıra nömrəsi */}
                      <td
                        onClick={() => handleNameClick(user.referralCode)}
                        className="px-4 py-2 text-blue-600 cursor-pointer hover:underline"
                      >
                        {user.name}
                      </td>
                      <td className="px-4 py-2">{user.referralCode}</td>
                      <td className="px-4 py-2">{user.email}</td>
                      <td className="px-4 py-2">{user.phone}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`${user.payment ? "text-green-500" : "text-red-500"} text-5xl`}
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
            </div>
          ) : (
            <p className="text-gray-500">Qrup yoxdur.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;