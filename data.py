from models import Student, Course, session

def populate_data():
    # Check if data already exists
    if session.query(Student).count() > 0:
        print("Database already has data!")
        return
    
    # Create students
    student1 = Student(name="Alice Johnson", email="alice@example.com")
    student2 = Student(name="Bob Smith", email="bob@example.com")
    student3 = Student(name="Charlie Brown", email="charlie@example.com")
    
    # Create courses
    course1 = Course(name="Introduction to Python")
    course2 = Course(name="Web Development")
    course3 = Course(name="Database Systems")
    
    # Enroll students in courses
    student1.courses.extend([course1, course2])
    student2.courses.extend([course2, course3])
    student3.courses.extend([course1, course3])
    
    # Add all to session and commit
    session.add_all([student1, student2, student3, course1, course2, course3])
    session.commit()
    
    print("Sample data added successfully!")

if __name__ == "__main__":
    populate_data()