# Waste Segregation Dashboard

## Overview

The Waste Segregation Dashboard is a web application designed to help users identify and categorize waste materials using machine learning. The application uses a Teachable Machine model to detect waste types and provides analytics on waste segregation.

## Features

- **Real-time Waste Detection**: Uses a Teachable Machine model to detect and categorize waste materials.
- **Waste Analytics Dashboard**: Displays analytics on waste segregation using pie charts and line graphs.
- **History Table**: Shows the history of detected waste materials.
- **Dark Mode**: Toggle between light and dark themes.

## Technologies Used

- **React**: Frontend framework for building the user interface.
- **Firebase**: Backend service for real-time database and authentication.
- **Teachable Machine**: Machine learning model for waste detection.
- **Recharts**: Library for creating charts and graphs.
- **React Toastify**: Library for displaying toast notifications.

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/kernel-panic.git
   cd kernel-panic
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your Firebase configuration:
   ```env
   REACT_APP_FIREBASE_API_KEY=your-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   REACT_APP_FIREBASE_APP_ID=your-app-id
   ```

### Running the Application

1. Start the development server:
   ```bash
   npm start
   ```

2. Open your browser and navigate to `http://localhost:3000`.

## Project Structure

```
kernel-panic/
├── public/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── HistoryTable.jsx
│   │   ├── TeachableMachine.jsx
│   │   ├── ThemeToggleButton.jsx
│   │   ├── ToastNotification.jsx
│   │   └── WasteAnalytics.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── index.jsx
│   └── index.css
├── .env
├── .gitignore
├── package.json
└── README.md
```

## Usage

- **Waste Detection**: Place waste materials in front of the webcam to detect and categorize them.
- **Analytics**: View the pie charts and line graphs to analyze waste segregation data.
- **History**: Check the history table for a record of detected waste materials.
- **Dark Mode**: Use the theme toggle button in the header to switch between light and dark modes.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Teachable Machine](https://teachablemachine.withgoogle.com/)
- [Firebase](https://firebase.google.com/)
- [Recharts](https://recharts.org/)
- [React Toastify](https://fkhadra.github.io/react-toastify/)