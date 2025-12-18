from graphene_sqlalchemy import SQLAlchemyObjectType
import graphene
from models import Student, Course, session

# Step 4a: Define GraphQL Types
class StudentType(SQLAlchemyObjectType):
    class Meta:
        model = Student
        # This automatically creates GraphQL fields from SQLAlchemy model

class CourseType(SQLAlchemyObjectType):
    class Meta:
        model = Course

# Step 4b: Define Queries (Read Operations)
class Query(graphene.ObjectType):
    # Define available queries
    students = graphene.List(StudentType)
    courses = graphene.List(CourseType)
    student = graphene.Field(StudentType, id=graphene.Int(required=True))
    course = graphene.Field(CourseType, id=graphene.Int(required=True))
    
    # Resolver for getting all students
    def resolve_students(self, info):
        return session.query(Student).all()
    
    # Resolver for getting all courses
    def resolve_courses(self, info):
        return session.query(Course).all()
    
    # Resolver for getting a single student by ID
    def resolve_student(self, info, id):
        return session.query(Student).filter_by(id=id).first()
    
    # Resolver for getting a single course by ID
    def resolve_course(self, info, id):
        return session.query(Course).filter_by(id=id).first()

# Step 4c: Define Mutations (Write Operations)

# Mutation to add a new student
class AddStudent(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        email = graphene.String(required=True)
    
    student = graphene.Field(StudentType)
    
    def mutate(self, info, name, email):
        new_student = Student(name=name, email=email)
        session.add(new_student)
        session.commit()
        return AddStudent(student=new_student)

# Mutation to add a new course
class AddCourse(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
    
    course = graphene.Field(CourseType)
    
    def mutate(self, info, name):
        new_course = Course(name=name)
        session.add(new_course)
        session.commit()
        return AddCourse(course=new_course)

# Mutation to enroll a student in a course
class EnrollStudent(graphene.Mutation):
    class Arguments:
        student_id = graphene.Int(required=True)
        course_id = graphene.Int(required=True)
    
    student = graphene.Field(StudentType)
    
    def mutate(self, info, student_id, course_id):
        student = session.query(Student).filter_by(id=student_id).first()
        course = session.query(Course).filter_by(id=course_id).first()
        
        if student and course:
            student.courses.append(course)
            session.commit()
            return EnrollStudent(student=student)
        return None
class DeleteStudent(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)

    success = graphene.Boolean()

    def mutate(self, info, id):
        student = session.query(Student).filter_by(id=id).first()
        if not student:
            return DeleteStudent(success=False)

        session.delete(student)
        session.commit()
        return DeleteStudent(success=True)
    
class UpdateStudentEmail(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        email = graphene.String(required=True)

    student = graphene.Field(StudentType)

    def mutate(self, info, id, email):
        student = session.query(Student).filter_by(id=id).first()
        if not student:
            return UpdateStudentEmail(student=None)

        student.email = email
        session.commit()
        return UpdateStudentEmail(student=student)

    students_by_name = graphene.List(
        StudentType,
        name=graphene.String(required=True)
    )

def resolve_students_by_name(self, info, name):
    return session.query(Student).filter(
        Student.name.ilike(f"%{name}%")
    ).all()
students_by_course = graphene.List(
        StudentType,
        course_name=graphene.String(required=True)
    )

def resolve_students_by_course(self, info, course_name):
    course = session.query(Course).filter(
        Course.name.ilike(course_name)
    ).first()

    if not course:
        return []

    return course.students


# Step 4d: Register all mutations
class Mutation(graphene.ObjectType):
    add_student = AddStudent.Field()
    add_course = AddCourse.Field()
    enroll_student = EnrollStudent.Field()
    delete_student = DeleteStudent.Field()
    update_student_email = UpdateStudentEmail.Field()

# Step 4e: Create the schema
schema = graphene.Schema(query=Query, mutation=Mutation)