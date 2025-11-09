import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import ProfilePage from './pages/ProfilePage/ProfilePage.jsx';
import CreateProfile from './pages/CreatePage/CreateProfile.jsx';
import SearchPage from './pages/SearchPage/SearchPage.jsx';
import LoginPage from './pages/LoginPage/LoginPage.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import RedirectToProfile from './components/Redirect.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <RedirectToProfile/>
      },
      {
        path: 'profile/:id',
        element: <ProfilePage />
      },
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'create-profile',
        element: <CreateProfile />
      },
      {
        path: 'search',
        element: <SearchPage />
      }
    ]
  }
]);

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)
