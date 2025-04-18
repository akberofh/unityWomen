import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from '../../components/header/Header'
import Chat from '../../components/Chat/Chat'
import Sec from "../../components/SwiperSec/Sec";
import Cart from "../Cart/Cart";
import CommentDetal from "../../Catagory/Commet/CommentDetal";


const Home = () => {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
  );
  const element = document.documentElement;

  useEffect(() => {
    if (theme === "dark") {
      element.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      element.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  React.useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  return (
    <div className=" dark:bg-black dark:text-white mt-[270px] text-black overflow-x-hidden">
        <Header theme={theme} setTheme={setTheme} />
        <Sec/>
        <Chat theme={theme}  />
        <CommentDetal/>
        <Cart theme={theme} />
    </div>
  );
};

export default Home;
