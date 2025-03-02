function LoginButton() {
    const handleLogin = () => {
        window.location.href = "/oauth2/authorization/github";
    };

    return (
        <button onClick={handleLogin} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            GitHub Login
        </button>
    );
}

export default LoginButton;