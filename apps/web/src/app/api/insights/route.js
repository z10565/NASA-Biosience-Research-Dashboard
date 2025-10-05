import sql from "@/app/api/utils/sql";

// Get insights with filtering
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit')) || 20;

    let query = `
      SELECT i.*,
             array_agg(DISTINCT p.title) as supporting_publication_titles
      FROM insights i
      LEFT JOIN publications p ON p.id = ANY(i.supporting_publications)
      WHERE 1=1
    `;
    
    const params = [];
    let paramCount = 0;

    if (type) {
      paramCount++;
      query += ` AND i.type = $${paramCount}`;
      params.push(type);
    }

    query += ` 
      GROUP BY i.id
      ORDER BY i.confidence_score DESC, i.created_at DESC
      LIMIT $${paramCount + 1}
    `;
    params.push(limit);

    const insights = await sql(query, params);

    return Response.json(insights);
  } catch (error) {
    console.error('Error fetching insights:', error);
    return Response.json({ error: 'Failed to fetch insights' }, { status: 500 });
  }
}

// Create a new insight
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      type,
      title,
      description,
      supporting_publications,
      confidence_score,
      mission_impact
    } = body;

    if (!type || !title) {
      return Response.json({ error: 'Type and title are required' }, { status: 400 });
    }

    const query = `
      INSERT INTO insights (
        type, title, description, supporting_publications, 
        confidence_score, mission_impact
      ) VALUES (
        $1, $2, $3, $4, $5, $6
      ) RETURNING *
    `;
    
    const params = [
      type, title, description, supporting_publications || [],
      confidence_score || 0.5, mission_impact
    ];
    
    const [insight] = await sql(query, params);

    return Response.json(insight);
  } catch (error) {
    console.error('Error creating insight:', error);
    return Response.json({ error: 'Failed to create insight' }, { status: 500 });
  }
}