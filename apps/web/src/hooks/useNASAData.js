/**
 * React hook for managing NASA articles data
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchNASAData, filterPublications, searchPublications, generateInsights } from '../utils/nasaData.js';

export const useNASAData = () => {
  const [publications, setPublications] = useState([]);
  const [filteredPublications, setFilteredPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    organism: '',
    experimentType: '',
    theme: '',
    dateRange: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [insights, setInsights] = useState([]);
  const [generatingInsights, setGeneratingInsights] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchNASAData();
        setPublications(data);
        setFilteredPublications(data);
      } catch (err) {
        setError(err);
        console.error('Failed to load NASA data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Update filtered publications when filters or search term changes
  useEffect(() => {
    let filtered = publications;

    // Apply search filter
    if (searchTerm) {
      filtered = searchPublications(filtered, searchTerm);
    }

    // Apply other filters
    filtered = filterPublications(filtered, filters);

    setFilteredPublications(filtered);
  }, [publications, filters, searchTerm]);

  // Generate insights when publications change
  useEffect(() => {
    if (publications.length > 0) {
      const newInsights = generateInsights(publications);
      setInsights(newInsights);
    }
  }, [publications]);

  // Handler functions
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleSearchChange = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  const handleGenerateInsights = useCallback(async () => {
    try {
      setGeneratingInsights(true);
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      const newInsights = generateInsights(filteredPublications);
      setInsights(newInsights);
    } catch (err) {
      console.error('Failed to generate insights:', err);
    } finally {
      setGeneratingInsights(false);
    }
  }, [filteredPublications]);

  const clearFilters = useCallback(() => {
    setFilters({
      organism: '',
      experimentType: '',
      theme: '',
      dateRange: ''
    });
    setSearchTerm('');
  }, []);

  // Computed values
  const pagination = useMemo(() => {
    const total = publications.length;
    const filtered = filteredPublications.length;
    return {
      total,
      filtered,
      hasMore: false // For future pagination implementation
    };
  }, [publications.length, filteredPublications.length]);

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

  return {
    // Data
    publications: filteredPublications,
    allPublications: publications,
    insights,
    stats,
    
    // Loading states
    loading,
    error,
    generatingInsights,
    
    // Filters and search
    filters,
    searchTerm,
    pagination,
    
    // Handlers
    handleFilterChange,
    handleSearchChange,
    handleGenerateInsights,
    clearFilters,
    
    // Utilities
    refetch: () => {
      setLoading(true);
      setError(null);
      fetchNASAData()
        .then(data => {
          setPublications(data);
          setFilteredPublications(data);
        })
        .catch(err => {
          setError(err);
          console.error('Failed to refetch NASA data:', err);
        })
        .finally(() => setLoading(false));
    }
  };
};

export default useNASAData;
