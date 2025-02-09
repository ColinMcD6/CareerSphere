# MERN Stack Application

This project is a MERN stack application that consists of a backend built with Node.js and Express, and a frontend built with React. The application fetches data from a MongoDB database and displays it through a simple user interface.

## Project Structure

The project is organized into two main directories: `backend` and `frontend`.

### Backend

- **src/app.js**: Entry point of the backend application. Sets up the Express server and connects to MongoDB.
- **src/controllers/dataController.js**: Contains the logic for fetching data from MongoDB.
- **src/models/dataModel.js**: Defines the Mongoose model for the data schema.
- **src/routes/dataRoutes.js**: Sets up the routes for the application.
- **src/config/db.js**: Manages the connection to the MongoDB database.
- **package.json**: Lists dependencies and scripts for the backend.

### Frontend

- **src/App.js**: Main component of the frontend application that renders the FetchButton.
- **src/components/FetchButton.js**: Contains a button that fetches data from the backend when clicked.
- **src/services/api.js**: Handles API calls to the backend.
- **src/index.js**: Entry point of the frontend application that renders the App component.
- **package.json**: Lists dependencies and scripts for the frontend.

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the backend directory and install dependencies:
   ```
   cd backend
   npm install
   ```

3. Navigate to the frontend directory and install dependencies:
   ```
   cd frontend
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```
   cd backend
   npm start
   ```

2. Start the frontend application:
   ```
   cd frontend
   npm start
   ```

The application should now be running, and you can access the frontend in your browser at `http://localhost:3000`.

## License

This project is licensed under the MIT License.