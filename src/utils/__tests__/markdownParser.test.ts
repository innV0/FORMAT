import { describe, it, expect } from 'vitest';
import { parseMarkdownModel, generateMarkdownFileContent } from '../markdownParser';
import { Concept, Marker } from '../../types';

// Minimal mock concepts list matching Ghostbusters file structure
const mockConcepts: Concept[] = [
  { name: 'Business summary', icon: 'file-text', type: 'text', description: '' },
  { name: 'Stakeholders', icon: 'users', type: 'weight', description: '' },
  { name: 'Segments', icon: 'users', type: 'weight', description: '' },
  { name: 'Profiles', icon: 'users', type: 'weight', description: '' },
  { name: 'Persona', icon: 'users', type: 'text', description: '' },
  { name: 'Segmentation', icon: 'users', type: 'weight', description: '' },
  { name: 'Market trends', icon: 'users', type: 'weight', description: '' },
  { name: 'Market size', icon: 'users', type: 'text', description: '' },
  { name: 'Competition', icon: 'users', type: 'weight', description: '' },
  { name: 'Roles', icon: 'users', type: 'weight', description: '' },
  { name: 'Problems', icon: 'users', type: 'weight', description: '' },
  { name: 'Value propositions', icon: 'users', type: 'weight', description: '' },
  { name: 'Messages', icon: 'users', type: 'weight', description: '' },
  { name: 'Channels', icon: 'users', type: 'weight', description: '' },
  { name: 'Relationships', icon: 'users', type: 'text', description: '' },
  { name: 'Perceptions', icon: 'users', type: 'weight', description: '' },
  { name: 'Emotions', icon: 'users', type: 'weight', description: '' },
  { name: 'Behaviors', icon: 'users', type: 'weight', description: '' },
  { name: 'Journey', icon: 'users', type: 'steps', description: '' },
  { name: 'Products and services', icon: 'users', type: 'weight', description: '' },
  { name: 'Portfolio', icon: 'users', type: 'text', description: '' },
  { name: 'Components', icon: 'users', type: 'weight', description: '' },
  { name: 'Features', icon: 'users', type: 'weight', description: '' },
  { name: 'Roadmap', icon: 'users', type: 'steps', description: '' },
  { name: 'Pricing', icon: 'users', type: 'text', description: '' },
  { name: 'Offerings', icon: 'users', type: 'weight', description: '' },
  { name: 'Naming', icon: 'users', type: 'text', description: '' },
  { name: 'Branding', icon: 'users', type: 'text', description: '' },
  { name: 'Visual identity', icon: 'users', type: 'text', description: '' },
  { name: 'Logo', icon: 'users', type: 'text', description: '' },
  { name: 'Media plan', icon: 'users', type: 'text', description: '' },
  { name: 'Pitch', icon: 'users', type: 'text', description: '' },
  { name: 'Brochure', icon: 'users', type: 'text', description: '' },
  { name: 'Web', icon: 'users', type: 'text', description: '' },
  { name: 'Storytelling', icon: 'users', type: 'text', description: '' },
  { name: 'Presentations', icon: 'users', type: 'text', description: '' },
  { name: 'Inspiration', icon: 'users', type: 'weight', description: '' },
  { name: 'Opportunity', icon: 'users', type: 'weight', description: '' },
  { name: 'Business status', icon: 'users', type: 'text', description: '' },
  { name: 'Challenges', icon: 'users', type: 'weight', description: '' },
  { name: 'Mission', icon: 'target', type: 'text', description: '' },
  { name: 'Vision', icon: 'users', type: 'text', description: '' },
  { name: 'Organizational values', icon: 'users', type: 'weight', description: '' },
  { name: 'Organizational goals', icon: 'users', type: 'weight', description: '' },
  { name: 'Activities', icon: 'users', type: 'weight', description: '' },
  { name: 'Functions', icon: 'users', type: 'weight', description: '' },
  { name: 'Resources', icon: 'users', type: 'weight', description: '' },
  { name: 'Goals', icon: 'users', type: 'weight', description: '' },
  { name: 'Skills', icon: 'users', type: 'weight', description: '' },
  { name: 'Contributions', icon: 'users', type: 'weight', description: '' },
  { name: 'Compensations', icon: 'users', type: 'weight', description: '' },
  { name: 'Positions', icon: 'users', type: 'weight', description: '' },
  { name: 'Phases', icon: 'users', type: 'steps', description: '' },
  { name: 'Milestones', icon: 'users', type: 'sequence', description: '' },
  { name: 'Metrics', icon: 'users', type: 'weight', description: '' },
  { name: 'Revenue', icon: 'users', type: 'weight', description: '' },
  { name: 'Life Time Value', icon: 'users', type: 'text', description: '' },
  { name: 'Costs', icon: 'users', type: 'weight', description: '' },
  { name: 'Customer Aquisition Cost', icon: 'users', type: 'text', description: '' },
  { name: 'Unit economics', icon: 'users', type: 'text', description: '' },
  { name: 'Funding sources', icon: 'users', type: 'weight', description: '' },
  { name: 'Shareholders', icon: 'users', type: 'weight', description: '' },
  { name: 'Projections', icon: 'users', type: 'weight', description: '' },
  { name: 'Legal issues', icon: 'users', type: 'weight', description: '' },
  { name: 'Contracts', icon: 'users', type: 'weight', description: '' },
  { name: 'Matrices', icon: 'users', type: 'weight', description: '' },
  { name: 'Assumptions', icon: 'users', type: 'weight', description: '' },
  { name: 'Risks', icon: 'key', type: 'weight', description: '' },
  { name: 'Suggestions', icon: 'users', type: 'weight', description: '' },
  { name: 'Unfair advantage', icon: 'users', type: 'text', description: '' },
  { name: 'SWOT', icon: 'users', type: 'text', description: '' },
  { name: 'Keys', icon: 'users', type: 'weight', description: '' },
  { name: 'Coherence', icon: 'users', type: 'weight', description: '' },
  { name: 'Experiments', icon: 'users', type: 'weight', description: '' },
  { name: 'Misc', icon: 'users', type: 'text', description: '' }
];

