import { useState, useMemo, useCallback } from 'react';
import { Network, Search, Filter, Zap, Info } from 'lucide-react';

export default function KnowledgeGraph({ publications }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const graphData = useMemo(() => {
    if (!publications || publications.length === 0) {
      return { nodes: [], edges: [], stats: {} };
    }

    const nodes = new Map();
    const edges = [];
    const nodeConnections = new Map();

    // Extract entities from publications
    publications.forEach((pub, pubIndex) => {
      const pubId = `pub_${pub.id || pubIndex}`;
      
      // Add publication node
      if (!nodes.has(pubId)) {
        nodes.set(pubId, {
          id: pubId,
          label: pub.title?.substring(0, 50) + '...' || 'Untitled',
          type: 'publication',
          data: pub,
          size: Math.max(10, (pub.impact_score || 1) * 2),
          color: '#3B82F6'
        });
      }

      // Add organism nodes
      if (pub.organism) {
        const orgId = `org_${pub.organism}`;
        if (!nodes.has(orgId)) {
          nodes.set(orgId, {
            id: orgId,
            label: pub.organism,
            type: 'organism',
            size: 15,
            color: '#10B981'
          });
        }
        edges.push({
          id: `${pubId}_${orgId}`,
          source: pubId,
          target: orgId,
          type: 'studies',
          weight: 1
        });
        
        // Track connections
        nodeConnections.set(orgId, (nodeConnections.get(orgId) || 0) + 1);
      }

      // Add experiment type nodes
      if (pub.experiment_type) {
        const expId = `exp_${pub.experiment_type}`;
        if (!nodes.has(expId)) {
          nodes.set(expId, {
            id: expId,
            label: pub.experiment_type,
            type: 'experiment',
            size: 12,
            color: '#F59E0B'
          });
        }
        edges.push({
          id: `${pubId}_${expId}`,
          source: pubId,
          target: expId,
          type: 'uses_method',
          weight: 1
        });
        
        nodeConnections.set(expId, (nodeConnections.get(expId) || 0) + 1);
      }

      // Add keyword nodes
      if (pub.keywords && Array.isArray(pub.keywords)) {
        pub.keywords.slice(0, 3).forEach(keyword => {
          const keyId = `key_${keyword}`;
          if (!nodes.has(keyId)) {
            nodes.set(keyId, {
              id: keyId,
              label: keyword,
              type: 'keyword',
              size: 8,
              color: '#8B5CF6'
            });
          }
          edges.push({
            id: `${pubId}_${keyId}`,
            source: pubId,
            target: keyId,
            type: 'relates_to',
            weight: 0.5
          });
          
          nodeConnections.set(keyId, (nodeConnections.get(keyId) || 0) + 1);
        });
      }
    });

    // Update node sizes based on connections and store connection counts
    nodeConnections.forEach((count, nodeId) => {
      const node = nodes.get(nodeId);
      if (node && node.type !== 'publication') {
        node.size = Math.max(8, Math.min(25, 8 + count * 2));
        node.connectionCount = count; // Store actual connection count
      }
    });

    // Filter nodes and edges based on search and filter
    let filteredNodes = Array.from(nodes.values());
    let filteredEdges = edges;

    if (filterType !== 'all') {
      filteredNodes = filteredNodes.filter(node => 
        node.type === filterType || node.type === 'publication'
      );
      const nodeIds = new Set(filteredNodes.map(n => n.id));
      filteredEdges = edges.filter(edge => 
        nodeIds.has(edge.source) && nodeIds.has(edge.target)
      );
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredNodes = filteredNodes.filter(node =>
        node.label.toLowerCase().includes(searchLower) ||
        (node.data && node.data.authors && node.data.authors.toLowerCase().includes(searchLower))
      );
      const nodeIds = new Set(filteredNodes.map(n => n.id));
      filteredEdges = filteredEdges.filter(edge => 
        nodeIds.has(edge.source) && nodeIds.has(edge.target)
      );
    }

    const stats = {
      totalNodes: nodes.size,
      totalEdges: edges.length,
      organisms: Array.from(nodes.values()).filter(n => n.type === 'organism').length,
      experiments: Array.from(nodes.values()).filter(n => n.type === 'experiment').length,
      keywords: Array.from(nodes.values()).filter(n => n.type === 'keyword').length,
      publications: Array.from(nodes.values()).filter(n => n.type === 'publication').length
    };

    return {
      nodes: filteredNodes,
      edges: filteredEdges,
      stats
    };
  }, [publications, filterType, searchTerm]);

  const handleNodeClick = useCallback((node) => {
    setSelectedNode(node);
  }, []);

  const getNodeTypeColor = (type) => {
    switch (type) {
      case 'publication': return '#3B82F6';
      case 'organism': return '#10B981';
      case 'experiment': return '#F59E0B';
      case 'keyword': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const getNodeTypeIcon = (type) => {
    switch (type) {
      case 'publication': return '📄';
      case 'organism': return '🧬';
      case 'experiment': return '🔬';
      case 'keyword': return '🏷️';
      default: return '⚪';
    }
  };

  if (!publications || publications.length === 0) {
    return (
      <div className="text-center py-12">
        <Network className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No knowledge graph available</h3>
        <p className="text-gray-500">Add publications to see entity relationships and knowledge connections.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search entities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Types</option>
          <option value="organism">Organisms</option>
          <option value="experiment">Experiments</option>
          <option value="keyword">Keywords</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-blue-600">{graphData.stats.publications}</div>
          <div className="text-sm text-gray-600">Publications</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-green-600">{graphData.stats.organisms}</div>
          <div className="text-sm text-gray-600">Organisms</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-yellow-600">{graphData.stats.experiments}</div>
          <div className="text-sm text-gray-600">Experiments</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-purple-600">{graphData.stats.keywords}</div>
          <div className="text-sm text-gray-600">Keywords</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-gray-600">{graphData.edges.length}</div>
          <div className="text-sm text-gray-600">Connections</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graph Visualization (Simplified) */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Knowledge Graph</h3>
          
          {/* Simplified network visualization */}
          <div className="relative h-96 bg-gray-50 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Network className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Interactive Knowledge Graph</p>
                <p className="text-sm text-gray-500">
                  Showing {graphData.nodes.length} entities and {graphData.edges.length} relationships
                </p>
              </div>
            </div>
            
            {/* Simple node layout for demonstration */}
            <div className="absolute inset-4 grid grid-cols-4 gap-2">
              {graphData.nodes.slice(0, 16).map((node, index) => (
                <div
                  key={node.id}
                  onClick={() => handleNodeClick(node)}
                  className="flex flex-col items-center justify-center p-2 bg-white rounded-lg shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
                  style={{ 
                    borderColor: node.color,
                    borderWidth: selectedNode?.id === node.id ? '2px' : '1px'
                  }}
                >
                  <div className="text-lg mb-1">{getNodeTypeIcon(node.type)}</div>
                  <div className="text-xs text-center font-medium text-gray-700 truncate w-full">
                    {node.label.length > 15 ? `${node.label.substring(0, 15)}...` : node.label}
                  </div>
                  <div className="text-xs text-gray-500">{node.type}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Entity Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Entity Details</h3>
          
          {selectedNode ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: selectedNode.color }}
                ></div>
                <div>
                  <div className="font-medium text-gray-900">{selectedNode.label}</div>
                  <div className="text-sm text-gray-500 capitalize">{selectedNode.type}</div>
                </div>
              </div>

              {selectedNode.type === 'publication' && selectedNode.data && (
                <div className="space-y-3">
                  {selectedNode.data.authors && (
                    <div>
                      <div className="text-sm font-medium text-gray-700">Authors</div>
                      <div className="text-sm text-gray-600">{selectedNode.data.authors}</div>
                    </div>
                  )}
                  
                  {selectedNode.data.publication_date && (
                    <div>
                      <div className="text-sm font-medium text-gray-700">Year</div>
                      <div className="text-sm text-gray-600">
                        {new Date(selectedNode.data.publication_date).getFullYear()}
                      </div>
                    </div>
                  )}
                  
                  {selectedNode.data.impact_score && (
                    <div>
                      <div className="text-sm font-medium text-gray-700">Impact Score</div>
                      <div className="text-sm text-gray-600">{selectedNode.data.impact_score}/10</div>
                    </div>
                  )}
                  
                  {selectedNode.data.abstract && (
                    <div>
                      <div className="text-sm font-medium text-gray-700">Abstract</div>
                      <div className="text-sm text-gray-600 leading-relaxed">
                        {selectedNode.data.abstract.substring(0, 200)}...
                      </div>
                    </div>
                  )}
                </div>
              )}

              {selectedNode.type !== 'publication' && (
                <div>
                  <div className="text-sm font-medium text-gray-700">Connections</div>
                  <div className="text-sm text-gray-600">
                    Connected to {selectedNode.connectionCount || 0} entities
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Info className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Click on an entity to see details</p>
            </div>
          )}
        </div>
      </div>

      {/* Entity Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Top Organisms */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h4 className="font-medium text-gray-900 mb-3">Top Organisms</h4>
          <div className="space-y-2">
            {graphData.nodes
              .filter(n => n.type === 'organism')
              .sort((a, b) => (b.connectionCount || 0) - (a.connectionCount || 0))
              .slice(0, 5)
              .map(node => (
                <div key={node.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{node.label}</span>
                  <span className="text-gray-500">{node.connectionCount || 0}</span>
                </div>
              ))
            }
          </div>
        </div>

        {/* Top Experiments */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h4 className="font-medium text-gray-900 mb-3">Top Experiments</h4>
          <div className="space-y-2">
            {graphData.nodes
              .filter(n => n.type === 'experiment')
              .sort((a, b) => (b.connectionCount || 0) - (a.connectionCount || 0))
              .slice(0, 5)
              .map(node => (
                <div key={node.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{node.label}</span>
                  <span className="text-gray-500">{node.connectionCount || 0}</span>
                </div>
              ))
            }
          </div>
        </div>

        {/* Top Keywords */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h4 className="font-medium text-gray-900 mb-3">Top Keywords</h4>
          <div className="space-y-2">
            {graphData.nodes
              .filter(n => n.type === 'keyword')
              .sort((a, b) => (b.connectionCount || 0) - (a.connectionCount || 0))
              .slice(0, 5)
              .map(node => (
                <div key={node.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{node.label}</span>
                  <span className="text-gray-500">{node.connectionCount || 0}</span>
                </div>
              ))
            }
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h4 className="font-medium text-gray-900 mb-3">Color coding</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-gray-700">Publications</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-gray-700">Organisms</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-gray-700">Experiments</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-gray-700">Keywords</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}