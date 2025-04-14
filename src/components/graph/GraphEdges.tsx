import React from 'react';
import { Edge, Node } from '../../types/graph';

interface GraphEdgesProps {
  edges: Edge[];
  nodePositions: Record<string, { x: number; y: number }>;
  nodeSizeScale: number;
  selectedNode: Node | null;
  highlightedPath: {
    nodes: Set<string>;
    edges: Set<string>;
  };
  theme: 'light' | 'dark';
  transform: { scale: number };
  onEdgeClick: (edge: Edge) => void;
}

export const GraphEdges: React.FC<GraphEdgesProps> = ({
  edges,
  nodePositions,
  nodeSizeScale,
  selectedNode,
  highlightedPath,
  theme,
  transform,
  onEdgeClick
}) => {
  return (
    <>
      {edges.map((edge) => {
        const sourcePos = nodePositions[edge.source] || { x: 0, y: 0 };
        const targetPos = nodePositions[edge.target] || { x: 0, y: 0 };

        if (sourcePos.x === 0 && sourcePos.y === 0) return null;
        if (targetPos.x === 0 && targetPos.y === 0) return null;

        const isHighlighted = selectedNode && 
          (selectedNode.id === edge.source || selectedNode.id === edge.target);
        const isPathHighlighted = highlightedPath.edges.has(`${edge.source}-${edge.target}`);

        const angle = Math.atan2(targetPos.y - sourcePos.y, targetPos.x - sourcePos.x);

        const nodeRadius = 45 * nodeSizeScale;
        const startX = sourcePos.x + Math.cos(angle) * nodeRadius;
        const startY = sourcePos.y + Math.sin(angle) * nodeRadius;
        const endX = targetPos.x - Math.cos(angle) * nodeRadius;
        const endY = targetPos.y - Math.sin(angle) * nodeRadius;

        let markerEnd = "url(#arrowhead-default)";
        let strokeClass = theme === 'dark' ? 'stroke-gray-600' : 'stroke-gray-300';
        let strokeWidth = 1.5;

        if (isPathHighlighted) {
          markerEnd = "url(#arrowhead-path)";
          strokeClass = 'stroke-green-500';
          strokeWidth = 2.5;
        } else if (isHighlighted) {
          markerEnd = "url(#arrowhead-highlighted)";
          strokeClass = 'stroke-blue-500';
          strokeWidth = 2;
        }

        return (
          <g key={`edge-${edge.source}-${edge.target}`} 
             onClick={(e) => {
               e.stopPropagation();
               onEdgeClick(edge);
             }}>
            <line
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              className={`${strokeClass} cursor-pointer transition-all duration-200`}
              strokeWidth={strokeWidth / transform.scale}
              markerEnd={markerEnd}
            />
            
            {(isHighlighted || isPathHighlighted) && edge.type && (
              <text
                x={(startX + endX) / 2}
                y={(startY + endY) / 2}
                dy="-5"
                textAnchor="middle"
                className={`text-xs select-none pointer-events-none
                  ${isPathHighlighted ? 'fill-green-500' : 'fill-blue-500'}`}
                style={{ fontSize: `${12 / transform.scale}px` }}
              >
                {edge.type}
              </text>
            )}
            
            <line
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              strokeWidth={10 / transform.scale}
              className="stroke-transparent cursor-pointer"
            />
          </g>
        );
      })}
    </>
  );
}; 