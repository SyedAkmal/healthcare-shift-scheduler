import React, { useState } from 'react';

const AdminAddStaff: React.FC = () => {
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !role) {
            setError('Please fill in all fields');
            return;
        }
        // Here you would typically send the data to your backend
        console.log('New staff added:', { name, role });
        setName('');
        setRole('');
        setError('');
    };

    return (
        <div>
            <h2>Add New Staff</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label>Role:</label>
                    <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Add Staff</button>
            </form>
        </div>
    );
};

export default AdminAddStaff;