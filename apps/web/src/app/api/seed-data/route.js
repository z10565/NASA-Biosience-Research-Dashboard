import sql from "@/app/api/utils/sql";

// Seed sample NASA bioscience publications data
export async function POST(request) {
  try {
    const samplePublications = [
      {
        title: "Effects of Microgravity on Plant Growth and Development in Space",
        authors: "Smith, J.A., Johnson, M.B., Williams, K.C.",
        abstract: "This study investigates the effects of microgravity on plant growth patterns, cellular development, and gene expression in Arabidopsis thaliana during spaceflight missions. Results show significant alterations in root development and gravitropic responses.",
        publication_date: "2023-06-15",
        journal: "Space Biology Research",
        doi: "10.1234/sbr.2023.001",
        url: "https://example.com/paper1",
        keywords: ["microgravity", "plant biology", "Arabidopsis", "spaceflight", "gravitropism"],
        experiment_type: "Plant Growth Study",
        organism: "Arabidopsis thaliana",
        mission_relevance: "Critical for understanding food production capabilities during long-duration space missions to Mars and beyond.",
        ai_summary: "This research demonstrates that microgravity significantly affects plant development, particularly root growth patterns and cellular organization. The findings are essential for developing sustainable food production systems for future Mars missions.",
        key_findings: [
          "Root growth patterns altered by 40% in microgravity conditions",
          "Gene expression changes in gravitropic response pathways",
          "Cellular wall development shows structural modifications",
          "Potential for adapted cultivation techniques identified"
        ],
        methodology: "Controlled experiment aboard the International Space Station using specialized plant growth chambers with Earth-based controls.",
        impact_score: 8,
        citation_count: 45
      },
      {
        title: "Bone Density Changes in Astronauts During Extended Spaceflight",
        authors: "Davis, R.L., Thompson, A.K., Brown, S.M.",
        abstract: "Analysis of bone mineral density changes in astronauts during 6-month ISS missions, examining the effectiveness of current countermeasures and proposing new intervention strategies.",
        publication_date: "2023-03-22",
        journal: "Aerospace Medicine & Human Performance",
        doi: "10.1234/amhp.2023.002",
        url: "https://example.com/paper2",
        keywords: ["bone density", "astronauts", "spaceflight", "countermeasures", "osteoporosis"],
        experiment_type: "Human Physiology Study",
        organism: "Homo sapiens",
        mission_relevance: "Essential for maintaining crew health during long-duration missions and developing effective countermeasures for bone loss.",
        ai_summary: "This comprehensive study reveals significant bone density loss patterns in astronauts and evaluates the effectiveness of current exercise countermeasures, providing recommendations for improved protocols.",
        key_findings: [
          "Average bone density loss of 1.5% per month in weight-bearing bones",
          "Current exercise protocols reduce loss by 60%",
          "Hip and spine regions most affected",
          "Recovery time on Earth averages 6-12 months"
        ],
        methodology: "Longitudinal study using DEXA scans and biomarker analysis of 24 astronauts over multiple missions.",
        impact_score: 9,
        citation_count: 78
      },
      {
        title: "Microbial Behavior and Antibiotic Resistance in Space Environment",
        authors: "Garcia, M.P., Lee, H.J., Anderson, C.R.",
        abstract: "Investigation of bacterial growth patterns, biofilm formation, and antibiotic resistance development in microgravity conditions using E. coli and S. aureus cultures.",
        publication_date: "2022-11-08",
        journal: "Microgravity Science and Technology",
        doi: "10.1234/mst.2022.003",
        url: "https://example.com/paper3",
        keywords: ["microbiology", "antibiotic resistance", "biofilms", "E. coli", "space medicine"],
        experiment_type: "Microbiology Study",
        organism: "Escherichia coli",
        mission_relevance: "Critical for understanding infection risks and developing medical protocols for crew health during space missions.",
        ai_summary: "This study reveals concerning changes in bacterial behavior in microgravity, including increased virulence and altered antibiotic susceptibility patterns.",
        key_findings: [
          "Increased biofilm formation in microgravity conditions",
          "Enhanced antibiotic resistance development",
          "Altered gene expression in stress response pathways",
          "Modified bacterial morphology and growth rates"
        ],
        methodology: "Controlled microgravity experiments using rotating wall vessel bioreactors and spaceflight hardware.",
        impact_score: 7,
        citation_count: 32
      },
      {
        title: "Radiation Effects on DNA Repair Mechanisms in Human Cells",
        authors: "Wilson, K.T., Martinez, L.A., Taylor, J.B.",
        abstract: "Comprehensive analysis of DNA damage and repair mechanisms in human fibroblasts exposed to galactic cosmic radiation and solar particle events simulated in laboratory conditions.",
        publication_date: "2023-01-12",
        journal: "Radiation Research",
        doi: "10.1234/rr.2023.004",
        url: "https://example.com/paper4",
        keywords: ["radiation", "DNA repair", "cosmic rays", "human cells", "space radiation"],
        experiment_type: "Radiation Biology Study",
        organism: "Homo sapiens",
        mission_relevance: "Fundamental for assessing radiation risks and developing protective strategies for deep space exploration missions.",
        ai_summary: "This research provides crucial insights into how space radiation affects human cellular repair mechanisms, informing risk assessment for Mars missions.",
        key_findings: [
          "Significant impairment of homologous recombination repair",
          "Increased chromosomal aberrations with high-LET radiation",
          "Cell cycle checkpoint activation patterns altered",
          "Potential therapeutic targets for radioprotection identified"
        ],
        methodology: "In vitro cell culture experiments using particle accelerator-generated radiation to simulate space conditions.",
        impact_score: 8,
        citation_count: 56
      },
      {
        title: "Protein Crystallization in Microgravity for Drug Development",
        authors: "Chen, Y.L., Roberts, D.M., Kumar, S.P.",
        abstract: "Study of protein crystallization processes in microgravity conditions to produce higher quality crystals for pharmaceutical research and drug design applications.",
        publication_date: "2022-09-30",
        journal: "Crystal Growth & Design",
        doi: "10.1234/cgd.2022.005",
        url: "https://example.com/paper5",
        keywords: ["protein crystallization", "microgravity", "drug development", "pharmaceuticals", "crystal quality"],
        experiment_type: "Protein Crystallization Study",
        organism: "Various proteins",
        mission_relevance: "Enables development of improved pharmaceuticals and supports commercial space applications for drug discovery.",
        ai_summary: "This study demonstrates the superior quality of protein crystals grown in microgravity, with implications for advancing drug development and therapeutic research.",
        key_findings: [
          "50% improvement in crystal quality and size",
          "Reduced defects and improved diffraction patterns",
          "Enhanced structural resolution for drug target analysis",
          "Successful crystallization of previously difficult proteins"
        ],
        methodology: "Automated crystallization experiments conducted on the International Space Station using specialized hardware.",
        impact_score: 6,
        citation_count: 28
      }
    ];

    // Insert sample publications
    for (const pub of samplePublications) {
      const query = `
        INSERT INTO publications (
          title, authors, abstract, publication_date, journal, doi, url,
          keywords, experiment_type, organism, mission_relevance, ai_summary,
          key_findings, methodology, impact_score, citation_count
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
        )
      `;
      
      const params = [
        pub.title, pub.authors, pub.abstract, pub.publication_date, 
        pub.journal, pub.doi, pub.url, pub.keywords, 
        pub.experiment_type, pub.organism, pub.mission_relevance, 
        pub.ai_summary, pub.key_findings, pub.methodology,
        pub.impact_score, pub.citation_count
      ];
      
      await sql(query, params);
    }

    // Insert sample research themes
    const themes = [
      {
        name: "Space Plant Biology",
        description: "Research focused on plant growth and development in space environments",
        publication_count: 2,
        key_entities: ["Arabidopsis thaliana", "microgravity", "plant growth"],
        trend_direction: "increasing"
      },
      {
        name: "Human Space Physiology",
        description: "Studies on human physiological adaptations and health in space",
        publication_count: 2,
        key_entities: ["bone density", "radiation effects", "astronaut health"],
        trend_direction: "stable"
      },
      {
        name: "Space Microbiology",
        description: "Investigation of microbial behavior in space environments",
        publication_count: 1,
        key_entities: ["E. coli", "biofilms", "antibiotic resistance"],
        trend_direction: "increasing"
      }
    ];

    for (const theme of themes) {
      const query = `
        INSERT INTO research_themes (
          name, description, publication_count, key_entities, trend_direction
        ) VALUES (
          $1, $2, $3, $4, $5
        )
      `;
      
      const params = [
        theme.name, theme.description, theme.publication_count,
        theme.key_entities, theme.trend_direction
      ];
      
      await sql(query, params);
    }

    // Insert sample insights
    const insights = [
      {
        type: "progress",
        title: "Significant Advances in Space Plant Biology",
        description: "Recent studies show remarkable progress in understanding how plants adapt to microgravity, with new cultivation techniques showing promise for sustainable food production in space.",
        supporting_publications: [1, 5],
        confidence_score: 0.85,
        mission_impact: "These advances are crucial for establishing sustainable food systems for Mars missions and long-duration space exploration."
      },
      {
        type: "gap",
        title: "Limited Understanding of Long-term Radiation Effects",
        description: "While we understand acute radiation effects, there's insufficient data on cumulative radiation exposure effects over multi-year missions to Mars.",
        supporting_publications: [4],
        confidence_score: 0.78,
        mission_impact: "This knowledge gap poses significant risks for crew safety during extended deep space missions."
      },
      {
        type: "actionable",
        title: "Enhanced Countermeasures for Bone Loss Prevention",
        description: "Current research suggests combining exercise protocols with pharmaceutical interventions could significantly reduce bone density loss in astronauts.",
        supporting_publications: [2],
        confidence_score: 0.82,
        mission_impact: "Implementation of these countermeasures could reduce crew health risks and post-mission recovery time."
      }
    ];

    for (const insight of insights) {
      const query = `
        INSERT INTO insights (
          type, title, description, supporting_publications, 
          confidence_score, mission_impact
        ) VALUES (
          $1, $2, $3, $4, $5, $6
        )
      `;
      
      const params = [
        insight.type, insight.title, insight.description, 
        insight.supporting_publications, insight.confidence_score, 
        insight.mission_impact
      ];
      
      await sql(query, params);
    }

    return Response.json({ 
      success: true, 
      message: "Sample data seeded successfully",
      publications_added: samplePublications.length,
      themes_added: themes.length,
      insights_added: insights.length
    });

  } catch (error) {
    console.error('Error seeding data:', error);
    return Response.json({ error: 'Failed to seed data' }, { status: 500 });
  }
}