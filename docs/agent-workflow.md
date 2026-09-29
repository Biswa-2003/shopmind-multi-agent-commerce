# SmartShop AI - Multi-Agent Workflow

## Agent Roles & Delegation

1. **IntentAgent**:
   - Parses the user's natural language input.
   - Extracts constraints (budget, category, desired features).
   - Routes to the appropriate specialist agent.

2. **ProductSearchAgent**:
   - Performs faceted queries against product inventories.
   - Combines keyword search with category filtering.

3. **RecommendationAgent**:
   - Scores candidate products against user parameters.
   - Generates persuasive, factual justifications for why each item fits.

4. **ComparisonAgent**:
   - Computes diffs between technical specs of 2 to 4 devices.
   - Highlights key trade-offs and best value metrics.

5. **ProductQAAgent**:
   - Handles granular hardware questions ("Does it support spatial audio?").
   - Extracts answers directly from official specs.

6. **ReviewAnalysisAgent**:
   - Synthesizes buyer reviews into pros, cons, and durability trends.
   - Filters out biased or low-credibility feedback.
