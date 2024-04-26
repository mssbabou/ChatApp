# ChatApp

ChatApp is a real-time chat application that leverages modern technologies such as ASP.NET Core, SignalR, MongoDB, Next.js, and Docker to deliver a robust and scalable messaging solution.

## Features

- **Real-time communication:** Utilize SignalR for seamless and instant message exchange.
- **Persistent storage:** Use MongoDB to store chat messages, ensuring data durability.
- **Scalable architecture:** Employ Next.js for building a scalable and responsive frontend.
- **REST API:** Retrieve and manage chat messages through a well-defined RESTful API.
- **Security:** Implement user authentication using API keys to secure the application.

## Getting Started

### Prerequisites

- .NET Core 8.0 or later
- MongoDB
- Docker (for running with Docker Compose)
- Node.js and npm (for running the Next.js frontend)

### Running the Backend

1. Clone the repository:
```sh
git clone https://github.com/mssbabou/ChatApp.git
```
2. Navigate to the backend project directory:
```sh
cd ChatApp/DotNet-Backend
```
3. Restore the .NET packages:
```sh
dotnet restore
```
4. Run the application:
```sh
dotnet run
```

The application will start and listen on http://localhost:5000.

### Running the Next.js Frontend

1. Navigate to the frontend project directory:
```sh
cd ChatApp/React-Frontend
```
2. Install the dependencies:
```sh
npm install
```
3. Start the frontend application:
```sh
npm run dev
```

The frontend will be available at http://localhost:80.

### Building and Running with Docker Compose
1. Ensure Docker is installed and running on your machine.
2. At the root of the project directory, build and start the application using Docker Compose:
```sh
docker-compose up --build
```

The application will be accessible at the respective URLs, depending on your Docker Compose configuration and port settings.