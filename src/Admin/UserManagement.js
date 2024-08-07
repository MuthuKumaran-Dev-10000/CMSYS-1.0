import React, { useState, useEffect } from 'react';
import { ref, set, update, get, remove } from 'firebase/database';
import { auth, db } from '../firebaseConfig'; // Adjust the path if needed
import 'bootstrap/dist/css/bootstrap.min.css';

function UserManagement() {
  const [activeSection, setActiveSection] = useState(null);
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [userData, setUserData] = useState({});
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    dob: '',
    phoneNumber: '',
    role: '',
    dept: '',
    address: '',
    bloodGroup: '',
    religion: '',
    caste: '',
    email: '',
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (activeSection === 'update') {
      fetchRoles();
    }
  }, [activeSection]);

  const handleCreate = () => {
    const sanitizedEmail = formData.email.replace('.', ',');
    const userRef = ref(db, `users/${sanitizedEmail}`);

    set(userRef, formData)
      .then(() => alert('User created successfully!'))
      .catch(error => console.error('Error creating user:', error));
  };

  const fetchRoles = async () => {
    try {
      const rolesRef = ref(db);
      const snapshot = await get(rolesRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        const roles = Object.keys(data);
        setRoles(roles);
      } else {
        console.log('No roles found.');
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const handleRoleClick = async (role) => {
    const roleRef = ref(db, role);
    const snapshot = await get(roleRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      const userArray = Object.entries(data).map(([key, value]) => ({
        key,
        ...value
      }));
      setUsers(userArray);
    }
  };

  const handleEdit = (user) => {
    setUserData(user);
    setActiveSection('edit');
  };

  const handleEditSubmit = (userId) => {
    const userRef = ref(db, `users/${userId}`);
    update(userRef, userData)
      .then(() => alert('User updated successfully!'))
      .catch(error => console.error('Error updating user:', error));
  };

  const handleDelete = (userId) => {
    const userRef = ref(db, `users/${userId}`);
    remove(userRef)
      .then(() => alert('User deleted successfully!'))
      .catch(error => console.error('Error deleting user:', error));
  };

  const handleSearch = async () => {
    const sanitizedQuery = searchQuery.replace('.', ',');
    const userRef = ref(db, 'users');
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      const allUsers = [];
      for (const role of Object.keys(data)) {
        const roleData = data[role];
        const users = Object.entries(roleData).map(([key, value]) => ({
          key,
          ...value
        }));
        allUsers.push(...users);
      }
      const results = allUsers.filter(user => 
        Object.values(user).some(value => 
          value.toLowerCase().includes(sanitizedQuery.toLowerCase())
        )
      );
      setUsers(results);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">User Management</h1>
      <div className="btn-group mb-4" role="group">
        <button className="btn btn-primary" onClick={() => setActiveSection('create')}>Create New</button>
        <button className="btn btn-secondary" onClick={() => setActiveSection('update')}>Update</button>
        <button className="btn btn-info" onClick={() => setActiveSection('verify')}>Verify/Check Data</button>
      </div>

      {activeSection === 'create' && (
        <div className="card p-3 mb-4">
          <h4>Create New User</h4>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleCreate();
          }}>
            {Object.keys(formData).map((key) => (
              <div className="mb-3" key={key}>
                <label className="form-label">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                <input 
                  type={key === 'email' ? 'email' : 'text'} 
                  className="form-control" 
                  value={formData[key]} 
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })} 
                  required 
                />
              </div>
            ))}
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>
      )}

      {activeSection === 'update' && (
        <div className="card p-3 mb-4">
          <h4>Update User</h4>
          <div className="mb-3">
            <label className="form-label">Search</label>
            <input 
              type="text" 
              className="form-control" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()} 
            />
            <button className="btn btn-primary mt-2" onClick={handleSearch}>Search</button>
          </div>
          <div className="d-flex flex-wrap">
            {roles.map(role => (
              <div 
                key={role} 
                className="p-2 m-2 border rounded cursor-pointer" 
                onClick={() => handleRoleClick(role)}
              >
                {role}
              </div>
            ))}
          </div>
          {users.length > 0 ? (
            users.map(user => (
              <div key={user.key} className="mb-3 p-3 border rounded">
                <h5>User ID: {user.key}</h5>
                <p>Email: {user.email}</p>
                <p>Role: {user.role}</p>
                <p>Department: {user.dept}</p>
                <p>Phone Number: {user.phoneNumber}</p>
                <button className="btn btn-warning me-2" onClick={() => handleEdit(user)}>Edit</button>
                <button className="btn btn-danger" onClick={() => handleDelete(user.key)}>Delete</button>
              </div>
            ))
          ) : (
            <p>No users found.</p>
          )}
        </div>
      )}

      {activeSection === 'edit' && userData && (
        <div className="card p-3 mb-4">
          <h4>Edit User</h4>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleEditSubmit(userData.key);
          }}>
            {Object.keys(userData).map((key) => (
              <div className="mb-3" key={key}>
                <label className="form-label">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                <input 
                  type={key === 'email' ? 'email' : 'text'} 
                  className="form-control" 
                  value={userData[key]} 
                  onChange={(e) => setUserData({ ...userData, [key]: e.target.value })} 
                  required 
                />
              </div>
            ))}
            <button type="submit" className="btn btn-primary">Update</button>
          </form>
        </div>
      )}

      {activeSection === 'verify' && (
        <div className="card p-3 mb-4">
          <h4>Verify/Check Data</h4>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}>
            <div className="mb-3">
              <label className="form-label">Search Query</label>
              <input 
                type="text" 
                className="form-control" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
          {/* Display search results here */}
        </div>
      )}
    </div>
  );
}

export default UserManagement;
