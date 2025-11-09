import { Navigate } from 'react-router-dom';
import useAuthQuery from '../queries/checkAuth.queries';

const RedirectToProfile = () => {
  const { user } = useAuthQuery();

  if (!user) return <Navigate to="/login" replace />;
  
  return <Navigate to={`/profile/${user.userId}`} replace />;
};

export default RedirectToProfile;
