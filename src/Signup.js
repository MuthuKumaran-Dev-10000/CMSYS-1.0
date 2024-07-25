import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set, get, child } from 'firebase/database';
import { auth, db } from './firebaseConfig'; // Adjust the path if needed
import 'bootstrap/dist/css/bootstrap.min.css';

// Function to sanitize email for Firebase path
const sanitizePath = (email) => {
  return email.replace('.', ',');
};

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('');
  const [dept, setDept] = useState('');
  const [address, setAddress] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [religion, setReligion] = useState('');
  const [caste, setCaste] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      // Sanitize email for Firebase Realtime Database path
      const sanitizedEmail = sanitizePath(email);

      // Check if email already exists
      const dbRef = ref(db);
      const snapshot = await get(child(dbRef, `users/${sanitizedEmail}`));
      
      if (snapshot.exists()) {
        alert('Email already in use!');
        return;
      }

      // Create new user
      await createUserWithEmailAndPassword(auth, email, password);

      // Generate username as email_phone
      const username = `${sanitizedEmail}_${phoneNumber}`;

      // Save user data
      await set(ref(db, 'users/' + sanitizedEmail), {
        username,
        name,
        dob,
        phoneNumber,
        role,
        dept,
        address,
        bloodGroup,
        religion,
        caste,
        email
      });

      alert('Signup successful!');
    } catch (error) {
      console.error('Error signing up:', error.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">Signup</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSignup}>
                {/* Form fields */}
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Date of Birth</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    value={dob} 
                    onChange={(e) => setDob(e.target.value)} 
                    required 
                  />
                </div>
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
                  <label className="form-label">Phone Number</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={phoneNumber} 
                    onChange={(e) => setPhoneNumber(e.target.value)} 
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Role</label>
                  <select 
                    className="form-select" 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)} 
                    required
                  >
                    <option value="">Select a role</option>
                    <option value="Administrator">Administrator</option>
                    <option value="Technical">Technical</option>
                    <option value="Non-Technical">Non-Technical</option>
                    <option value="Assistant">Assistant</option>
                    <option value="Student">Student</option>
                    {/* Add more roles as needed */}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Department</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={dept} 
                    onChange={(e) => setDept(e.target.value)} 
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Blood Group</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={bloodGroup} 
                    onChange={(e) => setBloodGroup(e.target.value)} 
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Religion</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={religion} 
                    onChange={(e) => setReligion(e.target.value)} 
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Caste</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={caste} 
                    onChange={(e) => setCaste(e.target.value)} 
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
                <div className="mb-3">
                  <label className="form-label">Confirm Password</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required 
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">Signup</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
