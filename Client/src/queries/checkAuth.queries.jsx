import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import {useQuery} from '@tanstack/react-query';
import axiosInstance from '../utils/axiosInstance.utils';

const useAuthQuery = () => {
    const location = useLocation();
    if (location.pathname.includes('/profile/')) {
        return {user: "", isLoading: "", isError: "", error: ""}
    }
    
    const navigate = useNavigate();
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            try {
                const res = await axiosInstance.get('/checkAuth');
                return res.data.user;
            } catch (error) {
                throw error;
            }
        },
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
        refetchInterval: 3 * 60 * 1000,
        retry: false
    });

    useEffect(() => {        
        if (isError) {
            navigate('/login');
        }
    }, [isError, error, navigate]);

    return {user: data, isLoading, isError, error};
};

export default useAuthQuery;
