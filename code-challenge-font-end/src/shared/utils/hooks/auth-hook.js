import { useState, useCallback, useEffect } from 'react';

let logoutTimer;

const useAuth = () => {
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(false);

  const login = useCallback((uid, userToken, expirationDate) => {
    setToken(userToken);
    setUserId(uid);
    const tokenValidTill = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenValidTill);
    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: uid,
        userToken,
        expiration: tokenValidTill.toISOString(),
      }),
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    localStorage.removeItem('userData');
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);
//store in localStorage so it will keep user login for () hour
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (
      storedData
      && storedData.token
      && new Date(storedData.expiration) > new Date()
    ) {
      login(storedData.userId, storedData.token, new Date(storedData.expiration));
    }
  }, [login]);

  return {
    token, login, logout, userId,
  };
};

export default useAuth;
