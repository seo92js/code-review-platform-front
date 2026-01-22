import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RepositoryList from "./components/RepositoryList";
import PullRequestList from "./components/PullRequestList";
import ChangedFilesView from "./components/ChangedFilesView";
import SettingsPage from "./components/SettingsPage";
import CustomToastContainer from "./components/ToastContainer";
import Footer from "./components/Footer";
import MainLayout from './layouts/MainLayout';
import { AuthProvider } from './contexts/AuthContext';
import { usePageView } from "./hooks/usePageView";
import './api/axios';

function AppContent() {
    usePageView();

    return (
        <AuthProvider>
            <div className="App min-h-screen flex flex-col">
                <Routes>
                    <Route element={<MainLayout />}>
                        <Route path="/" element={<RepositoryList />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/repos/:owner/:repo" element={<PullRequestList />} />
                        <Route path="/repos/:owner/:repo/pulls/:prNumber" element={<ChangedFilesView />} />
                    </Route>
                </Routes>
                <Footer />
                <CustomToastContainer />
            </div>
        </AuthProvider>
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
