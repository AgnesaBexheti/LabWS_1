# Student Management System - GraphQL Interface

A comprehensive web interface for managing students, courses, and enrollments using GraphQL API.

## Features

### 1. Student Management
- Add new students with name and email
- Edit student information (name and/or email)
- View all students with their enrolled courses
- Delete students (via GraphQL API)

### 2. Course Management
- Add new courses
- Edit course information (name)
- View all courses with enrolled students
- Display student count per course

### 3. Enrollment Management
- Enroll students in courses
- Unenroll students from courses
- View enrollment relationships in both student and course views

### 4. Search Functionality
- **Search Students by ID**: Find and display a specific student by their ID number
- **Search Students by Name**: Partial name search (e.g., searching "Ali" finds "Alice Johnson")
- **Search Courses by Name**: Find courses by name (exact or partial match)
- Display complete information including all enrollments for search results

## Files Included

- `index.html` - Main web interface
- `styles.css` - Styling for the interface
- `app.js` - JavaScript for GraphQL API interactions
- `app.py` - Flask application with GraphQL endpoint
- `schema.py` - GraphQL schema with queries and mutations
- `models.py` - Database models
- `data.py` - Sample data (if exists)
- `db.sqlite` - SQLite database
- `README.md` - This file

## Installation & Setup

### Prerequisites
- Python 3.x
- pip package manager

### Required Python Packages
```bash
pip install flask
pip install flask-graphql
pip install graphene
pip install graphene-sqlalchemy
pip install sqlalchemy
pip install flask-cors
```

### Running the Application

1. Navigate to the project directory:
```bash
cd LabWS_1
```

2. Start the Flask server:
```bash
python app.py
```

3. Open your web browser and navigate to:
```
http://localhost:5000
```

4. The GraphQL API endpoint is also available at:
```
http://localhost:5000/graphql
```

## Usage Guide

### Adding Students
1. Fill in the "Student Name" and "Student Email" fields
2. Click "Add Student"
3. The new student will appear in the Students List below

### Editing Students
1. Click the "Edit" button on any student card
2. Modify the name and/or email in the form that appears
3. Click "Update Student" to save changes or "Cancel" to discard

### Adding Courses
1. Fill in the "Course Name" field
2. Click "Add Course"
3. The new course will appear in the Courses List below

### Editing Courses
1. Click the "Edit" button on any course card
2. Modify the course name
3. Click "Update Course" to save changes or "Cancel" to discard

### Enrolling Students
1. Select a student from the dropdown
2. Select a course from the dropdown
3. Click "Enroll"
4. The enrollment will be reflected in both the student and course views

### Unenrolling Students
1. Select a student from the dropdown
2. Select a course they are enrolled in
3. Click "Unenroll"
4. The enrollment will be removed from both views

### Searching
- **By Student ID**: Enter the student ID number and click "Search"
- **By Student Name**: Enter a partial or full name and click "Search"
- **By Course Name**: Enter a partial or full course name and click "Search"
- Search results will display all relevant information and enrollments

## GraphQL API

### Queries
- `students` - Get all students
- `student(id: Int!)` - Get student by ID
- `studentsByName(name: String!)` - Search students by name (partial match)
- `courses` - Get all courses
- `course(id: Int!)` - Get course by ID
- `coursesByName(name: String!)` - Search courses by name (partial match)

### Mutations
- `addStudent(name: String!, email: String!)` - Create a new student
- `updateStudent(id: Int!, name: String, email: String)` - Update student information
- `deleteStudent(id: Int!)` - Delete a student
- `addCourse(name: String!)` - Create a new course
- `updateCourse(id: Int!, name: String!)` - Update course information
- `enrollStudent(studentId: Int!, courseId: Int!)` - Enroll a student in a course
- `unenrollStudent(studentId: Int!, courseId: Int!)` - Unenroll a student from a course

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Python Flask, GraphQL
- **Database**: SQLite with SQLAlchemy ORM
- **GraphQL**: Graphene, Flask-GraphQL
- **Styling**: Custom CSS with gradient backgrounds and  card-based design



## Notes

- The application uses SQLite database (`db.sqlite`) which is created automatically
