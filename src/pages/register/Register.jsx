import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../redux/slices/usersApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../../redux/slices/authSlice";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import 'react-toastify/dist/ReactToastify.css';
import { useDropzone } from 'react-dropzone';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';


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
    const location = useLocation();

    const [register, { isLoading }] = useRegisterMutation();
    const { userInfo } = useSelector(state => state.auth);

    const [referralRequired, setReferralRequired] = useState(false);

    useEffect(() => {

        if (userInfo) {
            setReferralCode(referralCode);

            // API'ye referral ile kaç kullanıcı kayıt olmuş kontrolü yap
            fetch(`https://unity-women-backend.vercel.app/api/users/admin/${referralCode}`)
                .then(res => res.json())
                .then(data => {
                    if (data.count >= 2) {
                        setReferralRequired(true); // 2 kişi olmuşsa zorunlu yap
                    } else {
                        setReferralRequired(false); // değilse zorunlu değil
                    }
                })
                .catch(err => {
                    console.error("Referral kod kontrol hatası:", err);
                });
        }
    }, [userInfo]);



    useEffect(() => {
        if (userInfo) {
            navigate("/");
        }
        const queryParams = new URLSearchParams(location.search);
        const referral = queryParams.get('referral');
        if (referral) {
            setReferralCode(referral);
        }
    }, [navigate, userInfo, location]);

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

            const res = await register(formData).unwrap();
            dispatch(setCredentials({ ...res }));
            navigate("/");
        } catch (error) {
            toast.error('Registration failed');
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
                        <div>
                            <label className="block text-md font-semibold text-gray-700">Lider</label>
                            <input
                                type="text"
                                name="referralCode"
                                placeholder="Liderin kodunu daxil edin!"
                                onChange={(e) => setReferralCode(e.target.value)}
                                required={referralRequired}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-md"
                            />
                            {referralRequired && (
                                <p className="text-sm text-red-500 mt-1">Bu kod artıq 2 dəfə istifadə edilib, yeni qeydiyyat üçün kod daxil edilməlidir.</p>
                            )}
                        </div>
                        
                        <div>
                            <label className="block text-md font-semibold text-gray-700">Link Sahibi</label>
                            <input
                                type="text"
                                name="referralCode"
                                value={referralCode}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-md"
                            />
                          
                        </div>

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
                                required
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-md"
                            />
                            <p>(Mecbur deyil)</p>
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
                    <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-150 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed">
                        {isLoading ? 'Creating User' : 'Register'}
                    </button>
                </form>
                <p className="text-center mt-6 text-md text-gray-700 cursor-pointer" onClick={() => navigate('/login')}>
                    Mövcud Hesabın Var? <span className="text-blue-600 hover:text-blue-800">Giriş et.</span>
                </p>
            </div>
        </section>
    );
};

export default Register;
