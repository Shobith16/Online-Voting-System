import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, HelpCircle } from 'lucide-react';
import '../styles/Popup.css';

const Popup = ({ isOpen, onClose, onConfirm, type = 'info', message, showCancel = false }) => {
  const icons = {
    success: <CheckCircle className="icon-success" size={24} />,
    error: <AlertCircle className="icon-error" size={24} />,
    info: <Info className="icon-info" size={24} />,
    confirm: <HelpCircle className="icon-confirm" size={24} />,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="popup-overlay">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            className="popup-content neumorphic"
          >
            <button className="popup-close" onClick={onClose}>
              <X size={20} />
            </button>
            <div className="popup-body">
              <div className={`popup-icon-container ${type}`}>
                {icons[type]}
              </div>
              <p className="popup-message">{message}</p>
              
              <div className="popup-actions">
                {showCancel && (
                  <button className="popup-btn cancel neumorphic-btn" onClick={onClose}>
                    Cancel
                  </button>
                )}
                <button 
                  className={`popup-btn confirm neumorphic-btn ${type === 'confirm' ? 'primary' : ''}`} 
                  onClick={onConfirm || onClose}
                >
                  {type === 'confirm' ? 'Confirm Vote' : 'Close'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Popup;
