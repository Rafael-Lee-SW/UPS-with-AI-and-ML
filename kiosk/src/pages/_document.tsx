import { Html, Head, Main, NextScript } from 'next/document';

// Next.js에서 HTML 문서의 구조를 설정하는 컴포넌트
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* 전역으로 사용할 meta 태그나 외부 리소스를 포함할 수 있음 */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
