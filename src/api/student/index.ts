import { Student } from "../../schema/student";

let studentId: number = 0;
let students: Student[] = [];

export const getAllStudents = (): Student[] => {
  return students;
};

export const getStudentById = async (
  id: number
): Promise<Student | undefined> => {
  const pr = new Promise<Student | undefined>((resolve, reject) => {
    const student = students.find((student) => student.id === id);
    if (student) {
      resolve(student);
    } else {
      reject("User not found");
    }
  });
  return pr;
};

export const addStudent = async (
  studentName: string,
  courses: number[]
): Promise<Student> => {
  const pr = new Promise<Student>((resolve, reject) => {
    const id = getNextStudentId();
    const studentWithId = { name: studentName, id: id, courseIds: courses };
    students = [...students, studentWithId];
    resolve(studentWithId);
  });
  return pr;
};

export const updateStudent = async (
  id: number,
  studentName: string,
  courses: number[]
): Promise<Student | undefined> => {
  const pr = new Promise<Student | undefined>((resolve, reject) => {
    students = students.map((student) =>
      student.id === id
        ? { ...student, name: studentName, courseIds: courses }
        : student
    );
    resolve(getStudentById(id));
  });
  return pr;
};

export const deleteStudent = async (id: number): Promise<boolean> => {
  const initialLength = students.length;
  students = students.filter((student) => student.id !== id);
  const pr = new Promise<boolean>((resolve, reject) => {
    if (students.length < initialLength) {
      resolve(true);
    } else {
      reject(false);
    }
  });
  return pr;
};

export const getStudentsByCourse = (courseId: number): Promise<Student[]> => {
  const pr = new Promise<Student[]>((resolve, reject) => {
    const filteredStudents = students.filter((student) =>
      student.courseIds.includes(courseId)
    );
    resolve(filteredStudents);
  });
  return pr;
};

function getNextStudentId(): number {
  studentId += 1;
  return studentId;
}
