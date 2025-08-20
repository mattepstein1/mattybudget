import React, { createContext, useState, useContext, ReactNode } from 'react';
interface AuthContextType {
    isLoggedIn: boolean;
    setIsLoggedIn: (value: boolean) => void;
}

interface ThemeContextType {
    theme: 'light' | 'dark';
    setTheme: (value: 'light' | 'dark') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<'light' | 'dark'>(
        localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'
    );

    React.useEffect(() => {
        document.body.className = theme === 'dark' ? 'dark-mode' : 'light-mode';
        localStorage.setItem('theme', theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within an AuthProvider');
    }
    return context;
};