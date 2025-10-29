import React from 'react'
import axiosInstance from '../utils/axiosInstance.utils'
import { useMutation } from '@tanstack/react-query';

const createProfile = async (formData) => {
    const response = await axiosInstance.post('/create-profile', formData);
    return response.data;
};

const useProfileMutation = () => {
  return useMutation({
    mutationFn: createProfile,
  })
}

export default useProfileMutation;
