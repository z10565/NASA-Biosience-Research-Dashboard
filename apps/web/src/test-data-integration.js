/**
 * Test file to verify NASA data integration
 * This file can be run to test the data transformation and component compatibility
 */

import { fetchNASAData, filterPublications, searchPublications, generateInsights } from './utils/nasaData.js';

// Test function to verify data integration
export const testDataIntegration = async () => {
  console.log('🚀 Testing NASA Data Integration...');
  
  try {
    // Test 1: Fetch NASA data
    console.log('📊 Fetching NASA articles data...');
    const publications = await fetchNASAData();
    console.log(`✅ Successfully loaded ${publications.length} publications`);
    
    // Test 2: Verify data structure
    console.log('🔍 Verifying data structure...');
    const samplePub = publications[0];
    const requiredFields = ['id', 'title', 'url', 'organism', 'experiment_type', 'keywords', 'authors', 'publication_date', 'abstract', 'impact_score'];
    
    const missingFields = requiredFields.filter(field => !(field in samplePub));
    if (missingFields.length > 0) {
      console.error(`❌ Missing required fields: ${missingFields.join(', ')}`);
      return false;
    }
    console.log('✅ All required fields present');
    
    // Test 3: Test filtering
    console.log('🔍 Testing filtering functionality...');
    const filters = { organism: 'Mouse', experimentType: 'Microgravity' };
    const filteredPubs = filterPublications(publications, filters);
    console.log(`✅ Filtering works: ${filteredPubs.length} publications match filters`);
    
    // Test 4: Test search
    console.log('🔍 Testing search functionality...');
    const searchResults = searchPublications(publications, 'microgravity');
    console.log(`✅ Search works: ${searchResults.length} publications contain 'microgravity'`);
    
    // Test 5: Test insights generation
    console.log('🔍 Testing insights generation...');
    const insights = generateInsights(publications.slice(0, 50)); // Test with first 50 publications
    console.log(`✅ Insights generation works: ${insights.length} insights generated`);
    
    // Display sample data
    console.log('\n📋 Sample Publication Data:');
    console.log(JSON.stringify(samplePub, null, 2));
    
    console.log('\n📋 Sample Insights:');
    if (insights.length > 0) {
      console.log(JSON.stringify(insights[0], null, 2));
    }
    
    // Display statistics
    console.log('\n📊 Data Statistics:');
    const organisms = [...new Set(publications.map(p => p.organism))];
    const experimentTypes = [...new Set(publications.map(p => p.experiment_type))];
    const avgImpactScore = publications.reduce((sum, p) => sum + p.impact_score, 0) / publications.length;
    
    console.log(`- Total Publications: ${publications.length}`);
    console.log(`- Unique Organisms: ${organisms.length}`);
    console.log(`- Unique Experiment Types: ${experimentTypes.length}`);
    console.log(`- Average Impact Score: ${avgImpactScore.toFixed(2)}`);
    console.log(`- Top Organisms: ${organisms.slice(0, 5).join(', ')}`);
    console.log(`- Top Experiment Types: ${experimentTypes.slice(0, 5).join(', ')}`);
    
    console.log('\n✅ All tests passed! NASA data integration is working correctly.');
    return true;
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
};

// Component compatibility test
export const testComponentCompatibility = (publications) => {
  console.log('🧪 Testing component compatibility...');
  
  const components = [
    'PublicationsList',
    'SearchFilters', 
    'KnowledgeGraph',
    'InsightsPanel',
    'AnalyticsCharts'
  ];
  
  components.forEach(component => {
    try {
      // Test that publications data has the expected structure for each component
      switch (component) {
        case 'PublicationsList':
          const hasRequiredForList = publications.every(p => 
            p.id && p.title && p.authors && p.publication_date
          );
          console.log(`${component}: ${hasRequiredForList ? '✅' : '❌'} Compatible`);
          break;
          
        case 'SearchFilters':
          const hasRequiredForFilters = publications.every(p => 
            p.organism && p.experiment_type && p.themes
          );
          console.log(`${component}: ${hasRequiredForFilters ? '✅' : '❌'} Compatible`);
          break;
          
        case 'KnowledgeGraph':
          const hasRequiredForGraph = publications.every(p => 
            p.keywords && Array.isArray(p.keywords)
          );
          console.log(`${component}: ${hasRequiredForGraph ? '✅' : '❌'} Compatible`);
          break;
          
        case 'InsightsPanel':
          const insights = generateInsights(publications.slice(0, 10));
          console.log(`${component}: ${insights.length > 0 ? '✅' : '❌'} Compatible`);
          break;
          
        case 'AnalyticsCharts':
          const hasRequiredForCharts = publications.every(p => 
            p.impact_score && p.publication_date
          );
          console.log(`${component}: ${hasRequiredForCharts ? '✅' : '❌'} Compatible`);
          break;
      }
    } catch (error) {
      console.log(`${component}: ❌ Error - ${error.message}`);
    }
  });
};

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
  // Node.js environment
  testDataIntegration().then(success => {
    if (success) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  });
}
