import React, { useState } from 'react';
import { ref, set } from 'firebase/database';
import { db } from '../firebaseConfig'; // Adjust path if needed
import * as XLSX from 'xlsx';
import 'bootstrap/dist/css/bootstrap.min.css';

function StudentInfo() {
  const [file, setFile] = useState(null);
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [years, setYears] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        // Set unique departments and years
        const uniqueDepts = [...new Set(jsonData.map((student) => student.Dept))];
        setDepartments(uniqueDepts);
        setStudents(jsonData); // Set the student data in state
        saveToFirebase(jsonData); // Save to Firebase
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const saveToFirebase = async (data) => {
    for (const student of data) {
      const { Dept, Year, RegNo, Name, Semester, Subject1, Subject2, Subject3, Subject4, Subject5, Subject6, Subject7, Subject8, Subject9, Subject10 } = student;
      const studentRef = ref(db, `students/${Dept}/${Year}/studentList/${RegNo}`);
      
      const studentData = {
        regNo: RegNo,
        name: Name,
        semester: Semester,
        subjects: {
          Subject1, Subject2, Subject3, Subject4, Subject5, Subject6, Subject7, Subject8, Subject9, Subject10
        }
      };

      await set(studentRef, studentData).catch((error) => {
        console.error("Error saving student data: ", error);
      });
    }
    alert("Student data saved successfully!");
  };

  const handleDeptSelect = (e) => {
    const dept = e.target.value;
    setSelectedDept(dept);

    // Filter the years for the selected department
    const filteredYears = [...new Set(students.filter((student) => student.Dept === dept).map((student) => student.Year))];
    setYears(filteredYears);
    setSelectedYear(''); // Reset the year when department changes
  };

  const handleYearSelect = (e) => {
    setSelectedYear(e.target.value);
  };

  const filteredStudents = students.filter((student) => student.Dept === selectedDept && student.Year.toString() === selectedYear);

  return (
    <div className="container mt-4">
      <h1>Student Data Import</h1>
      <div className="mb-3">
        <label className="form-label">Upload Excel File</label>
        <input type="file" className="form-control" onChange={handleFileChange} />
      </div>
      <button className="btn btn-primary" onClick={handleFileUpload}>Upload and Save</button>
      
      {/* Department Dropdown */}
      {departments.length > 0 && (
        <div className="mt-4">
          <label className="form-label">Select Department</label>
          <select className="form-select" onChange={handleDeptSelect} value={selectedDept}>
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      )}

      {/* Year Dropdown */}
      {selectedDept && years.length > 0 && (
        <div className="mt-4">
          <label className="form-label">Select Year</label>
          <select className="form-select" onChange={handleYearSelect} value={selectedYear}>
            <option value="">Select Year</option>
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      )}

      {/* Student Table */}
      {selectedDept && selectedYear && filteredStudents.length > 0 && (
        <div className="mt-4">
          <h2>Students List for {selectedDept} - Year {selectedYear}</h2>
          <table className="table">
            <thead>
              <tr>
                <th>RegNo</th>
                <th>Name</th>
                <th>Semester</th>
                <th>Subjects</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => (
                <tr key={index}>
                  <td>{student.RegNo}</td>
                  <td>{student.Name}</td>
                  <td>{student.Semester}</td>
                  <td>
                    {Array.from({ length: 10 }, (_, i) => student[`Subject${i + 1}`]).join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default StudentInfo;
