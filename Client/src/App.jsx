import { Outlet, useLocation } from 'react-router-dom'
import Header from './components/Header/Header'
import { ThemeProvider } from './context/ThemeContext'
import {Toaster} from 'react-hot-toast'; 
import useAuthQuery from './queries/checkAuth.queries.jsx';
function App() {
  const location = useLocation();
  const {user, isLoading, isError, error} = useAuthQuery();
  
  return (
    <>
      <ThemeProvider>
        {location.pathname !== "/login" && <Header></Header>}
        <Outlet />
      </ThemeProvider>
      <Toaster></Toaster>
    </>
  )
}

export default App
