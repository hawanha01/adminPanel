import React from "react";
import {
  Box,
  Container,
  Grid,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { addCourse, updateCourse } from "../../api/course";
import { useMutation, useQueryClient } from "react-query";
import courseValidation from "../../validations/course";
import { Course } from "../../schema/course";
interface CreateCourseProps {
  editCourse: any;
  onEditCourseChange: (course: Course | null) => void;
}

export default function CourseForm({
  editCourse,
  onEditCourseChange,
}: CreateCourseProps) {
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const queryClient = useQueryClient();

  const { mutateAsync: addCourseMutation } = useMutation({
    mutationFn: addCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course"] });
      setName("");
      setError(null);
    },
  });
  const { mutateAsync: updateCourseMutation } = useMutation({
    mutationFn: () => updateCourse(editCourse.id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course"] });
      setName("");
      onEditCourseChange(null);
      setError(null);
    },
  });

  React.useEffect(() => {
    if (editCourse) {
      setName(editCourse.name);
    }
  }, [editCourse]);

  return (
    <Container>
      <Box mt={4}>
        <form>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Course Name"
                variant="outlined"
                name="courseName"
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
              <Button
                type="button"
                variant="contained"
                color="primary"
                onClick={async () => {
                  try {
                    await courseValidation.validate({ name });
                    if (editCourse) {
                      await updateCourseMutation();
                    } else {
                      await addCourseMutation({ name });
                    }
                    setName("");
                  } catch (e) {
                    setError((e as any).message);
                  }
                }}
              >
                {editCourse ? "Update" : "Submit"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
}
