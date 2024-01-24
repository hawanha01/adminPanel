import * as Yup from "yup";
const courseValidation = Yup.object({
  name: Yup.string()
    .min(2, "Minimum 2 character require for course name")
    .required("Course name required"),
});
export default courseValidation;
