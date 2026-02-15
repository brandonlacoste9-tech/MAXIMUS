# API Documentation

Complete API reference for MAXIMUS AI Assistant.

## Base URL

```
http://localhost:3000/api
```

## Authentication

Currently, the API is open. For production, implement authentication middleware.

## Endpoints

### Health & Status

#### GET /health

Basic health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-02-15T04:44:17.016Z"
}
```

#### GET /api/health

Detailed health status with service information.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-02-15T04:44:17.016Z",
  "services": {
    "api": { "status": "healthy" },
    "ai": {
      "status": "healthy",
      "provider": "ollama"
    }
  },
  "system": {
    "uptime": 12345,
    "memory": {
      "used": 52428800,
      "total": 104857600
    },
    "cpu": 0.5
  }
}
```

### AI Chat

#### POST /api/ai/chat

Send a message to the AI assistant.

**Request:**
```json
{
  "message": "Hello, how are you?",
  "context": [
    {
      "role": "user",
      "content": "Previous message"
    },
    {
      "role": "assistant",
      "content": "Previous response"
    }
  ]
}
```

**Response:**
```json
{
  "response": "Hello! I'm MAXIMUS, your AI assistant. I'm functioning well and ready to help you. How can I assist you today?",
  "model": "llama2",
  "provider": "ollama"
}
```

**Error Response:**
```json
{
  "error": "Failed to communicate with Ollama: Connection refused"
}
```

#### GET /api/ai/status

Get AI model status.

**Response:**
```json
{
  "provider": "ollama",
  "status": "connected",
  "models": [
    {
      "name": "llama2",
      "size": 3825819519
    }
  ]
}
```

### Leads Management

#### GET /api/leads

Get all leads with optional filtering.

**Query Parameters:**
- `status` - Filter by status (new, contacted, qualified, converted)
- `source` - Filter by source (website, telegram, whatsapp, referral, other)

**Response:**
```json
[
  {
    "id": "1708000000000",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "source": "website",
    "status": "new",
    "createdAt": "2026-02-15T04:44:17.016Z",
    "updatedAt": "2026-02-15T04:44:17.016Z"
  }
]
```

#### GET /api/leads/stats

Get lead statistics.

**Response:**
```json
{
  "total": 42,
  "byStatus": {
    "new": 10,
    "contacted": 15,
    "qualified": 12,
    "converted": 5
  },
  "bySource": {
    "website": 20,
    "telegram": 10,
    "whatsapp": 8,
    "referral": 4
  }
}
```

#### GET /api/leads/:id

Get a specific lead by ID.

**Response:**
```json
{
  "id": "1708000000000",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "source": "website",
  "status": "new",
  "createdAt": "2026-02-15T04:44:17.016Z",
  "updatedAt": "2026-02-15T04:44:17.016Z"
}
```

**Error Response (404):**
```json
{
  "error": "Lead not found"
}
```

#### POST /api/leads

Create a new lead.

**Request:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+0987654321",
  "source": "telegram",
  "status": "new"
}
```

**Response (201):**
```json
{
  "id": "1708000000001",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+0987654321",
  "source": "telegram",
  "status": "new",
  "createdAt": "2026-02-15T04:44:17.016Z",
  "updatedAt": "2026-02-15T04:44:17.016Z"
}
```

#### PUT /api/leads/:id

Update a lead.

**Request:**
```json
{
  "status": "contacted",
  "notes": "Called on 2026-02-15"
}
```

**Response:**
```json
{
  "id": "1708000000000",
  "name": "John Doe",
  "email": "john@example.com",
  "status": "contacted",
  "notes": "Called on 2026-02-15",
  "updatedAt": "2026-02-15T05:00:00.000Z"
}
```

#### DELETE /api/leads/:id

Delete a lead.

**Response (204):**
No content

**Error Response (404):**
```json
{
  "error": "Lead not found"
}
```

### Personality

#### GET /api/personality

Get the current personality configuration.

**Response:**
```json
{
  "raw": "# MAXIMUS AI Personality Configuration\n\n## Identity\n...",
  "html": "<h1>MAXIMUS AI Personality Configuration</h1>...",
  "parsed": {
    "name": "MAXIMUS",
    "role": "AI Assistant",
    "tone": "Professional yet friendly",
    "greeting": "Hello! I'm MAXIMUS, your AI assistant.",
    "traits": [],
    "colors": {
      "primary": "#FFD700",
      "secondary": "#800080",
      "accent": "#4B0082"
    }
  }
}
```

#### PUT /api/personality

Update the personality configuration.

**Request:**
```json
{
  "content": "# MAXIMUS AI Personality Configuration\n\n## Identity\n**Name:** CustomBot\n..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Personality updated successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Failed to write file: Permission denied"
}
```

### Metrics

#### GET /api/metrics

Get system metrics.

**Response:**
```json
{
  "requests": 150,
  "chatMessages": 42,
  "leadsCreated": 12,
  "uptime": 1708000000000,
  "errors": 2,
  "uptimeSeconds": 3600
}
```

#### POST /api/metrics/reset

Reset all metrics.

**Response:**
```json
{
  "message": "Metrics reset successfully"
}
```

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 404 | Not Found |
| 500 | Internal Server Error |

## Rate Limiting

Currently not implemented. Consider adding rate limiting for production:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## CORS

CORS is enabled by default for all origins. Configure for production:

```javascript
const cors = require('cors');

app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true
}));
```

## Examples

### cURL Examples

**Chat with AI:**
```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello!"}'
```

**Create Lead:**
```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "source": "website"
  }'
```

**Get Metrics:**
```bash
curl http://localhost:3000/api/metrics
```

### JavaScript Examples

```javascript
// Chat with AI
const chatResponse = await fetch('/api/ai/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Hello MAXIMUS!',
    context: []
  })
});
const data = await chatResponse.json();
console.log(data.response);

// Create Lead
const leadResponse = await fetch('/api/leads', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Jane Smith',
    email: 'jane@example.com',
    source: 'website',
    status: 'new'
  })
});
const lead = await leadResponse.json();
```

### Python Examples

```python
import requests

# Chat with AI
response = requests.post('http://localhost:3000/api/ai/chat', json={
    'message': 'Hello MAXIMUS!',
    'context': []
})
print(response.json()['response'])

# Create Lead
lead = requests.post('http://localhost:3000/api/leads', json={
    'name': 'John Doe',
    'email': 'john@example.com',
    'source': 'website'
})
print(lead.json())
```
