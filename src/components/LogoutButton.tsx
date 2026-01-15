import axios from "axios";
import { toast } from 'react-toastify';
import { getErrorMessage } from '../utils/errorMessages';

interface LogoutButtonProps {
    username: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ username }) => {
    const handleLogout = async () => {
        try {
            await axios.post('/oauth2/logout', {
                withCredentials: true
            });

            window.location.href = "http://localhost:5173";
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    return (
        <div className="flex items-center space-x-4">
            {/* User Info */}
            <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium text-xs">
                    {username.charAt(0).toUpperCase()}
                </div>
                <span className="text-[13px] font-medium text-slate-300">{username}</span>
            </div>

            {/* Logout Button */}
            <button
                onClick={handleLogout}
                className="group flex items-center space-x-1.5 px-2.5 py-1.5 text-[12px] text-slate-500 hover:text-slate-300 rounded-md hover:bg-white/5 transition-all duration-200"
            >
                <span>Logout</span>
            </button>
        </div>
    );
}

export default LogoutButton;