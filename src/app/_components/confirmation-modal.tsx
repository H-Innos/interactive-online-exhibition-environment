import React from "react";

interface ConfirmationModalProps {
    isOpen: boolean;
    onSaveAndExit: () => void;
    onDontSaveAndExit: () => void;
    onCancel: () => void;
  }
  
  const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onSaveAndExit, onDontSaveAndExit, onCancel }) => {
    if (!isOpen) return null;
  
    return (
      <div className="modal">
        <h2>Unsaved Changes</h2>
        <p>You have unsaved changes. Are you sure you want to leave? All unsaved changes will be lost.</p>
        <button onClick={onSaveAndExit}>Save changes and leave</button>
        <button onClick={onDontSaveAndExit}>Don`&apos;`t save changes and leave</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    );
  };

export default ConfirmationModal;