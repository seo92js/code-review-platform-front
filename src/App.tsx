import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RepositoryList from "./components/RepositoryList";
import PullRequestList from "./components/PullRequestList";
import ChangedFilesView from "./components/ChangedFilesView";
import CustomToastContainer from "./components/ToastContainer";
import './api/axios';

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path="/" element={<RepositoryList />} />
                    <Route path="/repos/:owner/:repo" element={<PullRequestList />} />
                    <Route path="/repos/:owner/:repo/pulls/:prNumber" element={<ChangedFilesView />} />
                </Routes>
                <CustomToastContainer />
            </div>
        </BrowserRouter>
    )
}

export default App
