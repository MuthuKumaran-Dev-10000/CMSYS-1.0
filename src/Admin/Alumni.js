import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set, get, child } from 'firebase/database';
import { auth, db } from '../firebaseConfig'; // Adjust the path if needed
import 'bootstrap/dist/css/bootstrap.min.css';
import * as XLSX from 'xlsx'; // Import the xlsx library

const Alumni = () => {
  const [file, setFile] = useState(null);

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    try {
      // Read the file
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      // Process and save data
      for (const record of jsonData) {
        const {
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
        } = record;

        // Sanitize email
        const sanitizedEmail = email.replace('.', ',');

        // Check if email already exists
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, `users/${sanitizedEmail}`));
        
        if (snapshot.exists()) {
          console.log(`Email already in use: ${email}`);
          continue;
        }

        // Create new user
        await createUserWithEmailAndPassword(auth, email, 'qwerty'); // Set a default password or prompt for one

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
      }

      alert('Data uploaded successfully!');
    } catch (error) {
      console.error('Error uploading data:', error.message);
    }
  };

  return (
    <div>
      <h1>Alumni Management</h1>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white">
                <h4 className="mb-0">Upload Alumni Data</h4>
              </div>
              <div className="card-body">
                <input
                  type="file"
                  accept=".xls, .xlsx"
                  onChange={handleFileChange}
                />
                <button
                  className="btn btn-primary mt-3"
                  onClick={handleFileUpload}
                >
                  Upload Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alumni;
