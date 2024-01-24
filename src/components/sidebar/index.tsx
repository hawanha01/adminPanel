import React from "react";
import { Box, Typography, TextField, Checkbox } from "@mui/material";
import { Course } from "../../schema/course";

interface SidebarProps {
  courses: Course[];
  onFilterChange: (searchText: string, selectedCourses: number[]) => void;
}

const Sidebar = ({ courses, onFilterChange }: SidebarProps) => {
  const [searchText, setSearchText] = React.useState("");
  const [selectedCourses, setSelectedCourses] = React.useState<number[]>([]);

  React.useEffect(() => {
    onFilterChange(searchText, selectedCourses);
  }, [searchText, selectedCourses, onFilterChange]);

  return (
    <Box width={"25%"} p={1}>
      <Typography variant="h6">Filter Students</Typography>
      <TextField
        label="Search by student name"
        variant="outlined"
        fullWidth
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        margin="normal"
      />
      <Typography variant="h6" mt={2}>
        Courses
      </Typography>
      {courses?.map((course) => (
        <div key={course.id}>
          <Checkbox
            checked={selectedCourses.includes(course.id)}
            onChange={(e) => {
              const courseId = course.id;
              setSelectedCourses((prevCourses) =>
                e.target.checked
                  ? [...prevCourses, courseId]
                  : prevCourses.filter((id) => id !== courseId)
              );
            }}
          />
          {course.name}
        </div>
      ))}
    </Box>
  );
};

export default Sidebar;
