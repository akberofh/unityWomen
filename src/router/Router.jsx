import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "../pages/login/Login";
import Register from "../pages/register/Register";
import Profile from "../pages/profile/Profile";
import PrivateRoute from "../components/PrivateRoute";
import Home from "../pages/home/Home";
import Dashboard from "../pages/dashboard/Dashboard";
import EmailVerification from "../pages/EmailVerification/Email"
import ResertPass from "../pages/login/ResertPass";
import RequestPass from "../pages/login/RequestPass";
import Cart from "../pages/Cart/Cart";
import Confirmed from "../pages/Confirmed/Confirmerd";
import ContactComp from "../components/ContacUs/ContactComp";
import DestCatagory from "../Catagory/DestCatagory";
import DetalPage from "../Catagory/DetailPage/DetalPage";
import Qolbaq from "../Catagory/Qolbaq";
import Temizleyici from "../Catagory/Temizleyici";
import Boyunbagi from "../Catagory/Boyunbagi";
import Sirga from "../Catagory/Sirga";
import Saat from "../Catagory/Saat";
import Uzuk from "../Catagory/Uzuk";
import Etir from "../Catagory/Etir";
import Qizil from "../Catagory/Qizil";
import SacUcun from "../Catagory/SacUcun";
import Baxim from "../Catagory/Baxim";
import SacSanpun from "../Catagory/SacSanpun";
import DusGeli from "../Catagory/DusGeli";
import Dodaq from "../Catagory/Dodaq";
import GozUcun from "../Catagory/GozUcun";
import QasUcun from "../Catagory/QasUcun";
import UsaqlarUcun from "../Catagory/UsaqlarUcun";
import Makiaj from "../Catagory/Makiaj";
import AddNewTodo from "../pages/addTodo/AddNewTodo";
import BasketProduct from "../pages/basket/BaketProduct";


const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}  />
        <Route path="/sirga" element={<Sirga />}  />
        <Route path="/saat" element={<Saat />}  />
        <Route path="/dodaq" element={<Dodaq />}  />
        <Route path="/baxim" element={<Baxim />}  />
        <Route path="/goz-ucun" element={<GozUcun />}  />
        <Route path="/sac-ucun" element={<SacUcun />}  />
        <Route path="/qizil" element={<Qizil />}  />
        <Route path="/makiaj" element={<Makiaj />}  />
        <Route path="/qas-ucun" element={<QasUcun />}  />
        <Route path="/uzuk" element={<Uzuk />}  />
        <Route path="/usaq-ucun" element={<UsaqlarUcun />}  />
        <Route path="/dus-geli" element={<DusGeli />}  />
        <Route path="/sac-sanpun" element={<SacSanpun />}  />
        <Route path="/etir" element={<Etir />}  />
        <Route path="/product/:qolbaq_id" element={<DetalPage />} />
        <Route path="/dest" element={<DestCatagory />}  />
        <Route path="/boyunbagi" element={<Boyunbagi />}  />
        <Route path="/qolbaq" element={<Qolbaq />}  />
        <Route path="/temizleyici" element={<Temizleyici />}  />
        <Route path="/contact" element={<ContactComp />}  />
        <Route path="/confirmed" element={<Confirmed />}  />
        <Route path="/basket" element={<BasketProduct />}  />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/EmailVerification" element={< EmailVerification/>} />
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/add-new-todo" element={<AddNewTodo />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/reset-password" element={<  ResertPass/>} />
        <Route path="/request-password-reset" element={<  RequestPass/>} />
         
        <Route path="" element={<PrivateRoute/>}>
          <Route path="/profile" element={<Profile/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
