import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import AdminPage from './AdminPage';
import TechnicalPage from './TechnicalPage';
import NonTechnicalPage from './NonTechnicalPage';
import AssistantPage from './AssistantPage';
import StudentPage from './StudentPage';
import UserManagement from './UserManagement'; 
import AcademicManagement from './AcademicManagement';
import StudentInfo from './StudentInfo';
import FacultyManagement from './FacultyManagement';
import FinancialManagement from './FinancialManagement';
import Communication from './Communication';
import LibraryManagement from './LibraryManagement';
import Exams from './Exams';
import Infrastructure from './Infrastructure';
import Reports from './Reports';
import Security from './Security';
import Compliance from './Compliance';
import Events from './Events';
import Alumni from './Alumni';
import PrivateRoute from './PrivateRoute'; 
import { AuthProvider } from './AuthContext'; 

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* Protected routes */}
          <Route path="/admin" element={<PrivateRoute element={<AdminPage />} allowedRoles={['Administrator']} />} />
          <Route path="/technical" element={<PrivateRoute element={<TechnicalPage />} allowedRoles={['Technical']} />} />
          <Route path="/non-technical" element={<PrivateRoute element={<NonTechnicalPage />} allowedRoles={['Non-Technical']} />} />
          <Route path="/assistant" element={<PrivateRoute element={<AssistantPage />} allowedRoles={['Assistant']} />} />
          <Route path="/student" element={<PrivateRoute element={<StudentPage />} allowedRoles={['Student']} />} />

          {/* Admin feature pages */}
          <Route path="/admin/user-management" element={<PrivateRoute element={<UserManagement />} allowedRoles={['Administrator']} />} />
          <Route path="/admin/academic-management" element={<PrivateRoute element={<AcademicManagement />} allowedRoles={['Administrator']} />} />
          <Route path="/admin/student-info" element={<PrivateRoute element={<StudentInfo />} allowedRoles={['Administrator']} />} />
          <Route path="/admin/faculty-management" element={<PrivateRoute element={<FacultyManagement />} allowedRoles={['Administrator']} />} />
          <Route path="/admin/financial-management" element={<PrivateRoute element={<FinancialManagement />} allowedRoles={['Administrator']} />} />
          <Route path="/admin/communication" element={<PrivateRoute element={<Communication />} allowedRoles={['Administrator']} />} />
          <Route path="/admin/library-management" element={<PrivateRoute element={<LibraryManagement />} allowedRoles={['Administrator']} />} />
          <Route path="/admin/exams" element={<PrivateRoute element={<Exams />} allowedRoles={['Administrator']} />} />
          <Route path="/admin/infrastructure" element={<PrivateRoute element={<Infrastructure />} allowedRoles={['Administrator']} />} />
          <Route path="/admin/reports" element={<PrivateRoute element={<Reports />} allowedRoles={['Administrator']} />} />
          <Route path="/admin/security" element={<PrivateRoute element={<Security />} allowedRoles={['Administrator']} />} />
          <Route path="/admin/compliance" element={<PrivateRoute element={<Compliance />} allowedRoles={['Administrator']} />} />
          <Route path="/admin/events" element={<PrivateRoute element={<Events />} allowedRoles={['Administrator']} />} />
          <Route path="/admin/alumni" element={<PrivateRoute element={<Alumni />} allowedRoles={['Administrator']} />} />
          
          {/* Catch-all route for undefined paths */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
