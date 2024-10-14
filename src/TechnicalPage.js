import React, { useState, useEffect, useContext } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from './firebaseConfig'; // Adjust the path if needed
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthContext } from './AuthContext'; // Import the context providing the user role

const sections = [
  'Message',
  'Classes',
  'Assignments',
  'Holidays',
  'Salary/Claim',
  'Test/Exams',
  'Attendance',
  'Appointments'
];

function TechnicalPage() {
  const [activeSection, setActiveSection] = useState('Message');
  const [messages, setMessages] = useState([]);
  const { userRole } = useContext(AuthContext); // Get the user role from context
  const role = userRole ? userRole.toLowerCase() : 'technical'; // Default to 'technical' if userRole is not defined

  useEffect(() => {
    if (activeSection === 'Message') {
      fetchMessages();
    }
  }, [activeSection]);

  const fetchMessages = async () => {
    const messagesRef = ref(db, 'communication');
    onValue(messagesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const messagesArray = Object.values(data).filter(msg => {
          return msg.privileges && msg.privileges[role];
        });
        setMessages(messagesArray);
      } else {
        setMessages([]);
      }
    });
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'Message':
        return (
          <div>
            <h2>Messages</h2>
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <div key={index} className="card p-3 mb-3">
                  <p><strong>Message:</strong> {msg.message}</p>
                  <p><strong>Published By:</strong> {msg.publishedBy}</p>
                  <p><strong>Published Time:</strong> {new Date(msg.publishedTime).toLocaleString()}</p>
                </div>
              ))
            ) : (
              <p>No messages found.</p>
            )}
          </div>
        );
      case 'Classes':
        return <div><h2>Classes</h2><p>Class information will be displayed here.</p></div>;
      case 'Assignments':
        return <div><h2>Assignments</h2><p>Assignment details will be displayed here.</p></div>;
      case 'Holidays':
        return <div><h2>Holidays</h2><p>Holiday schedule will be displayed here.</p></div>;
      case 'Test/Exams':
        return <div><h2>Test/Exams</h2><p>Test and exam schedules will be displayed here.</p></div>;
        
      case 'Salary/Claim':
        return <div><h2>Salary/Claim</h2><p>Salary/Claims will be displayed here.</p></div>;
          
        case 'Attendance':
        return <div><h2>Attendance</h2><p>Attendance records will be displayed here.</p></div>;
      case 'Appointments':
        return <div><h2>Appointments</h2><p>Appointment details will be displayed here.</p></div>;
      default:
        return null;
    }
  };

  return (
    <div className="container mt-5">
      <h1>Technical Page</h1>
      <nav className="nav nav-tabs">
        {sections.map(section => (
          <button
            key={section}
            className={`nav-link ${activeSection === section ? 'active' : ''}`}
            onClick={() => setActiveSection(section)}
          >
            {section}
          </button>
        ))}
      </nav>
      <div className="mt-4">
        {renderContent()}
      </div>
    </div>
  );
}

export default TechnicalPage;
