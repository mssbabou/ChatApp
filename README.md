# ChatApp

ChatApp is a real-time chat application leveraging modern technologies such as ASP.NET Core, SignalR, MongoDB, Next.js, Material-UI, and Docker to provide a robust and scalable messaging solution.

## Features

- **Real-time Communication**: Utilizes SignalR for instant message exchange.
- **Persistent Storage**: Uses MongoDB for storing chat messages.
- **Scalable Architecture**: Built with Next.js for a responsive frontend.
- **Beautiful UI**: Designed with Material-UI for a consistent and accessible interface.
- **REST API**: Provides a well-defined API for managing chat messages.
- **Security**: Implements user authentication using API keys.

## Getting Started

### Prerequisites

- .NET Core 8.0 or later
- MongoDB
- Docker (for running with Docker Compose)
- Node.js and npm (for running the Next.js frontend)

### Running the Backend

1. Clone the repository:

    ```bash
    git clone https://github.com/mssbabou/ChatApp.git
    ```

2. Navigate to the backend project directory:

    ```bash
    cd ChatApp/DotNet-Backend
    ```

3. Restore the .NET packages:

    ```bash
    dotnet restore
    ```

4. Run the application:

    ```bash
    dotnet run
    ```

The application will start and listen on `http://localhost:5001`.

### Running the Next.js Frontend

1. Navigate to the frontend project directory:

    ```bash
    cd ChatApp/NextJs-Frontend
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Start the frontend application:

    ```bash
    npm run dev
    ```

The frontend will be available at `http://localhost:3000`.

### Building and Running with Docker Compose

1. Ensure Docker is installed and running on your machine.
2. At the root of the project directory, build and start the application using Docker Compose:

    ```bash
    docker-compose up --build
    ```

The application will be accessible at the respective URLs, depending on your Docker Compose configuration and port settings.

## Project Structure

The repository is organized as follows:

- **DotNet-Backend**: Contains the ASP.NET Core backend project.
- **NextJs-Frontend**: Contains the Next.js frontend project.
- **.github/workflows**: Contains GitHub Actions workflows for CI/CD.
- **docker-compose-deploy.yml**: Docker Compose file for deployment.
- **docker-compose-localbuild.yml**: Docker Compose file for local development.
