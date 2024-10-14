import React, { useState, useEffect, useContext } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from './firebaseConfig'; // Adjust the path if needed
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthContext } from './AuthContext'; // Import the context providing the user role

const sections = [
  'Message',
  'Time Table',
  'Attendance',
  'Holidays',
  'Billing',
  'Exams',
  'Events',
  'Results',
  'Assignments',
  'Achievements'
];

function StudentPage() {
  const [activeSection, setActiveSection] = useState('Message');
  const [messages, setMessages] = useState([]);
  const { userRole } = useContext(AuthContext); // Get the user role from context

  // Default role handling
  const currentRole = userRole ? userRole.toLowerCase() : 'student';

  useEffect(() => {
    console.log('Current user role:', currentRole);

    const messagesRef = ref(db, 'communication');
    
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log('Fetched data:', data); // Log fetched data
        const messagesArray = Object.values(data).filter(msg => {
          console.log('Checking privileges for message:', msg); // Log message being checked
          return msg.privileges && msg.privileges[currentRole];
        });
        console.log('Filtered messages:', messagesArray); // Log filtered messages
        setMessages(messagesArray);
      } else {
        setMessages([]);
      }
    });

    return () => unsubscribe();
  }, [currentRole]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log('Current user role (interval):', currentRole);
      
      const messagesRef = ref(db, 'communication');
      onValue(messagesRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          console.log('Fetched data on interval:', data); // Log fetched data on interval
          const messagesArray = Object.values(data).filter(msg => {
            console.log('Checking privileges for message on interval:', msg); // Log message being checked on interval
            return msg.privileges && msg.privileges[currentRole];
          });
          console.log('Filtered messages on interval:', messagesArray); // Log filtered messages on interval
          setMessages(messagesArray);
        } else {
          setMessages([]);
        }
      });
    }, 1000); // Check every second

    return () => clearInterval(intervalId);
  }, [currentRole]);

  const renderContent = () => {
    switch (activeSection) {
      case 'Message':
        return (
          <div>
            <h2>Messages</h2>
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <div key={index} className="card p-3 mb-3">
                  <p><strong>{msg.message}</strong></p>
                  <p>By - {msg.publishedBy} {new Date(msg.publishedTime).toLocaleString()}</p>
                </div>
              ))
            ) : (
              <p>No messages found.</p>
            )}
          </div>
        );
      case 'Time Table':
        return <div><h2>Time Table</h2><p>Time table details will be displayed here.</p></div>;
      case 'Attendance':
        return <div><h2>Attendance</h2><p>Attendance records will be displayed here.</p></div>;
      case 'Holidays':
        return <div><h2>Holidays</h2><p>Holiday schedule will be displayed here.</p></div>;
      case 'Exams':
        return <div><h2>Exams</h2><p>Upcoming exams will be displayed here.</p></div>;
      case 'Events':
        return <div><h2>Events</h2><p>Upcoming events will be displayed here.</p></div>;
        
      case 'Billing':
        return <div><h2>Billing</h2><p>Billing will be displayed here.</p></div>;
        
      case 'Results':
        return <div><h2>Results</h2><p>Exam results will be displayed here.</p></div>;
      case 'Assignments':
        return <div><h2>Assignments</h2><p>Assignment details will be displayed here.</p></div>;
      case 'Achievements':
        return <div><h2>Achievements</h2><p>Student achievements will be displayed here.</p></div>;
      default:
        return null;
    }
  };

  return (
    <div className="container mt-5">
      <h1>Student Dashboard</h1>
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

export default StudentPage;
