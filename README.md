# si679finalProject

## Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Build](#build)
- [Run](#run)
- [Testing](#testing)
- [Contributing](#contributing)

## Overview
This is the final project for SI679 FA25. This project implements a simplified version of StockX, providing a marketplace where users can post items they want to buy or sell. The platform supports creating listings, browsing available posts, and filtering out posts based on users' specific needs. It is designed as a full-stack application with a clear separation between client and server, offering a streamlined, easy-to-use workflow for managing marketplace activity.

## Tech Stack
- Backend: Node.js, Express
- Frontend: React, Vite
- Database: MongoDB
- Cloud: GCP
- Other: JWT, socket

## Project Structure
```
├── server/
│   ├── client/
│   │   ├── public/
│   │   └── src/
│   │       ├── components/
│   │       ├── data/
│   │       ├── pages/
│   │       ├── App.js
│   │       └── index.js
│   └── src/
│       ├── controllers/
│       ├── db/
│       ├── middlewares/
│       ├── models/
│       ├── routes/
│       ├── services/
│       ├── socket/
│       ├── static/
│       └── server.js
├── tests/
├── .gitignore
└── README.md


```

## Prerequisites
- Node.js
- npm

## Environment Variables

Create a file named `.env` in both `client` and `server` directories.

### Format
```
REACT_APP_API_URL=<deployed_ip:6790>
```

```
DB_URL=mongodb://127.0.0.1:27017
DB_NAME=finalProject

TLS_SERVER_KEY=<self_generated_key>

TLS_SERVER_CERT=<self_generated_cert>

JWT_PRIVATE_KEY=<self_generated_key>

JWT_PUBLIC_KEY=<self_generated_key>
```


## Installation

Clone the repository:
```
git clone https://github.com/your/repo.git
cd repo
```

Install dependencies in both `client` and `server` directories:
```
npm install
```

## Build
```
cd server/client/
npm run build
```
## Run

```
cd ..
npm start
```


## Testing
```
npm test
```

## Contributing
1. Fork the repo  
2. Create a feature branch  
3. Submit a pull request  

