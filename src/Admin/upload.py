import pandas as pd
import random
import string

# Function to generate a unique email
def generate_unique_email(base_email, used_emails):
    while True:
        random_suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=5))
        unique_email = f"{base_email}_@gmail.com"
        if unique_email not in used_emails:
            used_emails.add(unique_email)
            return unique_email

# Sample data
data = {
    'name': ['Student1', 'Student2', 'Student3', 'Student4', 'Student5', 'Student6', 'Student7', 'Student8', 'Student9', 'Student10', 'Student11', 'Student12', 'Student13', 'Student14', 'Student15', 'Admin1', 'Admin2', 'Technical1', 'Technical2'],
    'dob': ['2000-01-01'] * 15 + ['1990-01-01'] * 2 + ['1980-01-01'] * 2,
    'phoneNumber': [f'123456789{i}' for i in range(1, 16)] + ['9876543210', '9876543211', '8765432109', '8765432108'],
    'role': ['Student'] * 15 + ['Administrator'] * 2 + ['Technical'] * 2,
    'dept': ['Dept1'] * 15 + ['AdminDept'] * 2 + ['TechDept'] * 2,
    'address': ['Address1'] * 15 + ['AdminAddress'] * 2 + ['TechAddress'] * 2,
    'bloodGroup': ['A+'] * 15 + ['B+'] * 2 + ['O+'] * 2,
    'religion': ['Religion1'] * 15 + ['ReligionAdmin'] * 2 + ['ReligionTech'] * 2,
    'caste': ['Caste1'] * 15 + ['CasteAdmin'] * 2 + ['CasteTech'] * 2,
    'email': [''] * 19  # Placeholder for email generation
}

# Create a DataFrame
df = pd.DataFrame(data)

# Generate unique emails
used_emails = set()
for i in range(len(df)):
    base_email = df.at[i, 'name'].replace(' ', '').lower()
    df.at[i, 'email'] = generate_unique_email(base_email, used_emails)

# Generate random passwords for the users
df['password'] = [''.join(random.choices(string.ascii_letters + string.digits, k=8)) for _ in range(len(df))]

# Save the DataFrame to an Excel file
df.to_excel('alumni_data.xlsx', index=False)
