import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import toast from 'react-hot-toast';
import axiosInstance from '../utils/axiosInstance.utils';
import { useNavigate } from 'react-router-dom';

const useLoginMutation = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async (payload) => {
            const res = await axiosInstance.post('/auth', payload);
            return res.data;
        },
        onSuccess: (data) => {
            toast.success("User Authentication successful");
            queryClient.invalidateQueries(['user']);
            console.log(data);
            navigate(`/profile/${data.userId}`);
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong. Please try again.");
        }
    })
}

export default useLoginMutation;
