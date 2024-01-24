import React from "react";
import {
  Box,
  Container,
  Grid,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  Input,
} from "@mui/material";
import { addStudent, updateStudent } from "../../api/student";
import { useMutation, useQueryClient } from "react-query";
import { Student } from "../../schema/student";
import { getAllCourses } from "../../api/course";
import studentValidation from "../../validations/student";

interface StudentFormProps {
  editStudent: Student | null;
  onEditStudentChange: (student: Student | null) => void;
}

export default function StudentForm({
  editStudent,
  onEditStudentChange,
}: StudentFormProps) {
  const [name, setName] = React.useState("");
  const [selectedCourses, setSelectedCourses] = React.useState<number[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const queryClient = useQueryClient();

  const { mutateAsync: addStudentMutation } = useMutation<
    Student,
    string,
    { studentName: string; courses: number[] }
  >({
    mutationFn: (data) => addStudent(data.studentName, data.courses),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student"] });
      setName("");
      setSelectedCourses([]);
      setError(null);
    },
  });

  const { mutateAsync: updateStudentMutation } = useMutation({
    mutationFn: () =>
      updateStudent(editStudent?.id || 0, name, selectedCourses),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student"] });
      setName("");
      setSelectedCourses([]);
      onEditStudentChange(null);
      setError(null);
    },
  });

  React.useEffect(() => {
    if (editStudent) {
      setName(editStudent.name);
      setSelectedCourses(editStudent.courseIds);
    }
  }, [editStudent]);

  return (
    <Container>
      <Box mt={4}>
        <form>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Student Name"
                variant="outlined"
                name="studentName"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
              {error && (
                <Typography variant="caption" color="error">
                  {error}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Courses</InputLabel>
                <Select
                  multiple
                  value={selectedCourses}
                  name="courses"
                  onChange={(e) => {
                    const selectedCourseIds = e.target.value as number[];
                    setSelectedCourses(selectedCourseIds);
                  }}
                  input={<Input />}
                  renderValue={(selected) => (
                    <div>
                      {(selected as number[]).map((courseId) => (
                        <Chip
                          key={courseId}
                          label={
                            getAllCourses().find(
                              (course) => course.id === courseId
                            )?.name
                          }
                        />
                      ))}
                    </div>
                  )}
                >
                  {getAllCourses().map((course) => (
                    <MenuItem key={course.id} value={course.id}>
                      {course.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                type="button"
                variant="contained"
                color="primary"
                onClick={async () => {
                  try {
                    await studentValidation.validate({ name, selectedCourses });
                    if (editStudent) {
                      await updateStudentMutation();
                    } else {
                      await addStudentMutation({
                        studentName: name,
                        courses: selectedCourses,
                      });
                    }
                    setName("");
                    setSelectedCourses([]);
                  } catch (e) {
                    setError((e as any).message);
                  }
                }}
              >
                {editStudent ? "Update" : "Submit"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
}
