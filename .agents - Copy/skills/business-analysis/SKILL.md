---
name: business-analysis
description: "Trigger: business analysis, model coherence, logic audit, business model audit. Evaluate business models, analyze logic coherence, and scores."
license: Apache-2.0
metadata:
  author: "lucas"
  version: "2.0"
---

## Activation Contract
Use this skill when:
- The user requests an audit of the business model coherence or analytical keys (Gis).
- Evaluating a network of dependencies and coherence relations between business keys.
- Recording multi-evaluator scoring logs at the end of the markdown model.

## Hard Rules
- **Language Policy**: Before commencing, check the language used in the model data. The output response and analysis tables MUST be written in that same language.
- **Introductory Steps**: Before starting the evaluation, clearly state to the user which files, configurations, or model data items you are going to use.
- **No SWOT Matrix**: Do not generate SWOT/FODA matrix diagrams.
- **Separation of Keys**:
  - **Pure Keys (Atomic)**: Evaluate a single concept of the model.
  - **Relational Keys (Composite)**: Cross-reference multiple concepts and/or other keys.
- **Visual Table of Keys**: Present all active keys in a table showing their metadata, with explicit links to their related concepts and related keys (if composite).
- **Evaluations Log Structure**: At the end of the user's markdown model, evaluations must be appended as structured data records containing:
  - `Timestamp`: ISO Date.
  - `Evaluador`: The identifier of the evaluator (e.g. human user or specific AI model).
  - `Target`: The specific concept or key being evaluated.
  - `Puntuación`: Numeric score (1-9).
  - `Comentarios`: Explanatory reasoning for the score.

## Coherence Audit Framework: 20 Core Aspects
When evaluating a business model, audit the following 20 aspects for logic and coherence:
1. **Value-Customer Alignment (Fit)**: Does the Value Proposition directly solve a high-priority, validated pain point of the Customer Segment?
2. **Channel-Segment Compatibility**: Do chosen channels align with the target customer’s native purchasing behaviors?
3. **Willingness to Pay vs. Revenue Model**: Does the pricing strategy match the customer segment's economic capability and expected buying friction?
4. **Painkiller vs. Vitamin (Urgency)**: Is the value proposition addressing an urgent necessity or a nice-to-have feature?
5. **Unit Economics & Margin Viability**: Does the cost structure allow for healthy gross margins under the current pricing model?
6. **Key Partner & Resource Sufficiency**: Are critical resources and external partnerships aligned with the operational requirements of the value proposition?
7. **CAC vs. LTV Ratio**: Is the customer acquisition cost (CAC) sustainable compared to the lifetime value (LTV)?
8. **Pricing Match to Purchasing Power**: Is the pricing aligned with the segment's income level (e.g., avoiding luxury pricing for low-income demographics)?
9. **Time-to-Market & Cash Runway**: Are regulatory, R&D, or setup timelines covered by the available cash runway?
10. **Scalability vs. Operational Complexity**: Can the model scale without creating exponential manual overhead or unmanageable operational bottlenecks?
11. **Team Competence Alignment**: Does the founding/operation team possess the core skills required for key activities?
12. **Defensibility (Moat)**: Are there clear barriers to entry (network effects, IP, switching costs) to protect margins from competitors?
13. **Supply Chain & Dependency Risk**: Are there single-point-of-failure dependencies on suppliers or third-party platforms?
14. **Cash Flow Timing (Working Capital)**: Does the cash conversion cycle favor liquidity (getting paid before paying suppliers)?
15. **Early-Stage Focus**: Is the model highly focused on a primary beachhead segment instead of over-diversifying across multiple markets?
16. **GTM Strategy vs. Ticket Size**: Is the sales motion (Product-Led-Growth vs. High-Touch Enterprise Sales) aligned with the average contract value?
17. **Switching Costs**: Does the solution create lock-in or high switching costs to prevent customer churn?
18. **Technical/Product Feasibility**: Can the proposed technology be built within the constraints of resources and timelines?
19. **Retention & Churn Dynamics**: Is the business model viable under expected churn rates, or is it a "leaky bucket"?
20. **Macro-Environment & Platform Risk**: Is the business model overly sensitive to regulatory shifts, interest rates, or external API platforms?

## Few-Shot Examples (Scoring Examples)

### Case A: High Coherence (Score: 8-9)
- **Target**: Willingness to Pay vs. Revenue Model (Aspect 3) & GTM Strategy vs. Ticket Size (Aspect 16).
- **Plan Details**: B2B SaaS targeting enterprise logistics companies with an Average Contract Value (ACV) of $50,000/year. Uses direct enterprise sales with consultative account executives.
- **Score**: `9/9`
- **Reasoning**: The high ticket size ($50k) fully justifies the high cost of a direct sales force. Customer segments have the budget, and the sales motion is designed for slow, high-value corporate decisions. Complete alignment.

### Case B: Low Coherence / Logic Gap (Score: 1-3)
- **Target**: Value-Customer Alignment (Aspect 1) & Pricing Match to Purchasing Power (Aspect 8).
- **Plan Details**: Premium mobile subscription app offering high-end financial tutoring, targeting college students (undergraduate), priced at $49/month.
- **Score**: `2/9`
- **Reasoning**: Severe logic gap. The value proposition targets cash-strapped college students, yet the pricing ($49/month) exceeds their purchasing power for non-essential educational content. The model fails to match the segment's economic reality.

### Case C: High Coherence (Score: 8-9)
- **Target**: Channel-Segment Compatibility (Aspect 2) & Early-Stage Focus (Aspect 15).
- **Plan Details**: Hyperlocal delivery app for premium organic pet food in a high-density urban neighborhood. Marketing channel is direct partnerships with the neighborhood's top 3 boutique veterinary clinics.
- **Score**: `8/9`
- **Reasoning**: Strong hyperlocal focus limits early-stage operational complexity. Veterinary partnerships are highly trusted channels that directly capture the target audience (wealthy pet owners) at the point of recommendation.

### Case D: Low Coherence / Logic Gap (Score: 1-3)
- **Target**: Unit Economics (Aspect 5) & CAC vs. LTV (Aspect 7).
- **Plan Details**: On-demand laundry service offering free pickup and delivery, priced at a flat rate of $10 per load, utilizing manual contract drivers paid hourly.
- **Score**: `1/9`
- **Reasoning**: Classic logic gap. High operational costs (driver compensation, fuel, laundry processing) exceed the low $10 flat fee. The unit economics are structurally negative, meaning scaling will only accelerate losses.

## Execution Steps
1. **Discovery Step**: Read and inspect the active business model data. Present the source files and components to the user before running the analysis.
2. **Analysis Process**: Apply semantic reasoning over target concepts to assess each key using the 20 Core Aspects.
3. **Generate Key Table**: Output the visual table mapping Keys, Types, Target Concepts, and Connected Keys.
4. **Append Evaluation Log**: Create and append the new evaluation records at the bottom of the document showing the new scores, timestamps, and reasoning.

## Output Contract
Return a markdown report structured as:
- **Archivos e Información Utilizada**: List of files processed.
- **Tabla de Keys de Análisis**: Table listing all Keys, Types, Related Concepts (links), and Related Keys (links).
- **Evaluaciones Generadas**: The list of new evaluation log records (Timestamp, Evaluador, Target, Puntuación, Comentarios) to be appended.
