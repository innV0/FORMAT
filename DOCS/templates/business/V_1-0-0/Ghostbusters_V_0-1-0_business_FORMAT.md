---
specification_version: "V_0-1-2"
specification_url: "https://raw.githubusercontent.com/innV0/FORMAT/main/DOCS/V_0-1-2/_format.md"
title: "Ghostbusters Business Model"
model_version: "V_0-1-0"
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

Ghostbusters is a professional paranormal investigation and elimination service based in New York City. Founded by three former university parapsychology researchers, the company captures and safely contains spectral entities that threaten residential and commercial properties. Revenue is generated through per-incident service fees and long-term containment contracts with property managers, hotels, and municipal agencies.

# <!-- block: concepts --> Market

# <!-- block: concepts --> Stakeholders

* <!-- block: Stakeholders --> B2C Residential Clients
Individual homeowners and tenants experiencing active paranormal activity in private residences. Motivated by fear and urgency.

* <!-- block: Stakeholders --> B2B Commercial Clients
Hotels, restaurants, offices, and event venues requiring fast, discreet service to protect revenue and reputation.

* <!-- block: Stakeholders --> Municipal Authorities
City emergency agencies activated during large-scale spectral events requiring specialist containment support.

* <!-- block: Stakeholders --> Insurance Companies
Property insurers that refer clients after ghost-related damage claims and may co-brand certified containment services.

# <!-- block: concepts --> Segments

* <!-- block: Segments --> Distressed Homeowners
Residential clients with active haunting. Price-sensitive but willing to pay for guaranteed results.

* <!-- block: Segments --> Haunted Hotel Managers
Hospitality operators facing reputational risk. Require fast, discreet service and post-intervention documentation.

* <!-- block: Segments --> City Emergency Contacts
Public-sector contacts during large-scale incidents. Slow procurement but high-value contracts.

# <!-- block: concepts --> Profiles

* <!-- block: Profiles --> Terrified Tenant
Young or middle-aged urban renter experiencing unexplained phenomena. Has no prior contact with paranormal services.

* <!-- block: Profiles --> Property Manager
Operations-focused professional responsible for multiple buildings. Prioritizes speed, discretion, and documentation.

# <!-- block: concepts --> Persona

Dana Barrett, 32, musician living in a Central Park West apartment. She started noticing strange noises and cold spots three weeks ago. She is rational and skeptical but desperate — the phenomena are escalating and she can't sleep. She has no idea where to turn. She googles "ghost removal NYC" at 2am and finds Ghostbusters. She calls immediately, credit card in hand.

# <!-- block: concepts --> Segmentation

* <!-- block: Segmentation --> Geography
NYC metro area — Manhattan, Brooklyn, Queens, The Bronx, Staten Island.

* <!-- block: Segmentation --> Client type
B2C residential vs. B2B commercial vs. government.

* <!-- block: Segmentation --> Incident severity
Class I (minor, no physical manifestation) to Class V (full physical manifestation, structural risk).

# <!-- block: concepts --> Market trends

* <!-- block: Market trends --> Increased spectral activity post-2020
Paranormal incident reports in NYC have risen 340% since 2020, creating first-time demand in previously skeptical demographics.

* <!-- block: Market trends --> Insurance sector interest
Two major property insurers are piloting ghost-certified inspection programs, creating a potential B2B2C referral channel.

# <!-- block: concepts --> Market size

Estimated 12,000 haunting incidents per year in the NYC metro area. At an average service fee of $4,500 per incident, the addressable market is approximately $54M/year. Ghostbusters is currently capturing ~2% market share.

# <!-- block: concepts --> Competition

* <!-- block: Competition --> Ghost Getters Inc.
Low-cost competitor operating in outer boroughs. No containment capability — they only "relocate" entities, leading to re-infestation within 90 days.

* <!-- block: Competition --> ParaSolutions LLC
Upmarket competitor targeting luxury real estate. Higher fees but 3-week average response time.

# <!-- block: concepts --> Roles

* <!-- block: Roles --> Decision Maker
The property owner or manager who authorizes and pays for the service.

* <!-- block: Roles --> Influencer
Tenants, guests, or staff who trigger the call by reporting the incident.

* <!-- block: Roles --> End User
The person who experiences the haunting and whose quality of life is directly affected.

# <!-- block: concepts --> Problems

* <!-- block: Problems --> Uncontrolled spectral infestations
Property owners have no reliable, professional service to safely eliminate ghosts. Amateur attempts worsen the situation.

* <!-- block: Problems --> Reputational damage from hauntings
Hotels and public venues suffer guest loss and revenue decline when incidents become public.

