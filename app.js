const GRAPHQL_URL = 'http://localhost:3000/graphql';

// GraphQL Query and Mutation Functions
async function graphqlRequest(query, variables = {}) {
    try {
        const response = await fetch(GRAPHQL_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables
            })
        });

        const result = await response.json();

        if (result.errors) {
            throw new Error(result.errors[0].message);
        }

        return result.data;
    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
        throw error;
    }
}

// Message Display
function showMessage(message, type = 'success') {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';

    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}

// Student Management Functions
async function addStudent(event) {
    event.preventDefault();

    const name = document.getElementById('studentName').value;
    const email = document.getElementById('studentEmail').value;

    const mutation = `
        mutation AddStudent($name: String!, $email: String!) {
            addStudent(name: $name, email: $email) {
                student {
                    id
                    name
                    email
                }
            }
        }
    `;

    try {
        await graphqlRequest(mutation, { name, email });
        showMessage('Student added successfully!', 'success');
        document.getElementById('addStudentForm').reset();
        loadStudents();
        loadEnrollmentDropdowns();
    } catch (error) {
        console.error('Error adding student:', error);
    }
}

async function loadStudents() {
    const query = `
        query {
            students {
                id
                name
                email
                courses {
                    id
                    name
                }
            }
        }
    `;

    try {
        const data = await graphqlRequest(query);
        displayStudents(data.students);
    } catch (error) {
        console.error('Error loading students:', error);
    }
}

