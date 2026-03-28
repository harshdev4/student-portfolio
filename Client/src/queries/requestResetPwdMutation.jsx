import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import toast from 'react-hot-toast';
import axiosInstance from '../utils/axiosInstance.utils';
import { useNavigate } from 'react-router-dom';

const requestResetPwdMutation = () => {
    return useMutation({
        mutationFn: async (payload) => {
            const res = await axiosInstance.post('/request-reset-pwd', payload);
            return res.data;
        },
        onSuccess: (data) => {
            toast.success("Email sent!, please check your inbox");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong. Please try again.");
        }
    })
}

export const resetPwdMutation = () => {
    return useMutation({
        mutationFn: async (payload) => {
            const res = await axiosInstance.post('/reset-pwd', payload);
            return res.data;
        },
        onSuccess: (data) => {
            toast.success("Password changed successfully");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong. Please try again.");
        }
    })
}

export default requestResetPwdMutation;