* <!-- block: Problems --> Lack of permanent containment
Captured entities must be stored indefinitely. No public infrastructure exists; improper disposal creates hazards.

* <!-- block: Problems --> Fear and psychological distress
Occupants suffer anxiety, sleep disruption, and trauma. No crisis support exists alongside technical remediation.

# <!-- block: concepts --> Value propositions

* <!-- block: Value propositions --> Instant Spectral Capture
Rapid on-site response with proprietary proton-pack technology that captures any class of entity safely within hours.

* <!-- block: Value propositions --> Property Damage Mitigation
Service guarantee covering minor collateral damage during extraction, reducing client liability and insurance claims.

* <!-- block: Value propositions --> Permanent Containment
Secure off-site storage in a purpose-built containment grid — permanent resolution, not relocation.

* <!-- block: Value propositions --> Certified Documentation
Full incident report and containment certificate for insurance, legal, and resale purposes.

# <!-- block: concepts --> Messages

* <!-- block: Messages --> Who you gonna call?
Top-of-mind recall message for emergency situations. Targets B2C residential in high-fear moments.

* <!-- block: Messages --> Protect your property. Protect your reputation.
B2B message targeting hotel and property managers. Emphasizes business continuity and discretion.

* <!-- block: Messages --> Certified. Contained. Documented.
Trust-building message for insurance and legal stakeholders.

# <!-- block: concepts --> Channels

* <!-- block: Channels --> Emergency hotline (555-2368)
24/7 inbound phone line. Primary channel for B2C residential clients in active crisis.

* <!-- block: Channels --> Direct B2B sales team
Account executives targeting hotel chains, property management groups, and municipal agencies.

* <!-- block: Channels --> Insurance partner referrals
Referral pipeline from co-branded partners in the property insurance sector.

* <!-- block: Channels --> Word of mouth
Primary organic growth driver in B2C. Satisfied clients refer neighbors and building contacts.

# <!-- block: concepts --> Relationships

B2C clients are managed as one-time emergency transactions with follow-up for containment renewals. B2B clients receive dedicated account management, quarterly reviews, and priority response SLAs. Municipal clients are managed through formal contract structures with annual renewals.

# <!-- block: concepts --> Perceptions

* <!-- block: Perceptions --> "Are they real?"
Many first-time callers doubt the company's legitimacy. Social proof and media coverage are key trust signals.

* <!-- block: Perceptions --> "Will they make a mess?"
B2B clients fear visible equipment and disruption. Discreet uniforms and clean protocols address this directly.

# <!-- block: concepts --> Emotions

* <!-- block: Emotions --> Fear
The dominant emotion at point of first contact. Drives urgency and willingness to pay.

* <!-- block: Emotions --> Relief
The emotion immediately post-service. The most powerful driver of referrals and reviews.

* <!-- block: Emotions --> Skepticism
Pre-purchase barrier. Overcome through testimonials, certifications, and media coverage.

# <!-- block: concepts --> Behaviors

* <!-- block: Behaviors --> Late-night emergency search
Most B2C first contacts originate between 11pm and 3am via mobile search.

* <!-- block: Behaviors --> Delay before calling
Average client waits 3–4 weeks after first incident before contacting Ghostbusters. Fear of being judged.

* <!-- block: Behaviors --> Sharing the story
Post-service, 68% of B2C clients share their experience on social media or with neighbors within 48 hours.

# <!-- block: concepts --> Journey

* Step 1: Incident occurs — client experiences unexplained phenomena
* Step 2: Denial and self-research — client tries DIY solutions, googles symptoms
* Step 3: Decision to call — urgency overcomes skepticism
* Step 4: Service delivery — on-site capture and containment
* Step 5: Resolution and documentation — client receives certificate and report
* Step 6: Referral — client shares experience with network

# <!-- block: concepts --> Solutions

# <!-- block: concepts --> Products and services

* <!-- block: Products and services --> Residential Ghost Removal
On-site investigation, capture, and containment for private residences. Per-incident pricing.

* <!-- block: Products and services --> Commercial Paranormal Response
Priority response service for hotels, offices, and public venues. Includes discretion protocol and documentation package.

* <!-- block: Products and services --> Containment Storage Subscription
Monthly fee for ongoing secure storage of captured entities in the Ghostbusters containment grid.

* <!-- block: Products and services --> Paranormal Risk Assessment
Pre-purchase property inspection for real estate transactions. Flat-fee report with certified findings.

# <!-- block: concepts --> Portfolio

The portfolio spans emergency response (high urgency, high margin), recurring containment storage (predictable MRR), and advisory services (low volume, high value). Emergency response drives customer acquisition; storage subscriptions drive LTV.

