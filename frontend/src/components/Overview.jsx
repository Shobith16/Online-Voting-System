import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/overview.css';
// import logo from "../assets/logo.png";

function Overview() {
  const [candidates, setCandidates] = useState([]);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [editedCandidate, setEditedCandidate] = useState({
    Candidate: '',
    Age: '',
    Party: '',
    State: '',
    District: '',
    Taluk: '',
    Vote:'',
  });

  useEffect(() => {
    // Fetch candidate data from the backend API
    axios.get('http://localhost:5000/candidates_details')
      .then(response => {
        setCandidates(response.data);
      })
      .catch(error => {
        console.error('Error fetching candidates:', error);
      });
  }, []);

  const handleEditCandidate = (candidate) => {
    setEditingCandidate(candidate);
    setEditedCandidate(candidate); 
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedCandidate(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSaveCandidate = async () => {
    try {
      // Send PUT request to update candidate details
      console.log(editedCandidate)
      let response = await axios.put(`http://localhost:5000/candidates/${editingCandidate._id}`, editedCandidate);


     
      console.log('Candidate updated successfully:', response.data);
      // Update candidate details in the UI
      setCandidates(prevCandidates => prevCandidates.map(candidate => {
        if (candidate._id === editingCandidate._id) {
          return { ...candidate, ...editedCandidate };
        }
        
        return candidate;
       
      }));

      // Reset editing state
      setEditingCandidate(null);
    } catch (error) {
      console.error('Error updating candidate:', error);
    }
  };

  const handleRemoveCandidate = async (candidateId) => {
    try {
      // Send DELETE request to remove candidate from the database
      await axios.delete(`http://localhost:5000/candidate_del/${candidateId}`);
      
      // Update state to reflect removal of the candidate
      setCandidates(prevCandidates => prevCandidates.filter(candidate => candidate._id !== candidateId));
    } catch (error) {
      console.error('Error removing candidate:', error);
    }
  };

  return (
    <div className="homecontainer2">
      <h1>Candidates!</h1>
      <div className="table-container">
        <table className="candidates1">
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Party</th>
              <th>State</th>
              <th>District</th>
              <th>Taluk</th>
              <th>Vote</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map(candidate => (
              <tr key={candidate._id}>
                {editingCandidate && editingCandidate._id === candidate._id ? (
                  <React.Fragment>
                    <td>
                      <input type="text" name="Candidate" value={editedCandidate.Candidate} onChange={handleInputChange} />
                    </td>
                    <td>
                      <input type="text" name="Party" value={editedCandidate.Party} onChange={handleInputChange} />
                    </td>
                    <td>
                      <input type="text" name="State" value={editedCandidate.State} onChange={handleInputChange} />
                    </td>
                    <td>
                      <input type="text" name="District" value={editedCandidate.District} onChange={handleInputChange} />
                    </td>
                    <td>
                      <input type="text" name="Taluk" value={editedCandidate.Taluk} onChange={handleInputChange} />
                    </td>
                    <td>
                      <input type="number" name="Vote" value={editedCandidate.Vote} onChange={handleInputChange} />
                    </td>
                    <td className="button-group">
                      <button onClick={handleSaveCandidate}>Save</button>
                      <button onClick={() => setEditingCandidate(null)}>Cancel</button>
                    </td>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <td>{candidate.Candidate}</td>
                    <td>{candidate.Party}</td>
                    <td>{candidate.State}</td>
                    <td>{candidate.District}</td>
                    <td>{candidate.Taluk}</td>
                    <td>{candidate.Vote}</td>
                    <td className="button-group">
                      <button onClick={() => handleEditCandidate(candidate)}>Edit</button>
                      <button onClick={() => handleRemoveCandidate(candidate._id)}>Remove</button>
                    </td>
                  </React.Fragment>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  
}  
export default Overview;
