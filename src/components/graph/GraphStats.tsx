import React from 'react';

interface GraphStatsProps {
  nodeCount: number;
  edgeCount: number;
  theme?: 'light' | 'dark';
}

export const GraphStats: React.FC<GraphStatsProps> = ({ 
  nodeCount,
  edgeCount,
  theme = 'light'
}) => {
  const colors = theme === 'dark' 
    ? {
        text: 'text-white',
        textSecondary: 'text-gray-300',
      }
    : {
        text: 'text-gray-900',
        textSecondary: 'text-gray-600',
      };

  return (
    <div className="p-2 text-xs">
      <div className="flex gap-3 items-center">
        <div className={colors.textSecondary}>
          Nodes: {nodeCount}
        </div>
        <div className="h-4 w-px bg-gray-300 dark:bg-gray-600" />
        <div className={colors.textSecondary}>
          Edges: {edgeCount}
        </div>
      </div>
    </div>
  );
}; 