# <!-- block: concepts --> Components

* <!-- block: Components --> Proton Pack
Proprietary particle accelerator backpack used to wrangle and capture spectral entities. Core hardware asset.

* <!-- block: Components --> Ghost Trap
Containment device that locks captured entities for transport to the storage grid.

* <!-- block: Components --> PKE Meter
Detection instrument used during investigation phase to locate and classify entities.

* <!-- block: Components --> Ecto-1
Custom-modified emergency response vehicle. Enables rapid deployment across NYC.

# <!-- block: concepts --> Features

* <!-- block: Features --> 2-hour response guarantee
Guaranteed on-site arrival within 2 hours of confirmed booking in the NYC metro area.

* <!-- block: Features --> Class V entity capability
Proton technology capable of capturing full physical manifestation entities — the highest threat class.

* <!-- block: Features --> Digital incident report
Automated post-service documentation delivered within 24 hours, accepted by major insurers.

* <!-- block: Features --> Discretion protocol
Unmarked vehicle option and plain-clothes team available for high-profile commercial clients.

# <!-- block: concepts --> Roadmap

* Phase 1: NYC operations stabilized — full team, containment grid operational
* Phase 2: B2B commercial contracts — hotel chains and property management groups
* Phase 3: Insurance partnerships — co-branded referral programs with two major insurers
* Phase 4: Franchise model — expand to Boston, Chicago, Los Angeles

# <!-- block: concepts --> Pricing

Residential removal: $2,500–$6,000 depending on entity class. Commercial response: $5,000–$15,000 with SLA pricing. Containment storage: $150/entity/month. Risk assessment: $800 flat fee. All pricing includes the standard documentation package.

# <!-- block: concepts --> Offerings

* <!-- block: Offerings --> Essential Response
Investigation + capture + basic report. Entry-level offering for residential clients.

* <!-- block: Offerings --> Complete Resolution
Investigation + capture + containment + full documentation package. Standard B2B offering.

* <!-- block: Offerings --> Priority Partner
SLA-backed annual contract for commercial clients. Includes quarterly risk assessments and dedicated account manager.

# <!-- block: concepts --> Brochure

Front: "Who You Gonna Call?" headline, Ecto-1 hero image, 3-step process (Call → Capture → Certified). Back: client testimonials, certifications, QR code to booking page and case studies.

# <!-- block: concepts --> Marketing

# <!-- block: concepts --> Naming

"Ghostbusters" — direct, memorable, category-defining. Sub-brand: "GB Certified" for the documentation and inspection line targeting insurance and real estate.

# <!-- block: concepts --> Branding

Brand personality: professional, brave, slightly irreverent. Tone: confident and reassuring, never sensationalist. Positioning: the reliable experts in a field everyone needs but nobody talks about.

# <!-- block: concepts --> Visual identity

Primary colors: red (urgency, action) and white (cleanliness, professionalism). Secondary: charcoal grey. Typography: bold sans-serif for headlines, clean sans-serif for body. No-Ghost logo as universal identifier.

# <!-- block: concepts --> Logo

The No-Ghost symbol — universally recognizable, trademarked. Used on all vehicles, uniforms, documentation, and digital surfaces. No wordmark required in NYC; aided awareness is near 100%.

# <!-- block: concepts --> Media plan

Primary: NYC local radio and outdoor (subway, bus shelters) for B2C awareness. Secondary: LinkedIn and trade press for B2B outreach. Earned media: leverage high-profile incident coverage as PR opportunities. Budget: 60% B2C, 40% B2B.

# <!-- block: concepts --> Communication

# <!-- block: concepts --> Pitch

"New York has a ghost problem. Property owners lose thousands — in damage, in guests, in sleep — with nowhere to turn. Ghostbusters is the only certified paranormal elimination and containment service in the northeast. We respond in 2 hours, capture any entity class, and deliver insurance-grade documentation. We're profitable, growing 40% YoY, and raising $2M to expand to three new cities."

# <!-- block: concepts --> Web

ghostbusters.com: Home (emergency CTA above the fold), How It Works (3 steps), Services (with pricing), Case Studies, About, Contact. Mobile-first. Primary conversion: phone call or online booking form.

# <!-- block: concepts --> Storytelling

Three scientists lose their university funding and bet everything on a theory nobody believes. Within a year, they save New York City. The story of Ghostbusters is the story of experts who refused to be dismissed — and who were proven right when it mattered most.

# <!-- block: concepts --> Presentations

