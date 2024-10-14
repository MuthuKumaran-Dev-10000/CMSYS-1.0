import React, { useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import 'bootstrap/dist/css/bootstrap.min.css';

// Constants
const COLLEGE_CODE = '9177';
const TOTAL_STUDENTS = 1565; // Updated to 1565 students
const STUDENTS_PER_HALL = 25; // 5 rows x 5 columns
const HALLS_PER_BLOCK = 5; // Number of halls in each block

const DEFAULT_DEPARTMENTS = [
  { key: 'CSE', name: 'Computer Science and Engineering' },
  { key: 'CE', name: 'Civil Engineering' },
  { key: 'EE', name: 'Electrical and Electronics Engineering' },
  { key: 'E', name: 'Electronics and Communication Engineering' },
  { key: 'M', name: 'Mechanical Engineering' },
];

// Dynamic subjects based on department and year
const SUBJECTS_BY_DEPT_YEAR = {
  CSE: {
    1: ['Maths I', 'Physics', 'Data Structures', 'C Programming', 'Discrete Maths', 'Digital Logic', 'English', 'Software Engineering'],
    2: ['Maths II', 'Algorithms', 'Operating Systems', 'DBMS', 'OOP', 'Computer Networks', 'Software Testing', 'AI'],
    3: ['Compilers', 'Machine Learning', 'Cloud Computing', 'Data Mining', 'Security', 'Web Development', 'IoT', 'DSA'],
    4: ['Big Data', 'Distributed Systems', 'Blockchain', 'Cyber Security', 'Mobile Computing', 'AR/VR', 'Quantum Computing', 'Bioinformatics'],
  },
  CE: {
    1: ['Engineering Maths', 'Engineering Physics', 'Civil Drawing', 'Environmental Science', 'Construction Materials', 'Geology', 'English', 'Fluid Mechanics'],
    2: ['Surveying', 'Structural Analysis', 'Geotechnical Engineering', 'Transportation', 'Water Resources', 'Foundation Design', 'Soil Mechanics', 'Concrete Technology'],
    3: ['Structural Design', 'Earthquake Engineering', 'Hydrology', 'Construction Project Management', 'Steel Structures', 'Pavement Design', 'Bridge Engineering', 'Coastal Engineering'],
    4: ['Advanced Surveying', 'Environmental Engineering', 'Urban Planning', 'Infrastructure Development', 'Geospatial Technologies', 'Sustainable Construction', 'Water Treatment', 'Traffic Engineering'],
  },
  EE: {
    1: ['Basic Electrical Engineering', 'Engineering Maths', 'Physics', 'Electrical Circuits', 'Engineering Chemistry', 'English', 'Environmental Science', 'Introduction to IT'],
    2: ['Electric Machines', 'Power Electronics', 'Control Systems', 'Analog Electronics', 'Digital Signal Processing', 'Electrical Measurements', 'Energy Systems', 'Microprocessors'],
    3: ['Power Systems', 'High Voltage Engineering', 'Embedded Systems', 'Electrical Machines II', 'Renewable Energy Systems', 'Electric Drives', 'Digital Electronics', 'Power Distribution'],
    4: ['Smart Grids', 'Power Quality', 'Energy Management', 'Advanced Control Systems', 'Electric Vehicle Technologies', 'Industrial Automation', 'IoT in Energy Systems', 'Electrical Power Utilization'],
  },
  ECE: {
    1: ['Electronics Fundamentals', 'Mathematics', 'Physics', 'Signals and Systems', 'Digital Circuits', 'Engineering Chemistry', 'English', 'Environmental Science'],
    2: ['Analog Electronics', 'Communication Theory', 'Microprocessors', 'Digital Communication', 'Electromagnetic Waves', 'Digital Signal Processing', 'Control Systems', 'VLSI Design'],
    3: ['Antenna and Wave Propagation', 'Wireless Communication', 'Digital Image Processing', 'Embedded Systems', 'Optical Communication', 'Advanced VLSI', 'Radar Engineering', 'Satellite Communication'],
    4: ['IoT and Embedded Systems', '5G Networks', 'Biomedical Instrumentation', 'RF Circuit Design', 'Robotics', 'Nanoelectronics', 'Wearable Technology', 'Advanced Communication Systems'],
  },
  ME: {
    1: ['Engineering Mechanics', 'Thermodynamics', 'Material Science', 'Engineering Drawing', 'Physics', 'Mathematics', 'English', 'Environmental Science'],
    2: ['Fluid Mechanics', 'Thermal Engineering', 'Strength of Materials', 'Manufacturing Processes', 'Kinematics of Machinery', 'Machine Drawing', 'Engineering Metallurgy', 'Heat Transfer'],
    3: ['Mechanical Vibrations', 'Dynamics of Machines', 'Finite Element Analysis', 'Mechatronics', 'CAD/CAM', 'Refrigeration and Air Conditioning', 'Production Technology', 'Robotics'],
    4: ['Automobile Engineering', 'Advanced Manufacturing', 'Industrial Engineering', 'Renewable Energy Systems', 'Automation and Control', 'Additive Manufacturing', 'Energy Conservation', 'Smart Manufacturing'],
  },
};


const generateStudents = () => {
  const students = [];
  for (let i = 1; i <= TOTAL_STUDENTS; i++) {
    const year = Math.floor((i - 1) / (TOTAL_STUDENTS / 4)) + 1; // Divide students into 4 years
    const deptIndex = (i - 1) % 5; // Cycle through departments
    const regNo = `${COLLEGE_CODE}${2022 - year}${DEFAULT_DEPARTMENTS[deptIndex].key}${i.toString().padStart(4, '0')}`;
    const student = {
      RegNo: regNo,
      Name: `Student ${i}`,
      Dept: DEFAULT_DEPARTMENTS[deptIndex].key,
      Year: year,
    };
    students.push(student);
  }
  return students;
};

const Exams = () => {
  const [students, setStudents] = useState([]);
  const [selectedExamDetails, setSelectedExamDetails] = useState({
    date: '',
    time: '',
    year: '',
    dept: '',
    subject: '',
    session: '',
  });
  const [allocationResult, setAllocationResult] = useState([]);
  const [allocatedMessage, setAllocatedMessage] = useState('');

  useEffect(() => {
    const generatedStudents = generateStudents();
    setStudents(generatedStudents);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedExamDetails((prev) => ({ ...prev, [name]: value }));
  };

  const allocateStudents = () => {
    const { date, time, year, dept, subject, session } = selectedExamDetails;

    if (!date || !time || !year || !dept || !subject || !session) {
      alert('Please fill in all exam details.');
      return;
    }

    // Filter students based on year and department
    const filteredStudents = students.filter(
      (student) => student.Year === parseInt(year) && student.Dept === dept
    );

    if (filteredStudents.length === 0) {
      alert('No students found for the selected year and department.');
      return;
    }

    const allocations = [];
    let hallCount = 1;
    let seatCount = 1;

    for (let i = 0; i < filteredStudents.length; i++) {
      const student = filteredStudents[i];

      // Create hall name with prefix
      const hallPrefix = hallCount === 1 ? 'IG' : hallCount === 2 ? 'IF' : 'IS';
      const hallName = `${hallPrefix}${hallCount}`;

      // Allocate student to seat
      allocations.push({
        Hall: hallName,
        Seat: seatCount,
        RegNo: student.RegNo,
      });

      seatCount++;
      if (seatCount > STUDENTS_PER_HALL) {
        seatCount = 1;
        hallCount++;
      }
    }

    setAllocationResult(allocations);
    setAllocatedMessage(`Allocated ${filteredStudents.length} students to the exam "${subject}" on ${date} at ${time} (${session}).`);
  };

  const generateImage = () => {
    html2canvas(document.querySelector("#seatingArrangement")).then(canvas => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL("image/png");
      link.download = "seating_arrangement.png";
      link.click();
    });
  };

  const getSubjectsForDeptAndYear = () => {
    const { dept, year } = selectedExamDetails;
    if (!dept || !year) return [];
    return SUBJECTS_BY_DEPT_YEAR[dept][year] || [];
  };

  return (
    <div className="container mt-5">
      <h1>Allocate Students to Exam Blocks</h1>

      <div className="mb-3">
        <label className="form-label">Exam Date</label>
        <input type="date" className="form-control" name="date" value={selectedExamDetails.date} onChange={handleInputChange} />
      </div>

      <div className="mb-3">
        <label className="form-label">Exam Time</label>
        <input type="time" className="form-control" name="time" value={selectedExamDetails.time} onChange={handleInputChange} />
      </div>

      <div className="mb-3">
        <label className="form-label">Year</label>
        <select className="form-control" name="year" value={selectedExamDetails.year} onChange={handleInputChange}>
          <option value="">Select Year</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Department</label>
        <select className="form-control" name="dept" value={selectedExamDetails.dept} onChange={handleInputChange}>
          <option value="">Select Department</option>
          {DEFAULT_DEPARTMENTS.map((dept) => (
            <option key={dept.key} value={dept.key}>{dept.name}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Exam Subject</label>
        <select className="form-control" name="subject" value={selectedExamDetails.subject} onChange={handleInputChange}>
          <option value="">Select Subject</option>
          {getSubjectsForDeptAndYear().map((subject) => (
            <option key={subject} value={subject}>{subject}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Session</label>
        <select className="form-control" name="session" value={selectedExamDetails.session} onChange={handleInputChange}>
          <option value="">Select Session</option>
          <option value="FN">FN</option>
          <option value="AN">AN</option>
        </select>
      </div>

      <button type="button" className="btn btn-primary" onClick={allocateStudents}>
        Allocate Students
      </button>

      {allocatedMessage && <div className="alert alert-success mt-3">{allocatedMessage}</div>}

      {allocationResult.length > 0 && (
        <div className="mt-4" id="seatingArrangement">
          <h2>Seating Arrangement</h2>
          <h4>{`Exam: ${selectedExamDetails.subject} - ${selectedExamDetails.date} - ${selectedExamDetails.time} (${selectedExamDetails.session})`}</h4>

          {Array.from({ length: HALLS_PER_BLOCK }).map((_, blockIndex) => (
            <div key={blockIndex} className="mb-4">
              <h3>Block {blockIndex + 1}</h3>
              {Array.from({ length: HALLS_PER_BLOCK }).map((_, hallIndex) => (
                <div key={hallIndex} className="mb-2">
                  <h4>Hall {hallIndex + 1}</h4>
                  <table className="table table-bordered">
                    <tbody>
                      {Array.from({ length: 5 }).map((_, rowIndex) => (
                        <tr key={rowIndex}>
                          {Array.from({ length: 5 }).map((_, colIndex) => {
                            const seatIndex = (hallIndex * STUDENTS_PER_HALL + rowIndex * 5 + colIndex);
                            const allocation = allocationResult[seatIndex];
                            return (
                              <td key={colIndex} className="text-center">
                                {allocation ? `${allocation.Hall}_${rowIndex * 5 + colIndex + 1}_${allocation.RegNo}` : 'Vacant'}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          ))}

          <button className="btn btn-success" onClick={generateImage}>
            Download Seating Arrangement as PNG
          </button>
        </div>
      )}
    </div>
  );
};

export default Exams;
