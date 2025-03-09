# WECS Mobile App - Employee Management & Evaluation

**Welcome to the WECS (Workforce Evaluation and Compensation System) mobile application!** This app is designed to provide employees and HR personnel with a convenient way to manage and engage with employee data, including evaluations, performance metrics, and more, directly from their mobile devices.

## Overview

The WECS Mobile App is a React Native application that interfaces with the WECS backend system. It allows users to:

*   **View Employee Information:** Access detailed profiles of employees, including their department, designation, level, and other relevant information.
*   **Manage Evaluations:** Create, update, and review employee evaluations, including metrics, scores, comments, and recommendations.
*   **HR Management:** HR personnel have enhanced access to create, update, and delete employee records.
* **Authentication**: Securely access application features through token-based authentication.

## Key Features

*   **User-Friendly Interface:** Intuitive design and navigation for a seamless user experience.
*   **Employee Profiles:** Comprehensive employee information at your fingertips.
*   **Performance Evaluations:** A dedicated system for managing and tracking employee performance.
*   **Secure Access:** Robust authentication to protect sensitive data.
* **Offline Capability**: You can see your previuos evaluation even if offline.
* **Real Time Data**: If you are online, you can have the latest data.

## Tech Stack

*   **React Native:** For building cross-platform mobile applications.
*   **TypeScript:** For enhanced code quality and maintainability.
*   **React Context API:** For managing application state.
*   **Fetch API:** For making network requests to the backend API.

## Getting Started

### Prerequisites

*   **Node.js:** (v16 or higher)
*   **npm or Yarn:** Package manager
*   **React Native Development Environment:** Set up according to the official React Native documentation (Expo or React Native CLI).
* **Backend Server** The backend server should be up and running at `http:192.168.19.217:8000/api`.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd WECS #change to the app directory
    ```

2.  **Install dependencies:**
    ```bash
    npm install  # or yarn install
    ```

3. **Run the application**:
    ```bash
    npx expo start #or npm run start
    ```

4. **Connect with you device**: Scan the QR code that the app generates.

### Configuration

*   **API URL:**
    *   The base API URL is set in `constants/App.ts`. You might need to adjust this if you're running the backend on a different port or server.
        ```typescript
        export const API_URL = "http:192.168.19.217:8000/api";
        ```

## Usage

1.  **Authentication:**
    *   Users will need to authenticate with their WECS credentials.
    *   Authentication tokens are used for secure API access.

2.  **Navigation:**
    *   The app features intuitive navigation to access employee profiles, evaluations, and other sections.

3.  **Employee Management:**
    *   HR users can access all employee records and perform CRUD operations.
    *   Employees can view their own profile and evaluation history.

4. **Evaluation**
    * Users can create a new evaluation or update an existing one.
    * HR users can modify the status of the evaluation.
    * Metrics, recomendations and overall score can be managed here.

## Backend Integration

The WECS Mobile App communicates with a backend server built using Node.js, Express, and MongoDB. Key backend functionalities include:

*   **Authentication:** JWT (JSON Web Tokens) are used to authenticate users and secure API endpoints.
*   **Employee Management:** The backend provides endpoints for managing employee data, including creating, reading, updating, and deleting employee records.
*   **Evaluation Management:** Similar endpoints are available for managing evaluations.
*   **Department Management:** The backend also provides functionalities to manage the departments.

## Contributing

We welcome contributions from the community! If you're interested in helping improve the WECS Mobile App, please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them.
4.  Push your changes to your forked repository.
5.  Submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For any questions or issues, please contact [Your Name/Team] at [Your Email/Contact Information].

---

**Note:** This README is a template. You should replace the bracketed placeholders with your specific details and add any other relevant sections that might be helpful. Add images if you have some.
