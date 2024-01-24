import * as Yup from "yup";

const studentValidation = Yup.object({
  name: Yup.string()
    .min(2, "Minimum 2 characters required for student name")
    .required("Student name required"),
  selectedCourses: Yup.array()
    .min(1, "At least one course must be selected")
    .max(4, "Maximum of 4 courses can be selected")
    .required("At least one course must be selected"),
});

export default studentValidation;
