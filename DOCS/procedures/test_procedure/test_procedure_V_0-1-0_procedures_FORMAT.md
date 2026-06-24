---
specification_version: "V_0-1-2"
model_version: "V_0-1-0"
specification_url: "https://raw.githubusercontent.com/innV0/FORMAT/v0.1.2/docs/spec/V_0-1-2/spec.md"
template:
  name: "procedures"
  version: "V_1-0-0"
  title: "FORMAT Template"
  last_updated: "2026-06-23T21:10:29.637Z"
  concepts:
    - name: "procedure summary"
      icon: "file-text"
      type: "text"
      color: "green"
      weight: 90
    - name: "roles"
      icon: "users"
      type: "list"
      color: "green"
      weight: 80
      fields:
        - name: "scope"
          type: "select"
          options:
            - "internal"
            - "external"
    - name: "steps"
      icon: "list-ordered"
      type: "sequence"
      color: "green"
      weight: 90
      fields:
        - name: "step_type"
          type: "select"
          options:
            - "task"
            - "decision"
            - "event"
        - name: "next"
          type: "string"
        - name: "condition"
          type: "string"
    - name: "position"
      icon: "briefcase"
      type: "list"
      color: "green"
      weight: 70
    - name: "person"
      icon: "user"
      type: "list"
      color: "green"
      weight: 60
  markers:
    - name: "complexity"
      icon: "gauge"
      color: "green"
      weight: 50
  matrices:
    - name: "steps-roles matrix"
      source: "steps"
      target: "roles"
      params: "Responsible;Accountable;Consulted;Informed"
    - name: "positions-roles matrix"
      source: "position"
      target: "roles"
      params: "Assumes"
    - name: "persons-positions matrix"
      source: "person"
      target: "position"
      params: "Occupies"
    - name: "item-markers matrix"
      source: "elements"
      target: "markers"
title: "test_procedure"
last_saved: "2026-06-23T21:10:29.637Z"
---

# <!-- block: concepts --> procedure summary

This procedure defines how Ark People Housing Care supports individuals to go on holiday. It covers holiday planning and permissions, cost management, risk and vulnerability planning, contingency arrangements, medication and money support, and staff working time rules. The procedure must be followed whenever Ark supports someone to go on holiday, whether in the UK or abroad. Support is provided on a case-by-case basis and cannot be guaranteed. #AI

(Source: [cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf](.sources/cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf))

# <!-- block: concepts --> roles

* <!-- block: roles --> Care & Support Staff
  - scope: internal
  Frontline staff who directly support individuals during holiday planning and on holiday. Must follow all relevant policies including CS08, CS05, HR20, and HS17 throughout the holiday. #AI (Source: [cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf](.sources/cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf))

* <!-- block: roles --> Care & Support Manager
  - scope: internal
  Responsible for ensuring Good Life Support Plans and R&V are completed, creating full holiday costings, signing off contingency plans on AIMS, notifying HR, and auditing spending on return. #AI (Source: [cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf](.sources/cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf))

* <!-- block: roles --> Operations Manager
  - scope: internal
  Must be made aware of and approve all holiday plans, including signing off the AIMS holiday checklist. Must be notified of any supported person going on holiday. #AI (Source: [cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf](.sources/cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf))

* <!-- block: roles --> On-call Manager
  - scope: internal
  Must be made aware of any supported person going on holiday and is contactable out of hours to offer advice and guidance. #AI (Source: [cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf](.sources/cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf))

* <!-- block: roles --> HR Department
  - scope: internal
  Must be notified by the CSM of any staff working away from their usual place of work. #AI (Source: [cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf](.sources/cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf))

* <!-- block: roles --> Compliance and Improvement Business Partner
  - scope: internal
  Must be consulted by the CSM at the planning stage to confirm what Ark insurance covers for staff supporting people on holiday abroad. #AI (Source: [cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf](.sources/cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf))

* <!-- block: roles --> Supported Person
  - scope: external
  The individual going on holiday. Responsible for all associated costs. Must be involved in the planning process as far as they are able. #AI (Source: [cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf](.sources/cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf))

* <!-- block: roles --> Legal Guardian
  - scope: external
  Must give permission for the individual to go on holiday where applicable. Must agree to the full cost of the holiday in writing before booking. Must be included in all risk and contingency planning. #AI (Source: [cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf](.sources/cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf))

# <!-- block: concepts --> steps

1. <!-- block: steps --> Check permissions and legal guardian consent
   - step_type: decision
   - next: Confirm Local Authority policy on Care-at-Home budget
   - condition: Individual has a legal guardian
   Discuss holiday plans with the legal guardian before planning begins to avoid creating false expectations. Permission must be obtained before proceeding. #AI (Source: [cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf](.sources/cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf))

2. <!-- block: steps --> Confirm Local Authority policy on Care-at-Home budget
   - step_type: task
   - next: Plan the holiday
   - condition:
   The CSM must confirm with the Local Authority whether council-funded Care-at-Home budgets can be used towards holiday support, as Local Authorities may have their own policies on this. #AI (Source: [cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf](.sources/cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf))

