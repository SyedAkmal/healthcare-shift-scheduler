export interface Staff {
    id: number;
    name: string;
    role: string;
    email: string;
    phone: string;
}

export interface Shift {
    id: number;
    staffId: number;
    date: string;
    startTime: string;
    endTime: string;
}

export interface Attendance {
    id: number;
    staffId: number;
    date: string;
    status: 'present' | 'absent' | 'leave';
}