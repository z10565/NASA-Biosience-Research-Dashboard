import sql from "@/app/api/utils/sql";

// AI-powered analysis endpoint
export async function POST(request) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'scrape_nasa_repository':
        return await scrapeNASARepository();
      
      case 'analyze_publication':
        return await analyzePublication(data);
      
      case 'generate_insights':
        return await generateInsights(data);
      
      case 'extract_entities':
        return await extractEntities(data);
      
      default:
        return Response.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in analysis:', error);
    return Response.json({ error: 'Analysis failed' }, { status: 500 });
  }
}

async function scrapeNASARepository() {
  try {
    // Scrape the NASA bioscience repository
    const response = await fetch('/integrations/web-scraping/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: 'https://www.nasa.gov/biological-physical-sciences-research-publications/',
        getText: true
      })
    });

    const content = await response.text();
    
    // Use AI to extract publication information
    const aiResponse = await fetch('/integrations/chat-gpt/conversationgpt4', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{
          role: 'system',
          content: `You are an expert at extracting publication data from NASA bioscience research pages. Extract publication information including titles, authors, abstracts, dates, and any available metadata. Focus on identifying experiment types, organisms studied, and mission relevance.`
        }, {
          role: 'user',
          content: `Extract publication data from this NASA bioscience page content: ${content.substring(0, 8000)}`
        }],
        json_schema: {
          name: "publication_extraction",
          schema: {
            type: "object",
            properties: {
              publications: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    authors: { type: "string" },
                    abstract: { type: "string" },
                    publication_date: { type: "string" },
                    journal: { type: "string" },
                    doi: { type: "string" },
                    url: { type: "string" },
                    keywords: { 
                      type: "array",
                      items: { type: "string" }
                    },
                    experiment_type: { type: "string" },
                    organism: { type: "string" },
                    mission_relevance: { type: "string" }
                  },
                  required: ["title"],
                  additionalProperties: false
                }
              },
              total_found: { type: "number" }
            },
            required: ["publications", "total_found"],
            additionalProperties: false
          }
        }
      })
    });

    const aiResult = await aiResponse.json();
    const extractedData = JSON.parse(aiResult.choices[0].message.content);

    return Response.json({
      success: true,
      data: extractedData,
      message: `Found ${extractedData.total_found} publications`
    });

  } catch (error) {
    console.error('Error scraping NASA repository:', error);
    return Response.json({ error: 'Failed to scrape repository' }, { status: 500 });
  }
}

async function analyzePublication(publicationData) {
  try {
    const { title, abstract, authors } = publicationData;
    
    const aiResponse = await fetch('/integrations/chat-gpt/conversationgpt4', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{
          role: 'system',
          content: `You are an expert in NASA bioscience research. Analyze publications to extract key insights, methodologies, findings, and assess their impact on space missions. Identify the organisms studied, experiment types, and mission relevance.`
        }, {
          role: 'user',
          content: `Analyze this NASA bioscience publication:
          
Title: ${title}
Authors: ${authors}
Abstract: ${abstract}

Provide a comprehensive analysis including key findings, methodology, organisms studied, experiment type, mission relevance, and impact score (1-10).`
        }],
        json_schema: {
          name: "publication_analysis",
          schema: {
            type: "object",
            properties: {
              ai_summary: { type: "string" },
              key_findings: {
                type: "array",
                items: { type: "string" }
              },
              methodology: { type: "string" },
              experiment_type: { type: "string" },
              organism: { type: "string" },
              mission_relevance: { type: "string" },
              impact_score: { type: "number" },
              keywords: {
                type: "array",
                items: { type: "string" }
              },
              entities: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    type: { type: "string" },
                    description: { type: "string" }
                  },
                  required: ["name", "type"],
                  additionalProperties: false
                }
              }
            },
            required: ["ai_summary", "key_findings", "methodology", "impact_score"],
            additionalProperties: false
          }
        }
      })
    });

    const aiResult = await aiResponse.json();
    const analysis = JSON.parse(aiResult.choices[0].message.content);

    return Response.json({
      success: true,
      analysis
    });

  } catch (error) {
    console.error('Error analyzing publication:', error);
    return Response.json({ error: 'Failed to analyze publication' }, { status: 500 });
  }
}

async function generateInsights(data) {
  try {
    const { publicationIds, analysisType } = data;
    
    // Get publications data
    const query = `SELECT * FROM publications WHERE id = ANY($1)`;
    const publications = await sql(query, [publicationIds]);

    const publicationsText = publications.map(p => 
      `Title: ${p.title}\nSummary: ${p.ai_summary}\nFindings: ${p.key_findings?.join(', ')}\nOrganism: ${p.organism}\nExperiment: ${p.experiment_type}`
    ).join('\n\n');

    const aiResponse = await fetch('/integrations/chat-gpt/conversationgpt4', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{
          role: 'system',
          content: `You are an expert NASA research analyst. Generate insights about bioscience research patterns, identify knowledge gaps, areas of consensus/disagreement, scientific progress, and actionable recommendations for mission planners.`
        }, {
          role: 'user',
          content: `Analyze these NASA bioscience publications and generate insights of type "${analysisType}":

${publicationsText}

Focus on identifying patterns, gaps, consensus areas, disagreements, and actionable insights for space missions.`
        }],
        json_schema: {
          name: "research_insights",
          schema: {
            type: "object",
            properties: {
              insights: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    type: { type: "string" },
                    title: { type: "string" },
                    description: { type: "string" },
                    confidence_score: { type: "number" },
                    mission_impact: { type: "string" },
                    supporting_evidence: {
                      type: "array",
                      items: { type: "string" }
                    }
                  },
                  required: ["type", "title", "description", "confidence_score"],
                  additionalProperties: false
                }
              }
            },
            required: ["insights"],
            additionalProperties: false
          }
        }
      })
    });

    const aiResult = await aiResponse.json();
    const insights = JSON.parse(aiResult.choices[0].message.content);

    return Response.json({
      success: true,
      insights: insights.insights
    });

  } catch (error) {
    console.error('Error generating insights:', error);
    return Response.json({ error: 'Failed to generate insights' }, { status: 500 });
  }
}

async function extractEntities(data) {
  try {
    const { text, publicationId } = data;
    
    const aiResponse = await fetch('/integrations/chat-gpt/conversationgpt4', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{
          role: 'system',
          content: `Extract scientific entities from bioscience research text. Identify organisms, experiment types, methodologies, findings, and mission-related concepts. Determine relationships between entities.`
        }, {
          role: 'user',
          content: `Extract entities and their relationships from this research text: ${text}`
        }],
        json_schema: {
          name: "entity_extraction",
          schema: {
            type: "object",
            properties: {
              entities: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    type: { type: "string" },
                    description: { type: "string" }
                  },
                  required: ["name", "type"],
                  additionalProperties: false
                }
              },
              relationships: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    source: { type: "string" },
                    target: { type: "string" },
                    relationship_type: { type: "string" },
                    strength: { type: "number" }
                  },
                  required: ["source", "target", "relationship_type"],
                  additionalProperties: false
                }
              }
            },
            required: ["entities", "relationships"],
            additionalProperties: false
          }
        }
      })
    });

    const aiResult = await aiResponse.json();
    const extracted = JSON.parse(aiResult.choices[0].message.content);

    return Response.json({
      success: true,
      entities: extracted.entities,
      relationships: extracted.relationships
    });

  } catch (error) {
    console.error('Error extracting entities:', error);
    return Response.json({ error: 'Failed to extract entities' }, { status: 500 });
  }
}