* <!-- block: Presentations --> Investor Deck
15 slides: problem, solution, market size, traction, team, financials, ask. Target: seed-stage VCs and angel investors.

* <!-- block: Presentations --> Hotel & Property Manager Pitch
8 slides: risk framing, service overview, response SLA, documentation package, pricing, case study. Target: commercial decision-makers.

# <!-- block: concepts --> Organization

# <!-- block: concepts --> Business idea

# <!-- block: concepts --> Inspiration

* <!-- block: Inspiration --> Academic research in parapsychology
Years of university research on spectral phenomena created the scientific foundation and proprietary technology.

* <!-- block: Inspiration --> NYC's unsolved haunting problem
Observing the complete absence of professional services in a demonstrably real market.

# <!-- block: concepts --> Opportunity

* <!-- block: Opportunity --> Rising spectral activity in urban centers
340% increase in reported incidents creates a market that did not previously exist at scale.

* <!-- block: Opportunity --> Insurance sector readiness
Major insurers are actively seeking certified partners to handle ghost-related claims — a B2B channel with high CAC efficiency.

# <!-- block: concepts --> Business status

Operational. Team of 4, one vehicle, containment grid active. ~$180K revenue in first 6 months. Growing faster than capacity allows. Seeking funding to hire, expand fleet, and build a second containment grid.

# <!-- block: concepts --> Challenges

* <!-- block: Challenges --> Regulatory uncertainty
No legal framework exists for paranormal elimination services. EPA and city authorities are beginning to take interest in containment grid safety standards.

* <!-- block: Challenges --> Capacity constraint
Single Ecto-1 and 3-person field team cannot handle demand spikes. Peak periods result in 6+ hour wait times.

* <!-- block: Challenges --> Credibility gap
A significant portion of the addressable market still dismisses paranormal services as fraudulent. Conversion requires social proof investment.

# <!-- block: concepts --> Business objectives

# <!-- block: concepts --> Mission

To protect people and property from paranormal threats through expert investigation, safe containment, and certified documentation.

# <!-- block: concepts --> Vision

A world where every city has access to professional paranormal response — and where Ghostbusters is the globally recognized standard.

# <!-- block: concepts --> Organizational values

* <!-- block: Organizational values --> Scientific rigor
Every intervention is grounded in parapsychological research and documented with precision.

* <!-- block: Organizational values --> Courage under pressure
The team operates in high-fear environments. Professionalism never breaks, regardless of entity class.

* <!-- block: Organizational values --> Client discretion
What happens in a client's property stays in the report — shared only with the client and their insurer.

# <!-- block: concepts --> Organizational goals

* <!-- block: Organizational goals --> Reach $1M ARR by end of Year 2
Through a combination of incident fees, containment subscriptions, and commercial contracts.

* <!-- block: Organizational goals --> Sign 3 hotel chain agreements in Year 1
Establish B2B commercial revenue as 30% of total revenue.

* <!-- block: Organizational goals --> Achieve regulatory clarity on containment
Work with NYC authorities to establish a legal framework before EPA intervention forces a shutdown.

# <!-- block: concepts --> Operations

# <!-- block: concepts --> Activities

* <!-- block: Activities --> Emergency dispatch and response
24/7 hotline management, routing, and field team deployment within the 2-hour SLA.

* <!-- block: Activities --> Entity investigation and classification
On-site PKE scanning, entity classification, and capture protocol selection.

* <!-- block: Activities --> Containment grid maintenance
Daily monitoring and maintenance of the storage grid. Critical for operational continuity.

* <!-- block: Activities --> Documentation and reporting
Post-incident report generation and delivery within 24 hours.

# <!-- block: concepts --> Functions

* <!-- block: Functions --> Field Operations
Investigation, capture, and containment. Core service delivery function.

* <!-- block: Functions --> Dispatch & Customer Service
Inbound call handling, booking, SLA management, and client communication.

* <!-- block: Functions --> Research & Development
Ongoing improvement of capture technology and containment protocols.

* <!-- block: Functions --> Sales & Partnerships
B2B outreach, contract negotiation, and insurance partner management.

# <!-- block: concepts --> Resources

* <!-- block: Resources --> Proton pack technology
Proprietary and irreplaceable. Loss or regulatory ban would halt operations.

* <!-- block: Resources --> Containment grid
Physical infrastructure storing all captured entities. Must remain operational 24/7.

* <!-- block: Resources --> Scientific expertise
The founding team's 20+ years of combined parapsychology research. The core competitive moat.

* <!-- block: Resources --> Ecto-1 and equipment fleet
Vehicles and field hardware enabling rapid deployment.

# <!-- block: concepts --> Team

# <!-- block: concepts --> Goals

