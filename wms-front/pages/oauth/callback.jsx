import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'; // AuthContext를 import

const OAuthCallback = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  // 사용자 정보를 가져오는 비동기 함수
  const fetchUserInfo = async (token, userEmail) => {
    try {
      const response = await axios.get(`https://i11a508.p.ssafy.io/api/oauth/social-sign-in`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          email  :userEmail,
        },
      });

      if (response.status === 200) {
        const user = response.data;
        // 로컬 스토리지에 사용자 정보 저장
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);

        // 전역 상태에 사용자 정보와 토큰 저장
        login(user, token);
        alert(`${user.name}님 환영합니다!`);
        router.push('/'); // 메인 페이지로 이동
      }
    } catch (error) {
      alert('사용자 정보를 가져오는 중 오류가 발생했습니다.');
      router.push('/signIn');
    } finally {
      setLoading(false); // 로딩 상태 해제
    }
  };

  const handleCallback = async (response) => {
    if (response) {
      try {
        // 'response' 쿼리 매개변수 값을 JSON으로 파싱
        const responseData = JSON.parse(decodeURIComponent(response));

        // 상태 코드와 응답 코드가 성공인지 확인
        if (responseData.code === 'SU') {

          const { userEmail, token } = responseData;

          // 이메일과 토큰을 사용하여 사용자 정보 가져오기
          await fetchUserInfo(token, userEmail);
        } else {
          alert('로그인에 실패하였습니다.');
          router.push('/signIn'); // 로그인 페이지로 이동
        }
      } catch (error) {
        alert('인증 처리 중 오류가 발생했습니다.');
        router.push('/signIn');
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    } else {
      setLoading(false); // response가 없을 경우 로딩 상태 해제
    }
  };

  useEffect(() => {
    // 컴포넌트가 처음 마운트될 때와 쿼리 매개변수가 변경될 때 호출
    const checkQueryAndHandle = async () => {

      const { token } = router.query; // 리다이렉션 URL에서 'response' 쿼리 매개변수 가져오기

      if (!token) {
        // 쿼리가 아직 준비되지 않았다면, 추가적인 로직을 사용하여 다시 확인하거나 사용자에게 대기 메시지를 표시할 수 있습니다.
        return;
      }

      // 쿼리가 존재할 경우 handleCallback 호출
      await handleCallback(token);
    };

    // 쿼리 파라미터가 존재할 때까지 기다림
    checkQueryAndHandle();
  }, [router.query]);

  if (loading) {
    return <div>OAuth 인증 처리 중...</div>;
  }

  return null;
};

export default OAuthCallback;
