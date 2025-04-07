'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { GraphNode } from './GraphNode';
import { GraphEdge } from './GraphEdge';
import { GraphData, Node, Edge } from '../types/graph';

interface GraphProps {
  data: GraphData;
}

export const Graph: React.FC<GraphProps> = ({ data }) => {
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>({});
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [highlightedPath, setHighlightedPath] = useState<{
    nodes: Set<string>;
    edges: Set<string>;
  }>({ nodes: new Set(), edges: new Set() });

  // Initialize node positions in a circular layout
  useEffect(() => {
    // Get the window dimensions
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Calculate radius based on screen size
    const radius = Math.min(width, height) * 0.3;
    const center = { 
      x: width * 0.5, 
      y: height * 0.5 
    };
    const angleStep = (2 * Math.PI) / data.nodes.length;

    const positions = data.nodes.reduce((acc, node, index) => {
      const angle = index * angleStep;
      acc[node.id] = {
        x: center.x + radius * Math.cos(angle),
        y: center.y + radius * Math.sin(angle),
      };
      return acc;
    }, {} as Record<string, { x: number; y: number }>);

    setNodePositions(positions);
  }, [data.nodes]);

  const handleNodePositionChange = useCallback((id: string, newPosition: { x: number; y: number }) => {
    setNodePositions((prev) => ({
      ...prev,
      [id]: newPosition,
    }));
  }, []);

  const findConnectedNodes = useCallback((nodeId: string) => {
    const connectedNodes = new Set<string>();
    const connectedEdges = new Set<string>();

    // Add the selected node
    connectedNodes.add(nodeId);

    // Find all edges connected to this node
    data.edges.forEach((edge) => {
      if (edge.source === nodeId || edge.target === nodeId) {
        connectedEdges.add(`${edge.source}-${edge.target}`);
        connectedNodes.add(edge.source);
        connectedNodes.add(edge.target);
      }
    });

    return { nodes: connectedNodes, edges: connectedEdges };
  }, [data.edges]);

  const handleNodeClick = useCallback((node: Node) => {
    setSelectedNode(node);
    const { nodes, edges } = findConnectedNodes(node.id);
    setHighlightedPath({ nodes, edges });
  }, [findConnectedNodes]);

  const handleShowDependencies = useCallback((node: Node) => {
    const dependencies = new Set<string>();
    const dependencyEdges = new Set<string>();

    // Find all nodes that this node depends on
    data.edges.forEach((edge) => {
      if (edge.target === node.id) {
        dependencies.add(edge.source);
        dependencyEdges.add(`${edge.source}-${edge.target}`);
      }
    });

    setHighlightedPath({
      nodes: new Set([node.id, ...dependencies]),
      edges: dependencyEdges,
    });
  }, [data.edges]);

  const handleShowDependents = useCallback((node: Node) => {
    const dependents = new Set<string>();
    const dependentEdges = new Set<string>();

    // Find all nodes that depend on this node
    data.edges.forEach((edge) => {
      if (edge.source === node.id) {
        dependents.add(edge.target);
        dependentEdges.add(`${edge.source}-${edge.target}`);
      }
    });

    setHighlightedPath({
      nodes: new Set([node.id, ...dependents]),
      edges: dependentEdges,
    });
  }, [data.edges]);

  const handleEdgeClick = useCallback((edge: Edge) => {
    setHighlightedPath({
      nodes: new Set([edge.source, edge.target]),
      edges: new Set([`${edge.source}-${edge.target}`]),
    });
  }, []);

  const handleBackgroundClick = useCallback(() => {
    setSelectedNode(null);
    setHighlightedPath({ nodes: new Set(), edges: new Set() });
  }, []);

  return (
    <div 
      className="fixed inset-0 w-screen h-screen"
      onClick={handleBackgroundClick}
    >
      {/* Dotted background */}
      <div 
        className="absolute inset-0 bg-white"
        style={{
          backgroundImage: `
            radial-gradient(circle, #e5e7eb 1px, transparent 1px),
            radial-gradient(circle, #e5e7eb 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 10px 10px',
        }}
      />

      {/* Render edges */}
      {data.edges.map((edge) => (
        <GraphEdge
          key={`${edge.source}-${edge.target}`}
          edge={edge}
          sourcePos={nodePositions[edge.source] || { x: 0, y: 0 }}
          targetPos={nodePositions[edge.target] || { x: 0, y: 0 }}
          isHighlighted={selectedNode?.id === edge.source || selectedNode?.id === edge.target}
          isPathHighlighted={highlightedPath.edges.has(`${edge.source}-${edge.target}`)}
          onClick={handleEdgeClick}
        />
      ))}

      {/* Render nodes */}
      {data.nodes.map((node) => (
        <GraphNode
          key={node.id}
          node={node}
          position={nodePositions[node.id] || { x: 0, y: 0 }}
          onPositionChange={handleNodePositionChange}
          isHighlighted={selectedNode?.id === node.id}
          isPathHighlighted={highlightedPath.nodes.has(node.id)}
          onNodeClick={handleNodeClick}
          onShowDependencies={handleShowDependencies}
          onShowDependents={handleShowDependents}
        />
      ))}

      {/* Folder details tooltip */}
      <div className="fixed bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-gray-100 p-2 text-xs">
        <div className="flex gap-3 items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-gray-600">Components: {data.metadata.stats.componentCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500" />
            <span className="text-gray-600">Hooks: {data.metadata.stats.hookCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="text-gray-600">Contexts: {data.metadata.stats.contextCount}</span>
          </div>
          <div className="h-4 w-px bg-gray-200 mx-1" />
          <div className="text-gray-500">
            Total Files: {data.metadata.totalFiles}
          </div>
        </div>
        <div className="text-gray-400 text-[10px] mt-1">
          Generated by {data.metadata.generatedBy} in {data.metadata.analysisTime}
        </div>
      </div>

      {/* Selected node details */}
      {selectedNode && (
        <div 
          className="fixed top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-sm max-w-xs shadow-lg border border-gray-100"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="font-medium mb-2">{selectedNode.name}</div>
          <div className="text-gray-600 text-xs">{selectedNode.filepath}</div>
          <div className="text-gray-600 text-xs mt-1">Type: {selectedNode.type}</div>
          {selectedNode.metadata.description && (
            <div className="text-gray-600 text-xs mt-1">{selectedNode.metadata.description}</div>
          )}
          {selectedNode.metadata.dependencies && (
            <div className="text-gray-600 text-xs mt-1">
              Dependencies: {selectedNode.metadata.dependencies.join(', ')}
            </div>
          )}
        </div>
      )}
    </div>
  );
};