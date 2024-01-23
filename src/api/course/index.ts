import { Course } from "../../schema/course";

let courseId: number = 0;
let courses: Course[] = [];

export const getAllCourses = (): Course[] => {
  return courses;
};

export const getCourseById = async (
  id: number
): Promise<Course | undefined> => {
  const pr = new Promise<Course | undefined>((resolve, reject) => {
    const course = courses.find((course) => course.id === id);
    if (course) {
      resolve(course);
    } else {
      reject(new Error("course not found"));
    }
  });
  return pr;
};

export const addCourse = async (
  newCourse: Pick<Course, "name">
): Promise<Course> => {
  const pr = new Promise<Course>((resolve, reject) => {
    const id = getNextCourseId();
    const courseWithId = { ...newCourse, id, studentIds: [] };
    courses = [...courses, courseWithId];
    resolve(courseWithId);
  });
  return pr;
};

export const updateCourse = async (
  id: number,
  updatedName: string
): Promise<Course | undefined> => {
  const pr = new Promise<Course | undefined>((resolve, reject) => {
    courses = courses.map((course) =>
      course.id === id ? { ...course, name: updatedName } : course
    );
    resolve(getCourseById(id));
  });
  return pr;
};

export const deleteCourse = async (id: number): Promise<boolean> => {
  const initialLength = courses.length;
  courses = courses.filter((course) => course.id !== id);
  const pr = new Promise<boolean>((resolve, reject) => {
    if (courses.length < initialLength) {
      resolve(true);
    } else {
      reject(new Error("Course not deleted"));
    }
  });
  return pr;
};

function getNextCourseId(): number {
  courseId += 1;
  return courseId;
}
