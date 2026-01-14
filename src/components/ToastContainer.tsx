import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CustomToastContainer = () => {
    return (
        <>
            <style>{`
                .Toastify__progress-bar {
                    background: linear-gradient(90deg, #60a5fa, #3b82f6) !important;
                }
            `}</style>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                toastStyle={{
                    background: 'rgba(17, 17, 24, 0.95)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    fontSize: '11px',
                    padding: '8px 10px',
                    minHeight: '38px',
                    lineHeight: '1.4',
                }}
            />
        </>
    );
};

export default CustomToastContainer;
