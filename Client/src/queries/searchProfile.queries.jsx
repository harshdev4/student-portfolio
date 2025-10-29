import { useQuery } from '@tanstack/react-query';
import React from 'react'
import axiosInstance from '../utils/axiosInstance.utils';

const useSearchProfileQuery = (name) => {
  return useQuery({
    queryKey: ['searchedUsers'],
    queryFn: () => searchUser(name),
    staleTime: 'static',
  })
}

export default useSearchProfileQuery;
