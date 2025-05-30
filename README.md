# Healthcare Shift Scheduler

A modern web application for managing healthcare worker shifts and schedules efficiently.

## Tech Stack

- **React 18**: Modern UI library for building user interfaces
- **Redux Toolkit**: State management with simplified Redux configuration
- **React Router DOM**: Navigation and routing
- **Bootstrap**: Responsive UI components and styling
- **Axios**: HTTP client for API requests

## Features

- User authentication and authorization
- Shift management and scheduling
- Calendar view of schedules
- Staff management
- Real-time updates
- Responsive design for mobile and desktop

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm (comes with Node.js)

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd healthcare-shift-scheduler
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at http://localhost:3000 (or another port if 3000 is in use)

## Available Scripts

- `npm start`: Run the development server
- `npm test`: Run tests
- `npm run build`: Create production build
- `npm run eject`: Eject from Create React App (one-way operation)

## Project Structure

```
healthcare-shift-scheduler/
├── src/
│   ├── app/              # Application setup, store configuration
│   ├── components/       # Reusable components
│   ├── features/         # Feature-based modules
│   ├── pages/           # Page components
│   ├── services/        # API services
│   ├── utils/           # Utility functions
│   └── styles/          # Global styles
├── public/              # Static files
└── package.json         # Project dependencies and scripts
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the repository or contact the development team.

---

# Squad - 11 Staff Shift Management System

## High-Level Goals
- Staff management with roles, shift preferences, and contact information.
- Shift scheduling with capacity management and real-time slot tracking.
- Daily and weekly schedule visualization.
- Attendance marking with remarks.
- Search and filter functionality across staff, shifts, and dates.
- Conflict detection and alert system for overlapping shift assignments.

---

## Tech Stack
- **Frontend:** React.js + Bootstrap  
- **Backend:** Node.js + Express  
- **Database:** MongoDB  
- **State Management:** Redux  
- **Authentication:** JWT  
- **Calendar UI:** FullCalendar  

---

## Frontend Screens
- Admin Login  
- Staff List Management  
- Shift Scheduler  
- Calendar Screen  
- Mark Attendance  

---

## Modules Breakdown

### 1. Staff Management Module
**Features:**  
- Add/Edit/Delete staff  
- Fields: Name, Staff ID, Role, Shift preference, Contact number  
- Searchable, sortable table view  

**Backend APIs:**  
- `POST /staff/` - Create staff  
- `GET /staff/?search=&sort=&filter=` - List staff with search, sort, filter  
- `PUT /staff/{id}/` - Update staff  
- `DELETE /staff/{id}/` - Delete staff  

---

### 2. Shift Scheduler Module
**Features:**  
- Create configurable shifts (Morning, Afternoon, Night)  
- Define capacity for each shift  
- Assign/unassign staff to shifts  
- View real-time slot tracking  

**Backend APIs:**  
- `POST /shifts/` - Create shift per day  
- `POST /shifts/{shift_id}/assign/` - Assign staff to shift  
- `GET /shifts/{date}/` - View shifts and assignments  
- `GET /shifts/capacity-status/` - Get current shift capacities  

**Real-Time Updates:**  
- Use WebSocket for live slot tracking and dashboard updates  

---

### 3. Daily/Weekly Schedule View
**Features:**  
- Calendar/Table view with shift color codes  
- Dropdown/radio button for switching shift types  
- Visual indicators for unassigned or overbooked shifts  

**Frontend:**  
- Integrate FullCalendar in week/day view  

**Color Codes:**  
- Morning – Yellow  
- Afternoon – Blue  
- Night – Purple  
- Unassigned – Red Border or Badge  

---

### 4. Attendance Marking
**Features:**  
- Admin marks attendance during or after shift  
- Options: Present, Absent  
- Remarks field (e.g., "Sick Leave")  
- Time-restricted update window (e.g., within 1 hour after shift ends)  

**Backend APIs:**  
- `POST /attendance/{shift_assignment_id}/` - Mark attendance  
- `PATCH /attendance/{shift_assignment_id}/` - Update attendance  

---

### 5. Search and Filter Module
**Features:**  
- Filter by Staff name, Role, Date range, Shift type, Attendance status  

**Frontend:**  
- Dynamic filters with dropdowns, date pickers, and search box  

**Backend APIs:**  
- `GET /search/?name=&role=&date_from=&date_to=&shift=` - Search with filters  

---

### 6. Shift Conflict Alerts
**Features:**  
- Alert if staff is assigned to more than one shift per day  
- Prevent assignment or show red alert box in UI  
- Daily conflict validation logic  

**Backend Validation:**  
- Check conflicts during shift assignment API calls  

---

## Database Schemas

### Staff
| Field          | Type       |
|----------------|------------|
| id             | ObjectId   |
| name           | String     |
| staffId        | String     |
| role           | String     |
| shiftPreference| String     |
| contactNumber  | String     |
| department     | String     |
| createdAt      | Timestamp  |
| updatedAt      | Timestamp  |

---

### Shift
| Field         | Type       |
|---------------|------------|
| id            | ObjectId   |
| date          | Date       |
| shiftType     | String     |
| capacity      | Number     |
| createdBy     | ObjectId   |
| createdAt     | Timestamp  |
| updatedAt     | Timestamp  |

---

### ShiftAssignment
| Field       | Type       |
|-------------|------------|
| id          | ObjectId   |
| shift       | ObjectId   |
| staff       | ObjectId   |
| status      | String     |
| createdAt   | Timestamp  |
| updatedAt   | Timestamp  |

---

### Attendance
| Field           | Type       |
|-----------------|------------|
| id              | ObjectId   |
| shiftAssignment | ObjectId   |
| staff           | ObjectId   |
| status          | String     |
| remarks         | String     |
| markedAt        | Timestamp  |

---

## Development Milestones

| Phase | Description                                             |
|-------|---------------------------------------------------------|
| 1     | Staff Management - CRUD APIs, frontend table with search/sort |
| 2     | Shift Management - Create shifts, assign staff, capacity tracking, conflict checks |
| 3     | Scheduling Views - Weekly/daily calendar with color codes and real-time updates |
| 4     | Attendance System - Attendance marking form and backend APIs, time-based editing |
| 5     | Search & Filter - Advanced search filters implementation |
| 6     | Conflict Detection - Pre-assignment validation & UI warnings |

---

## Deployment
- **Backend:** Heroku or AWS  
- **Frontend:** Vercel  
- **Database:** MongoDB  

---

## Authentication
- JWT-based authentication for secure access  

---

## Additional Notes
- Real-time shift slot tracking via WebSockets to synchronize multiple admin views  
- Conflict alerts implemented both at backend and frontend levels for reliability  

---

Feel free to contribute or raise issues!

---

**Squad - 11**  
Staff Shift Management System  