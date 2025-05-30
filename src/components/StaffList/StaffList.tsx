import React, { useEffect, useState } from 'react';
import { Staff } from '../../types';

const StaffList: React.FC = () => {
    const [staffMembers, setStaffMembers] = useState<Staff[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStaffMembers = async () => {
            try {
                const response = await fetch('/api/staff'); // Adjust the API endpoint as necessary
                if (!response.ok) {
                    throw new Error('Failed to fetch staff members');
                }
                const data: Staff[] = await response.json();
                setStaffMembers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStaffMembers();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Staff List</h2>
            <ul>
                {staffMembers.map(staff => (
                    <li key={staff.id}>
                        {staff.name} - {staff.position}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StaffList;