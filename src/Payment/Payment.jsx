import React, { useEffect, useRef, useState } from 'react';
import { useGetTodosQuery } from '../redux/slices/productApiSlice';
import { setTodos } from '../redux/slices/productSlice';
import { useDispatch } from 'react-redux';

const Payment = () => {
  const [step, setStep] = useState(1);
  const { data, isLoading } = useGetTodosQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    if (data) {
      dispatch(setTodos(data));
    }
  }, [data, dispatch]);

  const [selectedImage, setSelectedImage] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const canvasRef = useRef(null);

  const startCamera = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Arka kamerayı seçmeye çalış
      const constraints = {
        video: {
          facingMode: "environment" // Arka kamerayı açmaya çalışıyoruz
        }
      };
  
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          // Akış başarılıysa video elementine bağla
          const videoElement = document.getElementById("videoElement");
          videoElement.srcObject = stream;
          setIsCameraOpen(true);
        })
        .catch((err) => {
          console.error("Kamera açılırken bir hata oluştu: ", err);
          alert("Kamera açılmadı. Lütfen kamera izinlerini kontrol edin.");
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
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
          <div>
            <h2 className="text-xl font-semibold mb-4">Faktura ünvanı</h2>
            <form>
              {['Ad', 'Soyad', 'Email ünvanı', 'Əlaqə nömrəsi', 'Ünvan', 'Poçt indeksi', 'Şəhər'].map((label, idx) => (
                <div key={idx}>
                  <label className="block text-sm font-semibold mt-4">{label}</label>
                  <input
                    type={label.includes('Email') ? 'email' : label.includes('Əlaqə') ? 'tel' : 'text'}
                    className="w-full p-2 mt-2 border dark:text-white dark:bg-black rounded-md"
                    required
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => setStep(2)}
                className="bg-[#b87333] text-white py-2 px-4 rounded-md hover:bg-[#a0652e] mt-6 float-right"
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
              {['Şəhər', 'Çatdırılma növü'].map((label, idx) => (
                <div key={idx}>
                  <label className="block text-sm font-semibold mt-4">{label}</label>
                  <select className="w-full p-2 mt-2 border dark:text-white dark:bg-black rounded-md">
                    {label === 'Şəhər'
                      ? ['Bakı', 'Gəncə', 'Sumqayıt', 'Şəki'].map((option, i) => (
                          <option key={i} value={option}>
                            {option}
                          </option>
                        ))
                      : ['Kuryer', 'Poçt', 'Mağazadan götürmə'].map((option, i) => (
                          <option key={i} value={option}>
                            {option}
                          </option>
                        ))}
                  </select>
                </div>
              ))}
              <div className="flex justify-between mt-6">
                <button type="button" onClick={() => setStep(1)} className="bg-gray-400 text-white py-2 px-4 rounded-md">
                  ← Geri
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="bg-[#b87333] text-white py-2 px-4 rounded-md hover:bg-[#a0652e]"
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
              {[['Kart Nömrəsi', '**** **** **** ****'], ['Son istifadə tarixi', 'MM/YY'], ['CVV', '***']].map(
                ([label, placeholder], idx) => (
                  <div key={idx}>
                    <label className="block text-sm font-semibold mt-4">{label}</label>
                    <input
                      type="text"
                      className="w-full p-2 mt-2 border dark:text-white dark:bg-black rounded-md"
                      placeholder={placeholder}
                      required
                    />
                  </div>
                )
              )}

              {/* Fotoğraf yükleme alanı */}
              <label className="block text-sm font-semibold mt-4">Şəkil yüklə</label>
              <input
                type="file"
                className="w-full p-2 mt-2 border dark:text-white dark:bg-black rounded-md"
                accept="image/*"
                onChange={handleFileChange}
              />

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
                <button type="button" className="bg-gray-400 text-white py-2 px-4 rounded-md">
                  ← Geri
                </button>
                <button type="submit" className="bg-[#b87333] text-white py-2 px-4 rounded-md hover:bg-[#a0652e]">
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
                  src={product.thumbnail}
                  alt="Thumbnail"
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
            <div className="dark:bg-black border shadow-lg rounded-lg p-6 mb-6 flex flex-col sm:flex-row items-center">
              <h6 className="text-sm font-semibold dark:text-white text-gray-800">Total: {data.length} items</h6>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;
