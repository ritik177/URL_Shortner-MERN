# URL Shortener

A full-stack URL shortener application built with the MERN stack (MongoDB, Express.js, React.js, Node.js). Features include URL shortening, analytics tracking, device detection, and visit statistics.

## Features

- URL shortening with custom codes
- Analytics tracking (total visits, unique visitors)
- Device type detection (desktop, mobile, tablet)
- Visit statistics with charts
- URL expiration
- Tag-based organization
- Copy to clipboard functionality
- Responsive design

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Moment.js
- UAParser.js

### Frontend
- React.js
- Material-UI
- Recharts
- Axios
- Tailwind CSS

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Local Development Setup

### Backend Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd URLShortner
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/url-shortener
BASE_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
```

4. Start the backend server:
```bash
npm run dev
```

### Frontend Setup

1. Install frontend dependencies:
```bash
cd frontend
npm install
```

2. Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:3000/api
```

3. Start the frontend development server:
```bash
npm start
```

The application should now be running at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Endpoints

#### 1. Create Short URL
```http
POST /urls
```

Request Body:
```json
{
  "originalUrl": "https://example.com/very/long/url",
  "customCode": "optional-custom-code",
  "tags": ["example", "test"],
  "expiryHours": 24
}
```

Response:
```json
{
  "success": true,
  "data": {
    "shortUrl": "http://localhost:3000/abc123",
    "originalUrl": "https://example.com/very/long/url",
    "expiryDate": "2024-03-21T12:00:00.000Z"
  }
}
```

#### 2. Get All URLs
```http
GET /urls
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "shortCode": "abc123",
      "shortUrl": "http://localhost:3000/abc123",
      "originalUrl": "https://example.com/very/long/url",
      "tags": ["example", "test"],
      "analytics": {
        "totalVisits": 10,
        "uniqueVisitors": 5,
        "deviceTypes": {
          "desktop": 7,
          "mobile": 2,
          "tablet": 1
        }
      },
      "createdAt": "2024-03-20T12:00:00.000Z",
      "expiryDate": "2024-03-21T12:00:00.000Z"
    }
  ]
}
```

#### 3. Get URL Analytics
```http
GET /urls/:code/analytics
```

Response:
```json
{
  "success": true,
  "data": {
    "originalUrl": "https://example.com/very/long/url",
    "totalVisits": 10,
    "uniqueVisitors": 5,
    "deviceTypes": {
      "desktop": 7,
      "mobile": 2,
      "tablet": 1
    },
    "topReferrers": [
      {
        "source": "direct",
        "count": 5
      },
      {
        "source": "google.com",
        "count": 3
      }
    ],
    "visitsByDay": {
      "2024-03-20": 5,
      "2024-03-21": 5
    }
  }
}
```

#### 4. Get URLs by Tag
```http
GET /urls/tag/:tag
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "shortCode": "abc123",
      "originalUrl": "https://example.com/very/long/url",
      "totalVisits": 10,
      "uniqueVisitors": 5,
      "createdAt": "2024-03-20T12:00:00.000Z",
      "expiryDate": "2024-03-21T12:00:00.000Z"
    }
  ]
}
```

#### 5. Redirect to Original URL
```http
GET /:code
```

Response:
- Redirects to the original URL
- Updates analytics automatically

## Postman Collection

```json
{
  "info": {
    "name": "URL Shortener API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Create Short URL",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/urls",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"originalUrl\": \"https://example.com/very/long/url\",\n  \"customCode\": \"optional-custom-code\",\n  \"tags\": [\"example\", \"test\"],\n  \"expiryHours\": 24\n}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        }
      }
    },
    {
      "name": "Get All URLs",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/urls"
      }
    },
    {
      "name": "Get URL Analytics",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/urls/:code/analytics"
      }
    },
    {
      "name": "Get URLs by Tag",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/urls/tag/:tag"
      }
    }
  ]
}
```

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/url-shortener
BASE_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:3000/api
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 