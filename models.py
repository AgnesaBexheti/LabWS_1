from sqlalchemy import create_engine, Column, Integer, String, Table, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship, scoped_session

# Create database engine with thread safety for SQLite
engine = create_engine(
    'sqlite:///db.sqlite', 
    echo=True,
    connect_args={'check_same_thread': False}  # Allow SQLite to work with Flask threads
)
Base = declarative_base()

# Create a scoped session for thread safety
session_factory = sessionmaker(bind=engine)
session = scoped_session(session_factory)

# Association table for many-to-many relationship
student_course = Table(
    'student_course',
    Base.metadata,
    Column('student_id', Integer, ForeignKey('students.id')),
    Column('course_id', Integer, ForeignKey('courses.id'))
)

class Student(Base):
    __tablename__ = 'students'
    
    id = Column(Integer, primary_key=True)
    name = Column(String)
    email = Column(String, unique=True)
    
    # Relationship to courses
    courses = relationship("Course", secondary=student_course, back_populates="students")

class Course(Base):
    __tablename__ = 'courses'
    
    id = Column(Integer, primary_key=True)
    name = Column(String)
    
    # Relationship to students
    students = relationship("Student", secondary=student_course, back_populates="courses")

# Create all tables
Base.metadata.create_all(engine)