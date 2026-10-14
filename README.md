# To-Do Task Management Application

A full-stack To-Do and Task Management application built with Node.js, Express, MongoDB, and vanilla JavaScript.

## Features

- Create, read, update, and delete tasks
- Mark tasks as complete/incomplete
- Filter tasks (all, active, completed)
- Responsive design
- Form validation
- MongoDB for data persistence

## Technology Stack

- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Database**: MongoDB

## Setup Instructions

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure MongoDB connection**:
   - Open `server.js`
   - Replace `<your_mongodb_connection_string>` with your actual MongoDB URI
   - Note: As per instructions, do not insert the key yet in this version

3. **Start the application**:
   ```bash
   npm start
   ```
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   Open your browser and navigate to `http://localhost:5000`

## API Endpoints

- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `PATCH /api/tasks/:id/toggle` - Toggle task completion status
- `GET /health` - Health check endpoint

## Project Structure

```
qskill task 2/
├── public/                 # Frontend static files
│   ├── index.html          # Main HTML file
│   ├── styles.css          # Stylesheet
│   └── script.js           # Frontend JavaScript
├── server.js               # Backend server
├── package.json            # Project metadata and dependencies
└── README.md               # This file
```

## Notes

- The MongoDB connection string is intentionally left as a placeholder (`<your_mongodb_connection_string>`) as per instructions
- To use the application, you'll need to:
  1. Have MongoDB installed and running (or use MongoDB Atlas)
  2. Replace the placeholder in `server.js` with your actual MongoDB connection URI
  3. Start the server

## Future Enhancements

- User authentication and authorization
- Due dates and reminders
- Task categories/tags
- Data persistence backup/restore
- Drag and drop reordering
- Unit and integration tests
