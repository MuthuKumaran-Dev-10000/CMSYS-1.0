import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'boxicons/css/boxicons.min.css'; // Import Boxicons
import './AdminPage.css'; // Import custom CSS

function AdminPage() {
  const features = [
    { title: 'User Management', path: '/admin/user-management', icon: 'bx bx-user' },
    { title: 'Academic Management', path: '/admin/academic-management', icon: 'bx bx-book' },
    { title: 'Student Information System', path: '/admin/student-info', icon: 'bx bxs-graduation' },
    { title: 'Faculty Management', path: '/admin/faculty-management', icon: 'bx bx-chalkboard' },
    { title: 'Financial Management', path: '/admin/financial-management', icon: 'bx bx-credit-card' },
    { title: 'Communication and Notifications', path: '/admin/communication', icon: 'bx bxs-megaphone' },
    { title: 'Library Management', path: '/admin/library-management', icon: 'bx bx-library' },
    { title: 'Examination and Assessment', path: '/admin/exams', icon: 'bx bx-clipboard' },
    { title: 'Infrastructure Management', path: '/admin/infrastructure', icon: 'bx bx-building' },
    { title: 'Reports and Analytics', path: '/admin/reports', icon: 'bx bx-pie-chart-alt' },
    { title: 'Security and Access Control', path: '/admin/security', icon: 'bx bx-lock' },
    { title: 'Compliance and Accreditation', path: '/admin/compliance', icon: 'bx bx-shield-quarter' },
    { title: 'Event Management', path: '/admin/events', icon: 'bx bx-calendar' },
    { title: 'Alumni Management', path: '/admin/alumni', icon: 'bx bx-group' }
  ];

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Administrator Dashboard</h1>
      <p className="text-center mb-4">Welcome to the Admin Dashboard. Manage users and access all system features from here.</p>
      <div className="row">
        {features.map((feature, index) => (
          <div key={index} className="col-md-4 mb-4">
            <Link to={feature.path} className="card feature-card text-decoration-none">
              <div className="card-body d-flex align-items-center justify-content-center flex-column">
                <i className={`${feature.icon} feature-icon fs-2 mb-3`}></i>
                <h5 className="card-title mt-3">{feature.title}</h5>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPage;
