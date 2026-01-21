import axios from './axios';

export interface Notification {
    id: number;
    loginId: string;
    // message removed. Constructed on client side.
    type: 'NEW_PR' | 'REVIEW_COMPLETE' | 'REVIEW_FAILED';
    isRead: boolean;
    createdAt: string;
    prTitle?: string;
    prNumber?: number;
    repositoryName?: string;
}

export const getNotifications = async (): Promise<Notification[]> => {
    const response = await axios.get<Notification[]>('/api/notifications');
    return response.data;
};

export const markAllAsRead = async (): Promise<void> => {
    await axios.put('/api/notifications/read-all');
};

export const markAsRead = async (id: number): Promise<void> => {
    await axios.put(`/api/notifications/${id}/read`);
};