3. <!-- block: steps --> Plan the holiday
   - step_type: task
   - next: Create full holiday costing
   - condition:
   Plan based on individual preferences, abilities, and budget. Ensure suitable accommodation (staff must not share a bedroom with the supported person), confirm passports are valid and shown to manager before booking, arrange for deliveries and home arrangements during absence, and identify an Ark contact throughout the holiday. If going abroad, confirm insurance coverage with the Compliance Business Partner and ensure a SIM is purchased for AIMS access at the supported person's cost. #AI (Source: [cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf](.sources/cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf))

4. <!-- block: steps --> Create full holiday costing
   - step_type: task
   - next: Obtain written cost agreement from legal guardian
   - condition:
   The CSM is responsible for creating a full costing, delegating elements to the individual's staff as needed. The supported person is responsible for all costs: travel insurance, visas and passports, travel expenses, meals, accommodation, activities and outings, additional staffing hours, excess baggage, and SIM if going abroad. Staff expenses including meals must never exceed the individual's. #AI (Source: [cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf](.sources/cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf))

5. <!-- block: steps --> Obtain written cost agreement from legal guardian
   - step_type: task
   - next: Update Good Life Support Plan and R&V on AIMS
   - condition: Individual has a legal guardian
   There must be written agreement from the legal guardian to the whole cost of the holiday prior to booking. #AI (Source: [cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf](.sources/cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf))

6. <!-- block: steps --> Update Good Life Support Plan and R&V on AIMS
   - step_type: task
   - next: Complete contingency planning on AIMS
   - condition:
   The CSM must ensure Good Life Support Plans and R&V are completed and updated to include the holiday section. Plans must be shared and agreed with any legal guardian. The individual must be included in planning as far as they are able. If a risk cannot be supported by Ark, a Risk Management Plan must be completed and signed off by the relevant parties. #AI (Source: [cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf](.sources/cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf))

7. <!-- block: steps --> Complete contingency planning on AIMS
   - step_type: task
   - next: Plan medication support
   - condition:
   Staff complete the contingency section on AIMS; the CSM must sign it off. Contingencies to plan for include: cancelled or delayed transport, cancelled holiday, cancelled activities, illness prior to or during holiday (staff or supported person), missing persons, theft, lost or missing medication, escalation of behaviours of concern, and other unforeseen circumstances. The supported person must carry emergency contact information at all times. #AI (Source: [cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf](.sources/cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf))

8. <!-- block: steps --> Plan medication support
   - step_type: task
   - next: Plan money support
   - condition:
   Follow CS08 Support with Medication. Update AIMS with any specific changes for safe storage and contingency arrangements. The individual is responsible for the cost of any safe required. A prescription or doctor's note may be required for medications as hand luggage. Stolen medication must be reported to local police and a crime number obtained. #AI (Source: [cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf](.sources/cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf))

9. <!-- block: steps --> Plan money support
   - step_type: task
   - next: Notify HR and Operations Manager
   - condition:
   Follow CS05 Support with Money. Update AIMS with safe storage arrangements, cash amounts held, and contingency plans. Consider pre-payment debit cards especially for holidays abroad. Agree approximate spending amounts and emergency money arrangements as part of planning. In the event of theft, a police report must be made and a crime number obtained. #AI (Source: [cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf](.sources/cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf))

10. <!-- block: steps --> Notify HR and Operations Manager
    - step_type: task
    - next: Sign off AIMS holiday checklist
    - condition:
    The CSM must notify Ark's HR Department of any staff working away from their usual place of work. The Operations Manager and On-call Manager must also be made aware of any supported person going on holiday. #AI (Source: [cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf](.sources/cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf))

11. <!-- block: steps --> Sign off AIMS holiday checklist
    - step_type: task
    - next: Conduct holiday
    - condition:
    The Operations Manager must sign off the holiday checklist on AIMS before the holiday proceeds. This confirms the holiday plan has been reviewed and approved. #AI (Source: [cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf](.sources/cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf))

12. <!-- block: steps --> Conduct holiday
    - step_type: task
    - next: Audit spending on return
    - condition:
    Staff must follow HR20 Drug & Alcohol Misuse and HS17 Smoke Free throughout the holiday. Staff are entitled to a 20-minute paid break per 6 hours of work; breaks may be arranged dynamically. When not directly supporting, staff must remain contactable and within reasonable distance. Waking hours support is capped at 12 hours per day (or 24 hours if the individual usually receives 24-hour support). Sleepovers follow HR38 Sleepovers policy; cost is shared if multiple individuals are on holiday together. #AI (Source: [cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf](.sources/cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf))

13. <!-- block: steps --> Audit spending on return
    - step_type: task
    - next: Document experiences on AIMS
    - condition:
    The CSM must audit all spending recorded by staff during the holiday where the individual does not have capacity to manage their own money. #AI (Source: [cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf](.sources/cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf))

