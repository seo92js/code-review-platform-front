import React from 'react';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';

interface HeaderProps {
    isLogin: boolean;
    username: string | null;
}

const Header: React.FC<HeaderProps> = ({ isLogin , username }) => {
    return (
        <div className="header mb-7">
            {isLogin && username ? <LogoutButton username={username} /> : <LoginButton />}
        </div>
    );
};

export default Header;