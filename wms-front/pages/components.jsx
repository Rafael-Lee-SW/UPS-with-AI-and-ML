import React, { useEffect, useState } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// react components for routing our app without refresh
import Link from "next/link";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Header from "/components/Header/HomeHeader.js";
import HeaderLinks from "/components/Header/HomeHeaderLinks.js";
import LoginHeaderLinks from "../components/Header/LogInHomeHeaderLinks";
import Footer from "/components/Footer/Footer.js";
import Slider from "react-slick"; 
import ServiceInfo1 from '/components/Main/ServiceInfo1';
import ServiceInfo2 from '/components/Main/ServiceInfo2';
import ServiceInfo3 from '/components/Main/ServiceInfo3';

import styles from "/styles/jss/nextjs-material-kit/pages/components.js";
import AOS from 'aos';
import 'aos/dist/aos.css';
import HowToUse1 from "../components/Main/HowToUse1";
import HowToUse2 from "../components/Main/HowToUse2";
import HowToUse3 from "../components/Main/HowToUse3";
import HowToUse4 from "../components/Main/HowToUse4";
import HowToUse5 from "../components/Main/HowToUse5";
import HowToUseStart from "../components/Main/HowToUseStart";
import MainEnd from "../components/Main/MainEnd";

const useStyles = makeStyles(styles);

const Components = (props) => {
  const classes = useStyles();
  const { ...rest } = props;
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1200,
    });

    // Check for token in local storage
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // 캐러셀 설정
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div>
      <Header
        brand="FIT-BOX"
        rightLinks={isLoggedIn ? <LoginHeaderLinks /> : <HeaderLinks />}
        fixed
        color="transparent"
        changeColorOnScroll={{
          height: 400,
          color: "white"
        }}
        {...rest}
      />
        <div style={{ width: '100%', height: '85vh', margin: '0', overflow: 'hidden' }}>
          <Slider {...settings}>
              <img src="/img/main1.jpg" alt="First slide" style={{ width: '100%', height: 'auto' }} />
              <img src="/img/main2.jpg" alt="Second slide" style={{ width: '100%', height: 'auto' }} />
              <img src="/img/main3.jpg" alt="Third slide" style={{ width: '100%', height: 'auto' }} />
          </Slider>
        </div>
        <div data-aos="fade-up">
          <ServiceInfo1/>
        </div>
        <div data-aos="fade-up">
          <ServiceInfo2/>
        </div>
        <div data-aos="fade-up">
          <ServiceInfo3/>
        </div>
        <div data-aos="fade-up">
          <HowToUseStart/>
        </div>
        <div data-aos="fade-up" style={{ width: '100%', height: '100vh', margin: '0', overflow: 'hidden' }}>
          <Slider {...{ ...settings, autoplay: false }}>
            <HowToUse1/>
            <HowToUse2/>
            <HowToUse3/>
            <HowToUse4/>
            <HowToUse5/>
          </Slider>
        </div>
        <div>
          <MainEnd/>
        </div>
        <Footer/>
    </div>
  );
};

export default Components;
