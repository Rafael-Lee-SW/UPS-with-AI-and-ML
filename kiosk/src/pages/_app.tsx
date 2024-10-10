import "../styles/globals.css"; // 전역 스타일을 포함
import { AppProps } from "next/app";

// 모든 페이지에 적용될 공통 레이아웃과 상태 관리 설정
function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
