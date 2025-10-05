import sql from "@/app/api/utils/sql";

// Get all publications with filtering and search
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const organism = searchParams.get('organism');
    const experimentType = searchParams.get('experiment_type');
    const theme = searchParams.get('theme');
    const limit = parseInt(searchParams.get('limit')) || 50;
    const offset = parseInt(searchParams.get('offset')) || 0;

    let query = `
      SELECT p.*, 
             array_agg(DISTINCT rt.name) as themes
      FROM publications p
      LEFT JOIN publication_themes pt ON p.id = pt.publication_id
      LEFT JOIN research_themes rt ON pt.theme_id = rt.id
      WHERE 1=1
    `;
    
    const params = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      query += ` AND (
        LOWER(p.title) LIKE LOWER($${paramCount}) OR 
        LOWER(p.abstract) LIKE LOWER($${paramCount}) OR 
        LOWER(p.authors) LIKE LOWER($${paramCount})
      )`;
      params.push(`%${search}%`);
    }

    if (organism) {
      paramCount++;
      query += ` AND LOWER(p.organism) = LOWER($${paramCount})`;
      params.push(organism);
    }

    if (experimentType) {
      paramCount++;
      query += ` AND LOWER(p.experiment_type) = LOWER($${paramCount})`;
      params.push(experimentType);
    }

    if (theme) {
      paramCount++;
      query += ` AND rt.name = $${paramCount}`;
      params.push(theme);
    }

    query += ` 
      GROUP BY p.id
      ORDER BY p.publication_date DESC, p.impact_score DESC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;
    params.push(limit, offset);

    const publications = await sql(query, params);

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(DISTINCT p.id) as total
      FROM publications p
      LEFT JOIN publication_themes pt ON p.id = pt.publication_id
      LEFT JOIN research_themes rt ON pt.theme_id = rt.id
      WHERE 1=1
    `;
    
    const countParams = [];
    let countParamCount = 0;

    if (search) {
      countParamCount++;
      countQuery += ` AND (
        LOWER(p.title) LIKE LOWER($${countParamCount}) OR 
        LOWER(p.abstract) LIKE LOWER($${countParamCount}) OR 
        LOWER(p.authors) LIKE LOWER($${countParamCount})
      )`;
      countParams.push(`%${search}%`);
    }

    if (organism) {
      countParamCount++;
      countQuery += ` AND LOWER(p.organism) = LOWER($${countParamCount})`;
      countParams.push(organism);
    }

    if (experimentType) {
      countParamCount++;
      countQuery += ` AND LOWER(p.experiment_type) = LOWER($${countParamCount})`;
      countParams.push(experimentType);
    }

    if (theme) {
      countParamCount++;
      countQuery += ` AND rt.name = $${countParamCount}`;
      countParams.push(theme);
    }

    const [{ total }] = await sql(countQuery, countParams);

    return Response.json({
      publications,
      pagination: {
        total: parseInt(total),
        limit,
        offset,
        hasMore: offset + limit < parseInt(total)
      }
    });
  } catch (error) {
    console.error('Error fetching publications:', error);
    return Response.json({ error: 'Failed to fetch publications' }, { status: 500 });
  }
}

// Create a new publication
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      title,
      authors,
      abstract,
      publication_date,
      journal,
      doi,
      url,
      keywords,
      experiment_type,
      organism,
      mission_relevance,
      ai_summary,
      key_findings,
      methodology,
      impact_score,
      citation_count
    } = body;

    if (!title) {
      return Response.json({ error: 'Title is required' }, { status: 400 });
    }

    const query = `
      INSERT INTO publications (
        title, authors, abstract, publication_date, journal, doi, url,
        keywords, experiment_type, organism, mission_relevance, ai_summary,
        key_findings, methodology, impact_score, citation_count
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
      ) RETURNING *
    `;
    
    const params = [
      title, authors, abstract, publication_date, journal, 
      doi, url, keywords, experiment_type, organism, 
      mission_relevance, ai_summary, key_findings, methodology,
      impact_score || 0, citation_count || 0
    ];
    
    const [publication] = await sql(query, params);

    return Response.json(publication);
  } catch (error) {
    console.error('Error creating publication:', error);
    return Response.json({ error: 'Failed to create publication' }, { status: 500 });
  }
}