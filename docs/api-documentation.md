# ShopMind AI — REST API Documentation
*Base URL: `http://localhost:5000/api`*

All API endpoints return a standardized JSON envelope:
```json
{
  "success": true,
  "message": "Operation description or status",
  "data": { ... }
}
```

In the event of an error:
```json
{
  "success": false,
  "message": "Human-readable error description",
  "error": "SPECIFIC_ERROR_CODE",
  "details": [ ... ]
}
```

---

## 1. Health Endpoints

### `GET /health`
Returns the status of the server and database connectivity.

**Response:**
```json
{
  "success": true,
  "message": "ShopMind AI Backend is operating normally",
  "data": {
    "status": "healthy",
    "timestamp": "2026-09-18T07:15:00.000Z",
    "uptime": 360.5
  }
}
```

---

## 2. Product Catalog Endpoints

### `GET /products`
Retrieve a paginated, filtered list of products.

**Query Parameters:**
| Parameter | Type | Description | Example |
|---|---|---|---|
| `category` | `string` | Filter by category name or slug | `Laptops` |
| `minPrice` | `number` | Minimum price in INR | `20000` |
| `maxPrice` | `number` | Maximum price in INR | `60000` |
| `search` | `string` | Free-text keyword search | `oled coding` |
| `sortBy` | `string` | Sort order: `price_asc`, `price_desc`, `rating`, `newest` | `price_asc` |
| `page` | `number` | Page number (default: 1) | `1` |
| `limit` | `number` | Items per page (default: 12) | `12` |

**Response:**
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": {
    "products": [
      {
        "id": "prod-laptop-01",
        "name": "Acer Swift Go 14 OLED",
        "slug": "acer-swift-go-14-oled",
        "description": "Intel Core Ultra 5 125H, 16GB LPDDR5X, 512GB SSD, 14-inch 2.8K OLED 90Hz display.",
        "price": 57990,
        "originalPrice": 64990,
        "category": "Laptops",
        "brand": "Acer",
        "rating": 4.5,
        "reviewCount": 128,
        "inStock": true,
        "stockCount": 24,
        "images": [
          "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80"
        ],
        "features": [
          "14-inch 2.8K OLED Display (100% DCI-P3)",
          "Intel Core Ultra 5 with AI Boost NPU",
          "16GB LPDDR5X Fast Dual-Channel RAM"
        ],
        "specifications": {
          "Processor": "Intel Core Ultra 5 125H",
          "RAM": "16GB LPDDR5X",
          "Storage": "512GB PCIe Gen4 NVMe SSD",
          "Display": "14-inch 2.8K (2880x1800) OLED 90Hz",
          "Battery": "65Wh (Up to 10 hours)"
        },
        "aiPros": [
          "Superb 2.8K OLED display with deep blacks and high sharpness",
          "Great multi-core performance for coding and compilation"
        ],
        "aiCons": [
          "Soldered RAM cannot be upgraded beyond 16GB"
        ]
      }
    ],
    "total": 1,
    "page": 1,
    "totalPages": 1
  }
}
```

### `GET /products/:id`
Fetch single product by unique ID or slug.

**Response:**
```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {
    "id": "prod-laptop-01",
    "name": "Acer Swift Go 14 OLED",
    "price": 57990,
    ...
  }
}
```

### `GET /products/:id/recommendations`
Fetch similar or alternative products recommended by the AI.

---

## 3. AI Assistant & Multi-Agent Endpoints

### `POST /assistant/chat`
Send a natural language shopping prompt to the multi-agent orchestrator.

**Request Body:**
```json
{
  "message": "Find a laptop under ₹60,000 for coding.",
  "conversationId": "conv-user-session-001",
  "context": {
    "currentProductId": null,
    "cartItemCount": 0
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "AI assistant response generated",
  "data": {
    "id": "msg-resp-9832",
    "agentName": "RecommendationAgent",
    "intent": "product_recommendation",
    "confidence": 0.96,
    "content": "Here are the best laptops under ₹60,000 tailored for coding and development workflows. The Acer Swift Go 14 OLED is our top recommendation due to its sharp 2.8K OLED display, 16GB high-speed memory, and capable Intel Core Ultra 5 processor.",
    "recommendedProducts": [
      {
        "id": "prod-laptop-01",
        "name": "Acer Swift Go 14 OLED",
        "price": 57990,
        "rating": 4.5,
        "images": ["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80"],
        "recommendationReason": "Best value for developers: 16GB RAM for compilation and an ultra-sharp 2.8K OLED display that reduces eye strain."
      }
    ],
    "suggestedFollowUps": [
      "Compare Acer Swift Go vs Asus Vivobook",
      "Show battery life details",
      "Add Acer Swift Go 14 to Cart"
    ]
  }
}
```

### `POST /assistant/compare`
Generate a structured comparative analysis for 2 to 4 product IDs.

**Request Body:**
```json
{
  "productIds": ["prod-laptop-01", "prod-laptop-02"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product comparison generated",
  "data": {
    "products": [ ... ],
    "summary": "The Acer Swift Go 14 OLED offers a superior display and faster RAM, while the ASUS Vivobook 15X provides a larger 15.6-inch screen with expandable storage.",
    "verdict": {
      "bestOverall": "prod-laptop-01",
      "bestBudget": "prod-laptop-02"
    },
    "featuresMatrix": [
      {
        "feature": "Display",
        "values": {
          "prod-laptop-01": "14-inch 2.8K OLED 90Hz",
          "prod-laptop-02": "15.6-inch FHD IPS 60Hz"
        }
      }
    ]
  }
}
```

---

## 4. Cart & Wishlist Endpoints

### `GET /cart`
Fetch current active cart session.

**Headers:**
- `x-cart-id`: Optional cart session ID.

### `POST /cart/items`
Add an item to the user's cart.

**Request Body:**
```json
{
  "productId": "prod-laptop-01",
  "quantity": 1
}
```

### `DELETE /cart/items/:productId`
Remove an item from the cart.

### `DELETE /cart`
Clear the active cart.
