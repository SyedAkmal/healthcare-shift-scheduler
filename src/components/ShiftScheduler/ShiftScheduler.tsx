import React, { useState, useEffect } from 'react';

const ShiftScheduler = () => {
    const [shifts, setShifts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch shifts from an API or a local source
        const fetchShifts = async () => {
            // Simulating an API call
            const response = await fetch('/api/shifts');
            const data = await response.json();
            setShifts(data);
            setLoading(false);
        };

        fetchShifts();
    }, []);

    const updateShift = (shiftId, updatedShift) => {
        // Logic to update the shift
        setShifts(prevShifts => 
            prevShifts.map(shift => 
                shift.id === shiftId ? { ...shift, ...updatedShift } : shift
            )
        );
    };

    if (loading) {
        return <div>Loading shifts...</div>;
    }

    return (
        <div>
            <h2>Shift Scheduler</h2>
            <ul>
                {shifts.map(shift => (
                    <li key={shift.id}>
                        <span>{shift.staffName} - {shift.date} - {shift.time}</span>
                        <button onClick={() => updateShift(shift.id, { time: 'Updated Time' })}>
                            Update Shift
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ShiftScheduler;