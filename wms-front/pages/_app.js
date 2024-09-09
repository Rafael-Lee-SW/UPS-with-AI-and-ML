import React, { useEffect } from "react";
import Head from "next/head";
import Header from "/components/Header/HomeHeader.js";
import HeaderLinks from "/components/Header/HomeHeaderLinks.js";
import "/styles/scss/nextjs-material-kit.scss?v=1.2.0";
import "../styles/globals.css";
import { AuthProvider } from "../context/AuthContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps, router }) {
  useEffect(() => {
    // Add any side effects here
  }, []);

  // 헤더가 출력되지 않는 페이지
  const noHeaderRoutes = [
    "/user/[id]",
    "/user/select",
    "/signIn",
    "/signup",
    "/components",
    "/fitbox",
  ];

  // 헤더를 사용하지 않을 페이지인지 체크
  const shouldDisplayHeader = !noHeaderRoutes.includes(router.pathname);

  return (
    <React.Fragment>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <title>Fit-Box</title>
      </Head>
      <AuthProvider>
        {shouldDisplayHeader && (
          <Header
            brand="FIT-BOX"
            rightLinks={<HeaderLinks />}
            fixed
            color="transparent"
            changeColorOnScroll={{ height: 400, color: "white" }}
          />
        )}
        <Component {...pageProps} />
        <ToastContainer />
      </AuthProvider>
    </React.Fragment>
  );
}

export default MyApp;
