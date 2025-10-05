import { useState, useCallback, useMemo } from 'react';
import { 
  ExternalLink, 
  Calendar, 
  Users, 
  Tag, 
  ChevronDown, 
  ChevronUp,
  Loader2,
  AlertCircle,
  BookOpen,
  Microscope,
  Dna
} from 'lucide-react';

// Virtualized list component for better performance
const VirtualizedPublicationsList = ({ publications, loading, error, pagination, onLoadMore }) => {
  const [expandedItems, setExpandedItems] = useState(new Set());

  const toggleExpanded = useCallback((id) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  // Memoized publication items to prevent unnecessary re-renders
  const PublicationItem = useMemo(() => ({ publication, isExpanded, onToggle }) => {
    const handleToggle = () => onToggle(publication.id);
    
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">
              {publication.title}
            </h3>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
              {publication.authors && (
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{publication.authors}</span>
                </div>
              )}
              
              {publication.publication_date && (
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(publication.publication_date).getFullYear()}</span>
                </div>
              )}
              
              {publication.journal && (
                <div className="flex items-center space-x-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{publication.journal}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {publication.organism && (
                <span className="inline-flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  <Dna className="h-3 w-3" />
                  <span>{publication.organism}</span>
                </span>
              )}
              
              {publication.experiment_type && (
                <span className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  <Microscope className="h-3 w-3" />
                  <span>{publication.experiment_type}</span>
                </span>
              )}
              
              {publication.keywords && publication.keywords.slice(0, 3).map((keyword, index) => (
                <span key={index} className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  <Tag className="h-3 w-3" />
                  <span>{keyword}</span>
                </span>
              ))}
            </div>

            {/* Impact score */}
            {publication.impact_score > 0 && (
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-sm text-gray-600">Impact Score:</span>
                <div className="flex items-center">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(publication.impact_score / 10) * 100}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-900">
                    {publication.impact_score}/10
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 ml-4">
            {publication.url && (
              <a
                href={publication.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
              >
                <ExternalLink className="h-5 w-5" />
              </a>
            )}
            
            <button
              onClick={handleToggle}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {isExpanded ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Abstract preview */}
        {publication.abstract && (
          <div className="mb-4">
            <p className="text-gray-700 text-sm leading-relaxed">
              {isExpanded 
                ? publication.abstract 
                : `${publication.abstract.substring(0, 200)}${publication.abstract.length > 200 ? '...' : ''}`
              }
            </p>
          </div>
        )}

        {/* Expanded content */}
        {isExpanded && (
          <div className="border-t border-gray-200 pt-4 space-y-4">
            {publication.ai_summary && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">AI Summary</h4>
                <p className="text-gray-700 text-sm leading-relaxed bg-blue-50 p-3 rounded-lg">
                  {publication.ai_summary}
                </p>
              </div>
            )}

            {publication.key_findings && publication.key_findings.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Key Findings</h4>
                <ul className="space-y-1">
                  {publication.key_findings.map((finding, index) => (
                    <li key={index} className="text-gray-700 text-sm flex items-start space-x-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {publication.mission_relevance && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Mission Relevance</h4>
                <p className="text-gray-700 text-sm leading-relaxed bg-green-50 p-3 rounded-lg">
                  {publication.mission_relevance}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading publications...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <AlertCircle className="h-8 w-8 text-red-500" />
        <span className="ml-2 text-red-600">Error loading publications: {error.message}</span>
      </div>
    );
  }

  if (!publications || publications.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No publications found</h3>
        <p className="text-gray-500">Try adjusting your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {publications.length} of {pagination?.total || 0} publications
        </div>
        {pagination?.hasMore && (
          <button 
            onClick={onLoadMore}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Load more
          </button>
        )}
      </div>

      {/* Virtualized publications list */}
      <div className="space-y-4">
        {publications.map((publication) => {
          const isExpanded = expandedItems.has(publication.id);
          
          return (
            <PublicationItem
              key={publication.id}
              publication={publication}
              isExpanded={isExpanded}
              onToggle={toggleExpanded}
            />
          );
        })}
      </div>

      {/* Load more button */}
      {pagination?.hasMore && (
        <div className="text-center py-6">
          <button
            onClick={onLoadMore}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Load More Publications
          </button>
        </div>
      )}
    </div>
  );
};

export default VirtualizedPublicationsList;
