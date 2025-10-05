# NASA Biology Articles Data Integration

This document explains how the NASA Biology Articles dataset is integrated into the application components.

## Overview

The application now fetches data from the NASA Articles dataset (`/public/data/articles.json`) and processes it to work with all existing components. The data is transformed to match the expected structure for each component.

## Files Created/Modified

### New Files:
- `src/utils/nasaData.js` - Data fetching and transformation utilities
- `src/hooks/useNASAData.js` - React hook for managing NASA data
- `src/test-data-integration.js` - Test file to verify data integration

### Modified Files:
- `src/app/page.jsx` - Updated to use NASA data hook instead of API calls

## Data Flow

1. **Data Source**: `/public/data/articles.json` contains NASA biology articles
2. **Data Fetching**: `fetchNASAData()` loads and transforms the raw data
3. **Data Management**: `useNASAData()` hook manages state and provides data to components
4. **Component Integration**: All components receive processed NASA data

## Data Transformation

The raw NASA articles data is transformed to include:

### Required Fields for Components:
- `id` - Unique identifier
- `title` - Article title
- `url` - Article link
- `authors` - Author information
- `publication_date` - Publication date
- `abstract` - Article abstract
- `impact_score` - Research impact score (4-10)

### Filtering Fields:
- `organism` - Extracted from title (Mouse, Human, Cell, etc.)
- `experiment_type` - Extracted from title (Microgravity, Radiation, etc.)
- `keywords` - Extracted from title
- `themes` - Generated research themes

### Analysis Fields:
- `ai_summary` - AI-generated summary
- `key_findings` - Key research findings
- `methodology` - Research methodology
- `mission_relevance` - NASA mission relevance

## Component Integration

### PublicationsList
- Displays NASA articles with full details
- Shows impact scores, abstracts, and key findings
- Expandable cards with additional information

### SearchFilters
- Filters by organism, experiment type, research theme, and year
- Extracts filter options from NASA data
- Real-time filtering of publications

### KnowledgeGraph
- Creates network of organisms, experiments, and keywords
- Visualizes relationships between NASA research areas
- Interactive entity exploration

### InsightsPanel
- Generates AI insights from NASA publications
- Identifies research patterns and gaps
- Provides mission-relevant recommendations

### AnalyticsCharts
- Shows publication trends over time
- Displays organism and experiment type distributions
- Impact score analysis and trends

## Usage

### Basic Usage:
```javascript
import { useNASAData } from '../hooks/useNASAData.js';

function MyComponent() {
  const {
    publications,
    loading,
    error,
    filters,
    handleFilterChange,
    handleSearchChange
  } = useNASAData();

  // Use the data in your component
}
```

### Data Manipulation:
```javascript
import { filterPublications, searchPublications, generateInsights } from '../utils/nasaData.js';

// Filter publications
const filtered = filterPublications(publications, { organism: 'Mouse' });

// Search publications
const results = searchPublications(publications, 'microgravity');

// Generate insights
const insights = generateInsights(publications);
```

## Testing

Run the test file to verify data integration:

```javascript
import { testDataIntegration } from '../test-data-integration.js';

testDataIntegration(); // Returns true if all tests pass
```

## Data Statistics

The NASA dataset typically contains:
- 2,400+ biology research articles
- 20+ different organisms studied
- 15+ experiment types
- Research spanning 2015-2024
- Average impact scores of 6-7/10

## Benefits

1. **Real NASA Data**: Uses actual NASA biology research articles
2. **Rich Analysis**: Comprehensive data transformation for analysis
3. **Component Compatibility**: Works seamlessly with existing components
4. **Scalable**: Easy to add new data sources or modify transformations
5. **Interactive**: Full search, filter, and analysis capabilities

## Future Enhancements

- Add more sophisticated AI analysis
- Include additional metadata fields
- Implement real-time data updates
- Add export functionality
- Enhanced visualization options
