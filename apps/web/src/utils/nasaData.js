/**
 * NASA Articles Data Utility
 * Handles fetching and processing NASA biology articles data
 */

// Mock data transformation to match component expectations
const transformArticleData = (articles) => {
  return articles.map((article, index) => ({
    id: `nasa_${index}`,
    title: article.Title,
    url: article.Link,
    // Extract organism from title (simplified approach)
    organism: extractOrganismFromTitle(article.Title),
    // Extract experiment type from title
    experiment_type: extractExperimentType(article.Title),
    // Generate keywords from title
    keywords: extractKeywords(article.Title),
    // Mock additional fields for component compatibility
    authors: 'NASA Research Team',
    publication_date: generateRandomDate(),
    journal: 'NASA Biology Research',
    abstract: generateAbstract(article.Title),
    impact_score: generateImpactScore(),
    ai_summary: generateAISummary(article.Title),
    key_findings: generateKeyFindings(article.Title),
    methodology: generateMethodology(article.Title),
    mission_relevance: generateMissionRelevance(article.Title),
    themes: generateThemes(article.Title)
  }));
};

// Helper functions to extract and generate data
const extractOrganismFromTitle = (title) => {
  const organismKeywords = [
    'mouse', 'mice', 'rat', 'rats', 'human', 'cell', 'cells', 'tissue', 'plant', 'bacteria', 
    'microorganism', 'organism', 'animal', 'drosophila', 'zebrafish', 'arabidopsis'
  ];
  
  const lowerTitle = title.toLowerCase();
  for (const keyword of organismKeywords) {
    if (lowerTitle.includes(keyword)) {
      return keyword.charAt(0).toUpperCase() + keyword.slice(1);
    }
  }
  return 'Mixed Organisms';
};

const extractExperimentType = (title) => {
  const experimentKeywords = [
    'microgravity', 'spaceflight', 'radiation', 'gene expression', 'protein', 'metabolism',
    'oxidative stress', 'cell cycle', 'differentiation', 'regeneration', 'bone', 'muscle',
    'immune', 'cardiovascular', 'neural', 'stem cell', 'transcriptome', 'proteome'
  ];
  
  const lowerTitle = title.toLowerCase();
  for (const keyword of experimentKeywords) {
    if (lowerTitle.includes(keyword)) {
      return keyword.charAt(0).toUpperCase() + keyword.slice(1);
    }
  }
  return 'General Biology';
};

const extractKeywords = (title) => {
  const words = title.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3)
    .filter(word => !['this', 'that', 'with', 'from', 'into', 'only', 'more', 'also', 'each', 'which', 'their', 'time', 'will', 'about', 'would', 'there', 'could', 'other'].includes(word));
  
  return words.slice(0, 5);
};

const generateRandomDate = () => {
  const startYear = 2015;
  const endYear = 2024;
  const year = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
  const month = Math.floor(Math.random() * 12) + 1;
  const day = Math.floor(Math.random() * 28) + 1;
  return new Date(year, month - 1, day).toISOString();
};

const generateImpactScore = () => {
  // Generate scores between 4-10 for NASA research
  return Math.floor(Math.random() * 7) + 4;
};

const generateAbstract = (title) => {
  const baseAbstracts = [
    `This study investigates the effects described in "${title}" under space conditions. The research provides valuable insights into biological responses in microgravity environments.`,
    `Research examining the biological mechanisms outlined in "${title}" reveals significant findings about space biology and its implications for long-term space missions.`,
    `This comprehensive study of the phenomena described in "${title}" contributes to our understanding of how biological systems adapt to space environments.`
  ];
  return baseAbstracts[Math.floor(Math.random() * baseAbstracts.length)];
};

const generateAISummary = (title) => {
  return `AI Analysis: This NASA research on "${title}" demonstrates critical findings for space biology. The study provides essential data for understanding biological responses in space environments, with implications for future space missions and astronaut health.`;
};

const generateKeyFindings = (title) => {
  const findings = [
    `Significant biological changes observed in space environment`,
    `Microgravity effects on cellular mechanisms identified`,
    `Potential applications for space mission planning`,
    `Important implications for astronaut health and safety`
  ];
  return findings.slice(0, Math.floor(Math.random() * 3) + 2);
};

const generateMethodology = (title) => {
  return `The study employed advanced biological research techniques to examine the effects described in "${title}". Experimental protocols included controlled space environment simulations and comprehensive biological analysis methods.`;
};

const generateMissionRelevance = (title) => {
  return `This research directly supports NASA's mission objectives for long-duration space travel. Findings from "${title}" provide crucial data for developing countermeasures and understanding biological adaptation in space environments.`;
};

const generateThemes = (title) => {
  const allThemes = [
    'Space Biology', 'Microgravity Effects', 'Radiation Biology', 'Cell Biology', 
    'Tissue Engineering', 'Gene Expression', 'Protein Synthesis', 'Metabolic Changes',
    'Immune System', 'Cardiovascular Health', 'Bone Health', 'Muscle Physiology'
  ];
  
  const numThemes = Math.floor(Math.random() * 3) + 1;
  const selectedThemes = [];
  for (let i = 0; i < numThemes; i++) {
    const theme = allThemes[Math.floor(Math.random() * allThemes.length)];
    if (!selectedThemes.includes(theme)) {
      selectedThemes.push(theme);
    }
  }
  return selectedThemes.length > 0 ? selectedThemes : ['Space Biology'];
};

