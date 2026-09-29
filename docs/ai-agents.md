# ShopMind AI — Multi-Agent Architecture Documentation

ShopMind AI utilizes a coordinated multi-agent system designed to turn natural language shopping inquiries into personalized, spec-verified product selections.

---

## 1. High-Level Agent Workflow

```text
                     ┌──────────────────────┐
                     │       Customer       │
                     └──────────┬───────────┘
                                │ Natural Language Query
                                ▼
                     ┌──────────────────────┐
                     │   Next.js Frontend   │
                     │  Product UI + Chat UI │
                     └──────────┬───────────┘
                                │ HTTP POST /api/assistant/chat
                                ▼
                     ┌──────────────────────┐
                     │   Backend API Layer  │
                     │  Express Application │
                     └──────────┬───────────┘
                                │
                                ▼
                     ┌──────────────────────┐
                     │ Shopping Orchestrator│
                     │  Workflow Coordinator│
                     └──────────┬───────────┘
                                │
          ┌─────────────────────┼─────────────────────┐
          ▼                     ▼                     ▼
┌─────────────────┐  ┌─────────────────┐  ┌────────────────────┐
│   Intent Agent  │  │  Product Search │  │Recommendation Agent│
│                 │  │     Agent       │  │                    │
└────────┬────────┘  └────────┬────────┘  └─────────┬──────────┘
         │                    │                     │
         └────────────────────┼─────────────────────┘
                              ▼
                   ┌──────────────────────┐
                   │    Product Database  │
                   │ PostgreSQL / Mock DB │
                   └──────────┬───────────┘
                              │
                              ▼
                   ┌──────────────────────┐
                   │     GenAI Model      │
                   │    OpenAI/Gemini/    │
                   │      Mock Core       │
                   └──────────┬───────────┘
                              │
                              ▼
                   ┌──────────────────────┐
                   │ Final Answer + Items │
                   └──────────┬───────────┘
                              │
                              ▼
                   ┌──────────────────────┐
                   │    Frontend Result   │
                   └──────────────────────┘
```

---

## 2. Agent Roles and Delegation

### 1. Shopping Orchestrator Agent (`shopping-orchestrator.agent.ts`)
The master manager of the conversation lifecycle.
- Receives user query from API layer.
- Asks `IntentAgent` to classify intention and extract entities (e.g. category, budget in INR, specific features).
- Delegates processing to the specialized domain agent.
- Formulates standardized responses with action suggestions.

### 2. Intent Agent (`intent.agent.ts`)
Natural language intention extraction:
- `product_search`: General catalog queries ("laptop", "4k monitor").
- `product_recommendation`: Needs-based or budget-based inquiries ("Find a laptop under ₹60,000 for coding").
- `product_comparison`: Multi-item comparative evaluation ("Compare iPhone and Samsung phones").
- `product_question`: Factual hardware inquiries ("What is the battery life of the MacBook Air M3?").
- `cart_request`: Actions directed at shopping bag ("Add this laptop to my cart").
- `general_shopping`: Open greetings or brand queries.

### 3. Product Search Agent (`product-search.agent.ts`)
High-performance faceted inventory querying:
- Filters by category, price threshold (₹), tags, and brand keywords.
- Ranks candidate results by relevancy and match scores.

### 4. Recommendation Agent (`recommendation.agent.ts`)
Personalized recommendation generator:
- Evaluates candidate products against specific user constraints (e.g., coding, photography, battery life).
- Provides factual, persuasive justifications for why a product was selected.
- Synthesizes user sentiment and verified customer ratings.

### 5. Comparison Agent (`comparison.agent.ts`)
Specification delta and value analyzer:
- Contrasts 2 to 4 devices across display, battery endurance, build quality, and pricing.
- Highlights winners for specific use cases (e.g. best camera, best battery, best value).

### 6. Product Q&A Agent (`product-qa.agent.ts`)
Factual hardware assistant:
- Answers hardware questions based strictly on manufacturer documentation.
- Avoids AI hallucination by confirming verified parameters or explicitly stating when data is unavailable.

---

## 3. Example Request & Response Flow

### Input
```json
{
  "message": "Find a laptop under ₹60,000 for coding."
}
```

### Orchestrator Pipeline
1. **Intent Agent**: Detects `product_recommendation`, category `Laptops`, budget `₹60,000`, requirement `coding`.
2. **Recommendation Agent**: Filters laptops where `price <= 60000`, finds `Acer Swift Go 14 OLED` and `ASUS Vivobook 15X`.
3. **Synthesis**: Highlights 2.8K OLED display and 16GB RAM for compilation speed.

### Output
```json
{
  "success": true,
  "message": "AI Assistant response generated",
  "data": {
    "agentName": "RecommendationAgent",
    "intent": "product_recommendation",
    "content": "Here are the top laptops under ₹60,000 for coding. The Acer Swift Go 14 stands out with its 2.8K OLED screen and 16GB RAM.",
    "recommendedProducts": [...],
    "suggestedFollowUps": [
      "Compare Acer Swift Go vs Asus Vivobook",
      "Add Acer Swift Go 14 to Cart",
      "Show full spec sheet"
    ]
  }
}
```
