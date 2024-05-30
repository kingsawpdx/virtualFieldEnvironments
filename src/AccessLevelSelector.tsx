import React from 'react';

interface AccessLevelSelectorProps {
  accessLevel: number;
  updateAccessLevel: (newLevel: number) => void;
}

const AccessLevelSelector: React.FC<AccessLevelSelectorProps> = ({ accessLevel, updateAccessLevel }) => {
  return (
    <>
      <select
        value={accessLevel}
        onChange={(e) => { updateAccessLevel(Number(e.target.value)); }}
      >
        <option value="-1">No Access</option>
        <option value="0">Level 0</option>
        <option value="1">Level 1</option>
        <option value="2">Level 2</option>
        <option value="3">Level 3</option>
      </select>
      <p>Current Access Level: {accessLevel}</p>
    </>
  );
};

export default AccessLevelSelector;