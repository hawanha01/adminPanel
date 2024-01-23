import { Course } from "../../schema/course";

let courseId: number = 0;
let courses: Course[] = [];

export const getAllCourses = (): Course[] => {
  return courses;
};

export const getCourseById = (id: number): Course | undefined => {
  return courses.find((course) => course.id === id);
};

export const createCourse = (newCourse: Course): Course => {
  const id = getNextCourseId();
  const courseWithId = { ...newCourse, id };
  courses = [...courses, courseWithId];
  return courseWithId;
};

export const updateCourse = (
  id: number,
  updatedCourse: Course
): Course | undefined => {
  courses = courses.map((course) =>
    course.id === id ? updatedCourse : course
  );
  return getCourseById(id);
};

export const deleteCourse = (id: number): boolean => {
  const initialLength = courses.length;
  courses = courses.filter((course) => course.id !== id);
  return courses.length < initialLength;
};

function getNextCourseId(): number {
  courseId += 1;
  return courseId;
}