* <!-- block: Goals --> Build second containment grid by Q3
Remove capacity constraint blocking commercial contract growth.

* <!-- block: Goals --> Hire 2 additional field technicians by Q2
Reduce response time during peak periods and enable simultaneous multi-site operations.

# <!-- block: concepts --> Skills

* <!-- block: Skills --> Parapsychology research
Deep academic and applied expertise in spectral phenomena. Founding team differentiator.

* <!-- block: Skills --> Proton pack operation
Specialized training required for safe field operation. Currently limited to 3 certified operators.

* <!-- block: Skills --> Crisis communication
Ability to reassure terrified clients while executing a technical procedure under pressure.

# <!-- block: concepts --> Contributions

* <!-- block: Contributions --> Dr. Peter Venkman — business development and client relations
Primary external face of the company. Drives commercial relationships and media opportunities.

* <!-- block: Contributions --> Dr. Egon Spengler — technology and R&D
Designer of all core technology. Maintains and evolves proton and containment systems.

* <!-- block: Contributions --> Dr. Ray Stantz — field operations and logistics
Leads field operations, maintains Ecto-1, and manages equipment inventory.

# <!-- block: concepts --> Compensations

* <!-- block: Compensations --> Founding equity split
33/33/33 among the three co-founders. No salary drawn until $500K ARR reached.

* <!-- block: Compensations --> Field technician salary
$65K/year base + $200 per-incident bonus for additional hires.

# <!-- block: concepts --> Positions

* <!-- block: Positions --> CEO / Head of Business Development
Peter Venkman. Sales, partnerships, media, and investor relations.

* <!-- block: Positions --> CTO / Head of R&D
Egon Spengler. Technology, containment, and research.

* <!-- block: Positions --> COO / Head of Field Operations
Ray Stantz. Dispatch, field team, equipment, and logistics.

* <!-- block: Positions --> Field Technician (open role)
Required hire to meet demand. Reports to COO.

# <!-- block: concepts --> Project plan

# <!-- block: concepts --> Phases

* Phase 1: Stabilize NYC operations — full team, second containment grid, SLA compliance
* Phase 2: Commercial expansion — hotel chains, property managers, insurance partners
* Phase 3: Franchise model — first city outside NYC (target: Chicago)

# <!-- block: concepts --> Milestones

* 2026-Q2: Second containment grid operational
* 2026-Q3: First hotel chain contract signed
* 2026-Q4: $1M ARR reached
* 2027-Q1: First franchise agreement signed

# <!-- block: concepts --> Metrics

* <!-- block: Metrics --> Monthly Recurring Revenue (MRR)
Containment storage subscriptions + commercial SLA contracts. Target: $50K MRR by end of Year 2.

* <!-- block: Metrics --> Average Response Time
Time from confirmed booking to field team on-site. Target: <2 hours for 95% of NYC metro incidents.

* <!-- block: Metrics --> Net Promoter Score (NPS)
Post-service survey. Current NPS: 72. Target: maintain above 65.

* <!-- block: Metrics --> Containment Grid Capacity Utilization
% of grid capacity occupied. Red alert threshold: 85%. Current: 61%.

# <!-- block: concepts --> Finance

# <!-- block: concepts --> Revenue

* <!-- block: Revenue --> Per-incident service fees
Primary revenue driver. $2,500–$15,000 per incident depending on entity class and client type.

* <!-- block: Revenue --> Containment storage subscriptions
$150/entity/month. Growing MRR component. 47 entities currently in storage.

* <!-- block: Revenue --> Paranormal risk assessments
$800 flat fee. Low volume, high margin. Driven by real estate referrals.

# <!-- block: concepts --> Life Time Value

B2C residential: avg. 1.2 incidents over 3 years + 8 months containment storage = ~$4,200 LTV. B2B commercial: avg. annual contract value $28,000 + renewals over 3+ years = ~$84,000 LTV.

# <!-- block: concepts --> Costs

* <!-- block: Costs --> Proton pack maintenance and parts
~$3,200/month across 3 units. Proprietary components, no external supplier.

* <!-- block: Costs --> Containment grid energy and maintenance
~$4,500/month. Fixed cost regardless of occupancy.

* <!-- block: Costs --> Ecto-1 operation and insurance
~$1,800/month fuel, maintenance, and commercial vehicle insurance.

* <!-- block: Costs --> Salaries (current team of 4)
~$18,000/month including founder draws at reduced rate.

# <!-- block: concepts --> Customer Aquisition Cost

B2C: ~$85/customer (primarily word of mouth + local radio). B2B: ~$2,400/client (direct sales effort, 3-month average sales cycle). Insurance partner referral channel (in pilot): estimated $40/customer once live.