function displayStudents(students) {
    const container = document.getElementById('studentsList');

    if (!students || students.length === 0) {
        container.innerHTML = '<div class="empty-state">No students found</div>';
        return;
    }

    container.innerHTML = students.map(student => `
        <div class="item-card">
            <div class="item-info">
                <strong>${student.name}</strong>
                <p>ID: ${student.id}</p>
                <p>Email: ${student.email}</p>
                ${student.courses && student.courses.length > 0 ? `
                    <div class="courses-enrolled">
                        <strong>Enrolled Courses:</strong>
                        <ul>
                            ${student.courses.map(course => `<li>${course.name}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
            <div class="item-actions">
                <button class="edit-btn" onclick="editStudent(${student.id}, '${student.name.replace(/'/g, "\\'")}', '${student.email}')">Edit</button>
            </div>
        </div>
    `).join('');
}

function editStudent(id, name, email) {
    document.getElementById('editStudentId').value = id;
    document.getElementById('editStudentName').value = name;
    document.getElementById('editStudentEmail').value = email;
    document.getElementById('editStudentContainer').style.display = 'block';
    document.getElementById('editStudentContainer').scrollIntoView({ behavior: 'smooth' });
}

async function updateStudent(event) {
    event.preventDefault();

    const id = parseInt(document.getElementById('editStudentId').value);
    const name = document.getElementById('editStudentName').value;
    const email = document.getElementById('editStudentEmail').value;

    const mutation = `
        mutation UpdateStudent($id: Int!, $name: String, $email: String) {
            updateStudent(id: $id, name: $name, email: $email) {
                student {
                    id
                    name
                    email
                }
            }
        }
    `;

    try {
        await graphqlRequest(mutation, { id, name, email });
        showMessage('Student updated successfully!', 'success');
        cancelEdit('student');
        loadStudents();
        loadEnrollmentDropdowns();
    } catch (error) {
        console.error('Error updating student:', error);
    }
}

function cancelEdit(type) {
    if (type === 'student') {
        document.getElementById('editStudentContainer').style.display = 'none';
        document.getElementById('editStudentForm').reset();
    } else if (type === 'course') {
        document.getElementById('editCourseContainer').style.display = 'none';
        document.getElementById('editCourseForm').reset();
    }
}

// Course Management Functions
async function addCourse(event) {
    event.preventDefault();

    const name = document.getElementById('courseName').value;

    const mutation = `
        mutation AddCourse($name: String!) {
            addCourse(name: $name) {
                course {
                    id
                    name
                }
            }
        }
    `;

    try {
        await graphqlRequest(mutation, { name });
        showMessage('Course added successfully!', 'success');
        document.getElementById('addCourseForm').reset();
        loadCourses();
        loadEnrollmentDropdowns();
    } catch (error) {
        console.error('Error adding course:', error);
    }
}

async function loadCourses() {
    const query = `
        query {
            courses {
                id
                name
                students {
                    id
                    name
                    email
                }
            }
        }
    `;

    try {
        const data = await graphqlRequest(query);
        displayCourses(data.courses);
    } catch (error) {
        console.error('Error loading courses:', error);
    }
}

function displayCourses(courses) {
    const container = document.getElementById('coursesList');

    if (!courses || courses.length === 0) {
        container.innerHTML = '<div class="empty-state">No courses found</div>';
        return;
    }

    container.innerHTML = courses.map(course => `
        <div class="item-card">
            <div class="item-info">
                <strong>${course.name}</strong>
                <p>ID: ${course.id}</p>
                ${course.students && course.students.length > 0 ? `
                    <div class="courses-enrolled">
                        <strong>Enrolled Students (${course.students.length}):</strong>
                        <ul>
                            ${course.students.map(student => `<li>${student.name} (${student.email})</li>`).join('')}
                        </ul>
                    </div>
                ` : '<p style="color: #999; font-style: italic;">No students enrolled</p>'}
            </div>
            <div class="item-actions">
                <button class="edit-btn" onclick="editCourse(${course.id}, '${course.name.replace(/'/g, "\\'")}')">Edit</button>
            </div>
        </div>
    `).join('');
}

function editCourse(id, name) {
    document.getElementById('editCourseId').value = id;
    document.getElementById('editCourseName').value = name;
    document.getElementById('editCourseContainer').style.display = 'block';
    document.getElementById('editCourseContainer').scrollIntoView({ behavior: 'smooth' });
}

async function updateCourse(event) {
    event.preventDefault();

    const id = parseInt(document.getElementById('editCourseId').value);
    const name = document.getElementById('editCourseName').value;

    const mutation = `
        mutation UpdateCourse($id: Int!, $name: String!) {
            updateCourse(id: $id, name: $name) {
                course {
                    id
                    name
                }
            }
        }
    `;

    try {
        await graphqlRequest(mutation, { id, name });
        showMessage('Course updated successfully!', 'success');
        cancelEdit('course');
        loadCourses();
        loadEnrollmentDropdowns();
    } catch (error) {
        console.error('Error updating course:', error);
    }
}

// Enrollment Functions
async function enrollStudent(event) {
    event.preventDefault();

    const studentId = parseInt(document.getElementById('enrollStudentId').value);
    const courseId = parseInt(document.getElementById('enrollCourseId').value);

    const mutation = `
        mutation EnrollStudent($studentId: Int!, $courseId: Int!) {
            enrollStudent(studentId: $studentId, courseId: $courseId) {
                student {
                    id
                    name
                    courses {
                        id
                        name
                    }
                }
            }
        }
    `;

    try {
        await graphqlRequest(mutation, { studentId, courseId });
        showMessage('Student enrolled successfully!', 'success');
        document.getElementById('enrollForm').reset();
        loadStudents();
        loadCourses();
    } catch (error) {
        console.error('Error enrolling student:', error);
    }
}

async function unenrollStudent(event) {
    event.preventDefault();

    const studentId = parseInt(document.getElementById('unenrollStudentId').value);
    const courseId = parseInt(document.getElementById('unenrollCourseId').value);

    const mutation = `
        mutation UnenrollStudent($studentId: Int!, $courseId: Int!) {
            unenrollStudent(studentId: $studentId, courseId: $courseId) {
                student {
                    id
                    name
                    courses {
                        id
                        name
                    }
                }
            }
        }
    `;

    try {
        await graphqlRequest(mutation, { studentId, courseId });
        showMessage('Student unenrolled successfully!', 'success');
        document.getElementById('unenrollForm').reset();
        loadStudents();
        loadCourses();
    } catch (error) {
        console.error('Error unenrolling student:', error);
    }
}

async function loadEnrollmentDropdowns() {
    const studentsQuery = `
        query {
            students {
                id
                name
            }
        }
    `;

    const coursesQuery = `
        query {
            courses {
                id
                name
            }
        }
    `;

    try {
        const studentsData = await graphqlRequest(studentsQuery);
        const coursesData = await graphqlRequest(coursesQuery);

        const studentOptions = studentsData.students.map(s =>
            `<option value="${s.id}">${s.name} (ID: ${s.id})</option>`
        ).join('');

        const courseOptions = coursesData.courses.map(c =>
            `<option value="${c.id}">${c.name} (ID: ${c.id})</option>`
        ).join('');

        document.getElementById('enrollStudentId').innerHTML = '<option value="">Select Student</option>' + studentOptions;
        document.getElementById('enrollCourseId').innerHTML = '<option value="">Select Course</option>' + courseOptions;
        document.getElementById('unenrollStudentId').innerHTML = '<option value="">Select Student</option>' + studentOptions;
        document.getElementById('unenrollCourseId').innerHTML = '<option value="">Select Course</option>' + courseOptions;
    } catch (error) {
        console.error('Error loading dropdowns:', error);
    }
}

// Search Functions
async function searchStudentById() {
    const id = parseInt(document.getElementById('searchStudentId').value);

    if (!id) {
        showMessage('Please enter a student ID', 'error');
        return;
    }

    const query = `
        query GetStudent($id: Int!) {
            student(id: $id) {
                id
                name
                email
                courses {
                    id
                    name
                }
            }
        }
    `;

    try {
        const data = await graphqlRequest(query, { id });

        if (!data.student) {
            document.getElementById('searchResults').innerHTML = '<div class="empty-state">No student found with that ID</div>';
            return;
        }

        displaySearchResults([data.student], 'student');
    } catch (error) {
        console.error('Error searching student:', error);
    }
}

async function searchStudentByName() {
    const name = document.getElementById('searchStudentName').value.trim();

    if (!name) {
        showMessage('Please enter a student name', 'error');
        return;
    }

    const query = `
        query SearchStudents($name: String!) {
            studentsByName(name: $name) {
                id
                name
                email
                courses {
                    id
                    name
                }
            }
        }
    `;

    try {
        const data = await graphqlRequest(query, { name });

        if (!data.studentsByName || data.studentsByName.length === 0) {
            document.getElementById('searchResults').innerHTML = '<div class="empty-state">No students found with that name</div>';
            return;
        }

        displaySearchResults(data.studentsByName, 'student');
    } catch (error) {
        console.error('Error searching students:', error);
    }
}

async function searchCourseByName() {
    const name = document.getElementById('searchCourseName').value.trim();

    if (!name) {
        showMessage('Please enter a course name', 'error');
        return;
    }

    const query = `
        query SearchCourses($name: String!) {
            coursesByName(name: $name) {
                id
                name
                students {
                    id
                    name
                    email
                }
            }
        }
    `;

    try {
        const data = await graphqlRequest(query, { name });

        if (!data.coursesByName || data.coursesByName.length === 0) {
            document.getElementById('searchResults').innerHTML = '<div class="empty-state">No courses found with that name</div>';
            return;
        }

        displaySearchResults(data.coursesByName, 'course');
    } catch (error) {
        console.error('Error searching courses:', error);
    }
}

function displaySearchResults(results, type) {
    const container = document.getElementById('searchResults');

    if (type === 'student') {
        container.innerHTML = `
            <h3>Search Results (${results.length} student(s) found)</h3>
            ${results.map(student => `
                <div class="search-result-card">
                    <h4>${student.name}</h4>
                    <p><strong>ID:</strong> ${student.id}</p>
                    <p><strong>Email:</strong> ${student.email}</p>
                    ${student.courses && student.courses.length > 0 ? `
                        <div class="course-list">
                            <strong>Enrolled Courses:</strong>
                            <ul>
                                ${student.courses.map(course => `<li>${course.name} (ID: ${course.id})</li>`).join('')}
                            </ul>
                        </div>
                    ` : '<p style="color: #999; font-style: italic;">Not enrolled in any courses</p>'}
                </div>
            `).join('')}
        `;
    } else if (type === 'course') {
        container.innerHTML = `
            <h3>Search Results (${results.length} course(s) found)</h3>
            ${results.map(course => `
                <div class="search-result-card">
                    <h4>${course.name}</h4>
                    <p><strong>ID:</strong> ${course.id}</p>
                    ${course.students && course.students.length > 0 ? `
                        <div class="student-list">
                            <strong>Enrolled Students (${course.students.length}):</strong>
                            <ul>
                                ${course.students.map(student => `<li>${student.name} - ${student.email} (ID: ${student.id})</li>`).join('')}
                            </ul>
                        </div>
                    ` : '<p style="color: #999; font-style: italic;">No students enrolled</p>'}
                </div>
            `).join('')}
        `;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadStudents();
    loadCourses();
    loadEnrollmentDropdowns();
});