14. <!-- block: steps --> Document experiences on AIMS
    - step_type: task
    - next:
    - condition:
    Staff must capture evidence of good practice and experiences on the AIMS holiday document, noting what the supported person may or may not wish to repeat in the future. #AI (Source: [cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf](.sources/cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf))

# <!-- block: concepts --> position

* <!-- block: position --> Assistant Director, Care & Support
  Senior leadership position responsible for owning this procedure. #AI (Source: [cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf](.sources/cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf))

* <!-- block: position --> Care & Support Manager
  Management position responsible for implementing this procedure within their Care & Support team, including planning, costing, AIMS sign-off, and post-holiday audit. #AI (Source: [cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf](.sources/cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf))

* <!-- block: position --> Operations Manager
  Regional management position responsible for approving holiday plans and signing off AIMS holiday checklists. #AI (Source: [cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf](.sources/cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf))

* <!-- block: position --> Regional Manager
  Senior management position; part of the Regional Managers group responsible for reviewing these procedures at least every 3 years. #AI (Source: [cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf](.sources/cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf))

* <!-- block: position --> Care & Support Staff Member
  Frontline position providing direct support to individuals during holiday planning and on holiday. #AI (Source: [cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf](.sources/cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf))

# <!-- block: concepts --> person

* <!-- block: person --> Neil Armstrong
  Procedure owner. Assistant Director, Care & Support at Ark People Housing Care. #AI (Source: [cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf](.sources/cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf))

* <!-- block: person --> Lesley McDonough
  Author of version 3 of this procedure (August 2023 cyclical review). #AI (Source: [cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf](.sources/cs21a-supporting-people-on-holiday-procedure-aug-2023-v3.pdf))

# <!-- block: matrices --> item-markers matrix

| Item \ Marker | complexity |
| :--- | :---: |

# <!-- block: matrices --> metamatrix

| Matrix Name | Source | Target | Widget Type | Widget Parameters |
| :--- | :--- | :--- | :--- | :--- |
| steps-roles matrix | steps | roles | cycle | Responsible;Accountable;Consulted;Informed |
| positions-roles matrix | position | roles | cycle | Assumes |
| persons-positions matrix | person | position | cycle | Occupies |
| item-markers matrix | elements | markers | cycle | - |

# <!-- block: matrices --> steps-roles matrix

| steps \ roles | Care & Support Staff | Care & Support Manager | Operations Manager | On-call Manager | HR Department | Compliance and Improvement Business Partner | Supported Person | Legal Guardian |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Check permissions and legal guardian consent |  | Responsible |  |  |  |  | Informed | Accountable |
| Confirm Local Authority policy on Care-at-Home budget |  | Responsible |  |  |  |  |  | Informed |
| Plan the holiday | Responsible | Accountable | Informed |  |  | Consulted | Consulted | Consulted |
| Create full holiday costing | Consulted | Responsible |  |  |  |  | Informed | Informed |
| Obtain written cost agreement from legal guardian |  | Responsible |  |  |  |  |  | Accountable |
| Update Good Life Support Plan and R&V on AIMS | Consulted | Responsible |  |  |  |  | Consulted | Consulted |
| Complete contingency planning on AIMS | Responsible | Accountable | Informed | Informed |  |  |  | Consulted |
| Plan medication support | Responsible | Accountable |  |  |  |  | Informed |  |
| Plan money support | Responsible | Accountable |  |  |  |  | Informed |  |
| Notify HR and Operations Manager |  | Responsible | Informed | Informed | Informed |  |  |  |
| Sign off AIMS holiday checklist |  | Responsible | Accountable |  |  |  |  |  |
| Conduct holiday | Responsible |  |  |  |  |  | Consulted |  |
| Audit spending on return |  | Responsible |  |  |  |  |  |  |
| Document experiences on AIMS | Responsible | Informed |  |  |  |  |  |  |

# <!-- block: matrices --> positions-roles matrix

| position \ roles | Care & Support Staff | Care & Support Manager | Operations Manager | On-call Manager | HR Department | Compliance and Improvement Business Partner | Supported Person | Legal Guardian |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Assistant Director, Care & Support |  |  |  |  |  |  |  |  |
| Care & Support Manager |  | Assumes |  |  |  |  |  |  |
| Operations Manager |  |  | Assumes | Assumes |  |  |  |  |
| Regional Manager |  |  |  |  |  |  |  |  |
| Care & Support Staff Member | Assumes |  |  |  |  |  |  |  |

# <!-- block: matrices --> persons-positions matrix

| person \ position | Assistant Director, Care & Support | Care & Support Manager | Operations Manager | Regional Manager | Care & Support Staff Member |
| :--- | :---: | :---: | :---: | :---: | :---: |
| Neil Armstrong | Occupies |  |  |  |  |
| Lesley McDonough |  |  |  |  |  |

# <!-- block: matrices --> item-markers matrix

| elements \ markers |  |
| :--- |  |