---
specification_version: "V_0-1-2"
specification_url: "https://raw.githubusercontent.com/innV0/FORMAT/main/DOCS/V_0-1-2/_format.md"
title: "business Template — V_1-0-0"
model_version: "V_1-0-0"
last_saved: "2026-06-23T00:00:00.000Z"
template:
  name: "business"
  version: "V_1-0-0"
  title: "innV0 Business Model Template"
  concepts:
    - name: "Business summary"
      icon: "file-text"
      type: "text"
      color: "blue"
      weight: 90

    - name: "Market"
      icon: "store"
      type: "category"
      color: "blue"
      weight: 90

    - name: "Stakeholders"
      icon: "users"
      type: "weight"
      color: "blue"
      weight: 80
      category_id: "Market"

    - name: "Segments"
      icon: "pie-chart"
      type: "weight"
      color: "blue"
      weight: 70
      category_id: "Market"

    - name: "Profiles"
      icon: "user"
      type: "weight"
      color: "blue"
      weight: 80
      category_id: "Segments"

    - name: "Persona"
      icon: "user-round"
      type: "text"
      color: "blue"
      weight: 40
      category_id: "Profiles"

    - name: "Segmentation"
      icon: "split"
      type: "weight"
      color: "blue"
      weight: 60
      category_id: "Segments"

    - name: "Market trends"
      icon: "trending-up"
      type: "weight"
      color: "blue"
      weight: 20
      category_id: "Segments"

    - name: "Market size"
      icon: "ruler"
      type: "text"
      color: "blue"
      weight: 50
      category_id: "Segments"

    - name: "Competition"
      icon: "swords"
      type: "weight"
      color: "blue"
      weight: 40
      category_id: "Segments"

    - name: "Roles"
      icon: "user-cog"
      type: "weight"
      color: "blue"
      weight: 30
      category_id: "Segments"

    - name: "Problems"
      icon: "circle-alert"
      type: "weight"
      color: "blue"
      weight: 85
      category_id: "Segments"

    - name: "Value propositions"
      icon: "gem"
      type: "weight"
      color: "blue"
      weight: 70
      category_id: "Segments"

    - name: "Messages"
      icon: "message-square"
      type: "weight"
      color: "blue"
      weight: 40
      category_id: "Segments"

    - name: "Channels"
      icon: "share-2"
      type: "weight"
      color: "blue"
      weight: 70
      category_id: "Segments"

    - name: "Relationships"
      icon: "handshake"
      type: "text"
      color: "blue"
      weight: 50
      category_id: "Segments"

    - name: "Perceptions"
      icon: "eye"
      type: "weight"
      color: "blue"
      weight: 40
      category_id: "Segments"

    - name: "Emotions"
      icon: "heart"
      type: "weight"
      color: "blue"
      weight: 40
      category_id: "Segments"

    - name: "Behaviors"
      icon: "activity"
      type: "weight"
      color: "blue"
      weight: 40
      category_id: "Segments"

    - name: "Journey"
      icon: "route"
      type: "steps"
      color: "blue"
      weight: 40
      category_id: "Segments"

    - name: "Solutions"
      icon: "lightbulb"
      type: "category"
      color: "blue"
      weight: 90

    - name: "Products and services"
      icon: "package"
      type: "weight"
      color: "blue"
      weight: 80
      category_id: "Solutions"

    - name: "Portfolio"
      icon: "briefcase"
      type: "text"
      color: "blue"
      weight: 80
      category_id: "Products and services"

    - name: "Components"
      icon: "puzzle"
      type: "weight"
      color: "blue"
      weight: 20
      category_id: "Products and services"

    - name: "Features"
      icon: "sparkles"
      type: "weight"
      color: "blue"
      weight: 40
      category_id: "Products and services"

    - name: "Roadmap"
      icon: "map"
      type: "steps"
      color: "blue"
      weight: 20
      category_id: "Products and services"

    - name: "Pricing"
      icon: "tag"
      type: "text"
      color: "blue"
      weight: 40
      category_id: "Products and services"

    - name: "Offerings"
      icon: "shopping-bag"
      type: "weight"
      color: "blue"
      weight: 40
      category_id: "Products and services"

    - name: "Brochure"
      icon: "book-open"
      type: "text"
      color: "blue"
      weight: 40
      category_id: "Products and services"

    - name: "Marketing"
      icon: "megaphone"
      type: "category"
      color: "blue"
      weight: 60
      category_id: "Solutions"

    - name: "Naming"
      icon: "type"
      type: "text"
      color: "blue"
      weight: 40
      category_id: "Marketing"

    - name: "Branding"
      icon: "palette"
      type: "text"
      color: "blue"
      weight: 40
      category_id: "Marketing"

    - name: "Visual identity"
      icon: "image"
      type: "text"
      color: "blue"
      weight: 10
      category_id: "Marketing"

    - name: "Logo"
      icon: "shapes"
      type: "text"
      color: "blue"
      weight: 10
      category_id: "Marketing"

    - name: "Media plan"
      icon: "newspaper"
      type: "text"
      color: "blue"
      weight: 10
      category_id: "Marketing"

    - name: "Communication"
      icon: "message-circle"
      type: "category"
      color: "blue"
      weight: 50
      category_id: "Solutions"

    - name: "Pitch"
      icon: "presentation"
      type: "text"
      color: "blue"
      weight: 40
      category_id: "Communication"

    - name: "Web"
      icon: "globe"
      type: "text"
      color: "blue"
      weight: 40
      category_id: "Communication"

    - name: "Storytelling"
      icon: "feather"
      type: "text"
      color: "blue"
      weight: 20
      category_id: "Communication"

    - name: "Presentations"
      icon: "monitor-play"
      type: "text"
      color: "blue"
      weight: 35
      category_id: "Communication"

    - name: "Organization"
      icon: "building-2"
      type: "category"
      color: "blue"
      weight: 60

    - name: "Business idea"
      icon: "lightbulb"
      type: "category"
      color: "blue"
      weight: 60
      category_id: "Organization"

    - name: "Inspiration"
      icon: "sparkles"
      type: "weight"
      color: "blue"
      weight: 30
      category_id: "Business idea"

    - name: "Opportunity"
      icon: "door-open"
      type: "weight"
      color: "blue"
      weight: 40
      category_id: "Business idea"

    - name: "Business status"
      icon: "heart-pulse"
      type: "text"
      color: "blue"
      weight: 70
      category_id: "Business idea"

    - name: "Challenges"
      icon: "mountain"
      type: "weight"
      color: "blue"
      weight: 20
      category_id: "Business idea"

    - name: "Business objectives"
      icon: "target"
      type: "category"
      color: "blue"
      weight: 70
      category_id: "Organization"

    - name: "Mission"
      icon: "target"
      type: "text"
      color: "blue"
      weight: 50
      category_id: "Business objectives"

    - name: "Vision"
      icon: "telescope"
      type: "text"
      color: "blue"
      weight: 40
      category_id: "Business objectives"

    - name: "Organizational values"
      icon: "compass"
      type: "weight"
      color: "blue"
      weight: 35
      category_id: "Business objectives"

    - name: "Organizational goals"
      icon: "flag"
      type: "weight"
      color: "blue"
      weight: 60
      category_id: "Business objectives"

    - name: "Operations"
      icon: "settings"
      type: "category"
      color: "blue"
      weight: 50
      category_id: "Organization"

    - name: "Activities"
      icon: "list-checks"
      type: "weight"
      color: "blue"
      weight: 40
      category_id: "Operations"

    - name: "Functions"
      icon: "workflow"
      type: "weight"
      color: "blue"
      weight: 30
      category_id: "Operations"

    - name: "Resources"
      icon: "boxes"
      type: "weight"
      color: "blue"
      weight: 30
      category_id: "Operations"

    - name: "Team"
      icon: "users-round"
      type: "category"
      color: "blue"
      weight: 70
      category_id: "Organization"

    - name: "Goals"
      icon: "goal"
      type: "weight"
      color: "blue"
      weight: 30
      category_id: "Team"

    - name: "Skills"
      icon: "award"
      type: "weight"
      color: "blue"
      weight: 30
      category_id: "Team"

    - name: "Contributions"
      icon: "gift"
      type: "weight"
      color: "blue"
      weight: 10
      category_id: "Team"

    - name: "Compensations"
      icon: "hand-coins"
      type: "weight"
      color: "blue"
      weight: 10
      category_id: "Team"

    - name: "Positions"
      icon: "contact"
      type: "weight"
      color: "blue"
      weight: 20
      category_id: "Team"

    - name: "Project plan"
      icon: "calendar-range"
      type: "category"
      color: "blue"
      weight: 30
      category_id: "Organization"

    - name: "Phases"
      icon: "layers"
      type: "steps"
      color: "blue"
      weight: 20
      category_id: "Project plan"

    - name: "Milestones"
      icon: "milestone"
      type: "sequence"
      color: "blue"
      weight: 10
      category_id: "Project plan"

    - name: "Metrics"
      icon: "gauge"
      type: "weight"
      color: "blue"
      weight: 50
      category_id: "Organization"

    - name: "Finance"
      icon: "banknote"
      type: "category"
      color: "blue"
      weight: 70
      category_id: "Organization"

    - name: "Revenue"
      icon: "coins"
      type: "weight"
      color: "blue"
      weight: 65
      category_id: "Finance"

    - name: "Life Time Value"
      icon: "repeat"
      type: "text"
      color: "blue"
      weight: 35
      category_id: "Finance"

    - name: "Costs"
      icon: "receipt"
      type: "weight"
      color: "blue"
      weight: 50
      category_id: "Finance"

    - name: "Customer Aquisition Cost"
      icon: "user-plus"
      type: "text"
      color: "blue"
      weight: 35
      category_id: "Finance"

    - name: "Unit economics"
      icon: "calculator"
      type: "text"
      color: "blue"
      weight: 25
      category_id: "Finance"

    - name: "Funding sources"
      icon: "landmark"
      type: "weight"
      color: "blue"
      weight: 25
      category_id: "Finance"

    - name: "Shareholders"
      icon: "pie-chart"
      type: "weight"
      color: "blue"
      weight: 20
      category_id: "Finance"

    - name: "Projections"
      icon: "line-chart"
      type: "weight"
      color: "blue"
      weight: 20
      category_id: "Finance"

    - name: "Legal"
      icon: "scale"
      type: "category"
      color: "blue"
      weight: 40
      category_id: "Organization"

    - name: "Legal issues"
      icon: "gavel"
      type: "weight"
      color: "blue"
      weight: 40
      category_id: "Legal"

    - name: "Contracts"
      icon: "scroll-text"
      type: "weight"
      color: "blue"
      weight: 10
      category_id: "Legal"

    - name: "Matrices"
      icon: "grid-3x3"
      type: "weight"
      color: null
      weight: 40

    - name: "Analysis"
      icon: "microscope"
      type: "category"
      color: "red"
      weight: 80

    - name: "Assumptions"
      icon: "circle-help"
      type: "weight"
      color: "red"
      weight: 50
      category_id: "Analysis"

    - name: "Risks"
      icon: "shield-alert"
      type: "weight"
      color: "red"
      weight: 90
      category_id: "Analysis"

    - name: "Suggestions"
      icon: "messages-square"
      type: "weight"
      color: "red"
      weight: 30
      category_id: "Analysis"

    - name: "Unfair advantage"
      icon: "zap"
      type: "text"
      color: "blue"
      weight: 30
      category_id: "Analysis"

    - name: "SWOT"
      icon: "layout-grid"
      type: "text"
      color: "red"
      weight: 10
      category_id: "Analysis"

    - name: "Keys"
      icon: "key-round"
      type: "weight"
      color: "red"
      weight: 50

    - name: "Validation"
      icon: "clipboard-check"
      type: "category"
      color: "green"
      weight: 90

    - name: "Coherence"
      icon: "link"
      type: "weight"
      color: "green"
      weight: 25
      category_id: "Validation"

    - name: "Experiments"
      icon: "flask-conical"
      type: "weight"
      color: "green"
      weight: 40
      category_id: "Validation"

    - name: "Misc"
      icon: "ellipsis"
      type: "text"
      color: "grey"
      weight: 10

  markers:
    - name: "weight"
      symbol: "*"
      icon: "plus"
      color: "blue"
    - name: "completion"
      symbol: ">"
      icon: "check"
      color: "blue"
    - name: "certainty"
      symbol: "?"
      icon: "help-circle"
      color: "green"
    - name: "priority"
      symbol: "!"
      icon: "flag"
      color: "red"
    - name: "rating"
      symbol: "+"
      icon: "star"
      color: "green"

  matrices:
    - name: "Journey map"
      source: "Journey"
      target: "Emotions"
      params: "Max;Very High;High;Slightly High;Neutral;Slightly Low;Low;Very Low;Min"
    - name: "Segmentation-Profiles Matrix"
      source: "Segmentation"
      target: "Profiles"
      params: "Max;Very High;High;Slightly High;Neutral;Slightly Low;Low;Very Low;Min"
    - name: "Problems-Value propositions Matrix"
      source: "Problems"
      target: "Value propositions"
      params: "Max;Very High;High;Slightly High;Neutral;Slightly Low;Low;Very Low;Min"
    - name: "Value propositions-Messages Matrix"
      source: "Value propositions"
      target: "Messages"
      params: "Max;Very High;High;Slightly High;Neutral;Slightly Low;Low;Very Low;Min"
    - name: "Messages-Channels Matrix"
      source: "Messages"
      target: "Channels"
      params: "Max;Very High;High;Slightly High;Neutral;Slightly Low;Low;Very Low;Min"
    - name: "Assumptions-Risks Matrix"
      source: "Assumptions"
      target: "Risks"
      params: "Max;Very High;High;Slightly High;Neutral;Slightly Low;Low;Very Low;Min"
    - name: "Experiments-Assumptions Matrix"
      source: "Experiments"
      target: "Assumptions"
      params: "Max;Very High;High;Slightly High;Neutral;Slightly Low;Low;Very Low;Min"
    - name: "Metrics-Organizational goals Matrix"
      source: "Metrics"
      target: "Organizational goals"
      params: "Max;Very High;High;Slightly High;Neutral;Slightly Low;Low;Very Low;Min"
    - name: "Features-Milestones Matrix"
      source: "Features"
      target: "Milestones"
      params: "Max;Very High;High;Slightly High;Neutral;Slightly Low;Low;Very Low;Min"
    - name: "Organizational values-Organizational goals Matrix"
      source: "Organizational values"
      target: "Organizational goals"
      params: "Max;Very High;High;Slightly High;Neutral;Slightly Low;Low;Very Low;Min"
    - name: "Functions-Positions Matrix"
      source: "Functions"
      target: "Positions"
      params: "Max;Very High;High;Slightly High;Neutral;Slightly Low;Low;Very Low;Min"
    - name: "Activities-Resources Matrix"
      source: "Activities"
      target: "Resources"
      params: "Max;Very High;High;Slightly High;Neutral;Slightly Low;Low;Very Low;Min"
    - name: "Problems-Competition Matrix"
      source: "Problems"
      target: "Competition"
      params: "Max;Very High;High;Slightly High;Neutral;Slightly Low;Low;Very Low;Min"
    - name: "item-markers matrix"
      source: "elements"
      target: "markers"
