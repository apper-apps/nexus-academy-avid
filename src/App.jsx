import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import "@/index.css";
import TopNavigation from "@/components/organisms/TopNavigation";
import HomePage from "@/components/pages/HomePage";
import Login from "@/components/pages/Login";
import PromptPassword from "@/components/pages/PromptPassword";
import InsightPage from "@/components/pages/InsightPage";
import InsightDetailPage from "@/components/pages/InsightDetailPage";
import ResetPassword from "@/components/pages/ResetPassword";
import ProgramPage from "@/components/pages/ProgramPage";
import ProfilePage from "@/components/pages/ProfilePage";
import AdminPage from "@/components/pages/AdminPage";
import ReviewsPage from "@/components/pages/ReviewsPage";
import LectureDetailPage from "@/components/pages/LectureDetailPage";
import ProgramMasterDetailPage from "@/components/pages/ProgramMasterDetailPage";
import Callback from "@/components/pages/Callback";
import ErrorPage from "@/components/pages/ErrorPage";
import Signup from "@/components/pages/Signup";
import ProgramDetailPage from "@/components/pages/ProgramDetailPage";
import { clearUser, setUser } from "@/store/userSlice";

// Layout Components

// Page Components

// Create auth context
export const AuthContext = createContext(null);

// Protected Route component for admin access
const ProtectedRoute = ({ children }) => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated || !user?.is_admin) {
      toast.error('Admin only');
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);
  
  // Don't render anything if not admin - redirect will happen
  if (!isAuthenticated || !user?.is_admin) {
    return null;
  }
  
  return children;
};

function AppContent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  // Initialize ApperUI once when the app loads
  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;
    
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Initialize but don't show login yet
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function (user) {
        setIsInitialized(true);
        // CRITICAL: This exact currentPath logic must be preserved in all implementations
        // DO NOT simplify or modify this pattern as it ensures proper redirection flow
        let currentPath = window.location.pathname + window.location.search;
        let redirectPath = new URLSearchParams(window.location.search).get('redirect');
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || 
                           currentPath.includes('/callback') || currentPath.includes('/error') || 
                           currentPath.includes('/prompt-password') || currentPath.includes('/reset-password');
        
        if (user) {
          // User is authenticated
          if (redirectPath) {
            navigate(redirectPath);
          } else if (!isAuthPage) {
            if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
              navigate(currentPath);
            } else {
              navigate('/');
            }
          } else {
            navigate('/');
          }
          // Store user information in Redux
          dispatch(setUser(JSON.parse(JSON.stringify(user))));
} else {
          // User is not authenticated
          // Define public routes that don't require authentication
          const publicRoutes = ['/'];
          const isPublicRoute = publicRoutes.some(route => 
            currentPath === route || currentPath.startsWith(route + '?')
          );
          
          if (!isAuthPage && !isPublicRoute) {
            navigate(
              currentPath.includes('/signup')
                ? `/signup?redirect=${currentPath}`
                : currentPath.includes('/login')
                ? `/login?redirect=${currentPath}`
                : '/login'
            );
          } else if (redirectPath) {
            if (
              !['error', 'signup', 'login', 'callback', 'prompt-password', 'reset-password'].some((path) => currentPath.includes(path))
            ) {
              navigate(`/login?redirect=${redirectPath}`);
            } else {
              navigate(currentPath);
            }
          } else if (isAuthPage) {
            navigate(currentPath);
          } else if (!isPublicRoute) {
            navigate('/login');
          }
          dispatch(clearUser());
        }
      },
      onError: function(error) {
        console.error("Authentication failed:", error);
        setIsInitialized(true);
      }
    });
  }, [navigate, dispatch]);
  
  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };
  
  // Don't render routes until initialization is complete
  if (!isInitialized) {
    return (
      <div className="loading flex items-center justify-center p-6 h-screen w-full">
        <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v4"></path><path d="m16.2 7.8 2.9-2.9"></path><path d="M18 12h4"></path><path d="m16.2 16.2 2.9 2.9"></path><path d="M12 18v4"></path><path d="m4.9 19.1 2.9-2.9"></path><path d="M2 12h4"></path><path d="m4.9 4.9 2.9 2.9"></path>
        </svg>
      </div>
    );
  }
  
  return (
    <AuthContext.Provider value={authMethods}>
      <div className="min-h-screen bg-midnight">
<TopNavigation />
<Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/prompt-password/:appId/:emailAddress/:provider" element={<PromptPassword />} />
          <Route path="/reset-password/:appId/:fields" element={<ResetPassword />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/program" element={<ProgramPage />} />
          <Route path="/program/master" element={<ProgramPage filterType="master" />} />
          <Route path="/program/:slug" element={<ProgramDetailPage />} />
          <Route path="/program/master/:slug" element={<ProgramMasterDetailPage />} />
          <Route path="/lecture/:id" element={<LectureDetailPage />} />
          <Route path="/insight" element={<InsightPage />} />
          <Route path="/insight/:slug" element={<InsightDetailPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
          <Route path="/admin/programs" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
          <Route path="/admin/programs/new" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
          <Route path="/admin/lectures" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
          <Route path="/admin/posts" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>
    </AuthContext.Provider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;