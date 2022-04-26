const bcryptjs = require("bcryptjs");
const Student = require("../model/StudentAccountModel");
const { registerValidation } = require("../validations/studentValidation");

const addStudent = async (req, res) => {
  // checking whether is this a student or admin
  const validateStudent = localStorage.getItem("isStudent");
  const validateAdmin = localStorage.getItem("isAdmin");

  if(validateStudent === "true" || validateAdmin === "true"){

    // validate user input fields
    const { error } = registerValidation(req.body);
    if (error) {
      res.send({ message: error["details"][0]["message"] });
    }

    // to check user already exist
    const userExist = await Student.findOne({ email: req.body.email });
    if (userExist) {
      return res.status(400).send({ message: "User Already Exist" });
    }

    console.log("OK")

    //hash the password
    const salt = await bcryptjs.genSalt(5);
    const hashPassword = await bcryptjs.hash(req.body.password, salt);

    const student = new Student({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      birthday: req.body.birthday,
      NIC: req.body.NIC,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      school: req.body.school,
      grade: req.body.grade,
      medium: req.body.medium,
      parentName: req.body.parentName,
      parentPhoneNumber: req.body.parentPhoneNumber,
      parentEmail: req.body.parentEmail,
      studentGender: req.body.studentGender,
      parentAddress: req.body.parentAddress,
      parentOccupation: req.body.parentOccupation,
      imageURL: req.body.imageURL,
      subject: req.body.subject,
      teacher: req.body.teacher,
      OL_Year: req.body.OL_Year,
      AL_Year: req.body.AL_Year,
      username: req.body.username,
      password: hashPassword,
    });

    console.log(student);

    try {
      const savedStudent = student.save();
      res.send(savedStudent);
    } catch (error) {
      res.status(400).send({ message: error });
    }
  } else {
    return res.status(403).json("You do not have permission to access this");
  }
};

const getStudents = async (req, res) => {
  // checking whether is this a student or admin
  const validateStudent = localStorage.getItem("isStudent");
  const validateAdmin = localStorage.getItem("isAdmin");

  if(validateStudent === "true" || validateAdmin === "true"){
    try {
      const students = await Student.find();
      res.send(students);
    } catch (error) {
      res.status(400).send({ message: error });
    }
  } else {
    return res.status(403).json("You do not have permission to access this");
  }
};

const updateStudent = async (req, res) => {
  // checking whether is this a student or admin
  const validateStudent = localStorage.getItem("isStudent");
  const validateAdmin = localStorage.getItem("isAdmin");

  if(validateStudent === "true" || validateAdmin === "true"){
    const studentID = req.params.id;

    try {
      const student = await Student.findById(studentID);
      if (!student) {
        res.status(404).json("No Student Found");
      }

      const {
        firstName,
        lastName,
        birthday,
        NIC,
        phoneNumber,
        email,
        school,
        grade,
        medium,
        parentName,
        parentPhoneNumber,
        parentEmail,
        studentGender,
        parentAddress,
        parentOccupation,
        imageURL,
        subject,
        teacher,
        OL_Year,
        AL_Year,
        username,
        password,
      } = req.body;

      const updatedStudent = await Student.findByIdAndUpdate(studentID, {
        firstName,
        lastName,
        birthday,
        NIC,
        phoneNumber,
        email,
        school,
        grade,
        medium,
        parentName,
        parentPhoneNumber,
        parentEmail,
        studentGender,
        parentAddress,
        parentOccupation,
        imageURL,
        subject,
        teacher,
        OL_Year,
        AL_Year,
        username,
        password,
      });

      res.status(200).json(updatedStudent);
    } catch (err) {
      res.status(400).send({ message: err });
    }
  } else {
    return res.status(403).json("You do not have permission to access this");
  }
};

const deleteStudent = async (req, res) => {
  // checking whether is this a student or admin
  const validateStudent = localStorage.getItem("isStudent");
  const validateAdmin = localStorage.getItem("isAdmin");

  if(validateStudent === "true" || validateAdmin === "true"){
    const studentID = req.params.id;

    try {
      const student = await Student.findById(studentID);

      if (!student) {
        res.status(404).json("Student Not Found");
      }

      const deletedStudent = await Student.findByIdAndDelete(studentID);
      res.status(200).json(deletedStudent);
    } catch (err) {
      res.status(400).json(err.message);
    }
  } else {
    return res.status(403).json("You do not have permission to access this");
  }
};

const getOneStudent = async (req, res) => {
  // checking whether is this a student or admin
  const validateStudent = localStorage.getItem("isStudent");
  const validateAdmin = localStorage.getItem("isAdmin");

  if(validateStudent === "true" || validateAdmin === "true"){
    try {
      const student = await Student.findOne({ _id: req.params.id });

      if (!student) {
        res.status(404).json("Student Not Found");
      }
      res.status(200).json(student);
    } catch (err) {
      res.status(400).json(err.message);
    }
  } else {
    return res.status(403).json("You do not have permission to access this");
  }
};

module.exports = {
  addStudent,
  getStudents,
  updateStudent,
  deleteStudent,
  getOneStudent,
};
