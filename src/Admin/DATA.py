import pandas as pd
import random

# Define the department codes
dept_codes = {'CSE': 'C', 'ECE': 'EC', 'EEE': 'EE', 'MECH': 'M', 'CIVIL': 'CE'}

# Define subjects for each department and semester
subjects_dict_dept = {
    'CSE': {
        1: ['Programming', 'Data Structures', 'Algorithms', 'Computer Networks', 'Operating Systems', 'Database Systems', 'Software Engineering', 'Mathematics', 'Physics', 'English'],
        2: ['Object-Oriented Programming', 'Data Science', 'Machine Learning', 'Artificial Intelligence', 'Web Development', 'Mobile Computing', 'Discrete Mathematics', 'Statistics', 'Digital Electronics', 'Business Communication'],
        3: ['Advanced Algorithms', 'Compiler Design', 'Distributed Systems', 'Cloud Computing', 'Cybersecurity', 'Network Security', 'Human-Computer Interaction', 'Big Data', 'Cryptography', 'System Programming'],
        4: ['Blockchain', 'Quantum Computing', 'IoT', 'Natural Language Processing', 'Data Visualization', 'Deep Learning', 'DevOps', 'Software Testing', 'Advanced Database Systems', 'Mobile Security']
    },
    'ECE': {
        1: ['Digital Electronics', 'Analog Circuits', 'Network Theory', 'Control Systems', 'Signal Processing', 'Microprocessors', 'Communication Systems', 'Engineering Mathematics', 'Electromagnetics', 'Physics'],
        2: ['VLSI Design', 'Embedded Systems', 'Antenna Theory', 'Wireless Communication', 'Digital Communication', 'Optical Communication', 'Radar Systems', 'Analog Communication', 'Mathematics', 'English'],
        3: ['Digital Signal Processing', 'Microwave Engineering', 'Satellite Communication', 'Image Processing', 'Antenna & Wave Propagation', 'Nanotechnology', 'Sensor Networks', 'Network Security', 'Robotics', 'Communication Networks'],
        4: ['5G Technology', 'Bioelectronics', 'Cognitive Radio', 'Quantum Electronics', 'Photonics', 'Embedded System Design', 'Wearable Devices', 'Renewable Energy Systems', 'Speech Signal Processing', 'AI in Communication']
    },
    'EEE': {
        1: ['Circuit Theory', 'Electric Machines', 'Control Systems', 'Power Systems', 'Power Electronics', 'Digital Logic Design', 'Signals & Systems', 'Engineering Mathematics', 'Physics', 'English'],
        2: ['Electrical Drives', 'Embedded Systems', 'Microcontrollers', 'Analog Circuits', 'Renewable Energy Systems', 'Electrical Measurements', 'Transmission & Distribution', 'Mathematics', 'Circuit Simulation', 'Communication Skills'],
        3: ['High Voltage Engineering', 'Electric Power Generation', 'Smart Grids', 'Power System Analysis', 'Electrical Insulation', 'Electrical Machine Design', 'Advanced Control Systems', 'Renewable Energy Engineering', 'Electric Vehicles', 'Electronics & Power'],
        4: ['Power Quality', 'Energy Audit', 'Solar Energy Systems', 'Wind Power Systems', 'Electrical Machine Control', 'HVDC', 'Power System Protection', 'Grid Integration', 'Microgrid Systems', 'AI in Power Systems']
    },
    'MECH': {
        1: ['Engineering Mechanics', 'Thermodynamics', 'Fluid Mechanics', 'Manufacturing Processes', 'Material Science', 'Strength of Materials', 'Heat Transfer', 'Machine Drawing', 'Mathematics', 'Physics'],
        2: ['Theory of Machines', 'Dynamics of Machinery', 'Machine Design', 'CAD/CAM', 'Manufacturing Technology', 'Mechanical Vibrations', 'Industrial Engineering', 'Mechanics of Solids', 'English', 'Mathematics'],
        3: ['Finite Element Analysis', 'Automation', 'Robotics', 'Refrigeration & Air Conditioning', 'Fluid Dynamics', 'Heat Exchangers', 'Turbo Machinery', 'Manufacturing Automation', 'Mechatronics', 'Control Engineering'],
        4: ['Renewable Energy', 'Advanced Manufacturing', 'Nano Materials', 'Biomechanics', 'Robotics & Automation', 'Automotive Engineering', 'Composite Materials', 'Rapid Prototyping', 'Industrial Robotics', 'AI in Manufacturing']
    },
    'CIVIL': {
        1: ['Building Materials', 'Surveying', 'Engineering Geology', 'Fluid Mechanics', 'Solid Mechanics', 'Construction Technology', 'Mathematics', 'Physics', 'Civil Engineering Drawing', 'English'],
        2: ['Structural Analysis', 'Concrete Technology', 'Geotechnical Engineering', 'Water Resources Engineering', 'Transportation Engineering', 'Environmental Engineering', 'Hydraulics', 'Mathematics', 'Soil Mechanics', 'English'],
        3: ['Design of Steel Structures', 'Earthquake Engineering', 'Bridge Engineering', 'Urban Planning', 'Construction Management', 'Building Services', 'Irrigation Engineering', 'Transportation Planning', 'Highway Engineering', 'Railway Engineering'],
        4: ['Advanced Construction Techniques', 'Sustainable Engineering', 'Smart Cities', 'Infrastructure Management', 'Building Information Modeling', 'Remote Sensing & GIS', 'Advanced Foundation Engineering', 'Urban Hydrology', 'Construction Project Management', 'AI in Civil Engineering']
    }
}

# Function to generate random names
def generate_name():
    first_names = ['John', 'Jane', 'Alex', 'Emily', 'Chris', 'Katie', 'Michael', 'Sarah', 'David', 'Laura']
    last_names = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Martinez']
    return f"{random.choice(first_names)} {random.choice(last_names)}"

# Function to generate registration number in the specified format
def generate_reg_no(year_of_joining, dept, roll_no):
    college_code = '9177'
    year = str(year_of_joining)[-2:]  # Last 2 digits of the joining year
    dept_code = dept_codes[dept]
    roll_no_formatted = f"{roll_no:03d}"  # Ensure roll_no is 3 digits with leading zeros
    return f"{college_code}{year}{dept_code}{roll_no_formatted}"

# Generate student records
final_records = []

# Year of joining (randomized between 2019 to 2022 for variation)
joining_years_final = [2019, 2020, 2021, 2022]

# Generate final student records with department-specific subjects and new reg_no format
for i in range(1500):  # Generating 150 records
    dept = random.choice(list(dept_codes.keys()))
    year_of_joining = random.choice(joining_years_final)
    year = 2024 - year_of_joining  # Year in college is based on the year of joining
    semester = random.choice([1, 2, 3, 4])  # Semester based on year
    roll_no = i + 1  # Unique roll number for each student
    reg_no = generate_reg_no(year_of_joining, dept, roll_no)
    name = generate_name()

    # Get subjects based on the department and semester
    subjects = {f"Subject{j+1}": subjects_dict_dept[dept][semester][j] for j in range(10)}

    # Create a record dictionary
    final_record = {
        'Dept': dept,
        'Year': year,
        'RegNo': reg_no,
        'Name': name,
        'Semester': semester,
        **subjects
    }

    final_records.append(final_record)

# Convert the final records into a DataFrame
df_final = pd.DataFrame(final_records)

# Save the DataFrame to an Excel file
df_final.to_excel('student_records_final.xlsx', index=False)

print("Student records have been generated and saved to 'student_records_final.xlsx'.")
