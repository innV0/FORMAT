import { parseMarkdownModel, generateMarkdownFileContent } from '../utils/markdownParser.js';
import { mockConcepts, mockMarkers, sampleMarkdown } from './__tests__/fixtures.js';

const parsed = parseMarkdownModel(sampleMarkdown, mockConcepts);
const serialized = generateMarkdownFileContent({
  activeFileName: 'ghostbusters_model.md',
  metamodelPath: parsed.metamodelPath || undefined,
  modelTextData: parsed.modelTextData,
  modelTree: parsed.modelTree,
  nodeMarkers: parsed.nodeMarkers,
  markers: mockMarkers,
  metamatrix: parsed.metamatrix,
  matrixValues: parsed.matrixValues,
  concepts: mockConcepts,
  getMatrixRowsList: (source, tree) => {
    if (source === 'Profiles') return ['Distressed Homeowners', 'Hotel Managers', 'City Regulators'];
    if (source === 'Problems') return ['Spectral infestation', 'Fear of property damage', 'Environmental complaints'];
    return [];
  },
  getMatrixColsList: (target) => {
    if (target === 'Channels') return ['TV Commercials', 'Print Yellow Pages', 'Direct Sales Outbound'];
    if (target === 'Value propositions') return ['Instant Spectral Capture', 'Property Damage Mitigation', 'EPA Regulatory Compliance'];
    return [];
  }
});

const timestampRegex = /last_saved:\s*["'][^"']+["']/;
const cleanSample = sampleMarkdown.replace(timestampRegex, 'last_saved: "2026-06-18T16:25:14.814Z"').replace(/\r\n/g, '\n').trim();
const cleanSerialized = serialized.replace(timestampRegex, 'last_saved: "2026-06-18T16:25:14.814Z"').replace(/\r\n/g, '\n').trim();

if (cleanSerialized !== cleanSample) {
  const sampleLines = cleanSample.split('\n');
  const serLines = cleanSerialized.split('\n');
  console.log('Sample length:', sampleLines.length, 'Serialized length:', serLines.length);
  for (let i = 0; i < Math.max(sampleLines.length, serLines.length); i++) {
    if (sampleLines[i] !== serLines[i]) {
      console.log(`Difference on line ${i + 1}:`);
      console.log(`Expected: [${sampleLines[i]}]`);
      console.log(`Actual:   [${serLines[i]}]`);
      break;
    }
  }
} else {
  console.log("No differences found!");
}
