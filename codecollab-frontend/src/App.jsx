import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import FileManagerPage from './pages/FileManagerPage';
import ActivityPage from './pages/ActivityPage';
import EditorPage from './pages/EditorPage';
import Home from './pages/Home';
import PrivateRoute from './components/PrivateRoute';
import FeaturesPage from './pages/FeaturesPage';
import WorkflowPage from './pages/WorkflowPage';
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/projects"
              element={
                <PrivateRoute>
                  <ProjectsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/projects/:projectId"
              element={
                <PrivateRoute>
                  <ProjectDetailPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/projects/:projectId/files"
              element={
                <PrivateRoute>
                  <FileManagerPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/projects/:projectId/activity"
              element={
                <PrivateRoute>
                  <ActivityPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/projects/:projectId/editor/:fileId"
              element={
                <PrivateRoute>
                  <EditorPage />
                </PrivateRoute>
              }
            />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/workflow" element={<WorkflowPage />} />
            {/* <Route path="/" element={<RedirectHome />} /> */}
            <Route path="/" element={<Home />} />

          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

function RedirectHome() {
  const { user } = useAuth();
  return user ? <Navigate to="/profile" /> : <Navigate to="/login" />;
}

export default App;
