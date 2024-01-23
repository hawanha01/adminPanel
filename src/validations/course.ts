import * as Yup from "yup";
const courseValidation = Yup.object({
  name: Yup.string()
    .min(1, "Minimum 1 character require for course name")
    .required("Course name required"),
});
export default courseValidation;
