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
            <h2>{username}님 반갑습니다!</h2>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default LogoutButton;