const mockMarkers: Marker[] = [
  { name: 'weight', symbol: '*', icon: 'plus', description: 'Relevance score' },
  { name: 'certainty', symbol: '?', icon: 'help-circle', description: 'Certainty score' },
  { name: 'priority', symbol: '!', icon: 'flag', description: 'Priority level' },
  { name: 'rating', symbol: '+', icon: 'star', description: 'Impact evaluation' }
];

describe('Markdown Parser Parity Tests', () => {
  const sampleMarkdown = `---
template:
  name: "business"
  version: "V_1-0-0"
  path: "../../innV0_master_data.json"
title: "Ghostbusters Complete Model"
last_saved: "2026-06-18T16:25:14.814Z"
---

# Business summary
Ghostbusters is a professional paranormal investigation and elimination service. We offer reliable, round-the-clock containment of spectral entities for residential, commercial, and governmental clients in the New York metropolitan area. Our business creates value by restoring safety and peace of mind to haunted properties using proprietary nuclear-powered containment technology.

# Stakeholders
- B2C Clients: Residential property owners.
- B2B Commercial: Hotels, museums, and library boards.
- Government: NYC municipal buildings and regulators.

# Segments
- Distressed Homeowners: Families with disturbances.
- Hotel Managers: Businesses needing restoration.
- City Regulators: Public safety agencies.

# Profiles
- Distressed Homeowner Profile: Medium income, high panic.
- Haunted Hotel Manager Profile: Corporate budget, high urgency.

# Persona
- Strategic definition for Persona

# Segmentation
- Sample Segmentation Item A: Operational entry.
- Sample Segmentation Item B: Standard parameter.

# Market trends
- Sample Market trends Item A: Operational entry.
- Sample Market trends Item B: Standard parameter.

# Market size
Strategic definition for Market size.

# Competition
- Sample Competition Item A: Operational entry.
- Sample Competition Item B: Standard parameter.

# Roles
- Sample Roles Item A: Operational entry.
- Sample Roles Item B: Standard parameter.

# Problems
- Sample Problems Item A: Operational entry.
- Sample Problems Item B: Standard parameter.

# Value propositions
- Sample Value propositions Item A: Operational entry.
- Sample Value propositions Item B: Standard parameter.

# Messages
- Sample Messages Item A: Operational entry.
- Sample Messages Item B: Standard parameter.

# Channels
- Sample Channels Item A: Operational entry.
- Sample Channels Item B: Standard parameter.

# Relationships
Strategic definition for Relationships.

# Perceptions
- Sample Perceptions Item A: Operational entry.
- Sample Perceptions Item B: Standard parameter.

# Emotions
- Sample Emotions Item A: Operational entry.
- Sample Emotions Item B: Standard parameter.

# Behaviors
- Sample Behaviors Item A: Operational entry.
- Sample Behaviors Item B: Standard parameter.

# Journey
- Sample Journey Item A: Operational entry.
- Sample Journey Item B: Standard parameter.

# Products and services
- Sample Products and services Item A: Operational entry.
- Sample Products and services Item B: Standard parameter.

# Portfolio
Strategic definition for Portfolio.

# Components
- Sample Components Item A: Operational entry.
- Sample Components Item B: Standard parameter.

# Features
- Sample Features Item A: Operational entry.
- Sample Features Item B: Standard parameter.

# Roadmap
- Sample Roadmap Item A: Operational entry.
- Sample Roadmap Item B: Standard parameter.

# Pricing
Strategic definition for Pricing.

# Offerings
- Sample Offerings Item A: Operational entry.
- Sample Offerings Item B: Standard parameter.

# Naming
Strategic definition for Naming.

# Branding
Strategic definition for Branding.

# Visual identity
Strategic definition for Visual identity.

# Logo
Strategic definition for Logo.

# Media plan
Strategic definition for Media plan.

# Pitch
Strategic definition for Pitch.

# Brochure
Strategic definition for Brochure.

# Web
Strategic definition for Web.

# Storytelling
Strategic definition for Storytelling.

# Presentations
Strategic definition for Presentations.

# Inspiration
- The sudden spike in psychokinetic activity in the NYC area, combined with the development of the portable proton pack prototype by Dr. Spengler and Dr. Stantz.

# Opportunity
- The lack of any public or private entities capable of handling ectoplasmic infestations, combined with rising property vacancies due to hauntings.

# Business status
Operational prototype stage with one active NYC firehouse headquarters, a modified Cadillac ambulance (Ecto-1), and a functioning high-voltage laser containment grid.

# Challenges
- High municipal skepticism, regulatory pressure from the EPA, high equipment maintenance costs, and public relations handling after collateral property damage.

# Mission
To provide professional, safe, and effective solutions for spectral containment and elimination, ensuring peace of mind for our clients while advancing scientific understanding of the paranormal.

# Vision
To become the global leader in paranormal emergency response and containment, establishing franchises in every major metropolis and standardizing spectral safety protocols.

# Organizational values
- Scientific integrity, professional bravery, rapid response reliability, and advanced technological innovation in service of public safety.

# Organizational goals
- Establish a standardized spectral classification database, patent the proton pack technology, and expand operations to Boston and Chicago.

# Activities
- Responding to emergency calls, maintaining the containment unit, developing new ghost traps, performing municipal environmental compliance checks, and conducting local advertising.

# Functions
- Field dispatching, ectoplasmic research, proton pack calibration, administrative billing, and legal defense against municipal liabilities.

# Resources
- The Firehouse headquarters, Ecto-1 transport, four portable proton packs, custom ghost traps, and the basement containment grid system.

# Goals
- Sample Goals Item A: Operational entry.
- Sample Goals Item B: Standard parameter.

# Skills
- Sample Skills Item A: Operational entry.
- Sample Skills Item B: Standard parameter.

# Contributions
- Sample Contributions Item A: Operational entry.
- Sample Contributions Item B: Standard parameter.

# Compensations
- Sample Compensations Item A: Operational entry.
- Sample Compensations Item B: Standard parameter.

# Positions
- Dr. Peter Venkman (PR & Client Relations), Dr. Raymond Stantz (Hardware & Research), Dr. Egon Spengler (Theoretical Physics & Calibration), Winston Zeddemore (Field Operations), and Janine Melnitz (Office Administration).

# Phases
- Sample Phases Item A: Operational entry.
- Sample Phases Item B: Standard parameter.

# Milestones
- Milestone 1: First capture at the Sedgewick Hotel. Milestone 2: Successful containment of Gozer the Gozerian. Milestone 3: Signing of municipal emergency services contract.

# Metrics
- Number of traps successfully contained per week, dispatcher-to-deployment response time (minutes), revenue per capture, and collateral damage liability claims cost.

# Revenue
- Sample Revenue Item A: Operational entry.
- Sample Revenue Item B: Standard parameter.

# Life Time Value
High for B2B commercial entities (hotels, libraries, museums) requiring recurring sweep checks; lower for residential clients who generally need one-time service.

# Costs
- Sample Costs Item A: Operational entry.
- Sample Costs Item B: Standard parameter.

# Customer Aquisition Cost
Low initially due to high organic media coverage and novelty factor, supplemented by local TV commercials and print advertising.

# Unit economics
Standard capture fee is $5,000 + $2,000 containment storage fee. Proton pack charging and trap maintenance cost per capture is approximately $450.

# Funding sources
- Private mortgage on Dr. Ray Stantz's family home, combined with initial angel investment and customer deposit cash flows.

# Shareholders
- Dr. Peter Venkman (30%), Dr. Raymond Stantz (30%), Dr. Egon Spengler (30%), and external financial backers (10%).

# Projections
- Projecting $150,000 monthly revenue by month 3, expanding to $500,000 by year-end, with a 35% net profit margin after maintenance and insurance.

# Legal issues
- Ongoing disputes with the NYC Environmental Protection Agency (EPA) regarding unlicensed nuclear reactors in residential basements.

# Contracts
- Standard client liability release waiver, B2B monthly maintenance agreement, and City of New York emergency services charter.

# Matrices
- Sample Matrices Item A: Operational entry.
- Sample Matrices Item B: Standard parameter.

# Assumptions
- Assuming that paranormal activity levels will remain stable or increase, and that municipal authorities will tolerate the use of unlicensed nuclear accelerators.

# Risks
- Containment unit power failure leading to explosive ectoplasmic release, municipal shutdown orders, and toxic containment leakage.

# Suggestions
- Install a backup generator for the containment unit immediately, and hire a full-time legal counsel to handle EPA disputes.

# Unfair advantage
We hold the exclusive patents and technical know-how for portable proton packs and laser-based ectoplasmic containment grids.

# SWOT
Strengths: Only provider of this technology. Weaknesses: High potential liability. Opportunities: Global franchising. Threats: EPA regulatory shutdown.

# Keys
- Sample Keys Item A: Operational entry.
- Sample Keys Item B: Standard parameter.

# Coherence
- Weekly alignment meetings between Egon (science), Ray (hardware), and Peter (business) to ensure technology supports commercial goals.

# Experiments
- Testing the efficiency of the new trap prototype on Class IV free-roaming vapors in controlled environments.

# Misc
Strategic definition for Misc.

# Stakeholders-Segments Hierarchy Matrix

| Stakeholders \\ Segments | Distressed Homeowners | Hotel Managers | City Regulators |
| :--- | :---: | :---: | :---: |
| B2C Clients | X | - | - |
| B2B Commercial | - | X | - |
| Government | - | - | X |

# Segments-Profiles Hierarchy Matrix

| Segments \\ Profiles | Distressed Homeowner Profile | Haunted Hotel Manager Profile |
| :--- | :---: | :---: |
| Distressed Homeowners | X | - |
| Hotel Managers | - | X |
| City Regulators | - | - |

# Profiles-Persona Hierarchy Matrix

| Profiles \\ Persona | Strategic definition for Persona |
| :--- | :---: |
| Distressed Homeowner Profile | X |
| Haunted Hotel Manager Profile | - |

# Item-Markers Matrix

| Item \\ Marker | weight | certainty | priority | rating |
| :--- | :---: | :---: | :---: | :---: |
| B2C Clients | 4 | 5 | 5 | 4 |
| B2B Commercial | 5 | 4 | 5 | 5 |
| Government | 3 | 3 | 2 | -1 |
| Distressed Homeowners | 3 | 5 | 4 | 3 |
| Hotel Managers | 5 | 4 | 5 | 5 |
| City Regulators | 2 | 3 | 1 | -3 |
| Distressed Homeowner Profile | - | - | - | - |
| Haunted Hotel Manager Profile | - | - | - | - |
| Strategic definition for Persona | - | - | - | - |

# Metamatrix

| Matrix Name | Source | Target | Widget Type | Widget Parameters |
| :--- | :--- | :--- | :--- | :--- |
| Profiles-Channels Matrix | Profiles | Channels | cycle | Neutral;High;Critical |
| Problems-Value propositions Matrix | Problems | Value propositions | scale | min:1;max:5 |

# Profiles-Channels Matrix

| Profiles \\ Channels | TV Commercials | Print Yellow Pages | Direct Sales Outbound |
| :--- | :---: | :---: | :---: |
| Distressed Homeowner Profile | Critical | High | Neutral |
| Haunted Hotel Manager Profile | High | Neutral | Critical |

# Problems-Value propositions Matrix

| Problems \\ Value propositions | Instant Spectral Capture | Property Damage Mitigation | EPA Regulatory Compliance |
| :--- | :---: | :---: | :---: |
| Spectral infestation | 5 | 3 | 1 |
| Fear of property damage | 4 | 5 | 1 |
| Environmental complaints | 1 | 2 | 5 |`;

  it('should parse and serialize back to the identical markdown (excluding timestamp)', () => {
    const parsed = parseMarkdownModel(sampleMarkdown, mockConcepts);
    
    const serialized = generateMarkdownFileContent({
      activeFileName: parsed.title ? `${parsed.title}.md` : 'ghostbusters_model.md',
      metamodelPath: parsed.metamodelPath || undefined,
      modelTextData: parsed.modelTextData,
      modelTree: parsed.modelTree,
      nodeMarkers: parsed.nodeMarkers,
      markers: mockMarkers,
      metamatrix: parsed.metamatrix,
      matrixValues: parsed.matrixValues,
      concepts: mockConcepts,
      getMatrixRowsList: (source, tree) => {
        if (source === 'Profiles') return ['Distressed Homeowner Profile', 'Haunted Hotel Manager Profile'];
        if (source === 'Problems') return ['Spectral infestation', 'Fear of property damage', 'Environmental complaints'];
        return [];
      },
      getMatrixColsList: (target) => {
        if (target === 'Channels') return ['TV Commercials', 'Print Yellow Pages', 'Direct Sales Outbound'];
        if (target === 'Value propositions') return ['Instant Spectral Capture', 'Property Damage Mitigation', 'EPA Regulatory Compliance'];
        return [];
      }
    });


    // Replace the dynamically updated last_saved timestamp for parity comparison
    const timestampRegex = /last_saved:\s*["'][^"']+["']/;
    const cleanSample = sampleMarkdown.replace(timestampRegex, 'last_saved: "2026-06-18T16:25:14.814Z"').replace(/\r\n/g, '\n').trim();
    const cleanSerialized = serialized.replace(timestampRegex, 'last_saved: "2026-06-18T16:25:14.814Z"').replace(/\r\n/g, '\n').trim();

    if (cleanSerialized !== cleanSample) {
      const sampleLines = cleanSample.split('\n');
      const serLines = cleanSerialized.split('\n');
      console.log('--- DEBUG PARITY DIFF ---');
      console.log('Sample lines count:', sampleLines.length, 'Serialized lines count:', serLines.length);
      for (let i = 0; i < Math.max(sampleLines.length, serLines.length); i++) {
        if (sampleLines[i] !== serLines[i]) {
          console.log(`Difference on line ${i + 1}:`);
          console.log(`Expected (original): [${sampleLines[i]}]`);
          console.log(`Actual   (gen):     [${serLines[i]}]`);
          break;
        }
      }
      console.log('-------------------------');
    }


    expect(cleanSerialized).toBe(cleanSample);
  });

  it('should parse and serialize flat self-containing template format with lowercase comments', () => {
    const flatMarkdown = `---
template:
  name: "business"
  version: "V_1-0-0"
  title: "FORMAT Template"
  last_updated: "2026-06-19T17:48:57.477Z"
  concepts:
    - name: "business summary"
      category_id: null
      icon: "file-text"
      type: "text"
    - name: "stakeholders"
      category_id: null
      icon: "users"
      type: "weight"
    - name: "segments"
      category_id: null
      icon: "users"
      type: "weight"
  markers:
    - name: "weight"
      symbol: "*"
      icon: "plus"
  matrices:
    - name: "stakeholders-segments hierarchy matrix"
      source: "stakeholders"
      target: "segments"
title: "Flat Format Model"
last_saved: "2026-06-19T17:48:57.479Z"
---

# <!-- block: concepts --> business summary

Strategic definition of our business.

# <!-- block: concepts --> stakeholders

* <!-- block: stakeholders --> B2C Clients
Description of B2C Clients line 1.
Description of B2C Clients line 2.

* <!-- block: stakeholders --> B2B Commercial
Description of B2B Commercial.

# <!-- block: concepts --> segments

* <!-- block: segments --> Distressed Homeowners
Description of Distressed Homeowners.

* <!-- block: segments --> Hotel Managers
Description of Hotel Managers.

# <!-- block: matrices --> stakeholders-segments hierarchy matrix

| stakeholders \\ segments | Distressed Homeowners | Hotel Managers |
| :--- | :---: | :---: |
| B2C Clients | X | - |
| B2B Commercial | - | X |

# <!-- block: matrices --> item-markers matrix

| Item \\ Marker | weight |
| :--- | :---: |
| B2C Clients | - |
| B2B Commercial | - |
| Distressed Homeowners | - |
| Hotel Managers | - |

# <!-- block: matrices --> metamatrix

| Matrix Name | Source | Target | Widget Type | Widget Parameters |
| :--- | :--- | :--- | :--- | :--- |
| stakeholders-segments hierarchy matrix | stakeholders | segments | cycle | - |`;

    const parsed = parseMarkdownModel(flatMarkdown, []);
    
    // Check YAML parsed metamodel correctly
    expect(parsed.metamodel).toBeDefined();
    expect(parsed.metamodel?.title).toBe('FORMAT Template');
    expect(parsed.metamodel?.concepts?.length).toBe(3);
    expect(parsed.metamodel?.markers?.length).toBe(1);
    
    // Check tree nodes and multi-line descriptions
    expect(parsed.modelTree.length).toBe(2); // B2C Clients and B2B Commercial
    
    const b2c = parsed.modelTree.find(n => n.name === 'B2C Clients');
    expect(b2c).toBeDefined();
    expect(b2c?.description).toBe('Description of B2C Clients line 1.\nDescription of B2C Clients line 2.');
    expect(b2c?.children.length).toBe(1);
    expect(b2c?.children[0].name).toBe('Distressed Homeowners');
    expect(b2c?.children[0].description).toBe('Description of Distressed Homeowners.');
    
    const b2b = parsed.modelTree.find(n => n.name === 'B2B Commercial');
    expect(b2b).toBeDefined();
    expect(b2b?.description).toBe('Description of B2B Commercial.');
    expect(b2b?.children.length).toBe(1);
    expect(b2b?.children[0].name).toBe('Hotel Managers');
    expect(b2b?.children[0].description).toBe('Description of Hotel Managers.');

    // Serialize back and verify parity
    const serialized = generateMarkdownFileContent({
      activeFileName: parsed.title ? `${parsed.title}.md` : 'flat_format_model.md',
      modelTextData: parsed.modelTextData,
      modelTree: parsed.modelTree,
      nodeMarkers: parsed.nodeMarkers,
      markers: parsed.metamodel?.markers || [],
      metamatrix: parsed.metamatrix,
      matrixValues: parsed.matrixValues,
      concepts: parsed.metamodel?.concepts || [],
      getMatrixRowsList: (source, tree) => {
        if (source === 'stakeholders') return ['B2C Clients', 'B2B Commercial'];
        return [];
      },
      getMatrixColsList: (target) => {
        if (target === 'segments') return ['Distressed Homeowners', 'Hotel Managers'];
        return [];
      }
    });

    const timestampRegex = /last_saved:\s*["'][^"']+["']/;
    const lastUpdatedRegex = /last_updated:\s*["'][^"']+["']/;
    
    const cleanSample = flatMarkdown
      .replace(timestampRegex, 'last_saved: "2026-06-19T17:48:57.479Z"')
      .replace(lastUpdatedRegex, 'last_updated: "2026-06-19T17:48:57.477Z"')
      .replace(/\r\n/g, '\n')
      .trim();
      
    const cleanSerialized = serialized
      .replace(timestampRegex, 'last_saved: "2026-06-19T17:48:57.479Z"')
      .replace(lastUpdatedRegex, 'last_updated: "2026-06-19T17:48:57.477Z"')
      .replace(/\r\n/g, '\n')
      .trim();

    expect(cleanSerialized).toBe(cleanSample);
  });

  it.skip('convert ghostbusters model to flat format', () => {
    const fs = require('fs');
    const path = require('path');
    
    const templatePath = path.resolve(__dirname, '../../../Samples/metamodel_template.md');
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    const parsedTemplate = parseMarkdownModel(templateContent, []);
    const concepts = parsedTemplate.metamodel?.concepts || [];
    const markers = parsedTemplate.metamodel?.markers || [];
    const metamatrix = parsedTemplate.metamatrix;
    
    const oldFilePath = path.resolve(__dirname, '../../../samples/Ghostbusters/Ghostbusters_BM_V_0-1-2_FORMAT.md');
    const oldContent = fs.readFileSync(oldFilePath, 'utf8');
    
    const parsed = parseMarkdownModel(oldContent, concepts, metamatrix);
    
    const serialized = generateMarkdownFileContent({
      activeFileName: 'ghostbusters_model.md',
      formatVersion: parsedTemplate.formatVersion || 'V_0-1-2',
      specificationUrl: parsedTemplate.specificationUrl || 'https://raw.githubusercontent.com/innV0/FORMAT/v0.1.2/DOCS/spec/V_0-1-2/spec.md',
      documentationLocation: parsedTemplate.documentationLocation || 'docs/spec/V_0-1-2/',
      modelTextData: parsed.modelTextData,
      modelTree: parsed.modelTree,
      nodeMarkers: parsed.nodeMarkers,
      markers: markers,
      metamatrix: metamatrix,
      matrixValues: parsed.matrixValues,
      concepts: concepts,
      getMatrixRowsList: (source, tree) => {
        const hierarchyConcepts = ['stakeholders', 'segments', 'profiles', 'persona'];
        if (hierarchyConcepts.includes(source.toLowerCase())) {
          const clean = (s: string) => s.replace(/\*\*|\*|__/g, '').trim();
          const rows: string[] = [];
          const visit = (list: any[]) => {
            list.forEach(n => {
              if (n.type.toLowerCase() === source.toLowerCase()) {
                rows.push(clean(n.name));
              }
              if (n.children) visit(n.children);
            });
          };
          visit(tree);
          return rows;
        }
        const key = Object.keys(parsed.modelTextData).find(k => k.toLowerCase() === source.toLowerCase()) || source;
        const rawText = parsed.modelTextData[key] || '';
        if (rawText.includes('<!-- block:')) {
          const matchAll = [...rawText.matchAll(/<!--\s*block:\s*[\w\s-]+\s*-->\s*(.*)/gi)];
          return matchAll.map(m => m[1].replace(/\*\*|\*|__|\[\[|\]\]/g, '').trim());
        }
        const items: string[] = [];
        const lines = rawText.split('\n');
        lines.forEach(l => {
          const match = l.match(/^[-*]\s+\*\*?([^*:]+)\*\*?:?/);
          if (match) {
            items.push(match[1].replace(/\*\*|\*|__/g, '').trim());
          } else {
            const simpleMatch = l.match(/^[-*]\s+([^:]+):?/);
            if (simpleMatch) {
              items.push(simpleMatch[1].replace(/\*\*|\*|__/g, '').trim());
            }
          }
        });
        return items;
      },
      getMatrixColsList: (target) => {
        const hierarchyConcepts = ['stakeholders', 'segments', 'profiles', 'persona'];
        if (hierarchyConcepts.includes(target.toLowerCase())) {
          const clean = (s: string) => s.replace(/\*\*|\*|__/g, '').trim();
          const rows: string[] = [];
          const visit = (list: any[]) => {
            list.forEach(n => {
              if (n.type.toLowerCase() === target.toLowerCase()) {
                rows.push(clean(n.name));
              }
              if (n.children) visit(n.children);
            });
          };
          visit(parsed.modelTree);
          return rows;
        }
        const key = Object.keys(parsed.modelTextData).find(k => k.toLowerCase() === target.toLowerCase()) || target;
        const rawText = parsed.modelTextData[key] || '';
        if (rawText.includes('<!-- block:')) {
          const matchAll = [...rawText.matchAll(/<!--\s*block:\s*[\w\s-]+\s*-->\s*(.*)/gi)];
          return matchAll.map(m => m[1].replace(/\*\*|\*|__|\[\[|\]\]/g, '').trim());
        }
        const items: string[] = [];
        const lines = rawText.split('\n');
        lines.forEach(l => {
          const match = l.match(/^[-*]\s+\*\*?([^*:]+)\*\*?:?/);
          if (match) {
            items.push(match[1].replace(/\*\*|\*|__/g, '').trim());
          } else {
            const simpleMatch = l.match(/^[-*]\s+([^:]+):?/);
            if (simpleMatch) {
              items.push(simpleMatch[1].replace(/\*\*|\*|__/g, '').trim());
            }
          }
        });
        return items;
      }
    });
    
    fs.writeFileSync(oldFilePath, serialized, 'utf8');
    
    const specFilePath = path.resolve(__dirname, '../../../Samples/Ghostbusters/ghostbusters_model.spec.md');
    if (fs.existsSync(specFilePath)) {
      fs.unlinkSync(specFilePath);
    }
  });

  it('parses and serializes block parameters/fields correctly', () => {
    const markdownWithFields = `---
template:
  name: "business"
  version: "V_1-0-0"
  title: "FORMAT Template"
  last_updated: "2026-06-19T17:48:57.477Z"
  concepts:
    - name: "stakeholders"
      category_id: null
      icon: "help-circle"
      type: "weight"
      fields:
        - name: "importance"
          type: "string"
        - name: "verified"
          type: "boolean"
        - name: "score"
          type: "number"
        - name: "status"
          type: "select"
          options:
            - "Active"
            - "Inactive"
    - name: "segments"
      category_id: "stakeholders"
      icon: "user-check"
      type: "weight"
  markers:
    - name: "weight"
      symbol: "*"
      icon: "plus"
  matrices: []
title: "Fields Test Model"
last_saved: "2026-06-19T17:48:57.479Z"
---

# <!-- block: concepts --> stakeholders

* <!-- block: stakeholders --> B2C Clients
  \`\`\`yaml
  importance: "high"
  verified: true
  score: 10
  status: "Active"
  \`\`\`

Description of B2C Clients line 1.
Description of B2C Clients line 2.

# <!-- block: concepts --> segments

* <!-- block: segments --> Distressed Homeowners
Description of Distressed Homeowners.

# <!-- block: matrices --> stakeholders-segments hierarchy matrix

| stakeholders \\ segments | Distressed Homeowners |
| :--- | :---: |
| B2C Clients | X |

# <!-- block: matrices --> item-markers matrix

| Item \\ Marker | weight |
| :--- | :---: |
| B2C Clients | - |
| Distressed Homeowners | - |

# <!-- block: matrices --> metamatrix

| Matrix Name | Source | Target | Widget Type | Widget Parameters |
| :--- | :--- | :--- | :--- | :--- |
`;

    const parsed = parseMarkdownModel(markdownWithFields, []);
    expect(parsed.modelTree.length).toBe(1); // B2C Clients is root
    const b2c = parsed.modelTree[0];
    expect(b2c.name).toBe('B2C Clients');
    expect(b2c.fields).toBeDefined();
    expect(b2c.fields?.importance).toBe('high');
    expect(b2c.fields?.verified).toBe(true);
    expect(b2c.fields?.score).toBe(10);
    expect(b2c.fields?.status).toBe('Active');
    expect(b2c.description).toBe('Description of B2C Clients line 1.\nDescription of B2C Clients line 2.');

    const serialized = generateMarkdownFileContent({
      activeFileName: 'Fields Test Model.md',
      modelTextData: parsed.modelTextData,
      modelTree: parsed.modelTree,
      nodeMarkers: parsed.nodeMarkers,
      markers: parsed.metamodel?.markers || [],
      metamatrix: parsed.metamatrix,
      matrixValues: parsed.matrixValues,
      concepts: parsed.metamodel?.concepts || [],
      getMatrixRowsList: (source) => {
        if (source === 'stakeholders') return ['B2C Clients'];
        return [];
      },
      getMatrixColsList: (target) => {
        if (target === 'segments') return ['Distressed Homeowners'];
        return [];
      }
    });

    const timestampRegex = /last_saved:\s*["'][^"']+["']/;
    const lastUpdatedRegex = /last_updated:\s*["'][^"']+["']/;

    const cleanSample = markdownWithFields
      .replace(timestampRegex, 'last_saved: "2026-06-19T17:48:57.479Z"')
      .replace(lastUpdatedRegex, 'last_updated: "2026-06-19T17:48:57.477Z"')
      .replace(/\r\n/g, '\n')
      .trim();
    const cleanSerialized = serialized
      .replace(timestampRegex, 'last_saved: "2026-06-19T17:48:57.479Z"')
      .replace(lastUpdatedRegex, 'last_updated: "2026-06-19T17:48:57.477Z"')
      .replace(/\r\n/g, '\n')
      .trim();

    expect(cleanSerialized).toBe(cleanSample);
  });
});

