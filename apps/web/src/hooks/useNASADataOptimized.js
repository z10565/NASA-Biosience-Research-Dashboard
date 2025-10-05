/**
 * Optimized React hook for managing NASA articles data
 * Performance-optimized with memoization, debouncing, and virtualization
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  fetchNASADataOptimized, 
  filterPublicationsOptimized, 
  searchPublicationsOptimized, 
  generateInsightsOptimized,
  paginatePublications 
} from '../utils/nasaDataOptimized.js';

// Debounce utility
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useNASADataOptimized = (pageSize = 50) => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    organism: '',
    experimentType: '',
    theme: '',
    dateRange: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [insights, setInsights] = useState([]);
  const [generatingInsights, setGeneratingInsights] = useState(false);

  // Debounce search term to avoid excessive filtering
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Fetch data on component mount (only once)
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchNASADataOptimized();
        
        if (isMounted) {
          setPublications(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          console.error('Failed to load NASA data:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array - only run once

  // Memoized filtered and searched publications
  const processedPublications = useMemo(() => {
    if (!publications || publications.length === 0) return [];

    let filtered = publications;

    // Apply search filter
    if (debouncedSearchTerm) {
      filtered = searchPublicationsOptimized(filtered, debouncedSearchTerm);
    }

    // Apply other filters
    filtered = filterPublicationsOptimized(filtered, filters);

    return filtered;
  }, [publications, filters, debouncedSearchTerm]);

  // Memoized paginated publications
  const paginatedData = useMemo(() => {
    return paginatePublications(processedPublications, currentPage, pageSize);
  }, [processedPublications, currentPage, pageSize]);

  // Memoized insights (only generate once per data change)
  const memoizedInsights = useMemo(() => {
    if (processedPublications.length === 0) return [];
    
    // Only generate insights for a sample to improve performance
    const sampleSize = Math.min(100, processedPublications.length);
    const sample = processedPublications.slice(0, sampleSize);
    
    return generateInsightsOptimized(sample);
  }, [processedPublications.length]); // Only depend on length to avoid frequent regeneration

  // Update insights when memoized insights change
  useEffect(() => {
    setInsights(memoizedInsights);
  }, [memoizedInsights]);

  // Handler functions with useCallback for stability
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  }, []);

  const handleSearchChange = useCallback((term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when search changes
  }, []);

  const handleGenerateInsights = useCallback(async (insightType = null) => {
    try {
      setGeneratingInsights(true);
      
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Use current processed publications for insights
      const sampleSize = Math.min(50, processedPublications.length);
      const sample = processedPublications.slice(0, sampleSize);
      
      // Generate insights for the specific type requested
      const generatedInsights = generateInsightsOptimized(sample, insightType);
      
      setInsights(generatedInsights);
    } catch (err) {
      console.error('Failed to generate insights:', err);
    } finally {
      setGeneratingInsights(false);
    }
  }, [processedPublications]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      organism: '',
      experimentType: '',
      theme: '',
      dateRange: ''
    });
    setSearchTerm('');
    setCurrentPage(1);
  }, []);

  // Memoized computed values
  const stats = useMemo(() => {
    if (!publications.length) return null;

    const organisms = new Set(publications.map(p => p.organism)).size;
    const experimentTypes = new Set(publications.map(p => p.experiment_type)).size;
    const avgImpactScore = publications
      .filter(p => p.impact_score > 0)
      .reduce((sum, p) => sum + p.impact_score, 0) / publications.filter(p => p.impact_score > 0).length;

    return {
      totalPublications: publications.length,
      uniqueOrganisms: organisms,
      experimentTypes: experimentTypes,
      averageImpactScore: avgImpactScore || 0
    };
  }, [publications]);

  const filterOptions = useMemo(() => {
    if (!publications || publications.length === 0) {
      return { organisms: [], experimentTypes: [], themes: [] };
    }

    // Extract unique values efficiently
    const organisms = [...new Set(publications.map(p => p.organism).filter(Boolean))].sort();
    const experimentTypes = [...new Set(publications.map(p => p.experiment_type).filter(Boolean))].sort();
    const themes = [...new Set(publications.flatMap(p => p.themes || []).filter(Boolean))].sort();

    return { organisms, experimentTypes, themes };
  }, [publications]);

  // Refetch function
  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchNASADataOptimized();
      setPublications(data);
      setCurrentPage(1);
    } catch (err) {
      setError(err);
      console.error('Failed to refetch NASA data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // Data
    publications: paginatedData.data,
    allPublications: processedPublications,
    insights,
    stats,
    filterOptions,
    
    // Loading states
    loading,
    error,
    generatingInsights,
    
    // Filters and search
    filters,
    searchTerm,
    pagination: paginatedData.pagination,
    
    // Handlers
    handleFilterChange,
    handleSearchChange,
    handleGenerateInsights,
    handlePageChange,
    clearFilters,
    
    // Utilities
    refetch,
    
    // Performance info
    performanceInfo: {
      totalLoaded: publications.length,
      filteredCount: processedPublications.length,
      currentPageSize: pageSize
    }
  };
};

export default useNASADataOptimized;
