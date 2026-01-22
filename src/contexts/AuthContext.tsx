import React, { createContext, useContext, useState, useEffect } from 'react';
import { checkLogin, getUsername } from '../api/github';

interface AuthContextType {
    isLogin: boolean;
    username: string | null;
    isLoading: boolean;
    refreshLoginStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLogin, setIsLogin] = useState(false);
    const [username, setUsername] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshLoginStatus = async () => {
        try {
            const status = await checkLogin();
            setIsLogin(status);

            if (status) {
                const name = await getUsername();
                setUsername(name);
            } else {
                setUsername(null);
            }
        } catch (error) {
            console.error('Failed to check login status:', error);
            setIsLogin(false);
            setUsername(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshLoginStatus();
    }, []);

    return (
        <AuthContext.Provider value={{ isLogin, username, isLoading, refreshLoginStatus }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