---

# <!-- block: concepts --> Business summary

Brief description of your business — how it creates value, for whom, and the logic behind how it generates revenue.

# <!-- block: concepts --> Market

# <!-- block: concepts --> Stakeholders

* <!-- block: Stakeholders --> Stakeholder name
Description of this stakeholder and their role in the business.

# <!-- block: concepts --> Segments

* <!-- block: Segments --> Segment name
Description of this customer segment.

# <!-- block: concepts --> Profiles

* <!-- block: Profiles --> Profile name
Description of this customer profile.

# <!-- block: concepts --> Persona

Detailed narrative description of a specific customer archetype — demographics, motivations, fears, and daily context.

# <!-- block: concepts --> Segmentation

* <!-- block: Segmentation --> Segmentation criterion
Description of this criterion and the values it takes.

# <!-- block: concepts --> Market trends

* <!-- block: Market trends --> Trend name
Description of this market trend and its implications.

# <!-- block: concepts --> Market size

Quantitative and qualitative description of the addressable market — TAM, SAM, and SOM if available.

# <!-- block: concepts --> Competition

* <!-- block: Competition --> Competitor name
Description of this competitor and how they address the market.

# <!-- block: concepts --> Roles

* <!-- block: Roles --> Role name
Description of this role in the customer's buying process.

