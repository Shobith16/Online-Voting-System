import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { TrendingUp, PieChart as PieIcon } from 'lucide-react';
import '../../styles/Admin.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Result = () => {
    const [candidates, setCandidates] = useState([]);
    const [chartData, setChartData] = useState({
        datasets: [],
    });

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await api.get('/candidates');
                setCandidates(response.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchResults();
    }, []);

    useEffect(() => {
        setChartData({
            labels: candidates.map(c => c.Candidate),
            datasets: [
                {
                    label: 'Votes Earned',
                    data: candidates.map(c => c.Vote),
                    backgroundColor: [
                        'rgba(99, 102, 241, 0.7)',
                        'rgba(139, 92, 246, 0.7)',
                        'rgba(244, 63, 94, 0.7)',
                        'rgba(234, 179, 8, 0.7)',
                        'rgba(16, 185, 129, 0.7)',
                    ],
                    borderColor: '#1f1f23',
                    borderWidth: 2,
                    borderRadius: 10,
                }
            ]
        });
    }, [candidates]);

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                labels: { color: '#f5f5f7', font: { family: 'Inter', weight: 600 } }
            },
        },
        scales: {
            y: { ticks: { color: '#a1a1aa' }, grid: { color: 'rgba(255,255,255,0.05)' } },
            x: { ticks: { color: '#a1a1aa' }, grid: { display: false } }
        }
    };

    return (
        <div className="results-wrapper">
             <div className="admin-header">
                <h1>Election Statistics</h1>
                <p className="subtitle">Visual representation of the ongoing mandate</p>
            </div>

            <div className="admin-grid" style={{ gridTemplateColumns: '2fr 1.2fr' }}>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="neumorphic stat-card" style={{ padding: '2.5rem' }}>
                    <div className="detail-row" style={{ marginBottom: '2rem' }}>
                        <TrendingUp size={24} className="logo-icon" /> 
                        <span style={{ fontWeight: 800 }}>Vote Distribution by Candidate</span>
                    </div>
                    {chartData.labels && <Bar data={chartData} options={chartOptions} />}
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="neumorphic stat-card" style={{ padding: '2.5rem' }}>
                     <div className="detail-row" style={{ marginBottom: '2rem' }}>
                        <PieIcon size={24} className="logo-icon" /> 
                        <span style={{ fontWeight: 800 }}>Market Share</span>
                    </div>
                    {chartData.labels && <Pie data={chartData} options={{ ...chartOptions, scales: {} }} />}
                </motion.div>
            </div>
        </div>
    );
};

export default Result;
