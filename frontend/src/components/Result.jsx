import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import '../styles/Result.css';
import districtsData from '../json/district.json';

Chart.register(CategoryScale);

function Result() {
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "votes",
        data: [],
        backgroundColor: ["rgba(75,192,192,1)", "#ecf0f1", "#50AF95", "#f3ba2f", "#2a71d0"],
        borderColor: "black",
        borderWidth: 1
      }
    ]
  });

  useEffect(() => {
    setDistricts(districtsData);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/candidates_details`);
        const filteredCandidates = response.data.filter(candidate => candidate.District.toLowerCase() === selectedDistrict.toLowerCase());
        setCandidates(filteredCandidates);
      } catch (error) {
        console.error('Error fetching candidates:', error);
      }
    };

    fetchData();
  }, [selectedDistrict]);

  useEffect(() => {
    setChartData({
      ...chartData,
      labels: candidates.map(candidate => candidate.Candidate),
      datasets: [
        {
          ...chartData.datasets[0],
          data: candidates.map(candidate => candidate.Vote)
        }
      ]
    });
  }, [candidates]);

  return (
    <div className="resdiv">
      <select className="select-district" value={selectedDistrict} onChange={e => setSelectedDistrict(e.target.value)}>
        <option value="">Select District</option>
        {districts.map(district => (
          <option key={district} value={district}>{district}</option>
        ))}
      </select>
      <div className="chart-container">
        <h2 style={{ textAlign: "center" }}>Pie Chart</h2>
        <Pie
          data={chartData}
          options={{
            plugins: {
              title: {
                display: true,
                text: "Votes"
              }
            }
          }}
        />
      </div>
    </div>
  );
}

export default Result;
