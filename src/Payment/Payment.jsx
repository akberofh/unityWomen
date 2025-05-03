import React, { useEffect, useRef, useState } from 'react';
import { useGetTodosQuery } from '../redux/slices/productApiSlice';
import { setTodos } from '../redux/slices/productSlice';
import { useDispatch } from 'react-redux';
import { useAddPaymenttMutation } from '../redux/slices/paymentApiSlice';

const Payment = () => {
  const [step, setStep] = useState(1);
  const { data, isLoading } = useGetTodosQuery();
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const canvasRef = useRef(null);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [adress, setAdress] = useState('');
  const [poct, setPoct] = useState('');
  const [city, setCity] = useState('');
  const [delivery, setDelivery] = useState('');
  const [photo, setPhoto] = useState(null);
  const [addPaymentt] = useAddPaymenttMutation();

  useEffect(() => {
    if (data) {
      dispatch(setTodos(data));
    }
  }, [data, dispatch]);




  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('surname', surname);
      formData.append('delivery', delivery);
      formData.append('city', city);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('description', description);
      formData.append('adress', adress);
      formData.append('poct', poct);
      if (photo) formData.append('photo', photo);

      const newPayment = await addPaymentt(formData).unwrap();

      setTimeout(() => {
        dispatch({ type: 'payment/addPayment', payload: newPayment });
      }, 1000);

    } catch (err) {
      console.error('Failed to add the payment:', err);
    }
  };

  const startCamera = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices()
        .then(devices => {
          const videoDevices = devices.filter(device => device.kind === 'videoinput');
          const backCamera = videoDevices.find(device => device.label.toLowerCase().includes('back') || device.facing == 'environment');

          if (backCamera) {
            const constraints = {
              video: { deviceId: { exact: backCamera.deviceId } }
            };

            navigator.mediaDevices
              .getUserMedia(constraints)
              .then((stream) => {
                setIsCameraOpen(true);
              })
              .catch((err) => {
                console.error("Kamera açılırken bir hata oluştu: ", err);
                alert("Kamera açılmadı. Lütfen kamera izinlerini kontrol edin.");
              });
          } else {
            alert("Arka kamera bulunamadı.");
          }
        })
        .catch(err => {
          console.error("Cihazlar alınırken bir hata oluştu: ", err);
        });
    } else {
      alert("Tarayıcınız kamera erişimini desteklemiyor.");
    }
  };

  const takePicture = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const video = document.createElement('video');

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        video.srcObject = stream;
        video.play();

        video.onloadedmetadata = () => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageUrl = canvas.toDataURL('image/png');
          setSelectedImage(imageUrl);
          stream.getTracks().forEach(track => track.stop());
        };
      })
      .catch((err) => {
        console.error("Kamera kullanılamadı: ", err);
      });
  };

  return (
    <div className="flex justify-between border max-w-7xl dark:bg-black mx-auto p-5 gap-5 flex-wrap">
      {/* Left Panel */}
      <div className="flex-1 p-5 rounded-lg dark:bg-black shadow-lg w-full sm:w-2/3 lg:w-2/3">
        <div className="flex justify-between mb-5">
          {['Faktura ünvanı', 'Çatdırılma ünvanı', 'Ödəniş'].map((label, idx) => (
            <div
              key={label}
              className={`flex-1 text-center py-2 border border-[#b87333] rounded-md font-bold ${step === idx + 1 ? 'bg-[#b87333] text-white' : 'text-[#b87333]'}`}
            >
              {idx + 1}. {label}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="p-5 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Faktura Ünvanı</h2>
            <form>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ad:</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b87333] focus:border-[#b87333] dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="surname" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Soyad:</label>
                <input
                  type="text"
                  id="surname"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b87333] focus:border-[#b87333] dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email:</label>
                <input
                  type="text"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b87333] focus:border-[#b87333] dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="adress" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ünvan:</label>
                <input
                  type="text"
                  id="adress"
                  value={adress}
                  onChange={(e) => setAdress(e.target.value)}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b87333] focus:border-[#b87333] dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Telefon nömrəsi:
                </label>
                <div className="flex items-center">
                  <select
                    id="region-code"
                    value="+994"
                    className="mr-3 w-24 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#b87333] focus:border-[#b87333] dark:bg-gray-700 dark:text-white"
                    disabled
                  >
                    <option value="+994">+994</option>
                  </select>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-r-md focus:outline-none focus:ring-2 focus:ring-[#b87333] focus:border-[#b87333] dark:bg-gray-700 dark:text-white"
                    placeholder="Telefon nömrəsini daxil edin"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Şəhər:</label>
                <input
                  type="text"
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b87333] focus:border-[#b87333] dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Not:</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b87333] focus:border-[#b87333] dark:bg-gray-700 dark:text-white"
                ></textarea>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className={`bg-[#b87333] text-white py-2 px-6 rounded-md hover:bg-[#a0652e] mt-6 float-right ${!name || !surname || !email || !adress || !phone || !city || !description ? 'cursor-not-allowed opacity-50' : ''}`}
                disabled={!name || !surname || !email || !adress || !phone || !city || !description}
              >
                Davam et →
              </button>
            </form>
          </div>


        )}

        {step === 2 && (
          <div className="min-h-96">
            <h2 className="text-xl font-semibold mb-4">Çatdırılma ünvanı</h2>
            <form>
              <div className="mb-4">
                <label htmlFor="poct" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Poçt:
                </label>
                <select
                  id="poct"
                  value={poct}
                  onChange={(e) => setPoct(e.target.value)}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b87333] focus:border-[#b87333] dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Seçin</option>
                  <option value="Bakı">Bakı</option>
                  <option value="Gəncə">Gəncə</option>
                  <option value="Sumqayıt">Sumqayıt</option>
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="delivery" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Çatdırılma ünvanı:
                </label>
                <select
                  id="delivery"
                  value={delivery}
                  onChange={(e) => setDelivery(e.target.value)}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b87333] focus:border-[#b87333] dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Seçin</option>
                  <option value="Kuryer">Kuryer</option>
                  <option value="Poçt">Poçt</option>
                  <option value="Mağazadan götürmə">Mağazadan götürmə</option>
                </select>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="bg-gray-400 text-white py-2 px-4 rounded-md"
                >
                  ← Geri
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className={`bg-[#b87333] text-white py-2 px-4 rounded-md hover:bg-[#a0652e] ${!poct || !delivery ? 'cursor-not-allowed opacity-50' : ''}`}
                  disabled={!poct || !delivery}
                >
                  Davam et →
                </button>
              </div>
            </form>
          </div>


        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Ödəniş</h2>
            <form>

              <div >
                <label htmlFor="photo">Şəkil:</label>
                <input
                  type="file"
                  id="photo"
                  onChange={handleFileChange}
                />
              </div>

              {/* Kamera açma butonu */}
              {!isCameraOpen ? (
                <button
                  type="button"
                  onClick={startCamera}
                  className="w-full p-2 mt-2 border dark:text-white dark:bg-black rounded-md"
                >
                  Kamerayı aç
                </button>
              ) : (
                <div>
                  <button
                    type="button"
                    onClick={takePicture}
                    className="w-full p-2 mt-2 border dark:text-white dark:bg-black rounded-md"
                  >
                    Fotoğraf çek
                  </button>
                  <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
                </div>
              )}

              {/* Seçilen veya çekilen fotoğrafı göster */}
              {selectedImage && (
                <div className="mt-4">
                  <h5 className="text-sm font-semibold">Seçilen Fotoğraf:</h5>
                  <img src={selectedImage} alt="Selected or Captured" className="w-full mt-2 rounded-md" />
                </div>
              )}

              <div className="flex justify-between mt-6">
                <button type="button" onClick={() => setStep(2)}
                  className="bg-gray-400 text-white py-2 px-4 rounded-md">
                  ← Geri
                </button>
                <button type="submit" onClick={handleSubmit} className="bg-[#b87333] text-white py-2 px-4 rounded-md hover:bg-[#a0652e]">
                  Ödənişi tamamla
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Right Panel (Order Summary) */}
      <div className="w-full sm:w-1/3 lg:w-1/3 border p-5 rounded-lg shadow-lg mt-5 sm:mt-0">
        <h3 className="text-xl font-semibold mb-4">Sebetdeki mehsullar</h3>
        <div className="container mx-auto p-6 max-h-80 overflow-y-auto">
          {isLoading ? (
            <p className="text-center text-gray-600">Yükleniyor...</p>
          ) : (
            data &&
            data.map((product) => (
              <div key={product._id} className="dark:bg-black border shadow-lg rounded-lg p-6 mb-6 flex flex-col sm:flex-row items-center hover:shadow-xl transition-all duration-300 ease-in-out">
                    <img
                src={
                  Array.isArray(product.photo) && product.photo.length > 0
                    ? product.photo[0]
                    : product.photo
                }
                alt={product.title}
                className="w-9 h-9 object-cover rounded-full mb-4 sm:mb-0 sm:mr-6 border border-gray-200"
                />
                <div className="w-full flex flex-col items-center sm:items-start">
                  <h6 className="text-sm font-semibold dark:text-white text-gray-800">{product.title}</h6>
                </div>
              </div>
            ))
          )}
        </div>

        <h3 className="text-xl font-semibold mb-4">Sifaris ozeti</h3>
        <div className="container mx-auto p-6">
          {isLoading ? (
            <p className="text-center text-gray-600">Yükleniyor...</p>
          ) : (
            <div className="dark:bg-black border shadow-lg rounded-lg p-6 mb-6 flex flex-col sm:flex-row items-center hover:shadow-xl transition-all duration-300 ease-in-out">
              <div className="w-full flex flex-col items-center sm:items-start">
                <h6 className="text-sm font-semibold dark:text-white text-gray-800">Qiymet:</h6>
              </div>
              <p className="object-cover rounded-full mb-4 sm:mb-0 sm:mr-6">
                {data && (data.reduce((acc, product) => acc + product.totalPrice, 0)).toFixed(2)} ₼
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;
