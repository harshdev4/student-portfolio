import React from 'react'
import {useMutation, useQueryClient} from "@tanstack/react-query";
import axiosInstance from '../utils/axiosInstance.utils.js'
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-hot-toast';
const useLogoutQuery = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
  return useMutation({
    mutationFn: async () => {
        await axiosInstance.post('/logout');
    },
    onSuccess: () => {
        queryClient.removeQueries(['users']);
        navigate('/login');
        toast.success("User logout Successfully");
    },
    onError: () => {
        toast.error("Something went wrong");
    }
  });
};

export default useLogoutQuery;