# <!-- block: concepts --> Problems

* <!-- block: Problems --> Problem name
Description of this problem and why it matters to the customer.

# <!-- block: concepts --> Value propositions

* <!-- block: Value propositions --> Value proposition name
Description of this value proposition and the problem it solves.

# <!-- block: concepts --> Messages

* <!-- block: Messages --> Message name
The core message and the audience it targets.

# <!-- block: concepts --> Channels

* <!-- block: Channels --> Channel name
Description of this channel and how it delivers value to customers.

# <!-- block: concepts --> Relationships

Description of the type of relationship the business builds and maintains with each customer segment.

# <!-- block: concepts --> Perceptions

* <!-- block: Perceptions --> Perception name
How customers currently perceive this aspect of the business or market.

# <!-- block: concepts --> Emotions

* <!-- block: Emotions --> Emotion name
Emotional state triggered at a specific point in the customer experience.

# <!-- block: concepts --> Behaviors

* <!-- block: Behaviors --> Behavior name
Observable customer behavior relevant to the business model.

# <!-- block: concepts --> Journey

* Step 1: Awareness
* Step 2: Consideration
* Step 3: Purchase
* Step 4: Retention

# <!-- block: concepts --> Solutions

# <!-- block: concepts --> Products and services

* <!-- block: Products and services --> Product or service name
Description of this product or service offering.

