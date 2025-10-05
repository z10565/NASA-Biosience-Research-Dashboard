"use client";

import { useState, useCallback } from "react";
import {
  Search,
  Filter,
  BarChart3,
  Network,
  Brain,
  Loader2,
  BookOpen,
  TrendingUp,
  AlertTriangle,
  Users,
  Rocket,
} from "lucide-react";
import PublicationsList from "../components/PublicationsList";
import InsightsPanel from "../components/InsightsPanel";
import KnowledgeGraph from "../components/KnowledgeGraph";
import AnalyticsCharts from "../components/AnalyticsCharts";
import SearchFilters from "../components/SearchFilters";
import { useNASADataOptimized } from "../hooks/useNASADataOptimized.js";

export default function NASABioscienceDashboard() {
  const [activeTab, setActiveTab] = useState("publications");
  const [showFilters, setShowFilters] = useState(false);

  // Use our optimized NASA data hook
  const {
    publications,
    allPublications,
    insights,
    stats,
    filterOptions,
    loading,
    error,
    generatingInsights,
    filters,
    searchTerm,
    pagination,
    handleFilterChange,
    handleSearchChange,
    handleGenerateInsights,
    handlePageChange,
    clearFilters,
    refetch,
    performanceInfo
  } = useNASADataOptimized(50); // 50 items per page for better performance

  const handleSearch = useCallback((query) => {
    handleSearchChange(query);
  }, [handleSearchChange]);

  const totalPublications = pagination?.total || 0;

  const tabs = [
    { id: "publications", label: "Publications", icon: BookOpen },
    { id: "insights", label: "AI Insights", icon: Brain },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "knowledge-graph", label: "Knowledge Graph", icon: Network },
  ];

  const insightTypes = [
    { id: "progress", label: "Scientific Progress", icon: TrendingUp },
    { id: "gaps", label: "Knowledge Gaps", icon: AlertTriangle },
    { id: "consensus", label: "Areas of Consensus", icon: Users },
    { id: "actionable", label: "Mission Insights", icon: Rocket },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Rocket className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">
                  NASA Bioscience Research Dashboard
                </h1>
              </div>
              <div className="text-sm text-gray-500">
                {totalPublications} publications analyzed
                {performanceInfo && (
                  <span className="ml-2 text-green-600">
                    • {performanceInfo.filteredCount} filtered
                  </span>
                )}
              </div>
            </div>

            {/* <div className="flex items-center space-x-4">
              {totalPublications === 0 && (
                <button
                  onClick={() => seedDataMutation.mutate()}
                  disabled={seedDataMutation.isLoading}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {seedDataMutation.isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <BookOpen className="h-4 w-4" />
                  )}
                  <span>Load Sample Data</span>
                </button>
              )}

              <button
                onClick={handleScrapeRepository}
                disabled={scrapeRepositoryMutation.isLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {scrapeRepositoryMutation.isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                <span>Sync Repository</span>
              </button>
            </div> */}
          </div>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search publications, authors, keywords..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>

          {showFilters && (
            <SearchFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              publications={allPublications}
            />
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "publications" && (
              <PublicationsList
                publications={publications}
                loading={loading}
                error={error}
                pagination={pagination}
              />
            )}

            {activeTab === "insights" && (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Generate AI Insights
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {insightTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.id}
                          onClick={() => handleGenerateInsights(type.id)}
                          disabled={generatingInsights}
                          className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                        >
                          <Icon className="h-6 w-6 text-blue-600" />
                          <span className="font-medium">{type.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <InsightsPanel
                  insights={insights || []}
                  loading={loading}
                  generating={generatingInsights}
                />
              </div>
            )}

            {activeTab === "analytics" && (
              <AnalyticsCharts publications={allPublications} />
            )}

            {activeTab === "knowledge-graph" && (
              <KnowledgeGraph publications={allPublications} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
