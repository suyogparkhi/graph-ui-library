import React from 'react';
import { GraphData } from '../../types/graph';

interface GraphStatsProps {
  nodeStats: {
    total: number;
    types: Record<string, number>;
  };
  data: GraphData;
  transform: { x: number; y: number; scale: number };
  theme: 'light' | 'dark';
}

export const GraphStats: React.FC<GraphStatsProps> = ({ 
  nodeStats,
  data,
  transform,
  theme
}) => {
  const colors = theme === 'dark' 
    ? {
        panel: 'bg-gray-800/90 border-gray-700',
        text: 'text-white',
        textSecondary: 'text-gray-300',
      }
    : {
        panel: 'bg-white/90 border-gray-100',
        text: 'text-gray-900',
        textSecondary: 'text-gray-600',
      };

  return (
    <div className={`fixed bottom-4 right-4 ${colors.panel} backdrop-blur-sm rounded-lg shadow-sm border p-2 text-xs ${colors.text}`}>
      <div className="flex gap-3 items-center flex-wrap">
        {Object.entries(nodeStats.types).map(([type, count]) => (
          <div key={`stat-${type}`} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" 
                style={{ 
                  backgroundColor: type === 'component' ? '#3b82f6' : 
                                  type === 'hook' ? '#8b5cf6' : 
                                  type === 'context' ? '#eab308' :
                                  type === 'class' ? '#22c55e' :
                                  type === 'file' ? '#f97316' :
                                  '#6b7280'
                }} />
            <span className={colors.textSecondary}>{type}s: {count}</span>
          </div>
        ))}
        {nodeStats.types && Object.keys(nodeStats.types).length > 0 && (
          <div className="h-4 w-px bg-gray-200 mx-1" />
        )}
        <div className={colors.textSecondary}>
          Total: {nodeStats.total}
        </div>
      </div>
      <div className={`text-[10px] mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
        Project: {data.projectName || 'Unknown'} | 
        Language: {data.language || 'Unknown'} |
        {data.metadata?.generatedBy ? ` Generated by ${data.metadata.generatedBy}` : ''} |
        Zoom: {Math.round(transform.scale * 100)}%
      </div>
    </div>
  );
}; 