# <!-- block: concepts --> Portfolio

Overview of the full product and service portfolio — positioning, tiers, and strategic rationale.

# <!-- block: concepts --> Components

* <!-- block: Components --> Component name
Description of this component and the product it belongs to.

# <!-- block: concepts --> Features

* <!-- block: Features --> Feature name
Description of this feature and the customer need it addresses.

# <!-- block: concepts --> Roadmap

* Phase 1: MVP
* Phase 2: Growth
* Phase 3: Scale

# <!-- block: concepts --> Pricing

Description of the pricing model — tiers, logic, and competitive positioning.

# <!-- block: concepts --> Offerings

* <!-- block: Offerings --> Offering name
Description of this specific packaged offering.

# <!-- block: concepts --> Brochure

Content and structure of the main sales or marketing brochure.

# <!-- block: concepts --> Marketing

# <!-- block: concepts --> Naming

Brand name rationale, naming conventions, and naming system across products and sub-brands.

# <!-- block: concepts --> Branding

Brand identity — personality, tone of voice, positioning, and brand promise.

# <!-- block: concepts --> Visual identity

Visual identity system — color palette, typography, and visual language.

# <!-- block: concepts --> Logo

Logo description, usage rules, and variants.

# <!-- block: concepts --> Media plan

Media channels, budget allocation, timing, and expected reach.

