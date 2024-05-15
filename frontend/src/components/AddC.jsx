import React, { useState } from 'react';
import '../styles/AddC.css'
import axios from 'axios';
function AddC() {
  const [form, setForm] = useState({
    Candidate: '',
    Age: '',
    Party: '',
    State: '',
    District: '',
    Taluk: '',
    Vote:'0',
  });
  
  const [errors, setErrors] = useState({});

  const Submit = async (e) => {
    e.preventDefault();

    // Validate form fields
    const newErrors = {};
    if (form.Candidate.trim() === "") {
      newErrors.candidate = "Candidate is required";
    }
    if (isNaN(form.Age) || form.Age.trim() === "") {
      newErrors.Age = "Age is required and must be a number";
    }
    if (form.Party.trim() === "") {
      newErrors.Party = "Party is required";
    }
    if (form.State.trim() === "") {
      newErrors.state = "State is required";
    }
    if (form.District.trim() === "") {
      newErrors.District = "District is required";
    }
    if (form.Taluk.trim() === "") {
      newErrors.Taluk = "Taluk is required";
    }

    // If there are errors, set the errors state and return
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // If there are no errors, submit the form
    try {
      // console.log(candidate,Age,Party,state)
      const response = await axios.post("http://localhost:5000/candidates", form);

      console.log(response.data.message);
      alert(response.data.message)
      // Show a success messAge or navigate to another pAge
    } catch (error) {
      console.error(error);
      // Show an error messAge
    }
  };

  const handleInputChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="outer">
      <div className="addcandidate">
      <form onSubmit={Submit}>
        <label htmlFor="candidate">Candidate:</label>
        <input
          type="text"
          name="Candidate"
          id="Candidate"
          value={form.Candidate}
          onChange={handleInputChange}
        />
        {errors.candidate && <p>{errors.candidate}</p>}

        <label htmlFor="Age">Age:</label>
        <input
          type="number"
          name="Age"
          id="Age"
          value={form.Age}
          onChange={handleInputChange}
        />
        {errors.Age && <p>{errors.Age}</p>}

        <label htmlFor="Party">Party:</label>
        <input
          type="text"
          name="Party"
          id="Party"
          value={form.Party}
          onChange={handleInputChange}
        />
        {errors.Party && <p>{errors.Party}</p>}

        <label htmlFor="state">State:</label>
        <input
          type="text"
          name="State"
          id="State"
          value={form.State}
          onChange={handleInputChange}
        />
        {errors.state && <p>{errors.state}</p>}

        <label htmlFor="District">District:</label>
        <input
          type="text"
          name="District"
          id="District"
          value={form.District}
          onChange={handleInputChange}
        />
        {errors.District && <p>{errors.District}</p>}

        <label htmlFor="Taluk">Taluk:</label>
        <input
          type="text"
          name="Taluk"
          id="Taluk"
          value={form.Taluk}
          onChange={handleInputChange}
        />
        {errors.Taluk && <p>{errors.Taluk}</p>}

        <button type="submit">Register</button>
      </form>
    </div>
    </div>
    
  );
}

export default AddC;