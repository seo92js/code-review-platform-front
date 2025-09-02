import axios from "axios";

interface LogoutButtonProps {
    username: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({username}) => {
    const handleLogout = async () => {
        try {
            await axios.post('/oauth2/logout', {
                withCredentials: true
            });

            window.location.href = "http://localhost:5173";
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="flex flex-row items-center space-x-4">
            <h2 className="text-white text-base font-medium">{username}님 반갑습니다!</h2>
            <button 
                onClick={handleLogout}
                className="bg-red-500/20 text-sm hover:bg-red-500/30 text-red-400 border border-red-500/30 hover:border-red-400 font-semibold py-2 px-4 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-red-500/25"
            >
                Logout
            </button>
        </div>
    );
}

export default LogoutButton;