# <!-- block: concepts --> Communication

# <!-- block: concepts --> Pitch

Core pitch narrative — problem, solution, traction, and ask.

# <!-- block: concepts --> Web

Website structure, key pages, messaging hierarchy, and conversion goals.

# <!-- block: concepts --> Storytelling

Brand story — origin, mission, and narrative arc used across communication materials.

# <!-- block: concepts --> Presentations

Key presentations — target audiences, objectives, and structure.

# <!-- block: concepts --> Organization

# <!-- block: concepts --> Business idea

# <!-- block: concepts --> Inspiration

* <!-- block: Inspiration --> Inspiration source
What triggered this idea and why it matters.

# <!-- block: concepts --> Opportunity

* <!-- block: Opportunity --> Opportunity name
Description of this market opportunity and why now is the right time.

# <!-- block: concepts --> Business status

Current stage of the business — ideation, validation, early traction, growth, or scale.

# <!-- block: concepts --> Challenges

* <!-- block: Challenges --> Challenge name
Description of this challenge and its impact on the business.

# <!-- block: concepts --> Business objectives

# <!-- block: concepts --> Mission

One or two sentences describing why the business exists and who it serves.

# <!-- block: concepts --> Vision

The long-term aspirational state the business is working toward.

# <!-- block: concepts --> Organizational values