describe('concept-block marker persistence', () => {
  it('round-trips marker assignments anchored to a concept-block id (concept:<slug>)', () => {
    const markers: Marker[] = [
      { name: 'weight', symbol: '!', icon: '', description: 'Weight marker' }
    ];

    // Concept-kind blocks live in modelTextData, not modelTree. Their marker
    // assignments are keyed by the stable concept id `concept:<slug>`.
    const nodeMarkers = { 'concept:single-text-block': { weight: 2 } };

    const serialized = generateMarkdownFileContent({
      activeFileName: 'Concept Marker Test.md',
      modelTextData: { 'single text block': '# <!-- block: concepts --> single text block\n\nSome body.' },
      modelTree: [], // no tree nodes â€” the only marker lives on a concept block
      nodeMarkers,
      markers,
      metamatrix: [],
      matrixValues: {},
      concepts: [],
      getMatrixRowsList: () => [],
      getMatrixColsList: () => []
    });

    // The concept row must be emitted in the item-markers matrix.
    expect(serialized).toMatch(/concept:single-text-block/);

    // And it must survive a parse round-trip back into nodeMarkers.
    const parsed = parseMarkdownModel(serialized, []);
    expect(parsed.nodeMarkers['concept:single-text-block']).toBeDefined();
    expect(parsed.nodeMarkers['concept:single-text-block'].weight).toBe(2);
  });
});

