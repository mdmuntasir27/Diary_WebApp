import { createContext } from 'react';

const AuthContext = createContext({
    user: null,
    token: null,
    login: () => { },
    logout: () => { },
    theme: 'light',
    toggleTheme: () => { }
});

export default AuthContext;
