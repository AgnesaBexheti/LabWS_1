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
    students_by_name = graphene.List(StudentType, name=graphene.String(required=True))
    courses_by_name = graphene.List(CourseType, name=graphene.String(required=True))

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

    # Resolver for searching students by name (partial match)
    def resolve_students_by_name(self, info, name):
        return session.query(Student).filter(Student.name.ilike(f"%{name}%")).all()

    # Resolver for searching courses by name (partial match)
    def resolve_courses_by_name(self, info, name):
        return session.query(Course).filter(Course.name.ilike(f"%{name}%")).all()

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
    
class UpdateStudent(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        name = graphene.String()
        email = graphene.String()

    student = graphene.Field(StudentType)

    def mutate(self, info, id, name=None, email=None):
        student = session.query(Student).filter_by(id=id).first()
        if not student:
            return UpdateStudent(student=None)

        if name is not None:
            student.name = name
        if email is not None:
            student.email = email
        session.commit()
        return UpdateStudent(student=student)

class UpdateCourse(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        name = graphene.String(required=True)

    course = graphene.Field(CourseType)

    def mutate(self, info, id, name):
        course = session.query(Course).filter_by(id=id).first()
        if not course:
            return UpdateCourse(course=None)

        course.name = name
        session.commit()
        return UpdateCourse(course=course)

class UnenrollStudent(graphene.Mutation):
    class Arguments:
        student_id = graphene.Int(required=True)
        course_id = graphene.Int(required=True)

    student = graphene.Field(StudentType)

    def mutate(self, info, student_id, course_id):
        student = session.query(Student).filter_by(id=student_id).first()
        course = session.query(Course).filter_by(id=course_id).first()

        if student and course and course in student.courses:
            student.courses.remove(course)
            session.commit()
            return UnenrollStudent(student=student)
        return None


# Step 4d: Register all mutations
class Mutation(graphene.ObjectType):
    add_student = AddStudent.Field()
    add_course = AddCourse.Field()
    enroll_student = EnrollStudent.Field()
    unenroll_student = UnenrollStudent.Field()
    delete_student = DeleteStudent.Field()
    update_student = UpdateStudent.Field()
    update_course = UpdateCourse.Field()

# Step 4e: Create the schema
schema = graphene.Schema(query=Query, mutation=Mutation)