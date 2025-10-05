/**
 * Test file to verify all insight types are working
 */

import { generateInsightsOptimized } from './utils/nasaDataOptimized.js';

// Mock publication data for testing
const mockPublications = [
  {
    id: 'test_1',
    title: 'Microgravity Effects on Mouse Bone Density',
    organism: 'Mouse',
    experiment_type: 'Microgravity',
    themes: ['Space Biology', 'Bone Health'],
    impact_score: 8,
    publication_date: '2023-01-01',
    authors: 'NASA Research Team'
  },
  {
    id: 'test_2', 
    title: 'Human Immune System Response in Space',
    organism: 'Human',
    experiment_type: 'Immune System',
    themes: ['Immune System', 'Space Biology'],
    impact_score: 9,
    publication_date: '2022-06-15',
    authors: 'NASA Research Team'
  },
  {
    id: 'test_3',
    title: 'Cell Differentiation Under Microgravity',
    organism: 'Cell',
    experiment_type: 'Cell Biology',
    themes: ['Cell Biology', 'Microgravity Effects'],
    impact_score: 7,
    publication_date: '2023-03-20',
    authors: 'NASA Research Team'
  },
  {
    id: 'test_4',
    title: 'Plant Growth in Space Environment',
    organism: 'Plant',
    experiment_type: 'Plant Biology',
    themes: ['Space Biology', 'Plant Biology'],
    impact_score: 6,
    publication_date: '2021-12-10',
    authors: 'NASA Research Team'
  },
  {
    id: 'test_5',
    title: 'Bacterial Adaptation to Space Conditions',
    organism: 'Bacteria',
    experiment_type: 'Microbiology',
    themes: ['Microbiology', 'Space Biology'],
    impact_score: 8,
    publication_date: '2023-08-05',
    authors: 'NASA Research Team'
  }
];

// Test all insight types
const testInsightTypes = () => {
  console.log('🧪 Testing all insight types...');
  
  const insights = generateInsightsOptimized(mockPublications);
  
  // Group insights by type
  const insightsByType = insights.reduce((acc, insight) => {
    acc[insight.type] = (acc[insight.type] || 0) + 1;
    return acc;
  }, {});
  
  console.log('\n📊 Insight Types Generated:');
  console.log(`- Progress: ${insightsByType.progress || 0} insights`);
  console.log(`- Gap: ${insightsByType.gap || 0} insights`);
  console.log(`- Consensus: ${insightsByType.consensus || 0} insights`);
  console.log(`- Actionable: ${insightsByType.actionable || 0} insights`);
  
  console.log('\n📋 Sample Insights by Type:');
  
  // Show sample insights for each type
  const types = ['progress', 'gap', 'consensus', 'actionable'];
  types.forEach(type => {
    const typeInsights = insights.filter(insight => insight.type === type);
    if (typeInsights.length > 0) {
      console.log(`\n${type.toUpperCase()} INSIGHTS:`);
      typeInsights.forEach(insight => {
        console.log(`- ${insight.title}`);
        console.log(`  Description: ${insight.description.substring(0, 100)}...`);
        console.log(`  Confidence: ${Math.round(insight.confidence_score * 100)}%`);
      });
    } else {
      console.log(`\n${type.toUpperCase()} INSIGHTS: None generated`);
    }
  });
  
  // Check if all types are present
  const hasAllTypes = types.every(type => insightsByType[type] > 0);
  
  if (hasAllTypes) {
    console.log('\n✅ SUCCESS: All insight types are working!');
    console.log(`Total insights generated: ${insights.length}`);
  } else {
    console.log('\n❌ ISSUE: Some insight types are missing');
    const missingTypes = types.filter(type => !insightsByType[type]);
    console.log(`Missing types: ${missingTypes.join(', ')}`);
  }
  
  return hasAllTypes;
};

// Test specific insight type filtering
const testInsightFiltering = () => {
  console.log('\n🔍 Testing insight type filtering...');
  
  const allInsights = generateInsightsOptimized(mockPublications);
  
  const types = ['progress', 'gap', 'consensus', 'actionable'];
  types.forEach(type => {
    const filteredInsights = allInsights.filter(insight => insight.type === type);
    console.log(`${type}: ${filteredInsights.length} insights`);
    
    if (filteredInsights.length > 0) {
      console.log(`  Sample: ${filteredInsights[0].title}`);
    }
  });
};

// Run tests
if (typeof window === 'undefined') {
  // Node.js environment
  const success = testInsightTypes();
  testInsightFiltering();
  
  if (success) {
    console.log('\n🎉 All tests passed! AI Insights should now work for all types.');
  } else {
    console.log('\n⚠️ Some tests failed. Check the insight generation logic.');
  }
} else {
  // Browser environment
  window.testInsights = {
    testInsightTypes,
    testInsightFiltering
  };
  console.log('Insight testing functions available at window.testInsights');
}
