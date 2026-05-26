import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Navbar from '@/components/layout/Navbar.jsx';
import Footer from '@/components/layout/Footer.jsx';
import PrivateRoute from '@/routes/PrivateRoute.jsx';
import AdminRoute from '@/routes/AdminRoute.jsx';

import Home from '@/pages/Home.jsx';
import RootExplorer from '@/pages/RootExplorer.jsx';
import Search from '@/pages/Search.jsx';
import RootDetail from '@/pages/RootDetail.jsx';
import WordDetail from '@/pages/WordDetail.jsx';
import Login from '@/pages/Login.jsx';
import Register from '@/pages/Register.jsx';
import Profile from '@/pages/Profile.jsx';
import Favorites from '@/pages/Favorites.jsx';
import Revisions from '@/pages/Revisions.jsx';
import RevisionSession from '@/pages/RevisionSession.jsx';
import About from '@/pages/About.jsx';
import AdminUsers from '@/pages/AdminUsers.jsx';
import AdminUserDetail from '@/pages/AdminUserDetail.jsx';
import NotFound from '@/pages/NotFound.jsx';

const App = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50 text-ink dark:bg-neutral-950 dark:text-neutral-0">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/explorer" element={<RootExplorer />} />
            <Route path="/search" element={<Search />} />
            <Route path="/roots/:slug" element={<RootDetail />} />
            <Route path="/words/:id" element={<WordDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/favorites"
              element={
                <PrivateRoute>
                  <Favorites />
                </PrivateRoute>
              }
            />
            <Route
              path="/revisions"
              element={
                <PrivateRoute>
                  <Revisions />
                </PrivateRoute>
              }
            />
            <Route
              path="/revisions/session"
              element={
                <PrivateRoute>
                  <RevisionSession />
                </PrivateRoute>
              }
            />
            <Route path="/about" element={<About />} />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <AdminUsers />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users/:id"
              element={
                <AdminRoute>
                  <AdminUserDetail />
                </AdminRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};

export default App;