* <!-- block: Organizational values --> Value name
Description of this organizational value and how it manifests in practice.

# <!-- block: concepts --> Organizational goals

* <!-- block: Organizational goals --> Goal name
Description of this goal, its target, and the timeframe.

# <!-- block: concepts --> Operations

# <!-- block: concepts --> Activities

* <!-- block: Activities --> Activity name
Description of this key activity and why it is essential.

# <!-- block: concepts --> Functions

* <!-- block: Functions --> Function name
Description of this operational function and the team responsible.

# <!-- block: concepts --> Resources

* <!-- block: Resources --> Resource name
Description of this key resource and how it is acquired or maintained.

# <!-- block: concepts --> Team

# <!-- block: concepts --> Goals

* <!-- block: Goals --> Goal name
Individual or team goal with measurable outcome.

# <!-- block: concepts --> Skills

* <!-- block: Skills --> Skill name
Key skill required by the team and current level of proficiency.

# <!-- block: concepts --> Contributions

* <!-- block: Contributions --> Contribution name
Description of a specific contribution by a team member or role.

# <!-- block: concepts --> Compensations

* <!-- block: Compensations --> Compensation name
Compensation structure — salary, equity, bonuses, or benefits.

# <!-- block: concepts --> Positions

* <!-- block: Positions --> Position name
Description of this position, its responsibilities, and reporting line.

# <!-- block: concepts --> Project plan

# <!-- block: concepts --> Phases

* Phase 1: Foundation
* Phase 2: Build
* Phase 3: Launch

# <!-- block: concepts --> Milestones

* 2026-Q1: Milestone 1
* 2026-Q2: Milestone 2
* 2026-Q3: Milestone 3

# <!-- block: concepts --> Metrics

* <!-- block: Metrics --> Metric name
Definition of this metric, how it is measured, and the target value.

# <!-- block: concepts --> Finance

# <!-- block: concepts --> Revenue

* <!-- block: Revenue --> Revenue stream name
Description of this revenue stream — model, pricing, and expected volume.

# <!-- block: concepts --> Life Time Value

Estimated LTV per customer — calculation methodology and assumptions.

# <!-- block: concepts --> Costs

* <!-- block: Costs --> Cost item name
Description of this cost, whether fixed or variable, and estimated amount.

# <!-- block: concepts --> Customer Aquisition Cost

Estimated CAC by channel — calculation methodology and assumptions.

# <!-- block: concepts --> Unit economics

Unit economics breakdown — revenue per unit, variable cost per unit, contribution margin.

# <!-- block: concepts --> Funding sources

* <!-- block: Funding sources --> Funding source name
Description of this funding source — type, amount, and terms.

# <!-- block: concepts --> Shareholders

* <!-- block: Shareholders --> Shareholder name
Shareholder details — ownership percentage and role in the company.

# <!-- block: concepts --> Projections

* <!-- block: Projections --> Projection name
Financial projection — period, key assumptions, and expected outcome.

# <!-- block: concepts --> Legal

# <!-- block: concepts --> Legal issues

* <!-- block: Legal issues --> Legal issue name
Description of this legal issue, its status, and mitigation approach.

