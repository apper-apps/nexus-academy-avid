import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

// Layout Components
import TopNavigation from '@/components/organisms/TopNavigation';

// Page Components
import HomePage from '@/components/pages/HomePage';
import ProgramPage from '@/components/pages/ProgramPage';
import ProgramDetailPage from '@/components/pages/ProgramDetailPage';
import LectureDetailPage from '@/components/pages/LectureDetailPage';
import InsightPage from '@/components/pages/InsightPage';
import ReviewsPage from '@/components/pages/ReviewsPage';
import ProfilePage from '@/components/pages/ProfilePage';
import AdminPage from '@/components/pages/AdminPage';

// Mock user data - in a real app, this would come from authentication context
const mockUsers = [
  {
    Id: 1,
    name: "Academy Admin",
    email: "admin@nexusacademy.com",
    role: "both",
    master_cohort: "2024-Q1",
    is_admin: true
  },
  {
    Id: 2,
    name: "Active Member",
    email: "member@example.com",
    role: "member",
    master_cohort: null,
    is_admin: false
  }
];

function App() {
  const [currentUser, setCurrentUser] = useState(mockUsers[0]); // Mock logged-in admin user

  const handleLogin = () => {
    // Mock login - in real app, this would trigger auth flow
    console.log("Login triggered");
  };

  const handleSignup = () => {
    // Mock signup - in real app, this would trigger auth flow
    console.log("Signup triggered");
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-midnight">
        <TopNavigation
          currentUser={currentUser}
          onLogin={handleLogin}
          onSignup={handleSignup}
          onLogout={handleLogout}
        />
        
        <Routes>
<Route path="/" element={<HomePage />} />
          <Route path="/program" element={<ProgramPage />} />
          <Route path="/program/:slug" element={<ProgramDetailPage currentUser={currentUser} />} />
          <Route path="/lecture/:id" element={<LectureDetailPage />} />
          <Route path="/insight" element={<InsightPage />} />
          <Route path="/insight/:slug" element={<InsightPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/users" element={<AdminPage />} />
<Route path="/admin/programs" element={<AdminPage />} />
          <Route path="/admin/programs/new" element={<AdminPage />} />
          <Route path="/admin/lectures" element={<AdminPage />} />
          <Route path="/admin/posts" element={<AdminPage />} />
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
    </BrowserRouter>
  );
}

export default App;