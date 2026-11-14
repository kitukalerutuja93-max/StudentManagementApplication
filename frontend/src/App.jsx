
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {

  const API_URL = "http://127.0.0.1:8000/api/students/";

  const [students, setStudents] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
    course: ""
  });

  const [editId, setEditId] = useState(null);

  // Get all students
  const getStudents = async () => {
    try {
      const response = await axios.get(API_URL);
      setStudents(response.data);
    } catch (error) {
      console.log("Error fetching students:", error);
    }
  };

  // Load students when page opens
  useEffect(() => {
    getStudents();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Add or Update student
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      if (editId) {
        await axios.put(`${API_URL}${editId}/`, form);
        alert("Student updated successfully!");
      } 
      else {
        await axios.post(API_URL, form);
        alert("Student added successfully!");
      }

      setForm({
        name: "",
        email: "",
        age: "",
        course: ""
      });

      setEditId(null);

      getStudents();

    } catch (error) {
      console.log(error);
      alert("Something went wrong!");
    }
  };

  // Edit student
  const handleEdit = (student) => {

    setForm({
      name: student.name,
      email: student.email,
      age: student.age,
      course: student.course
    });

    setEditId(student.id);
  };

  // Delete student
  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (confirmDelete) {

      try {
        await axios.delete(`${API_URL}${id}/`);

        alert("Student deleted successfully!");

        getStudents();

      } catch (error) {
        console.log(error);
      }
    }
  };

  return (

    <div className="container">

      <h1>Student Management System</h1>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="name"
          placeholder="Enter Student Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="age"
          placeholder="Enter Age"
          value={form.age}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="course"
          placeholder="Enter Course"
          value={form.course}
          onChange={handleChange}
          required
        />

        <button type="submit">
          {editId ? "Update Student" : "Add Student"}
        </button>

      </form>

      <h2>Student Records</h2>

      <table>

        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Course</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {students.map((student) => (

            <tr key={student.id}>

              <td>{student.id}</td>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.age}</td>
              <td>{student.course}</td>

              <td>
                <button onClick={() => handleEdit(student)}>
                  Edit
                </button>

                <button onClick={() => handleDelete(student.id)}>
                  Delete
                </button>
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );
}

export default App;