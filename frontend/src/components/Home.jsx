import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Home.css';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [candidates, setCandidates] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const navigate = useNavigate();
  const v_id = localStorage.getItem('Voter_id');
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch candidates details
        const candidatesResponse = await axios.get('http://localhost:5000/candidates_details');
        const fetchedCandidates = candidatesResponse.data;

        // Fetch all user details
        const userResponse = await axios.get('http://localhost:5000/user');
        
        const user = userResponse.data.find(userData => userData.v_id === v_id);

        // Filter candidates for each user based on their Taluk
        const filteredCandidates = fetchedCandidates.filter(candidate => candidate.Taluk.toLowerCase() === user.Taluk.toLowerCase());

        // Set the filtered candidates state
        setCandidates(filteredCandidates);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Function to handle vote
  const handleVote = async (candidateId, candidate) => {
    try {
      if (!hasVoted) {
        // Update the candidate's vote count
        candidate.Vote += 1;

        // Send the updated candidate details to the backend
        await axios.put(`http://localhost:5000/candidates/${candidateId}`, candidate);
        console.log(candidate.Vote);

        // Update the candidates array state
        const updatedCandidates = candidates.map(c => c._id === candidateId ? { ...c, Vote: candidate.Vote } : c);
        setCandidates(updatedCandidates);

        // Set hasVoted to true
        setHasVoted(true);

        // Show popup message
        alert('Vote successful!');
        const response2 = await axios.post('http://localhost:5000/finishedvotinglist',{
          v_id,
        })
        navigate('/login')
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  return (
    <div className="homecontainer">
      <center><h1>Welcome!</h1></center>
      <div className="candidates">
        {candidates.map(candidate => (
          <div className="candidate" key={candidate._id}>
            <div className="image">
              <h1 className="party">{candidate.Party}</h1>
              <img src={logo} alt="no_party_img" />
            </div>
            <div className="details">
              <h2 className="candidatename">{candidate.Candidate}</h2>
              <h3 className="location">Taluk: {candidate.Taluk}</h3>
              <button className="vote" onClick={() => handleVote(candidate._id, candidate)} disabled={hasVoted}>Vote</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
