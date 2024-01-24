import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { deleteCourse, getAllCourses } from "../../api/course";
import { getAllStudents, deleteStudent } from "../../api/student";
import Skeleton from "react-loading-skeleton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CourseForm from "../form/courseForm";
import StudentForm from "../form/studentForm";
import { Course } from "../../schema/course";
import { Student } from "../../schema/student";
import Sidebar from "../sidebar";

export default function Dashboard() {
  const [editCourse, setEditCourse] = React.useState<Course | null>(null);
  const [editStudent, setEditStudent] = React.useState<Student | null>(null);
  const [filteredStudents, setFilteredStudents] = React.useState<
    Student[] | null
  >([]);
  const queryClient = useQueryClient();

  const { data: courses, isLoading: isLoadingCourses } = useQuery({
    queryKey: ["course"],
    queryFn: () => getAllCourses(),
  });

  const { data: students, isLoading: isLoadingStudents } = useQuery({
    queryKey: ["student"],
    queryFn: () => getAllStudents(),
  });

  const { mutateAsync: deleteCourseMutation } = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => queryClient.invalidateQueries(["course"]),
  });

  const { mutateAsync: deleteStudentMutation } = useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => queryClient.invalidateQueries(["student"]),
  });

  const handleEditCourse = (course: React.SetStateAction<Course | null>) => {
    setEditCourse(course);
    setEditStudent(null);
  };

  const handleEditStudent = (student: React.SetStateAction<Student | null>) => {
    setEditStudent(student);
    setEditCourse(null);
  };

  if (isLoadingCourses || isLoadingStudents) {
    return <Skeleton height={100} width={200} />;
  }

  const handleFilterChange = (
    searchText: string,
    selectedCourses: number[]
  ) => {
    let filteredData = students;
    if (searchText) {
      filteredData = filteredData?.filter((student) =>
        student.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    if (selectedCourses.length > 0) {
      filteredData = filteredData?.filter((student) =>
        selectedCourses.every((courseId) =>
          student.courseIds.includes(courseId)
        )
      );
    }
    setFilteredStudents(filteredData ?? []);
  };

  return (
    <Box display="flex">
      <Sidebar courses={courses || []} onFilterChange={handleFilterChange} />
      <Box flex="1" p={2}>
        <Typography variant="h4">Courses</Typography>
        <CourseForm
          editCourse={editCourse}
          onEditCourseChange={handleEditCourse}
        />
        <List>
          {courses?.map((course) => (
            <React.Fragment key={course.id}>
              <ListItem>
                <ListItemText primary={course.name} />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={async () => {
                      try {
                        await deleteCourseMutation(course.id);
                      } catch (e) {
                        console.log(e);
                      }
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => handleEditCourse(course)}
                  >
                    <EditIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
        <Typography variant="h4" mt={4}>
          Students
        </Typography>
        <StudentForm
          editStudent={editStudent}
          onEditStudentChange={handleEditStudent}
        />
        <List>
          {(filteredStudents ?? students)?.map((student) => (
            <React.Fragment key={student.id}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <ListItemText primary={student.name} />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={async () => {
                        try {
                          await deleteStudentMutation(student.id);
                        } catch (e) {
                          console.log(e);
                        }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => handleEditStudent(student)}
                    >
                      <EditIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {student.courseIds.map((courseId) => (
                      <ListItem key={courseId}>
                        <ListItemText>
                          {
                            courses?.find((course) => course.id === courseId)
                              ?.name
                          }
                        </ListItemText>
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Box>
  );
}
