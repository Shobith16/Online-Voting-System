import React from 'react';
import api from '../../api/axios';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import Popup from '../../components/Popup';

const Reele = () => {
    const [popup, setPopup] = React.useState({ isOpen: false, type: 'info', message: '' });

    const handleReset = async () => {
        if (!window.confirm("CRITICAL: This will delete all voting history and reset candidate counts to zero. This action CANNOT be undone. Are you sure?")) return;
        
        try {
            await api.delete('/clearVoters');
            setPopup({ isOpen: true, type: 'success', message: 'Election data reset successfully!' });
        } catch (err) {
            setPopup({ isOpen: true, type: 'error', message: 'Reset failed' });
        }
    };

    return (
        <div className="reset-wrapper">
             <div className="admin-header">
                <h1>Reset Election</h1>
                <p className="subtitle">Clear all results and prepare for a new voting cycle</p>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="auth-card neumorphic" style={{ textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                <div style={{ padding: '2rem', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', display: 'inline-block', marginBottom: '2rem' }}>
                    <AlertTriangle size={48} color="#ef4444" />
                </div>
                <h2 style={{ color: '#ef4444' }}>Danger Zone</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    Resetting the election will permanently clear all "Voted" flags and set all candidate vote counts to 0. 
                </p>
                <button onClick={handleReset} className="auth-btn neumorphic-btn" style={{ background: '#ef4444', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.8rem' }}>
                    <RefreshCw size={20} /> Reset All Election Data
                </button>
            </motion.div>

            <Popup isOpen={popup.isOpen} onClose={() => setPopup({ ...popup, isOpen: false })} type={popup.type} message={popup.message} />
        </div>
    );
};

export default Reele;