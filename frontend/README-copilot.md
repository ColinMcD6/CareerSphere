# FILE: /mern-stack-app/mern-stack-app/frontend/README.md

# Frontend Documentation for MERN Stack Application

This is the frontend part of the MERN stack application. It is built using React and communicates with the backend to fetch data from a MongoDB database.

## Project Structure

- **src/**: Contains the source code for the frontend application.
  - **App.js**: The main component that renders the application.
  - **components/**: Contains reusable components.
    - **FetchButton.js**: A button component that triggers data fetching from the backend.
  - **services/**: Contains service files for API calls.
    - **api.js**: Handles API requests to the backend.
  - **index.js**: The entry point of the React application.

## Getting Started

To run the frontend application, follow these steps:

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Start the application:
   ```
   npm start
   ```

The application will be available at `http://localhost:3000`.

## Fetching Data

The application includes a button that, when clicked, fetches data from the backend API. Ensure that the backend server is running to successfully retrieve data.

## Dependencies

The frontend application uses the following key dependencies:

- **react**: A JavaScript library for building user interfaces.
- **axios**: A promise-based HTTP client for making requests to the backend.

## License

This project is licensed under the MIT License.