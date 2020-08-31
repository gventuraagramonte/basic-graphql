const { ObjectId } = require("mongodb");
const connectDb = require("./db");
const mongodb = require("mongodb");
const errorHanlder = require("./errorHandler");

module.exports = {
  createCourse: async (root, { input }) => {
    const defaults = {
      teacher: "",
      topic: "",
    };

    const newCourse = Object.assign(defaults, input);

    let db;
    let course;
    try {
      db = await connectDb();
      course = await db.collection("courses").insertOne(newCourse);
      newCourse._id = course.insertedId;
    } catch (error) {
      errorHanlder(error);
    }

    return newCourse;
  },
  createPerson: async (root, { input }) => {
    const defaults = {
      phone: "",
      avatar: "",
    };

    const newStudent = Object.assign(defaults, input);

    let db;
    let student;
    try {
      db = await connectDb();
      student = await db.collection("students").insertOne(newStudent);
      newStudent._id = student.insertedId;
    } catch (error) {
      errorHanlder(error);
    }

    return newStudent;
  },
  editCourse: async (root, { _id, input }) => {
    let db;
    let course;
    try {
      db = await connectDb();
      course = db
        .collection("courses")
        .updateOne({ _id: mongodb.ObjectId(_id) }, { $set: input });
      course = await db
        .collection("courses")
        .findOne({ _id: mongodb.ObjectId(_id) });
    } catch (error) {
      errorHanlder(error);
    }

    return course;
  },
  editPerson: async (root, { _id, input }) => {
    let db;
    let student;
    try {
      db = await connectDb();
      student = db
        .collection("students")
        .updateOne({ _id: mongodb.ObjectId(_id) }, { $set: input });
      student = await db
        .collection("students")
        .findOne({ _id: mongodb.ObjectId(_id) });
    } catch (error) {
      errorHanlder(error);
    }

    return student;
  },
  addPeople: async (root, { courseID, personID }) => {
    let db;
    let person;
    let course;
    try {
      db = await connectDb();
      course = await db
        .collection("courses")
        .findOne({ _id: mongodb.ObjectId(courseID) });

      person = await db
        .collection("students")
        .findOne({ _id: mongodb.ObjectId(personID) });

      if (!course || !person)
        throw new Error("La persona o el curso no existe");

      await db.collection("courses").updateOne(
        {
          _id: mongodb.ObjectId(courseID),
        },
        { $addToSet: { people: mongodb.ObjectId(personID) } }
      );
    } catch (error) {
      errorHanlder(error);
    }
    return course;
  },
};
