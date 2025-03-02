import './App.css'
import {useEffect, useState} from "react";
import {checkLogin, getUsername} from "./api/github.ts";
import Header from "./components/Header.tsx";
import {getRepositories} from "./api/github.ts";
import RepositoryList from "./components/RepositoryList.tsx";

function App() {
    const [isLogin, setIsLogin] = useState(false);
    const [repositories, setRepositories] = useState([]);
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        const fetchLoginStatus = async () => {
            const status = await checkLogin();
            setIsLogin(status);

            if (status) {
                const repos = await getRepositories();
                const name = await getUsername();

                setUsername(name);
                setRepositories(repos);
            }
        }

        fetchLoginStatus();
    }, []);

    return (
        <div className="App">
            <Header isLogin={isLogin} username={username} />
            <RepositoryList repositories={repositories} />
        </div>
    )
}

export default App
