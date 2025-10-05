import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ScatterChart,
  Scatter
} from 'recharts';
import { TrendingUp, PieChart as PieChartIcon, BarChart3, Activity } from 'lucide-react';

export default function AnalyticsCharts({ publications }) {
  const chartData = useMemo(() => {
    if (!publications || publications.length === 0) {
      return {
        publicationsByYear: [],
        publicationsByOrganism: [],
        publicationsByExperimentType: [],
        impactScoreDistribution: [],
        publicationTrends: []
      };
    }

    // Publications by year
    const yearCounts = publications.reduce((acc, pub) => {
      if (pub.publication_date) {
        const year = new Date(pub.publication_date).getFullYear();
        acc[year] = (acc[year] || 0) + 1;
      }
      return acc;
    }, {});

    const publicationsByYear = Object.entries(yearCounts)
      .map(([year, count]) => ({ year: parseInt(year), count }))
      .sort((a, b) => a.year - b.year);

    // Publications by organism
    const organismCounts = publications.reduce((acc, pub) => {
      if (pub.organism) {
        const organism = pub.organism.trim();
        acc[organism] = (acc[organism] || 0) + 1;
      }
      return acc;
    }, {});

    const publicationsByOrganism = Object.entries(organismCounts)
      .map(([organism, count]) => ({ organism, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10

    // Publications by experiment type
    const experimentCounts = publications.reduce((acc, pub) => {
      if (pub.experiment_type) {
        const type = pub.experiment_type.trim();
        acc[type] = (acc[type] || 0) + 1;
      }
      return acc;
    }, {});

    const publicationsByExperimentType = Object.entries(experimentCounts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8); // Top 8

    // Impact score distribution
    const impactScores = publications
      .filter(pub => pub.impact_score && pub.impact_score > 0)
      .map(pub => pub.impact_score);

    const impactRanges = {
      'Low (1-3)': 0,
      'Medium (4-6)': 0,
      'High (7-8)': 0,
      'Very High (9-10)': 0
    };

    impactScores.forEach(score => {
      if (score <= 3) impactRanges['Low (1-3)']++;
      else if (score <= 6) impactRanges['Medium (4-6)']++;
      else if (score <= 8) impactRanges['High (7-8)']++;
      else impactRanges['Very High (9-10)']++;
    });

    const impactScoreDistribution = Object.entries(impactRanges)
      .map(([range, count]) => ({ range, count }));

    // Publication trends with impact scores
    const publicationTrends = publicationsByYear.map(yearData => {
      const yearPubs = publications.filter(pub => 
        pub.publication_date && new Date(pub.publication_date).getFullYear() === yearData.year
      );
      
      const avgImpact = yearPubs.length > 0 
        ? yearPubs.reduce((sum, pub) => sum + (pub.impact_score || 0), 0) / yearPubs.length
        : 0;

      return {
        year: yearData.year,
        count: yearData.count,
        avgImpact: Math.round(avgImpact * 10) / 10
      };
    });

    return {
      publicationsByYear,
      publicationsByOrganism,
      publicationsByExperimentType,
      impactScoreDistribution,
      publicationTrends
    };
  }, [publications]);

  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#06B6D4', '#F97316', '#84CC16', '#EC4899', '#6366F1'
  ];

  if (!publications || publications.length === 0) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No data available</h3>
        <p className="text-gray-500">Add publications to see analytics and trends.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Publications</p>
              <p className="text-2xl font-bold text-gray-900">{publications.length}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unique Organisms</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(publications.filter(p => p.organism).map(p => p.organism)).size}
              </p>
            </div>
            <Activity className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Experiment Types</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(publications.filter(p => p.experiment_type).map(p => p.experiment_type)).size}
              </p>
            </div>
            <PieChartIcon className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Impact Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {publications.filter(p => p.impact_score > 0).length > 0
                  ? Math.round(
                      publications.reduce((sum, p) => sum + (p.impact_score || 0), 0) /
                      publications.filter(p => p.impact_score > 0).length * 10
                    ) / 10
                  : 'N/A'
                }
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Publications by Year */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Publications by Year</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData.publicationsByYear}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Two column layout for smaller charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Publications by Organism */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Organisms Studied</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.publicationsByOrganism}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ organism, percent }) => `${organism} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {chartData.publicationsByOrganism.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Publications by Experiment Type */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Experiment Types</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData.publicationsByExperimentType}
              layout="vertical" // <-- use vertical for horizontal bars
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="count" />
              <YAxis type="category" dataKey="type" width={100} />
              <Tooltip />
              <Bar dataKey="count" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Impact Score Distribution */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Impact Score Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData.impactScoreDistribution}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#F59E0B" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Publication Trends with Impact */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Publication Trends & Average Impact</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData.publicationTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="count" fill="#3B82F6" name="Publications" />
            <Line 
              yAxisId="right" 
              type="monotone" 
              dataKey="avgImpact" 
              stroke="#EF4444" 
              strokeWidth={3}
              name="Avg Impact Score"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}