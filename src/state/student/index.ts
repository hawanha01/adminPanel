import { Student } from "../../schema/student";

let studentId: number = 0;
let students: Student[] = [];

export const getAllStudents = (): Student[] => {
  return students;
};

export const getStudentById = (id: number): Student | undefined => {
  return students.find((student) => student.id === id);
};

export const createStudent = (newStudent: Student): Student => {
  const id = getNextStudentId();
  const studentWithId = { ...newStudent, id };
  students = [...students, studentWithId];
  return studentWithId;
};

export const updateStudent = (
  id: number,
  updatedStudent: Student
): Student | undefined => {
  students = students.map((student) =>
    student.id === id ? updatedStudent : student
  );
  return getStudentById(id);
};

export const deleteStudent = (id: number): boolean => {
  const initialLength = students.length;
  students = students.filter((student) => student.id !== id);
  return students.length < initialLength;
};

export const getStudentsByCourse = (courseId: number): Student[] => {
  return students.filter((student) => student.courseIds.includes(courseId));
};

function getNextStudentId(): number {
  studentId += 1;
  return studentId;
}