# <!-- block: concepts --> Unit economics

Per residential incident: avg. revenue $3,800, variable cost (time + equipment wear) $620, contribution margin $3,180 (84%). Per commercial incident: avg. revenue $9,200, variable cost $1,100, contribution margin $8,100 (88%).

# <!-- block: concepts --> Funding sources

* <!-- block: Funding sources --> Founder capital
$72,000 total bootstrapped across three founders to build initial equipment and secure the firehouse facility.

* <!-- block: Funding sources --> Seed round (open)
Seeking $2M at $8M pre-money valuation to fund second containment grid, two additional field technicians, and B2B sales expansion.

# <!-- block: concepts --> Shareholders

* <!-- block: Shareholders --> Peter Venkman
33.3% equity. Co-founder.

* <!-- block: Shareholders --> Egon Spengler
33.3% equity. Co-founder.

* <!-- block: Shareholders --> Ray Stantz
33.3% equity. Co-founder.

# <!-- block: concepts --> Projections

* <!-- block: Projections --> Year 1 revenue
$380,000 (actuals to date: $180K in 6 months, on track).

* <!-- block: Projections --> Year 2 revenue
$1,100,000 assuming seed round closes Q3 and commercial expansion begins Q4.

* <!-- block: Projections --> Break-even
Projected at $75K MRR (~Month 18 post-seed close).

# <!-- block: concepts --> Legal

# <!-- block: concepts --> Legal issues

* <!-- block: Legal issues --> Containment grid regulatory status
No legal framework exists for storing spectral entities. EPA has begun inquiries. Risk of forced shutdown without proactive engagement.

* <!-- block: Legal issues --> Property damage liability
Three ongoing disputes with clients over collateral damage during extraction. All covered under service guarantee terms.

# <!-- block: concepts --> Contracts

* <!-- block: Contracts --> Firehouse lease
5-year commercial lease on the 8th Avenue firehouse. Expires 2029. Includes containment grid space.

* <!-- block: Contracts --> Zuul Building maintenance contract
Ongoing inspection and response contract with the Zuul Building management. $4,200/month.

# <!-- block: concepts --> Matrices

* <!-- block: Matrices --> Problems-Value propositions Matrix
Maps each customer problem to the value propositions that address it and the strength of the fit.

* <!-- block: Matrices --> Problems-Competition Matrix
Maps each problem to competitors' solutions, highlighting gaps Ghostbusters fills exclusively.

* <!-- block: Matrices --> Activities-Resources Matrix
Maps key operational activities to the resources they consume, identifying critical dependencies.

# <!-- block: concepts --> Analysis

# <!-- block: concepts --> Assumptions

* <!-- block: Assumptions --> Spectral activity will continue to grow
The 340% incident growth trend continues for at least 3 more years, sustaining market expansion.

* <!-- block: Assumptions --> Insurance sector will formalize certification
At least one major insurer will create a certified-provider program within 18 months.

* <!-- block: Assumptions --> Regulatory environment remains permissive
EPA will not impose containment bans before Ghostbusters can establish legal precedent.

# <!-- block: concepts --> Risks

* <!-- block: Risks --> Containment grid failure
A grid malfunction would release all stored entities simultaneously and create a catastrophic public incident. Probability: low. Impact: existential.

* <!-- block: Risks --> EPA shutdown
Regulatory action against the containment grid before legal framework is established. Probability: medium. Impact: existential.

* <!-- block: Risks --> Competitor with better technology
A well-funded competitor could replicate or improve on proton technology within 2–3 years. Probability: low. Impact: high.

# <!-- block: concepts --> Suggestions

* <!-- block: Suggestions --> Hire a regulatory attorney immediately
Before EPA engagement escalates. Proactive legal positioning is far cheaper than reactive defense.

* <!-- block: Suggestions --> Launch containment grid monitoring dashboard
Real-time visibility for clients on their stored entities — builds trust and creates a stickiness mechanism for subscriptions.

# <!-- block: concepts --> Unfair advantage

The only organization in the world with working proton-pack containment technology, developed through 15 years of proprietary academic research. The technology cannot be reverse-engineered without the foundational theoretical framework — which only the three co-founders possess.

# <!-- block: concepts --> SWOT

Strengths: proprietary technology, proven results, strong brand recognition in NYC, high margins. Weaknesses: single-city operations, capacity constrained, regulatory exposure, key-person dependency. Opportunities: insurance partnerships, franchise model, rising incident rates, real estate inspection market. Threats: EPA action, technology replication by well-funded entrant, city-wide power grid vulnerability affecting containment.

