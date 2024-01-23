import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { deleteCourse, getAllCourses } from "../../api/course";
import Skeleton from "react-loading-skeleton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CourseForm from "../form/courseForm";
import { Course } from "../../schema/course";

export default function Dashboard() {
  const [editCourse, setEditCourse] = React.useState<Course | null>(null);

  const queryClient = useQueryClient();
  const { data: courses, isLoading } = useQuery({
    queryKey: ["course"],
    queryFn: () => getAllCourses(),
  });
  const { mutateAsync: deleteCourseMutation } = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => queryClient.invalidateQueries(["course"]),
  });

  const handleEditCourse = (course: React.SetStateAction<Course | null>) => {
    setEditCourse(course);
  };

  if (isLoading) {
    return <Skeleton height={100} width={200} />;
  }

  return (
    <Box>
      <CourseForm
        editCourse={editCourse}
        onEditCourseChange={handleEditCourse}
      />
      <List>
        {courses?.map((course) => (
          <ListItem key={course.id}>
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
        ))}
      </List>
    </Box>
  );
}
