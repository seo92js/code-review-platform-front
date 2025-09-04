import { ToastContainer as ReactToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CustomToastContainer = () => {
    return (
        <ReactToastContainer
            position="top-center"
            autoClose={2000}
            hideProgressBar={true}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            pauseOnHover
            toastStyle={{
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                color: '#f8fafc',
                border: '1px solid #475569',
                borderRadius: '12px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                fontSize: '12px'
            }}
        />
    );
};

export default CustomToastContainer;
