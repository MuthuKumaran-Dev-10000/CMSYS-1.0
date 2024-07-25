import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { auth, db } from './firebaseConfig'; // Adjust the path if needed
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Sanitize email for Firebase Realtime Database path
    const sanitizedEmail = email.replace('.', ',');

    try {
      // Attempt to sign in with email and password
      await signInWithEmailAndPassword(auth, email, password);

      // Fetch user data based on sanitized email
      const userRef = ref(db, `users/${sanitizedEmail}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();
        const userRole = userData.role;

        // Store user role in sessionStorage
        sessionStorage.setItem('userRole', userRole);

        // Redirect based on user role
        switch (userRole) {
          case 'Administrator':
            navigate('/admin');
            break;
          case 'Technical':
            navigate('/technical');
            break;
          case 'Non-Technical':
            navigate('/non-technical');
            break;
          case 'Assistant':
            navigate('/assistant');
            break;
          case 'Student':
            navigate('/student');
            break;
          default:
            alert('Unknown role');
            break;
        }
      } else {
        alert('User data not found!');
      }
    } catch (error) {
      console.error('Error logging in:', error.code, error.message);
      alert('Failed to log in. Please check your credentials.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">Login</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">Login</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
