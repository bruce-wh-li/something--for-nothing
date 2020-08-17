import { createContext } from 'react';

// this works like a global variable 
const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  token: null,
  login: () => {},
  logout: () => {},
});

export default AuthContext;