// Main data fetching function
export const fetchNASAData = async () => {
  try {
    const response = await fetch('/data/articles.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const articles = await response.json();
    return transformArticleData(articles);
  } catch (error) {
    console.error('Error fetching NASA data:', error);
    throw error;
  }
};

// Filter functions for components
export const filterPublications = (publications, filters) => {
  if (!publications) return [];
  
  return publications.filter(publication => {
    // Organism filter
    if (filters.organism && publication.organism !== filters.organism) {
      return false;
    }
    
    // Experiment type filter
    if (filters.experimentType && publication.experiment_type !== filters.experimentType) {
      return false;
    }
    
    // Theme filter
    if (filters.theme && (!publication.themes || !publication.themes.includes(filters.theme))) {
      return false;
    }
    
    // Date range filter
    if (filters.dateRange) {
      const pubYear = new Date(publication.publication_date).getFullYear();
      const filterYear = parseInt(filters.dateRange);
      
      if (filters.dateRange === 'older') {
        if (pubYear >= 2015) return false;
      } else if (pubYear !== filterYear) {
        return false;
      }
    }
    
    return true;
  });
};

// Search function
export const searchPublications = (publications, searchTerm) => {
  if (!publications || !searchTerm) return publications;
  
  const term = searchTerm.toLowerCase();
  return publications.filter(publication => 
    publication.title.toLowerCase().includes(term) ||
    publication.abstract.toLowerCase().includes(term) ||
    publication.authors.toLowerCase().includes(term) ||
    (publication.keywords && publication.keywords.some(keyword => 
      keyword.toLowerCase().includes(term)
    ))
  );
};

// Generate insights from publications
export const generateInsights = (publications) => {
  if (!publications || publications.length === 0) return [];
  
  const insights = [];
  
  // Analyze organism distribution
  const organismCounts = publications.reduce((acc, pub) => {
    acc[pub.organism] = (acc[pub.organism] || 0) + 1;
    return acc;
  }, {});
  
  const topOrganism = Object.entries(organismCounts)
    .sort(([,a], [,b]) => b - a)[0];
  
  if (topOrganism) {
    insights.push({
      id: 'organism_focus',
      type: 'progress',
      title: `Research Focus on ${topOrganism[0]}`,
      description: `Most research (${topOrganism[1]} publications) focuses on ${topOrganism[0]}, indicating strong scientific interest in this organism's response to space conditions.`,
      confidence_score: 0.9,
      mission_impact: `Understanding ${topOrganism[0]} biology in space is crucial for developing appropriate countermeasures for long-duration missions.`,
      supporting_evidence: [
        `${topOrganism[1]} publications study ${topOrganism[0]} biology`,
        'Consistent research focus indicates importance',
        'Data supports mission planning decisions'
      ],
      supporting_publication_titles: publications
        .filter(p => p.organism === topOrganism[0])
        .slice(0, 3)
        .map(p => p.title),
      created_at: new Date().toISOString()
    });
  }
  
  // Analyze experiment types
  const experimentCounts = publications.reduce((acc, pub) => {
    acc[pub.experiment_type] = (acc[pub.experiment_type] || 0) + 1;
    return acc;
  }, {});
  
  const totalExperiments = Object.keys(experimentCounts).length;
  if (totalExperiments > 10) {
    insights.push({
      id: 'diverse_methods',
      type: 'progress',
      title: 'Diverse Research Methodologies',
      description: `Research spans ${totalExperiments} different experiment types, showing comprehensive approach to space biology research.`,
      confidence_score: 0.8,
      mission_impact: 'Diverse methodologies ensure robust understanding of biological responses in space.',
      supporting_evidence: [
        `${totalExperiments} distinct experiment types identified`,
        'Comprehensive coverage of biological systems',
        'Multiple approaches validate findings'
      ],
      supporting_publication_titles: publications.slice(0, 3).map(p => p.title),
      created_at: new Date().toISOString()
    });
  }
  
  // Identify research gaps
  const themes = [...new Set(publications.flatMap(p => p.themes))];
  const criticalThemes = ['Immune System', 'Cardiovascular Health', 'Neural Plasticity'];
  const missingThemes = criticalThemes.filter(theme => !themes.includes(theme));
  
  if (missingThemes.length > 0) {
    insights.push({
      id: 'research_gaps',
      type: 'gap',
      title: 'Potential Research Gaps Identified',
      description: `Limited research found in critical areas: ${missingThemes.join(', ')}. These areas may need more attention for comprehensive space biology understanding.`,
      confidence_score: 0.7,
      mission_impact: 'Addressing these gaps could improve astronaut health and mission success.',
      supporting_evidence: [
        `${missingThemes.length} critical themes with limited research`,
        'These areas are important for long-duration missions',
        'Additional research could fill knowledge gaps'
      ],
      supporting_publication_titles: [],
      created_at: new Date().toISOString()
    });
  }
  
  return insights;
};

export default {
  fetchNASAData,
  filterPublications,
  searchPublications,
  generateInsights
};
