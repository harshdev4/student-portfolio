import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance.utils";

const fetchProfile = async (id) => {
  const res = await axiosInstance.get(`/profile/${id}`);
  return res.data.profile;
};



const useFetchProfileQuery = (id) => {
  return useQuery({
    queryKey: ["profile", `${id}`],
    queryFn: () => fetchProfile(id),
    enabled: !!id,
    retry: false,
    staleTime: 5*60*1000
  });
};

export default useFetchProfileQuery;
