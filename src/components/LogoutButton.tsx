import axios from "../api/axios";
import { toast } from 'react-toastify';
import { getErrorMessage } from '../utils/errorMessages';

interface LogoutButtonProps {
    username: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ username }) => {
    const handleLogout = async () => {
        try {
            await axios.post('/oauth2/logout', null, {
                withCredentials: true
            });

            window.location.href = "/";
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    return (
        <div className="flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            {/* User Avatar */}
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium text-[10px] sm:text-xs">
                {username.charAt(0).toUpperCase()}
            </div>

            {/* Username - hidden on very small screens */}
            <span className="hidden sm:block ml-2 text-sm font-medium text-slate-300">{username}</span>

            {/* Divider */}
            <div className="w-px h-3 sm:h-4 mx-1.5 sm:mx-2.5 bg-white/10"></div>

            {/* Logout Button */}
            <button
                onClick={handleLogout}
                className="text-[10px] sm:text-xs text-slate-400 hover:text-slate-200 transition-colors duration-200"
            >
                Logout
            </button>
        </div>
    );
}

export default LogoutButton;