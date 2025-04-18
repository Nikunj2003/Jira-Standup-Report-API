# AI Jira Standup Report API
=============================

**Table of Contents**
-----------------

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [API Documentation](#api-documentation)
4. [Endpoints Overview](#endpoints-overview)
5. [Getting Started](#getting-started)
6. [Contributing](#contributing)
7. [License](#license)

## Overview
-----------

The AI Jira Standup Report API is designed to streamline the process of generating and managing daily scrum reports from Jira data. Leveraging AI capabilities through Nvidia NIM API, alongside Jira's robust project management features, this API automates report generation and scheduling, enhancing team productivity and efficiency.

## Technology Stack
---------------------

* **jira-report-ai-api**:
	+ **Language**: Python
	+ **Package Management**: Poetry
	+ **AI Integration**: Nvidia NIM API
* **jira-report-api**:
	+ **Language**: Node.js
	+ **Type System**: TypeScript

## API Documentation
---------------------

### OpenAPI Specification

For detailed API documentation, including request/response schemas, endpoints, and examples, please refer to our [OpenAPI Specification](https://raw.githubusercontent.com/[YourUsername]/AI-Jira-Standup-Report-API/main/openapi.yaml).

**Highlighted Endpoints:**

* **Scrum Report**
	+ `POST /api/report/set-cron-time` - Update the cron schedule time
	+ `POST /api/report/trigger-manual` - Manually trigger report generation
	+ `GET /api/report/current-schedule` - Get current cron schedule
	+ `GET /api/report/recent` - Get recent reports
	+ `GET /api/report/{id}` - Get specific report content
* **Health & Info**
	+ `GET /api/health` - Check API health status
	+ `GET /api/info` - Get API metadata

## Endpoints Overview
---------------------

### Scrum Report Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/report/set-cron-time` | `POST` | Update cron schedule |
| `/api/report/trigger-manual` | `POST` | Manually generate report |
| `/api/report/current-schedule` | `GET` | Retrieve current schedule |
| `/api/report/recent` | `GET` | Fetch recent reports |
| `/api/report/{id}` | `GET` | Retrieve a report by ID |

### Health & Info Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/health` | `GET` | Check API health |
| `/api/info` | `GET` | Retrieve API metadata |

## Getting Started
---------------

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/[YourUsername]/AI-Jira-Standup-Report-API.git
   ```
2. **Navigate to the Project Directory**:
   ```bash
   cd AI-Jira-Standup-Report-API
   ```
3. **Setup `jira-report-ai-api` (Python)**:
   - Install Poetry if you haven't already: https://python-poetry.org/docs/#installation
   - Activate your virtual environment (if using)
   - Run `poetry install` to install dependencies
4. **Setup `jira-report-api` (Node.js/TypeScript)**:
   - Ensure you have Node.js and npm installed: https://nodejs.org/en/download/
   - Run `npm install` to install dependencies
5. **Configure Environment Variables**:
   - For Jira API integration and Nvidia NIM API, configure the respective environment variables as outlined in the project's `.env.example` files.

## Contributing
------------

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request