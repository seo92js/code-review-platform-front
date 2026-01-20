import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export const usePageView = () => {
    const location = useLocation();

    useEffect(() => {
        axios.post('/api/analytics/pageview', { path: location.pathname })
            .catch(() => {
                // 실패해도 무시
            });
    }, [location.pathname]);
};
