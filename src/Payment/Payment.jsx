import React, { useState } from 'react';

const Payment = () => {
  const [step, setStep] = useState(1);
  
  return (
    <div className="flex justify-between border max-w-7xl dark:to-black mx-auto p-5 gap-5 flex-wrap">
      <div className="flex-1 p-5 rounded-lg dark:to-black shadow-md w-full sm:w-2/3 lg:w-2/3">
        <div className="flex justify-between mb-5">
          <div className={`flex-1 text-center py-2 border border-[#b87333] rounded-md font-bold ${step === 1 ? 'bg-[#b87333] text-white' : 'text-[#b87333]'}`}>1. Faktura ünvanı</div>
          <div className={`flex-1 text-center py-2 border border-[#b87333] rounded-md font-bold ${step === 2 ? 'bg-[#b87333] text-white' : 'text-[#b87333]'}`}>2. Çatdırılma ünvanı</div>
          <div className={`flex-1 text-center py-2 border border-[#b87333] rounded-md font-bold ${step === 3 ? 'bg-[#b87333] text-white' : 'text-[#b87333]'}`}>3. Ödəniş</div>
        </div>
        
        {step === 1 && (
          <div>
            <h2 className="text-xl dark:to-black font-semibold mb-4">Faktura ünvanı</h2>
            <form>
              <label className="block text-sm font-semibold mt-4">Ad</label>
              <input type="text" className="w-full p-2 mt-2 border dark:text-black dark:to-black rounded-md" required />

              <label className="block text-sm font-semibold mt-4">Soyad</label>
              <input type="text" className="w-full p-2 mt-2 dark:text-black border dark:to-black rounded-md" required />

              <label className="block text-sm font-semibold mt-4">Email ünvanı</label>
              <input type="email" className="w-full p-2 mt-2 dark:text-black border dark:to-black rounded-md" required />

              <label className="block text-sm font-semibold mt-4">Əlaqə nömrəsi</label>
              <input type="tel" className="w-full p-2 mt-2 dark:text-black border dark:to-black rounded-md" required />

              <label className="block text-sm font-semibold mt-4">Ünvan</label>
              <input type="text" className="w-full p-2 mt-2 dark:text-black border dark:to-black rounded-md" required />

              <label className="block text-sm font-semibold mt-4">Poçt indeksi</label>
              <input type="text" className="w-full p-2 mt-2 dark:text-black border dark:to-black rounded-md" />

              <label className="block text-sm font-semibold mt-4">Şəhər</label>
              <input type="email" className="w-full p-2 dark:text-black mt-2 border dark:to-black rounded-md" required />
              
              <button type="button" onClick={() => setStep(2)} className="bg-[#b87333] text-white py-2 px-4 rounded-md hover:bg-[#a0652e] mt-6 float-right">Davam et →</button>
            </form>
          </div>
        )}
        
        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Çatdırılma ünvanı</h2>
            <form>
              <label className="block text-sm font-semibold mt-4">Şəhər</label>
              <select className="w-full p-2 mt-2 border dark:text-black dark:to-black rounded-md">
                <option>Bakı</option>
                <option>Gəncə</option>
                <option>Sumqayıt</option>
                <option>Şəki</option>
              </select>
              
              <label className="block text-sm font-semibold mt-4">Çatdırılma növü</label>
              <select className="w-full p-2 mt-2 border dark:text-black dark:to-black rounded-md">
                <option>Kuryer</option>
                <option>Poçt</option>
                <option>Mağazadan götürmə</option>
              </select>
              
              <div className="flex justify-between mt-6">
                <button type="button" onClick={() => setStep(1)} className="bg-gray-400 text-white py-2 px-4 rounded-md">← Geri</button>
                <button type="button" onClick={() => setStep(3)} className="bg-[#b87333] text-white py-2 px-4 rounded-md hover:bg-[#a0652e]">Davam et →</button>
              </div>
            </form>
          </div>
        )}
        
        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Ödəniş</h2>
            <form>
              <label className="block text-sm font-semibold mt-4">Kart Nömrəsi</label>
              <input type="text" className="w-full p-2 mt-2 border dark:text-black dark:to-black rounded-md" placeholder="**** **** **** ****" required />
              
              <label className="block text-sm font-semibold mt-4">Son istifadə tarixi</label>
              <input type="text" className="w-full p-2 mt-2 border dark:text-black dark:to-black rounded-md" placeholder="MM/YY" required />
              
              <label className="block text-sm font-semibold mt-4">CVV</label>
              <input type="text" className="w-full p-2 mt-2 border dark:text-black dark:to-black rounded-md" placeholder="***" required />
              
              <label className="block text-sm font-semibold mt-4">Şəkil yüklə</label>
              <input type="file" className="w-full p-2 mt-2 border dark:text-black dark:to-black rounded-md" />
              
              <div className="flex justify-between mt-6">
                <button type="button" onClick={() => setStep(2)} className="bg-gray-400 text-white py-2 px-4 rounded-md">← Geri</button>
                <button type="submit" className="bg-[#b87333] text-white py-2 px-4 rounded-md hover:bg-[#a0652e]">Ödənişi tamamla</button>
              </div>
            </form>
          </div>
        )}
      </div>
      
      <div className="w-full sm:w-1/3 lg:w-1/3 border p-5 rounded-lg shadow-md mt-5 sm:mt-0">
        <h3 className="text-xl font-semibold">Sifariş özeti</h3>
        {/* Burada sifariş özeti əlavə ediləcək */}
      </div>
    </div>
  );
}

export default Payment;
