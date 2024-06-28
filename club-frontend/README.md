
# Club Explore Setup Guide

Welcome to the setup guide for the Club Explore web application. This document will guide you through setting up both the backend and frontend environments on your local machine.

## Prerequisites
Before beginning the setup, make sure you have Python installed for the backend and Node.js for the frontend. You can download Python from [python.org](https://www.python.org/downloads/) and Node.js from [nodejs.org](https://nodejs.org/en/download/).

## Backend Setup

1. **Open your terminal.**
2. **Navigate to the backend directory:**
   ```
   cd club-backend
   ```
3. **Activate the virtual environment:**
   ```
   source env/bin/activate
   ```
   For Windows, use:
   ```
   .\env\Scriptsactivate
   ```
4. **Install required Python packages:**
   ```
   pip install -r req.txt
   ```
5. **Start the Django server:**
   ```
   python manage.py runserver
   ```
   The backend server should now be running.

## Frontend Setup

1. **Open a new terminal window.**
2. **Navigate to the frontend directory:**
   ```
   cd club-frontend
   ```
3. **Ensure Node.js is installed:**
   ```
   brew install node
   ```
   Adjust the installation command based on your operating system. If you are using Windows, you can download Node.js from their [official website](https://nodejs.org/en/download/).

4. **Start the frontend application:**
   ```
   sudo npm start
   ```
   This command will compile the frontend and open the web application in your default web browser.

## Accessing the Application

After starting both servers, the Club Explore web page should automatically open in your default web browser at the following URL:
```
http://localhost:3000
```
If it doesn't open automatically, you can manually open a web browser and enter the above URL.

## Troubleshooting

- **Python not found:** Ensure Python is installed and properly added to your system's PATH.
- **Node.js issues:** Confirm Node.js and npm are installed correctly.
- **Permission issues with npm start:** Try running `npm start` without `sudo` if you're not on macOS, or adjust permissions for your npm directories.

For any additional help, please refer to the documentation or contact support.