describe('Index block taxonomy parsing and serialization', () => {
  it('correctly parses the index block list into taxonomyEdges', () => {
    const markdown = `---
template:
  name: "business"
  version: "V_1-0-0"
title: "Taxonomy Test"
---

# <!-- block: concepts --> index

* [[Market]]
  * [[Stakeholders]]
    * [[Segments]]
  * [[Value Propositions]]
    * [[Offerings]]
`;
    const parsed = parseMarkdownModel(markdown, mockConcepts);
    expect(parsed.taxonomyEdges).toBeDefined();
    expect(parsed.taxonomyEdges).toEqual([
      { parent: 'Market', child: 'Stakeholders' },
      { parent: 'Stakeholders', child: 'Segments' },
      { parent: 'Market', child: 'Value propositions' },
      { parent: 'Value propositions', child: 'Offerings' }
    ]);
  });

  it('correctly serializes taxonomyEdges to an index block at the start of the body', () => {
    const serialized = generateMarkdownFileContent({
      activeFileName: 'Taxonomy Test.md',
      modelTextData: {},
      modelTree: [],
      nodeMarkers: {},
      markers: mockMarkers,
      metamatrix: [],
      matrixValues: {},
      concepts: mockConcepts,
      taxonomyEdges: [
        { parent: 'Market', child: 'Stakeholders' },
        { parent: 'Stakeholders', child: 'Segments' },
        { parent: 'Market', child: 'Value propositions' },
        { parent: 'Value propositions', child: 'Offerings' }
      ],
      getMatrixRowsList: () => [],
      getMatrixColsList: () => []
    });

    expect(serialized).toContain(`# <!-- block: concepts --> index\n\n* [[Market]]\n  * [[Stakeholders]]\n    * [[Segments]]\n  * [[Value propositions]]\n    * [[Offerings]]`);
  });
});