# <!-- block: concepts --> Keys

* <!-- block: Keys --> Proton technology is the moat
Without patent protection and trade secret management, the entire competitive advantage disappears.

* <!-- block: Keys --> Regulatory engagement is existential
The business cannot scale without legal clarity on containment. This must be addressed before the seed round closes.

* <!-- block: Keys --> Storage subscriptions are the LTV engine
Incident fees are one-time; storage subscriptions compound. Every capture should be converted to a storage client.

# <!-- block: concepts --> Validation

# <!-- block: concepts --> Coherence

* <!-- block: Coherence --> Mission ↔ Pricing
Mission says "protect people and property" — but current pricing excludes lower-income residential clients. Coherence gap: consider a basic tier or payment plan.

* <!-- block: Coherence --> Value proposition (discretion) ↔ Channel (word of mouth)
Discretion protocol and word-of-mouth growth are in tension — satisfied clients want to share, but commercial clients want silence. Segment-specific communication guidelines needed.

# <!-- block: concepts --> Experiments

* <!-- block: Experiments --> Insurance referral pilot with SafeHome Insurance
Hypothesis: insurance adjusters will refer ghost-damage clients, reducing B2C CAC to <$50. Method: 90-day pilot with 3 adjusters. Success metric: 15+ referrals.

* <!-- block: Experiments --> Containment dashboard beta
Hypothesis: clients with dashboard access will renew storage subscriptions at 20% higher rate. Method: offer to 10 existing storage clients. Success metric: 90-day renewal rate vs. control group.

# <!-- block: concepts --> Misc

This model was created as a sample document for the innV0 FORMAT specification V_0-1-2, demonstrating all concepts defined in the business template V_1-0-0. The Ghostbusters universe is used under fair use for illustrative purposes.

<!-- block: matrices -->

# <!-- block: matrices --> Journey map

| Journey \ Emotions | Fear | Skepticism | Relief | Trust |
| :--- | :---: | :---: | :---: | :---: |
| Step 1: Incident occurs | Max | - | - | - |
| Step 2: Denial and self-research | High | Max | - | - |
| Step 3: Decision to call | High | High | - | Neutral |
| Step 4: Service delivery | Neutral | Low | High | High |
| Step 5: Resolution and documentation | Min | Min | Max | Very High |
| Step 6: Referral | - | - | Very High | Max |

# <!-- block: matrices --> Segmentation-Profiles Matrix

| Segmentation \ Profiles | Terrified Tenant | Property Manager |
| :--- | :---: | :---: |
| Geography | Max | Max |
| Client type | Max | Very High |
| Incident severity | High | Max |

# <!-- block: matrices --> Problems-Value propositions Matrix

| Problems \ Value propositions | Instant Spectral Capture | Property Damage Mitigation | Permanent Containment | Certified Documentation |
| :--- | :---: | :---: | :---: | :---: |
| Uncontrolled spectral infestations | Max | High | Very High | Neutral |
| Reputational damage from hauntings | High | Very High | High | Max |
| Lack of permanent containment | Neutral | Neutral | Max | Very High |
| Fear and psychological distress | Very High | Neutral | High | High |

# <!-- block: matrices --> Value propositions-Messages Matrix

| Value propositions \ Messages | Who you gonna call? | Protect your property. Protect your reputation. | Certified. Contained. Documented. |
| :--- | :---: | :---: | :---: |
| Instant Spectral Capture | Max | High | Neutral |
| Property Damage Mitigation | Neutral | Max | High |
| Permanent Containment | High | High | Very High |
| Certified Documentation | Neutral | High | Max |

# <!-- block: matrices --> Messages-Channels Matrix

| Messages \ Channels | Emergency hotline | Direct B2B sales team | Insurance partner referrals | Word of mouth |
| :--- | :---: | :---: | :---: | :---: |
| Who you gonna call? | Max | Neutral | High | Max |
| Protect your property. Protect your reputation. | Neutral | Max | High | High |
| Certified. Contained. Documented. | Neutral | High | Max | Neutral |

# <!-- block: matrices --> Assumptions-Risks Matrix

| Assumptions \ Risks | Containment grid failure | EPA shutdown | Competitor with better technology |
| :--- | :---: | :---: | :---: |
| Spectral activity will continue to grow | Neutral | Neutral | High |
| Insurance sector will formalize certification | Neutral | Very High | Neutral |
| Regulatory environment remains permissive | High | Max | Neutral |

# <!-- block: matrices --> Experiments-Assumptions Matrix

