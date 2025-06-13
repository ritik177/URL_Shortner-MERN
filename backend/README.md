# Advanced URL Shortener with Analytics

A professional-grade URL shortening service with comprehensive analytics and tracking capabilities.

## Features

- URL shortening with custom short codes
- Detailed analytics tracking
- Device type detection
- Referrer tracking
- Unique visitor counting
- URL tagging system
- Configurable URL expiry
- Rate limiting
- Input validation
- Error handling

## API Endpoints

### Create Short URL
```http
POST /api/urls
Content-Type: application/json

{
  "originalUrl": "https://example.com",
  "customCode": "optional-custom-code",
  "tags": ["marketing", "social"],
  "expiryHours": 24
}
```

### Redirect to Original URL
```http
GET /api/urls/:code
```

### Get Analytics
```http
GET /api/urls/:code/analytics
```

### Get URLs by Tag
```http
GET /api/urls/tags/:tag
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with the following variables:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/url-shortener
NODE_ENV=development
BASE_URL=http://localhost:3000
```

3. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Response Examples

### Create Short URL Response
```json
{
  "success": true,
  "data": {
    "shortUrl": "http://localhost:3000/abc123",
    "originalUrl": "https://example.com",
    "expiryDate": "2024-03-21T12:00:00.000Z"
  }
}
```

### Analytics Response
```json
{
  "success": true,
  "data": {
    "originalUrl": "https://example.com",
    "totalVisits": 100,
    "uniqueVisitors": 75,
    "deviceTypes": {
      "desktop": 60,
      "mobile": 35,
      "tablet": 5
    },
    "topReferrers": [
      { "source": "google.com", "count": 30 },
      { "source": "twitter.com", "count": 20 }
    ],
    "visitsByDay": {
      "2024-03-20": 50,
      "2024-03-21": 50
    },
    "tags": ["marketing", "social"],
    "createdAt": "2024-03-20T00:00:00.000Z",
    "expiryDate": "2024-03-21T12:00:00.000Z"
  }
}
```

## Error Handling

The API uses standard HTTP status codes and returns error responses in the following format:

```json
{
  "success": false,
  "error": "Error message",
  "details": [
    {
      "field": "fieldName",
      "message": "Validation error message"
    }
  ]
}
```

## Security Features

- Rate limiting (100 requests per 15 minutes per IP)
- Input validation
- CORS enabled
- Helmet security headers
- MongoDB injection protection
- Custom error handling

## Dependencies

- Express.js - Web framework
- Mongoose - MongoDB ODM
- Joi - Input validation
- nanoid - URL-safe unique ID generation
- ua-parser-js - User agent parsing
- moment - Date handling
- winston - Logging
- helmet - Security headers
- cors - Cross-origin resource sharing
- express-rate-limit - Rate limiting