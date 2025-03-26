'use client';

import React, { useState, useEffect } from 'react';
import { GraphNode } from './GraphNode';
import { GraphEdge } from './GraphEdge';
import { GraphData } from '../types/graph';

interface GraphProps {
  data: GraphData;
}

export const Graph: React.FC<GraphProps> = ({ data }) => {
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>({});

  // Initialize node positions in a circular layout
  useEffect(() => {
    const radius = 300;
    const center = { x: 400, y: 300 };
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

  const handleNodePositionChange = (id: string, newPosition: { x: number; y: number }) => {
    setNodePositions((prev) => ({
      ...prev,
      [id]: newPosition,
    }));
  };

  return (
    <div className="relative w-full h-[600px] bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Render edges */}
      {data.edges.map((edge) => (
        <GraphEdge
          key={`${edge.source}-${edge.target}`}
          edge={edge}
          sourcePos={nodePositions[edge.source] || { x: 0, y: 0 }}
          targetPos={nodePositions[edge.target] || { x: 0, y: 0 }}
        />
      ))}

      {/* Render nodes */}
      {data.nodes.map((node) => (
        <GraphNode
          key={node.id}
          node={node}
          position={nodePositions[node.id] || { x: 0, y: 0 }}
          onPositionChange={handleNodePositionChange}
        />
      ))}

      {/* Graph metadata */}
      <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm rounded-lg p-3 text-sm">
        <div className="font-medium">{data.projectName}</div>
        <div className="text-gray-600">Version: {data.version}</div>
        <div className="text-gray-600">Language: {data.language}</div>
      </div>
    </div>
  );
}