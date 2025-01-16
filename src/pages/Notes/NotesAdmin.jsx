import React, { useState } from "react";
import axios from "axios";
import "./NotesAdmin.css";


const NotesAdmin = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginDetails, setLoginDetails] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [semester, setSemester] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isAddSubjectVisible, setIsAddSubjectVisible] = useState(false);

  const [moduleNo, setModuleNo] = useState("");
  const [moduleName, setModuleName] = useState("");
  const [pdfLink, setPdfLink] = useState("");

  const [newSubject, setNewSubject] = useState({
    branch: "",
    semester: "",
    subject: ""
  });

  const hodCredentials = [
    { email: "cs@college.com", password: "cs123", branch: "CS" },
    { email: "ec@college.com", password: "ec123", branch: "EC" },
    { email: "eee@college.com", password: "eee123", branch: "EEE" },
    { email: "ce@college.com", password: "ce123", branch: "CE" },
    { email: "at@college.com", password: "at123", branch: "AT" },
    { email: "ch@college.com", password: "ch123", branch: "CH" },
    { email: "me@college.com", password: "me123", branch: "ME" },
    { email: "po@college.com", password: "po123", branch: "PO" },
    { email: "pratyush@gmail.com", password: "pratyush" }
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    const hod = hodCredentials.find(
      (cred) =>
        cred.email === loginDetails.email && cred.password === loginDetails.password
    );

    if (loginDetails.email === "pratyush@gmail.com") {
      window.location.href = "/notes/login";
      return;
    }

    if (hod) {
      setIsLoggedIn(true);
      setErrorMessage("");
      setNewSubject({ ...newSubject, branch: hod.branch });
    } else {
      setErrorMessage("Invalid email or password. Please try again.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginDetails({ email: "", password: "" });
    setSemester("");
    setSubjects([]);
    setModules([]);
    setIsDataFetched(false);
    setErrorMessage("");
  };

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/subjects`, {
        params: { branch: newSubject.branch, semester },
      });
      setSubjects(response.data);
      setIsDataFetched(true);
      setErrorMessage("");
    } catch (error) {
      console.error("Error fetching subjects:", error);
      setErrorMessage("Failed to fetch subjects. Please try again.");
    }
  };

  const fetchModules = async (subjectName) => {
    try {
      const response = await axios.get(`${baseUrl}/api/unit`, {
        params: { branch: newSubject.branch, semester, subject: subjectName },
      });
      setModules(response.data);
      setErrorMessage("");
    } catch (error) {
      console.error("Error fetching modules:", error);
      setErrorMessage("Failed to fetch modules. Please try again.");
    }
  };

  const handleShowSubjects = () => {
    if (!semester) {
      setErrorMessage("Please select Semester to continue.");
      setIsDataFetched(false);
    } else {
      fetchSubjects();
      setIsAddSubjectVisible(true);
    }
  };

  const deleteSubject = async (subjectId) => {
    try {
      await axios.delete(`${baseUrl}/api/subjects/${subjectId}`);
      setSubjects(subjects.filter((subject) => subject.id !== subjectId));
      setErrorMessage("");
    } catch (error) {
      console.error("Error deleting subject:", error);
      setErrorMessage("Failed to delete subject. Please try again.");
    }
  };

  const deleteUnit = async (unitId) => {
    try {
      await axios.delete(`${baseUrl}/api/unit/${unitId}`);
      setModules(modules.filter((module) => module.id !== unitId));
      setErrorMessage("");
    } catch (error) {
      console.error("Error deleting unit:", error);
      setErrorMessage("Failed to delete unit. Please try again.");
    }
  };

  const addUnit = async () => {
    try {
      const unitData = {
        branch: newSubject.branch,
        semester,
        subject: selectedSubject.subject,
        moduleNo,
        moduleName,
        pdfLink,
      };
      const response = await axios.post(`${baseUrl}/api/unit`, unitData);
      setModules([...modules, response.data]);
      setModuleNo("");
      setModuleName("");
      setPdfLink("");
      setErrorMessage("");
    } catch (error) {
      console.error("Error adding unit:", error);
      setErrorMessage("Failed to add unit. Please try again.");
    }
  };

  const handleMoreClick = (subject) => {
    if (selectedSubject === subject) {
      setDropdownVisible(!dropdownVisible);
    } else {
      setSelectedSubject(subject);
      setDropdownVisible(true);
      fetchModules(subject.subject);
    }
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    try {
      const subjectData = { ...newSubject, semester };
      const response = await axios.post(`${baseUrl}/api/subjects`, subjectData);
      setSubjects([...subjects, response.data]);
      setNewSubject({
        branch: newSubject.branch,
        semester: semester,
        subject: "",
      });
      setErrorMessage("");
      setIsAddSubjectVisible(true);
    } catch (error) {
      console.error("Error adding subject:", error);
      setErrorMessage("Failed to add subject. Please try again.");
    }
  };

  const handleSemesterClick = (sem) => {
    setSemester(sem);
    setNewSubject({ ...newSubject, semester: sem });
  };

  return (
    <div className="note-container">
      {!isLoggedIn ? (
        <div className="login-page">
          <h2 className="login-title">Login</h2>
          <form onSubmit={handleLogin} className="login-form">
            <input
              type="email"
              placeholder="Enter your email"
              value={loginDetails.email}
              onChange={(e) => setLoginDetails({ ...loginDetails, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Enter your password"
              value={loginDetails.password}
              onChange={(e) => setLoginDetails({ ...loginDetails, password: e.target.value })}
              required
            />
            <button type="submit" className="login-btn">Login</button>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
          </form>
        </div>
      ) : (
        <div>
          <div className="admin-panel">
            <span className="admin-title">NOTES PAGE</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>

          <div className="semester-container">
            <h2 className="semester-title">Select Semester</h2>
            <div className="semester-buttons">
              {["Sem1", "Sem2", "Sem3", "Sem4", "Sem5"].map((sem) => (
                <button
                  key={sem}
                  onClick={() => handleSemesterClick(sem)}
                  className={`semester-button ${semester === sem ? "selected" : ""}`}
                >
                  {sem}
                </button>
              ))}
            </div>
          </div>

          <div className="action-buttons">
            <button onClick={handleShowSubjects} className="show-subjects-btn">
              Show Subjects
            </button>
          </div>

          {errorMessage && <div className="error-message">{errorMessage}</div>}

          {isDataFetched && (
            <div className="subjects-container">
              <h2 className="subjects-title">Available Subjects</h2>
              <ul className="subjects-list">
                {subjects.length > 0 ? (
                  subjects.map((subject) => (
                    <li key={subject.id} className="subject-item">
                      {subject.subject}
                      <button
                        onClick={() => handleMoreClick(subject)}
                        className="subject-more-btn"
                      >
                        More
                      </button>
                      <button
                        onClick={() => deleteSubject(subject.id)}
                        className="noteslogin-delete-unit-btn"
                      >
                        Delete
                      </button>
                      {dropdownVisible && selectedSubject === subject && (
                       
                       <div className="modules-dropdown">
                       <h3>Units for {subject.subject}</h3>
                       <table className="module-table">
                            <thead>
                              <tr>
                                <th>Module No</th>
                                <th>Module Name</th>
                                <th>PDF Link</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {modules.length > 0 ? (
                                modules.map((module, index) => (
                                  <tr key={index}>
                                    <td>{module.moduleNo}</td>
                                    <td>{module.moduleName}</td>
                                    <td>
                                      <a
                                        href={module.pdfLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        View PDF
                                      </a>
                                    </td>
                                    <td>
                                      <button
                                        onClick={() => deleteUnit(module.id)}
                                        className="noteslogin-delete-unit-btn"
                                      >
                                        Delete
                                      </button>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="4">No modules found</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                       <div className="add-unit-container">
                         <h4>Add Unit</h4>
                         <form onSubmit={(e) => { e.preventDefault(); addUnit(); }}>
                           <input
                             type="text"
                             placeholder="Unit No"
                             value={moduleNo}
                             onChange={(e) => setModuleNo(e.target.value)}
                             required
                           />
                           <input
                             type="text"
                             placeholder="Unit Name"
                             value={moduleName}
                             onChange={(e) => setModuleName(e.target.value)}
                             required
                           />
                           <input
                             type="text"
                             placeholder="PDF Link"
                             value={pdfLink}
                             onChange={(e) => setPdfLink(e.target.value)}
                             required
                           />
                           <button type="submit" className="add-unit-btn">Add Unit</button>
                         </form>
                       </div>
                     </div>
                   )}
                 </li>
               ))
             ) : (
               <li>No subjects available</li>
             )}
           </ul>
         </div>
       )}

{isAddSubjectVisible && (
  <div className="add-subject-container">
    <h2 className="add-subject-title">Add New Subject</h2>
    <form onSubmit={handleAddSubject} className="add-subject-form">
    <input
        type="text"
        placeholder="Subject Name"
        value={newSubject.subject}
        onChange={(e) => setNewSubject({ ...newSubject, subject: e.target.value })}
        required
      />
      <input
        type="text"
        value={newSubject.branch}
        readOnly
        placeholder="Branch"
        className="read-only-input"
      />
      <input
        type="text"
        value={newSubject.semester}
        readOnly
        placeholder="Semester"
        className="read-only-input"
      />
     
      <button type="submit" className="add-subject-btn">Add Subject</button>
    </form>
  </div>
)}

     </div>
   )}
 </div>
);
};

export default NotesAdmin;
