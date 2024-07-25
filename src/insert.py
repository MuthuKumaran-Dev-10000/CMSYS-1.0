import os

# Define the components and their placeholder content
components = {
    'UserManagement.js': "import React from 'react';\n\nfunction UserManagement() {\n  return (\n    <div>\n      <h1>User Management</h1>\n      {/* Content for User Management */}\n    </div>\n  );\n}\n\nexport default UserManagement;\n",
    'AcademicManagement.js': "import React from 'react';\n\nfunction AcademicManagement() {\n  return (\n    <div>\n      <h1>Academic Management</h1>\n      {/* Content for Academic Management */}\n    </div>\n  );\n}\n\nexport default AcademicManagement;\n",
    'StudentInfo.js': "import React from 'react';\n\nfunction StudentInfo() {\n  return (\n    <div>\n      <h1>Student Information</h1>\n      {/* Content for Student Information */}\n    </div>\n  );\n}\n\nexport default StudentInfo;\n",
    'FacultyManagement.js': "import React from 'react';\n\nfunction FacultyManagement() {\n  return (\n    <div>\n      <h1>Faculty Management</h1>\n      {/* Content for Faculty Management */}\n    </div>\n  );\n}\n\nexport default FacultyManagement;\n",
    'FinancialManagement.js': "import React from 'react';\n\nfunction FinancialManagement() {\n  return (\n    <div>\n      <h1>Financial Management</h1>\n      {/* Content for Financial Management */}\n    </div>\n  );\n}\n\nexport default FinancialManagement;\n",
    'Communication.js': "import React from 'react';\n\nfunction Communication() {\n  return (\n    <div>\n      <h1>Communication and Notifications</h1>\n      {/* Content for Communication and Notifications */}\n    </div>\n  );\n}\n\nexport default Communication;\n",
    'LibraryManagement.js': "import React from 'react';\n\nfunction LibraryManagement() {\n  return (\n    <div>\n      <h1>Library Management</h1>\n      {/* Content for Library Management */}\n    </div>\n  );\n}\n\nexport default LibraryManagement;\n",
    'Exams.js': "import React from 'react';\n\nfunction Exams() {\n  return (\n    <div>\n      <h1>Examination and Assessment</h1>\n      {/* Content for Examination and Assessment */}\n    </div>\n  );\n}\n\nexport default Exams;\n",
    'Infrastructure.js': "import React from 'react';\n\nfunction Infrastructure() {\n  return (\n    <div>\n      <h1>Infrastructure Management</h1>\n      {/* Content for Infrastructure Management */}\n    </div>\n  );\n}\n\nexport default Infrastructure;\n",
    'Reports.js': "import React from 'react';\n\nfunction Reports() {\n  return (\n    <div>\n      <h1>Reports and Analytics</h1>\n      {/* Content for Reports and Analytics */}\n    </div>\n  );\n}\n\nexport default Reports;\n",
    'Security.js': "import React from 'react';\n\nfunction Security() {\n  return (\n    <div>\n      <h1>Security and Access Control</h1>\n      {/* Content for Security and Access Control */}\n    </div>\n  );\n}\n\nexport default Security;\n",
    'Compliance.js': "import React from 'react';\n\nfunction Compliance() {\n  return (\n    <div>\n      <h1>Compliance and Accreditation</h1>\n      {/* Content for Compliance and Accreditation */}\n    </div>\n  );\n}\n\nexport default Compliance;\n",
    'Events.js': "import React from 'react';\n\nfunction Events() {\n  return (\n    <div>\n      <h1>Event Management</h1>\n      {/* Content for Event Management */}\n    </div>\n  );\n}\n\nexport default Events;\n",
    'Alumni.js': "import React from 'react';\n\nfunction Alumni() {\n  return (\n    <div>\n      <h1>Alumni Management</h1>\n      {/* Content for Alumni Management */}\n    </div>\n  );\n}\n\nexport default Alumni;\n"
}

# Directory where the files will be created
directory = 'src'

# Ensure the directory exists
if not os.path.exists(directory):
    os.makedirs(directory)

# Create the files with placeholder content
for filename, content in components.items():
    filepath = os.path.join(directory, filename)
    with open(filepath, 'w') as file:
        file.write(content)

print("Files created successfully!")
