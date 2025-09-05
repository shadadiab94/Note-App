import { useState } from 'react';
import { useUser } from '../../context/UserContext';
import './UserModal.css';

interface UserModalProps {
  users: string[];
  onAddUser: (newUserId: string) => void;
  onClose: () => void;
}

export default function UserModal({ users, onAddUser, onClose }: UserModalProps) {
  const { setCurrentUser } = useUser();
  const [newUserId, setNewUserId] = useState('');

  const handleCreateUser = () => {
    const trimmed = newUserId.trim();
    if (trimmed && !users.includes(trimmed)) {
      onAddUser(trimmed);
      setCurrentUser(trimmed);
      setNewUserId('');
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="user-modal">
        <h2>Select User</h2>
        <ul className="user-list">
          {users.map((user) => (
            <li key={user}>
              <button onClick={() => {
                setCurrentUser(user);
                onClose();
              }}>{user}</button>
            </li>
          ))}
        </ul>

        <div className="new-user">
          <input
            type="text"
            value={newUserId}
            onChange={(e) => setNewUserId(e.target.value)}
            placeholder="New user name"
          />
          <button onClick={handleCreateUser}>Add</button>
        </div>

        <button className="close-btn" onClick={onClose}>✖ Close</button>
      </div>
    </div>
  );
}
