function LoginButton() {
    const handleLogin = () => {
        window.location.href = "/oauth2/authorization/github";
    };

    return (
        <button onClick={handleLogin} className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 hover:border-blue-400 font-semibold py-2 px-4 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25">
            GitHub Login
        </button>
    );
}

export default LoginButton;