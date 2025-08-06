# MOC Alumni Database

A full-stack web application for the Men of Color (MOC) organization to connect current members with alumni for mentorship, networking, and guidance.

## Features

### Core Features
- **Homepage**: Explains MOC and the purpose of the alumni database
- **Alumni Directory**: Searchable and filterable directory of all alumni
- **Admin Panel**: Secure admin access to manage alumni data
- **Responsive Design**: Mobile-friendly interface

### Alumni Information
- Full name
- Email address
- Graduation year
- Current college
- College major
- Profession (optional)
- LinkedIn URL (optional)

### Search & Filtering
- Search by name, email, college, or major
- Filter by graduation year
- Filter by college
- Filter by major
- Sort by various fields

### Admin Features
- Add new alumni entries
- Edit existing alumni information
- Delete alumni entries
- Secure login system
- JWT-based authentication

## Tech Stack

### Backend
- **Node.js** with Express.js
- **SQLite** database
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** enabled for cross-origin requests

### Frontend
- **React.js** with functional components and hooks
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Axios** for API calls

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MOC_alumni
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend development server (port 3000).

### Manual Setup

If you prefer to set up the servers separately:

#### Backend Setup
```bash
cd server
npm install
npm run dev
```

#### Frontend Setup
```bash
cd client
npm install
npm start
```

## Default Admin Credentials

- **Username**: `admin`
- **Password**: `admin123`

**Important**: Change these credentials after your first login for security.

## API Endpoints

### Public Endpoints
- `GET /api/alumni` - Get all alumni (with optional query parameters)
- `GET /api/filters` - Get filter options (years, colleges, majors)
- `GET /api/alumni/:id` - Get specific alumni

### Admin Endpoints (Require Authentication)
- `POST /api/login` - Admin login
- `POST /api/alumni` - Add new alumni
- `PUT /api/alumni/:id` - Update alumni
- `DELETE /api/alumni/:id` - Delete alumni

## Database Schema

### Alumni Table
```sql
CREATE TABLE alumni (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  year_graduated INTEGER NOT NULL,
  current_college TEXT NOT NULL,
  college_major TEXT NOT NULL,
  profession TEXT,
  linkedin_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Admins Table
```sql
CREATE TABLE admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Project Structure

```
MOC_alumni/
├── server/                 # Backend
│   ├── index.js           # Main server file
│   ├── package.json       # Backend dependencies
│   └── database.sqlite    # SQLite database (created automatically)
├── client/                # Frontend
│   ├── public/            # Static files
│   ├── src/               # React source code
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── App.js         # Main app component
│   │   └── index.js       # React entry point
│   ├── package.json       # Frontend dependencies
│   └── tailwind.config.js # Tailwind configuration
├── package.json           # Root package.json
└── README.md             # This file
```

## Usage

### For Current MOC Members
1. Visit the homepage to learn about the alumni database
2. Navigate to the Directory page to browse alumni
3. Use search and filters to find specific alumni
4. Contact alumni via email or LinkedIn for mentorship

### For Admins
1. Login with admin credentials
2. Access the Admin panel to manage alumni data
3. Add new alumni entries
4. Update or delete existing entries as needed

## Security Features

- JWT-based authentication for admin access
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration for secure cross-origin requests
- SQL injection prevention through parameterized queries

## Local Development

This application is designed to run locally on your machine. The backend server runs on `http://localhost:5000` and the frontend development server runs on `http://localhost:3000`.

### Environment Variables (Optional)
Create a `.env` file in the server directory for custom configuration:
```
JWT_SECRET=your-secret-key-here
PORT=5000
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For questions or support, contact the MOC leadership team.

## License

This project is for internal use by the MOC organization. 