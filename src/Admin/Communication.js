import React, { useState, useEffect } from 'react';
import { ref, set, push, get, remove, update } from 'firebase/database';
import { db } from '../firebaseConfig'; // Adjust the path if needed
import 'bootstrap/dist/css/bootstrap.min.css';

function Communication() {
  const [message, setMessage] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [publishedBy, setPublishedBy] = useState('');
  const [privileges, setPrivileges] = useState({
    student: false,
    technical: false,
    nonTechnical: false
  });
  const [messages, setMessages] = useState([]);
  const [editedPrivileges, setEditedPrivileges] = useState({}); // For tracking edited privileges

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSubmit = () => {
    const messageRef = push(ref(db, 'communication'));
    const messageData = {
      message,
      fromDate,
      toDate,
      publishedBy,
      publishedTime: new Date().toISOString(),
      privileges
    };

    set(messageRef, messageData)
      .then(() => {
        alert('Message stored successfully!');
        fetchMessages();
      })
      .catch(error => console.error('Error storing message:', error));
  };

  const fetchMessages = async () => {
    const messagesRef = ref(db, 'communication');
    const snapshot = await get(messagesRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      const messagesArray = Object.entries(data).map(([key, value]) => ({
        key,
        ...value
      }));
      setMessages(messagesArray);
      // Initialize editedPrivileges
      const initialPrivileges = messagesArray.reduce((acc, msg) => ({
        ...acc,
        [msg.key]: msg.privileges
      }), {});
      setEditedPrivileges(initialPrivileges);
    }
  };

  const handleDelete = (messageId) => {
    const messageRef = ref(db, `communication/${messageId}`);
    remove(messageRef)
      .then(() => {
        alert('Message deleted successfully!');
        fetchMessages();
      })
      .catch(error => console.error('Error deleting message:', error));
  };

  const handlePrivilegeChange = (e, messageId) => {
    const updatedPrivileges = {
      ...editedPrivileges[messageId],
      [e.target.name]: e.target.checked
    };
    setEditedPrivileges(prev => ({
      ...prev,
      [messageId]: updatedPrivileges
    }));
  };

  const handleSaveChanges = (messageId) => {
    const messageRef = ref(db, `communication/${messageId}`);
    update(messageRef, { privileges: editedPrivileges[messageId] })
      .then(() => {
        alert('Privileges updated successfully!');
        fetchMessages();
      })
      .catch(error => console.error('Error updating privileges:', error));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const currentDate = new Date();
      messages.forEach(message => {
        if (new Date(message.toDate) < currentDate) {
          handleDelete(message.key);
        }
      });
    }, 24 * 60 * 60 * 1000); // Check once a day

    return () => clearInterval(interval);
  }, [messages]);

  return (
    <div className="container mt-4">
      <h1>Communication and Notifications</h1>
      <div className="card p-3 mb-4">
        <form onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}>
          <div className="mb-3">
            <label className="form-label">Message</label>
            <textarea 
              className="form-control" 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              required 
            />
          </div>
          <div className="mb-3">
            <label className="form-label">From Date</label>
            <input 
              type="date" 
              className="form-control" 
              value={fromDate} 
              onChange={(e) => setFromDate(e.target.value)} 
              required 
            />
          </div>
          <div className="mb-3">
            <label className="form-label">To Date</label>
            <input 
              type="date" 
              className="form-control" 
              value={toDate} 
              onChange={(e) => setToDate(e.target.value)} 
              required 
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Published By</label>
            <input 
              type="text" 
              className="form-control" 
              value={publishedBy} 
              onChange={(e) => setPublishedBy(e.target.value)} 
              required 
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Privileges</label>
            <div className="form-check">
              <input 
                className="form-check-input" 
                type="checkbox" 
                name="student" 
                checked={privileges.student} 
                onChange={(e) => setPrivileges({ ...privileges, student: e.target.checked })} 
              />
              <label className="form-check-label">Student</label>
            </div>
            <div className="form-check">
              <input 
                className="form-check-input" 
                type="checkbox" 
                name="technical" 
                checked={privileges.technical} 
                onChange={(e) => setPrivileges({ ...privileges, technical: e.target.checked })} 
              />
              <label className="form-check-label">Technical</label>
            </div>
            <div className="form-check">
              <input 
                className="form-check-input" 
                type="checkbox" 
                name="nonTechnical" 
                checked={privileges.nonTechnical} 
                onChange={(e) => setPrivileges({ ...privileges, nonTechnical: e.target.checked })} 
              />
              <label className="form-check-label">Non-Technical</label>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>

      <div>
        <h2>Messages</h2>
        {messages.length > 0 ? (
          messages.map(msg => (
            <div key={msg.key} className="card p-3 mb-3">
              <p><strong>Message:</strong> {msg.message}</p>
              <p><strong>Published By:</strong> {msg.publishedBy}</p>
              <p><strong>Published Time:</strong> {new Date(msg.publishedTime).toLocaleString()}</p>
              <p><strong>From Date:</strong> {msg.fromDate}</p>
              <p><strong>To Date:</strong> {msg.toDate}</p>
              <div>
                <label className="form-label">Privileges</label>
                <div className="form-check">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    name="student" 
                    checked={editedPrivileges[msg.key]?.student || false} 
                    onChange={(e) => handlePrivilegeChange(e, msg.key)} 
                  />
                  <label className="form-check-label">Student</label>
                </div>
                <div className="form-check">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    name="technical" 
                    checked={editedPrivileges[msg.key]?.technical || false} 
                    onChange={(e) => handlePrivilegeChange(e, msg.key)} 
                  />
                  <label className="form-check-label">Technical</label>
                </div>
                <div className="form-check">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    name="nonTechnical" 
                    checked={editedPrivileges[msg.key]?.nonTechnical || false} 
                    onChange={(e) => handlePrivilegeChange(e, msg.key)} 
                  />
                  <label className="form-check-label">Non-Technical</label>
                </div>
                <button 
                  className="btn btn-success mt-2" 
                  onClick={() => handleSaveChanges(msg.key)}
                >
                  Save Changes
                </button>
              </div>
              <button className="btn btn-danger mt-2" onClick={() => handleDelete(msg.key)}>Delete</button>
            </div>
          ))
        ) : (
          <p>No messages found.</p>
        )}
      </div>
    </div>
  );
}

export default Communication;