| Experiments \ Assumptions | Spectral activity will continue to grow | Insurance sector will formalize certification | Regulatory environment remains permissive |
| :--- | :---: | :---: | :---: |
| Insurance referral pilot with SafeHome Insurance | Neutral | Max | Neutral |
| Containment dashboard beta | Neutral | Neutral | High |

# <!-- block: matrices --> Metrics-Organizational goals Matrix

| Metrics \ Organizational goals | Reach $1M ARR by end of Year 2 | Sign 3 hotel chain agreements in Year 1 | Achieve regulatory clarity on containment |
| :--- | :---: | :---: | :---: |
| Monthly Recurring Revenue (MRR) | Max | High | Neutral |
| Average Response Time | High | Max | Neutral |
| Net Promoter Score (NPS) | High | Very High | Neutral |
| Containment Grid Capacity Utilization | High | Neutral | Max |

# <!-- block: matrices --> Features-Milestones Matrix

| Features \ Milestones | Second containment grid operational | First hotel chain contract signed | $1M ARR reached | First franchise agreement signed |
| :--- | :---: | :---: | :---: | :---: |
| 2-hour response guarantee | Very High | High | High | Max |
| Class V entity capability | High | Max | High | Very High |
| Digital incident report | Neutral | Max | High | High |
| Discretion protocol | Neutral | Max | High | High |

# <!-- block: matrices --> Organizational values-Organizational goals Matrix

| Organizational values \ Organizational goals | Reach $1M ARR by end of Year 2 | Sign 3 hotel chain agreements in Year 1 | Achieve regulatory clarity on containment |
| :--- | :---: | :---: | :---: |
| Scientific rigor | High | Very High | Max |
| Courage under pressure | High | High | High |
| Client discretion | Neutral | Max | High |

# <!-- block: matrices --> Functions-Positions Matrix

| Functions \ Positions | CEO / Head of Business Development | CTO / Head of R&D | COO / Head of Field Operations | Field Technician |
| :--- | :---: | :---: | :---: | :---: |
| Field Operations | Neutral | High | Max | Max |
| Dispatch & Customer Service | High | Neutral | Max | High |
| Research & Development | Neutral | Max | High | Neutral |
| Sales & Partnerships | Max | Neutral | High | Neutral |

# <!-- block: matrices --> Activities-Resources Matrix

| Activities \ Resources | Proton pack technology | Containment grid | Scientific expertise | Ecto-1 and equipment fleet |
| :--- | :---: | :---: | :---: | :---: |
| Emergency dispatch and response | Neutral | Neutral | High | Max |
| Entity investigation and classification | High | Neutral | Max | High |
| Containment grid maintenance | Neutral | Max | Max | Neutral |
| Documentation and reporting | Neutral | High | Max | Neutral |

# <!-- block: matrices --> Problems-Competition Matrix

| Problems \ Competition | Ghost Getters Inc. | ParaSolutions LLC |
| :--- | :---: | :---: |
| Uncontrolled spectral infestations | High | Very High |
| Reputational damage from hauntings | Neutral | High |
| Lack of permanent containment | Min | Neutral |
| Fear and psychological distress | Neutral | High |

# <!-- block: matrices --> item-markers matrix

| Item \ Marker | weight | completion | certainty | priority | rating |
| :--- | :---: | :---: | :---: | :---: | :---: |
| Uncontrolled spectral infestations | 5 | 5 | 4 | 5 | - |
| Reputational damage from hauntings | 4 | 4 | 5 | 4 | - |
| Lack of permanent containment | 3 | 5 | 5 | 5 | - |
| Fear and psychological distress | 4 | 4 | 5 | 3 | - |
| Instant Spectral Capture | 5 | 5 | 5 | 5 | 5 |
| Property Damage Mitigation | 4 | 4 | 4 | 4 | 4 |
| Permanent Containment | 5 | 5 | 5 | 5 | 5 |
| Certified Documentation | 4 | 5 | 5 | 4 | 5 |
| B2C Residential Clients | 4 | 5 | 5 | 5 | - |
| B2B Commercial Clients | 5 | 3 | 4 | 5 | - |
| Municipal Authorities | 3 | 2 | 3 | 3 | - |
| Ghost Getters Inc. | 3 | 5 | 4 | 4 | - |
| ParaSolutions LLC | 4 | 5 | 4 | 4 | - |
| Proton pack technology | 5 | 5 | 5 | 5 | 5 |
| Containment grid | 5 | 4 | 5 | 5 | 5 |
| Scientific expertise | 5 | 5 | 5 | 5 | 5 |
| Ecto-1 and equipment fleet | 4 | 3 | 5 | 4 | 3 |