# <!-- block: concepts --> Contracts

* <!-- block: Contracts --> Contract name
Description of this contract — parties involved, scope, and status.

# <!-- block: concepts --> Matrices

* <!-- block: Matrices --> Matrix name
Description of this relational matrix and what it expresses.

# <!-- block: concepts --> Analysis

# <!-- block: concepts --> Assumptions

* <!-- block: Assumptions --> Assumption name
Description of this assumption and the evidence or reasoning behind it.

# <!-- block: concepts --> Risks

* <!-- block: Risks --> Risk name
Description of this risk, its likelihood, impact, and mitigation strategy.

# <!-- block: concepts --> Suggestions

* <!-- block: Suggestions --> Suggestion name
Suggested improvement or action based on analysis.

# <!-- block: concepts --> Unfair advantage

Description of what the business has that cannot be easily copied or bought by competitors.

# <!-- block: concepts --> SWOT

Strengths, Weaknesses, Opportunities, and Threats summary.

# <!-- block: concepts --> Keys

* <!-- block: Keys --> Key name
A critical insight or dependency that the entire business model rests on.

# <!-- block: concepts --> Validation

# <!-- block: concepts --> Coherence

* <!-- block: Coherence --> Coherence check name
Description of a coherence check — what two elements are being compared and whether they align.

# <!-- block: concepts --> Experiments

* <!-- block: Experiments --> Experiment name
Description of this experiment — hypothesis, method, and expected outcome.

# <!-- block: concepts --> Misc

Free-form notes, context, or content that does not fit any other concept.

<!-- block: matrices -->

# <!-- block: matrices --> Journey map

| Journey \ Emotions | Emotion A | Emotion B |
| :--- | :---: | :---: |
| Step 1: Awareness | High | - |
| Step 2: Consideration | - | Neutral |

# <!-- block: matrices --> Segmentation-Profiles Matrix

| Segmentation \ Profiles | Profile name |
| :--- | :---: |
| Segmentation criterion | Max |

# <!-- block: matrices --> Problems-Value propositions Matrix

| Problems \ Value propositions | Value proposition name |
| :--- | :---: |
| Problem name | Max |

# <!-- block: matrices --> Value propositions-Messages Matrix

| Value propositions \ Messages | Message name |
| :--- | :---: |
| Value proposition name | Max |

# <!-- block: matrices --> Messages-Channels Matrix

| Messages \ Channels | Channel name |
| :--- | :---: |
| Message name | Max |

# <!-- block: matrices --> Assumptions-Risks Matrix

| Assumptions \ Risks | Risk name |
| :--- | :---: |
| Assumption name | Max |

# <!-- block: matrices --> Experiments-Assumptions Matrix

| Experiments \ Assumptions | Assumption name |
| :--- | :---: |
| Experiment name | Max |

# <!-- block: matrices --> Metrics-Organizational goals Matrix

| Metrics \ Organizational goals | Goal name |
| :--- | :---: |
| Metric name | Max |

# <!-- block: matrices --> Features-Milestones Matrix

| Features \ Milestones | Milestone |
| :--- | :---: |
| Feature name | Max |

# <!-- block: matrices --> Organizational values-Organizational goals Matrix

| Organizational values \ Organizational goals | Goal name |
| :--- | :---: |
| Value name | Max |

# <!-- block: matrices --> Functions-Positions Matrix

| Functions \ Positions | Position name |
| :--- | :---: |
| Function name | Max |

# <!-- block: matrices --> Activities-Resources Matrix

| Activities \ Resources | Resource name |
| :--- | :---: |
| Activity name | Max |

# <!-- block: matrices --> Problems-Competition Matrix

| Problems \ Competition | Competitor name |
| :--- | :---: |
| Problem name | Max |

# <!-- block: matrices --> item-markers matrix

| Item \ Marker | weight | completion | certainty | priority | rating |
| :--- | :---: | :---: | :---: | :---: | :---: |
| Element name | - | - | - | - | - |
