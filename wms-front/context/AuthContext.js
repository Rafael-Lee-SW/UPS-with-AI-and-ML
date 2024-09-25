import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    token: null,
  });

  const login = (userData, token) => {
    setAuthState({ user: userData, token });
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setAuthState({ user: null, token: null });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      // 로컬 스토리지에서 가져온 사용자 정보로 로그인 함수 호출
      login(JSON.parse(userData), token);
    } else {
      if (token) {
        axios.get('/api/user', { headers: { Authorization: `Bearer ${token}` } })
          .then(response => {
            const userData = response.data;
            login(userData, token);
          })
          .catch(error => {
            console.error("Failed to fetch user data", error);

            // 에러가 발생했지만 토큰이 유효하지 않다고 확신할 수 없는 경우, logout을 호출하지 않음
            if (error.response && error.response.status === 401) {
              logout();
            }
          });
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
