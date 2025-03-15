import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import DetalPage from "../Catagory/DetailPage/DetalPage";
import Baxim from "../Catagory/Baxim";
import AddNewTodo from "../pages/addTodo/AddNewTodo";
import BasketProduct from "../pages/basket/BaketProduct";
import Comment from "../Catagory/Commet/Comment";
import Catagory from "../Catagory/Catagory";
import CatagoryAdd from "../Catagory/CatagoryAdd";
import FavorieProduct from "../pages/Favorie/FavorieProduct";
import PaymentDetal from "../Payment/PaymentDetal";


const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}  />
        <Route path="/payment" element={<PaymentDetal />}  />
        <Route path="/favorie" element={<FavorieProduct />}  />
        <Route path="/catagory/:catagory" element={<Baxim />} />
        <Route path="/comment" element={<Comment />}  />   
        <Route path="/product/:qolbaq_id" element={<DetalPage />} />   
        <Route path="/contact" element={<ContactComp />}  />
        <Route path="/confirmed" element={<Confirmed />}  />
        <Route path="/basket" element={<BasketProduct />}  />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/EmailVerification" element={< EmailVerification/>} />
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/add-new-todo" element={<AddNewTodo />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/kategori" element={<Catagory />} />
        <Route path="/catagoryadd" element={<CatagoryAdd />} />
        <Route path="/reset-password/:token" element={<  ResertPass/>} />
        <Route path="/request-password-reset" element={<  RequestPass/>} />
        <Route path="" element={<PrivateRoute/>}>
          <Route path="/profile" element={<Profile/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
