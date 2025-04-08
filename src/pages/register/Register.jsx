import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../redux/slices/usersApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../../redux/slices/authSlice";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import 'react-toastify/dist/ReactToastify.css';
import { useDropzone } from 'react-dropzone';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import axios from "axios";


const Register = () => {
    const [name, setName] = useState('');
    const [faze, setFaze] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [finCode, setFinCode] = useState('');
    const [card, setCard] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [photo, setPhoto] = useState(null);
    const [referralCode, setReferralCode] = useState("");
    const [gender, setGender] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [register, { isLoading }] = useRegisterMutation();

    const [referralRequired, setReferralRequired] = useState(false);

    const [referralOwner, setReferralOwner] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("referral");

        if (code) {
            setReferralCode(code);
            console.log(`Referral Code: ${code}`);  // Burada referralCode konsola yazdırılıyor.

            axios
                .get(`https://unity-women-backend.vercel.app/api/users/admin/${code}`)
                .then((res) => {
                    console.log("API'den gelen veri:", res.data); // Veriyi doğru şekilde alıyoruz
                    const data = res.data;

                    if (data.count >= 2) {
                        setReferralRequired(true);
                    } else {
                        setReferralRequired(false);
                    }

                    if (data.owner) {
                        console.log("Referral sahibi bulundu:", data.owner); // Referral sahibi logu
                        setReferralOwner(data.owner);
                    } else {
                        console.log("Referral sahibi bulunamadı."); // Eğer owner yoksa
                    }
                })
                .catch((err) => {
                    console.error("Referral kod kontrol hatası:", err);
                });
        } else {
            console.log("Referral kodu bulunamadı!"); // Eğer ref parametre yoksa
        }
    }, []);




    const handleRegister = async (e) => {
        e.preventDefault();



        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('faze', faze);
            formData.append('phone', phone);
            formData.append('finCode', finCode);
            formData.append('card', card);
            formData.append('email', email);
            formData.append('referralCode', referralCode);
            formData.append('password', password);
            formData.append('gender', gender);
            if (photo) {
                formData.append('photo', photo);


            }

            const params = new URLSearchParams(window.location.search);
            const referralLinkOwner = params.get("referral");

            
            if (referralLinkOwner) {
                formData.append('referralLinkOwner', referralLinkOwner);
            }

            const res = await register(formData).unwrap();
            dispatch(setCredentials({ ...res }));
            navigate("/");
        } catch (error) {
            console.error("Error:", error);  // Konsola da logla hata mesajını
    
            // Backend'den gelen hata mesajını al ve Toast ile göster
            const errorMessage = error?.data?.message || "Sunucu ile bağlantı kurulurken bir hata oluştu.";
            
            // Burada error mesajını toast ile ekranda göster
            toast.error(errorMessage);  // Hata mesajını ekranda göster
        }
    };
    

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: 'image/*',
        maxSize: 50971520,
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                const file = acceptedFiles[0];
                if (file.size <= 50971520) {
                    setPhoto(file);
                } else {
                    toast.error('File size exceeds 20 MB limit');
                }
            }
        }
    });

    const handleClearUploadPhoto = () => {
        setPhoto(null);
    };

    const [showTerms, setShowTerms] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    const toggleTermsModal = () => setShowTerms(true);
    const closeTermsModal = () => setShowTerms(false);
    const acceptTerms = () => {
        setAcceptedTerms(true);
        setShowTerms(false);
    };

    return (
        <section className="bg-gradient-to-r from-gray-100 via-blue-100 to-blue-50 min-h-screen flex items-center justify-center p-8">
            <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-3xl">
                <h1 className="text-4xl font-bold mb-10 text-center text-blue-700">Qeydiyyat</h1>
                <form onSubmit={handleRegister} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-md font-semibold text-gray-700">Ad Soyad</label>
                            <input
                                type="text"
                                name="name"
                                maxLength={40}
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-md"
                            />
                        </div>
                        <div>
                            <label className="block text-md font-semibold text-gray-700">Ata Adi</label>
                            <input
                                type="Ata adi"
                                name="Ata adi"
                                placeholder="Ata adi"
                                value={faze}
                                onChange={(e) => setFaze(e.target.value)}
                                required
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-md"
                            />
                        </div>
                        {referralRequired && (
                            <div>

                                <label className="block text-md font-semibold text-gray-700">Lider</label>

                                <input
                                    type="text"
                                    name="referralCode"
                                    placeholder="Liderin kodunu daxil edin"
                                    onChange={(e) => setReferralCode(e.target.value)}
                                    required={referralRequired}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-md"
                                />


                            </div>
                        )}



                        {referralCode && (
                            <div className="mt-6 bg-white p-4 rounded-2xl shadow-md border border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    ✨ Dəvət Edən
                                </h3>

                                {referralOwner ? (
                                    <div className="space-y-1 text-gray-700 text-sm">
                                        <p><span className="font-medium">👤 Ad:</span> {referralOwner.name}</p>
                                        <p><span className="font-medium">📧 Email:</span> {referralOwner.email}</p>
                                    </div>
                                ) : (
                                    <p className="text-sm text-red-500">Dəvət edən tapılmadı</p>
                                )}
                            </div>
                        )}





                        <div>
                            <label className="block text-md font-semibold text-gray-700">Email</label>
                            <input
                                type="text"
                                name="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-md"
                            />
                        </div>
                        <div>
                            <label className="block text-md font-semibold text-gray-700">FinCode</label>
                            <input
                                type="text"
                                name="finCode"
                                placeholder="FinCode"
                                value={finCode}
                                onChange={(e) => setFinCode(e.target.value)}
                                required
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-md"
                            />
                        </div>


                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-md font-semibold text-gray-700">Şifrə</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-md"
                            />
                        </div>
                        <div>
                            <label className="block text-md font-semibold text-gray-700">Şifrəni yeniden gir</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-md"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-md font-semibold text-gray-700">Card</label>
                            <input
                                type="text"
                                name="card"
                                placeholder="Card"
                                value={card}
                                onChange={(e) => setCard(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-md"
                            />
                            <p>(Məcbur deyil)</p>
                        </div>
                        <div>
                            <label className="block text-md font-semibold text-gray-700">Telefon Nömrəsi</label>
                            <PhoneInput
                                country={'az'} // Varsayılan ülke kodu
                                value={phone}
                                onChange={(phone) => setPhone(phone)}
                                inputProps={{
                                    name: 'Telefon nömrəsi',
                                    required: true,
                                }}
                                containerClass="w-full mt-1"
                                inputClass="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-md"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-md font-semibold text-gray-700">Cinsiyyət</label>
                        <div className="flex space-x-6">
                            <div>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Kişi"
                                    onChange={(e) => setGender(e.target.value)}
                                    checked={gender === 'Kişi'}
                                    className="mr-2"
                                />
                                <label className="text-md">Kişi</label>
                            </div>
                            <div>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Qadın"
                                    onChange={(e) => setGender(e.target.value)}
                                    checked={gender === 'Qadın'}
                                    className="mr-2"
                                />
                                <label className="text-md">Qadın</label>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-6">
                        <div className="flex-grow">
                            <label className="block text-md font-semibold text-gray-700">Foto</label>
                            <div {...getRootProps({ className: 'dropzone border border-dashed border-gray-300 rounded-md px-4 py-2 flex justify-center items-center cursor-pointer' })}>
                                <input {...getInputProps()} />
                                <p className="text-gray-600 text-center truncate">
                                    {photo ? photo.name : (isDragActive ? "Drop the files here..." : "Fotonu Yükləyin!")}
                                </p>
                                {photo && (
                                    <button type="button" className="text-red-600 hover:text-red-800 ml-2" onClick={handleClearUploadPhoto}>
                                        <IoClose />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="mt-6">
                        <input
                            type="checkbox"
                            id="terms"
                            checked={acceptedTerms}
                            onChange={(e) => setAcceptedTerms(e.target.checked)}
                            className="mr-2"
                            required
                        />
                        <label htmlFor="terms" className="text-md text-gray-700">
                            <span className="font-bold">Şərtlər və Qaydalar</span> ilə razıyam.
                        </label>
                        <div className="text-sm text-gray-500 mt-2">
                            <p className="cursor-pointer" onClick={toggleTermsModal}>
                                Şərtləri oxumaq üçün buraya klikləyin.
                            </p>
                        </div>
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-150 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed">
                        {isLoading ? 'Creating User' : 'Register'}
                    </button>
                </form>
                {showTerms && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg w-11/12 md:w-1/3 max-h-96 overflow-y-auto">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Şərtlər və Qaydalar</h3>
                            <p className="text-md text-gray-700 mb-4">
                                Zəhmət olmasa, bu saytdan istifadə etməzdən əvvəl aşağıdakı şərtləri diqqətlə oxuyun. Sayta daxil olaraq və qeydiyyat prosesini tamamlayaraq, aşağıda göstərilən şərtlərlə razılaşmış sayılırsınız.
                            </p>
                            <ul className="list-decimal pl-5 space-y-2">
                                <li>Ödənişlər və Geri Qaytarma Siyasəti
                                    Saytda etdiyiniz ödənişlər heç bir halda geri qaytarılmır. Xahiş edirik, ödəniş etməzdən əvvəl bütün məlumatları diqqətlə oxuyun və qərarınızı dəqiq verin.
                                </li>
                                <li>Qazanc Sistemi
                                    Əgər dəvətsiz şəkildə qazanc əldə etmək istəyirsinizsə, müəyyən vaxt ərzində sistem tərəfindən təyin olunan qaydalara uyğun olaraq qazanc əldə edə bilərsiniz.
                                    Lakin qeydiyyatdan keçdikdən sonra əgər dəvət etdiyiniz şəxslər olarsa, qazancınız dərhal aktivləşəcək və hesabınızda göstərilən məbləğ birbaşa bank kartı hesabınıza köçürüləcəkdir.
                                </li>
                                <li>Məlumatların Mühafizəsi
                                    İstifadəçilərin şəxsi məlumatları gizli saxlanılır və üçüncü şəxslərlə paylaşılmır. Lakin hüquq-mühafizə orqanlarının rəsmi sorğuları istisnadır.
                                </li>
                                <li>Hesabın Dayandırılması
                                    Əgər istifadəçi saytın qaydalarını pozarsa və ya sistemdən sui-istifadə edərsə, rəhbərlik həmin istifadəçinin hesabını xəbərdarlıq etmədən dondura və ya tamamilə silə bilər.</li>
                            </ul>
                            <button
                                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg"
                                onClick={acceptTerms}
                            >
                                Razıyam
                            </button>
                            <button
                                className="mt-2 w-full bg-gray-300 text-gray-700 py-2 rounded-lg"
                                onClick={closeTermsModal}
                            >
                                İmtina et
                            </button>
                        </div>
                    </div>
                )}
                <p className="text-center mt-6 text-md text-gray-700 cursor-pointer" onClick={() => navigate('/login')}>
                    Mövcud Hesabın Var? <span className="text-blue-600 hover:text-blue-800">Giriş et.</span>
                </p>
            </div>
        </section>
    );
};

export default Register;
