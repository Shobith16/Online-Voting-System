import React, { useState } from 'react';
import api from '../../api/axios';
import { UserPlus, User, Award, MapPin, Calendar, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Popup from '../../components/Popup';

const AddC = () => {
    const [Candidate, setname] = useState('');
    const [Age, setage] = useState('');
    const [Party, setparty] = useState('');
    const [State, setstate] = useState('');
    const [District, setdistrict] = useState('');
    const [Taluk, settaluk] = useState('');
    const [popup, setPopup] = useState({ isOpen: false, type: 'info', message: '' });

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await api.post('/candidates', { Candidate, Age, Party, State, District, Taluk });
            setPopup({ isOpen: true, type: 'success', message: `Candidate ${Candidate} added successfully!` });
            // Clear form
            setname(''); setage(''); setparty(''); setstate(''); setdistrict(''); settaluk('');
        } catch (err) {
            setPopup({ isOpen: true, type: 'error', message: err.response?.data?.message || 'Failed to add candidate' });
        }
    };

    return (
        <div className="add-candidate-wrapper">
            <div className="admin-header">
                <h1>Add New Candidate</h1>
                <p className="subtitle">Register a new candidate for the upcoming election</p>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="auth-card neumorphic" style={{ maxWidth: '700px' }}>
                <form onSubmit={handleAdd} className="signup-grid">
                    <div className="input-group">
                        <User size={18} className="input-icon" />
                        <input type="text" placeholder="Candidate Name" value={Candidate} onChange={(e) => setname(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <Calendar size={18} className="input-icon" />
                        <input type="number" placeholder="Age" value={Age} onChange={(e) => setage(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <Award size={18} className="input-icon" />
                        <input type="text" placeholder="Party Name" value={Party} onChange={(e) => setparty(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <MapPin size={18} className="input-icon" />
                        <input type="text" placeholder="State" value={State} onChange={(e) => setstate(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <MapPin size={18} className="input-icon" />
                        <input type="text" placeholder="District" value={District} onChange={(e) => setdistrict(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <MapPin size={18} className="input-icon" />
                        <input type="text" placeholder="Taluk" value={Taluk} onChange={(e) => settaluk(e.target.value)} required />
                    </div>
                    
                    <button type="submit" className="auth-btn neumorphic-btn full-width" style={{ marginTop: '1.5rem' }}>
                        <CheckCircle size={18} /> Register Candidate
                    </button>
                </form>
            </motion.div>

            <Popup isOpen={popup.isOpen} onClose={() => setPopup({ ...popup, isOpen: false })} type={popup.type} message={popup.message} />
        </div>
    );
};

export default AddC;