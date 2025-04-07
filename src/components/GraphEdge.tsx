'use client';

import React, { useState } from 'react';
import { Edge } from '../types/graph';

interface GraphEdgeProps {
  edge: Edge;
  sourcePos: { x: number; y: number };
  targetPos: { x: number; y: number };
  isHighlighted?: boolean;
  isPathHighlighted?: boolean;
  onClick?: (edge: Edge) => void;
}

export const GraphEdge: React.FC<GraphEdgeProps> = ({ 
  edge, 
  sourcePos, 
  targetPos,
  isHighlighted = false,
  isPathHighlighted = false,
  onClick
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Calculate the angle for the arrow
  const angle = Math.atan2(targetPos.y - sourcePos.y, targetPos.x - sourcePos.x);
  const distance = Math.sqrt(
    Math.pow(targetPos.x - sourcePos.x, 2) + Math.pow(targetPos.y - sourcePos.y, 2)
  );

  // Adjust start and end points to account for node size
  const nodeRadius = 90; // Half of node width
  const startX = sourcePos.x + Math.cos(angle) * nodeRadius;
  const startY = sourcePos.y + Math.sin(angle) * nodeRadius;
  const endX = targetPos.x - Math.cos(angle) * nodeRadius;
  const endY = targetPos.y - Math.sin(angle) * nodeRadius;

  // Calculate middle point for tooltip
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;

  const getEdgeColor = () => {
    if (isHighlighted) return 'stroke-blue-500';
    if (isPathHighlighted) return 'stroke-green-500';
    return 'stroke-gray-300';
  };

  const handleEdgeClick = () => {
    if (onClick) {
      onClick(edge);
    }
  };

  return (
    <svg
      className="absolute top-0 left-0 w-full h-full"
      style={{ zIndex: 0 }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={handleEdgeClick}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            className={getEdgeColor()}
          />
        </marker>
      </defs>
      
      {/* Edge line */}
      <g>
        <line
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          className={`${getEdgeColor()} cursor-pointer transition-all duration-200`}
          strokeWidth={isHighlighted || isPathHighlighted ? "3" : "2"}
          markerEnd="url(#arrowhead)"
        />
        
        {/* Invisible wider line for better hover */}
        <line
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          className="stroke-transparent cursor-pointer"
          strokeWidth="10"
        />
      </g>

      {/* Edge label */}
      <text
        x={midX}
        y={midY}
        dy="-5"
        textAnchor="middle"
        className={`text-xs ${isHighlighted ? 'fill-blue-500' : isPathHighlighted ? 'fill-green-500' : 'fill-gray-500'} pointer-events-none select-none`}
      >
        {edge.type}
      </text>

      {/* Enhanced Edge Tooltip */}
      {showTooltip && (
        <foreignObject
          x={midX - 100}
          y={midY - 60}
          width="200"
          height="50"
          style={{ overflow: 'visible' }}
        >
          <div className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm">
            <div className="font-medium">{edge.type} Relationship</div>
            {edge.metadata.functions && (
              <div className="text-xs text-gray-300">
                Functions: {edge.metadata.functions.join(', ')}
              </div>
            )}
            {edge.metadata.usage && (
              <div className="text-xs text-gray-300">
                Usage: {edge.metadata.usage}
              </div>
            )}
            {edge.metadata.location && (
              <div className="text-xs text-gray-300">
                Location: {edge.metadata.location}
              </div>
            )}
          </div>
        </foreignObject>
      )}
    </svg>
  );
};