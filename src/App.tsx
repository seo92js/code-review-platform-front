import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RepositoryList from "./components/RepositoryList";
import PullRequestList from "./components/PullRequestList";
import ChangedFilesView from "./components/ChangedFilesView";
import SettingsPage from "./components/SettingsPage";
import CustomToastContainer from "./components/ToastContainer";
import Footer from "./components/Footer";
import { usePageView } from "./hooks/usePageView";
import './api/axios';

function AppContent() {
    usePageView();

    return (
        <div className="App min-h-screen flex flex-col">
            <div className="flex-1">
                <Routes>
                    <Route path="/" element={<RepositoryList />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/repos/:owner/:repo" element={<PullRequestList />} />
                    <Route path="/repos/:owner/:repo/pulls/:prNumber" element={<ChangedFilesView />} />
                </Routes>
            </div>
            <Footer />
            <CustomToastContainer />
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    )
}

export default App
