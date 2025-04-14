// src/components/Graph.tsx
'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { GraphData, Node as GraphNode, Edge as GraphEdge } from '../types/graph';
import ReactFlow, {
  Controls,
  Background,
  Edge as ReactFlowEdge,
  Node as ReactFlowNode,
  useNodesState,
  useEdgesState,
  Panel,
  ConnectionLineType,
  MarkerType,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Import extracted components
import { NodeDetailsPanel } from './graph/NodeDetailsPanel';
import { GraphStats } from './graph/GraphStats';

interface GraphProps {
  data: GraphData;
  width?: number;
  height?: number;
  autoLayout?: 'circular' | 'force' | 'tree' | 'spiral' | 'donut';
  nodeSizeScale?: number;
  theme?: 'light' | 'dark';
}

// Custom node types will be defined here
const nodeTypes = {};

/**
 * Inner graph component that uses the ReactFlow hooks
 */
const GraphInner: React.FC<GraphProps> = ({
  data,
  width = 800,
  height = 600,
  autoLayout = 'circular',
  nodeSizeScale = 1,
  theme = 'light'
}) => {
  // Process incoming data
  const processedData = useMemo(() => {
    if (!data || !data.nodes || !Array.isArray(data.nodes)) {
      console.error('Invalid graph data format');
      return { nodes: [], edges: [], metadata: {} } as GraphData;
    }
    return data;
  }, [data]);

  // Convert our data to ReactFlow format
  const initialNodes: ReactFlowNode[] = useMemo(() => {
    return processedData.nodes.map((node, index) => {
      // Position nodes in different layouts based on autoLayout prop
      let position = { x: 0, y: 0 };
      
      switch (autoLayout) {
        case 'circular':
          // Simple circular layout
          const angle = (index / processedData.nodes.length) * 2 * Math.PI;
          const radius = Math.min(width, height) * 0.4;
          position = {
            x: width / 2 + radius * Math.cos(angle),
            y: height / 2 + radius * Math.sin(angle)
          };
          break;
        case 'spiral':
          // Spiral layout
          const spiralAngle = index * 0.5;
          const spiralRadius = 10 + index * 10;
          position = {
            x: width / 2 + spiralRadius * Math.cos(spiralAngle),
            y: height / 2 + spiralRadius * Math.sin(spiralAngle)
          };
          break;
        // Other layouts would go here
        default:
          // Default random positioning
          position = {
            x: Math.random() * width * 0.8 + width * 0.1,
            y: Math.random() * height * 0.8 + height * 0.1
          };
      }
      
      // Format node for ReactFlow
      return {
        id: node.id,
        position,
        type: 'default', // Use default node type for now
        data: { 
          label: node.title || node.name || `Node ${node.id}`,
          type: node.type || 'unknown',
          node: node // Pass original node data for custom rendering
        },
        style: {
          background: (node as any).color || getNodeColor(node.type || 'unknown', theme),
          borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
          borderWidth: 1,
          padding: 10,
          borderRadius: 5,
          width: 180 * nodeSizeScale,
          color: theme === 'dark' ? '#f3f4f6' : '#111827',
        },
      };
    });
  }, [processedData.nodes, width, height, autoLayout, nodeSizeScale, theme]);

  // Convert our edges to ReactFlow format
  const initialEdges: ReactFlowEdge[] = useMemo(() => {
    return processedData.edges.map(edge => ({
      id: `${edge.source}-${edge.target}`,
      source: edge.source,
      target: edge.target,
      type: 'smoothstep', // Use smoothstep for nicer curves
      animated: false,
      label: edge.type || '',
      labelStyle: { fill: theme === 'dark' ? '#d1d5db' : '#4b5563', fontSize: 12 },
      style: { stroke: theme === 'dark' ? '#4b5563' : '#9ca3af', strokeWidth: 1.5 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: theme === 'dark' ? '#4b5563' : '#9ca3af',
      },
      data: edge // Store original edge data
    }));
  }, [processedData.edges, theme]);

  // ReactFlow state
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  // Update nodes and edges when data changes
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  // Handle node selection
  const onNodeClick = useCallback((_: React.MouseEvent, node: ReactFlowNode) => {
    const graphNode = processedData.nodes.find(n => n.id === node.id);
    if (graphNode) {
      setSelectedNode(graphNode);
      
      // Highlight connected nodes and edges
      const connectedNodes = new Set<string>([node.id]);
      const connectedEdges = new Set<string>();
      
      // Find all edges connected to this node
      processedData.edges.forEach(edge => {
        if (edge.source === node.id || edge.target === node.id) {
          connectedNodes.add(edge.source);
          connectedNodes.add(edge.target);
          connectedEdges.add(`${edge.source}-${edge.target}`);
        }
      });
      
      // Update node and edge styles to highlight connections
      setNodes(currentNodes => 
        currentNodes.map(n => {
          const nodeStyle = { ...(n.style || {}) };
          return {
            ...n,
            style: {
              ...nodeStyle,
              opacity: connectedNodes.has(n.id) ? 1 : 0.25,
              borderWidth: n.id === node.id ? 2 : 1,
              borderColor: n.id === node.id 
                ? (theme === 'dark' ? '#3b82f6' : '#2563eb')
                : (theme === 'dark' ? '#374151' : '#e5e7eb'),
            }
          };
        })
      );
      
      setEdges(currentEdges => 
        currentEdges.map(e => {
          const edgeStyle = { ...(e.style || {}) };
          
          // Create a new markerEnd object instead of spreading
          const markerEndColor = connectedEdges.has(e.id) 
            ? (theme === 'dark' ? '#3b82f6' : '#2563eb')
            : (theme === 'dark' ? '#4b5563' : '#9ca3af');
            
          return {
            ...e,
            animated: connectedEdges.has(e.id),
            style: {
              ...edgeStyle,
              opacity: connectedEdges.has(e.id) ? 1 : 0.25,
              stroke: connectedEdges.has(e.id) 
                ? (theme === 'dark' ? '#3b82f6' : '#2563eb')
                : (theme === 'dark' ? '#4b5563' : '#9ca3af'),
              strokeWidth: connectedEdges.has(e.id) ? 2 : 1,
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: markerEndColor,
            }
          };
        })
      );
    }
  }, [processedData.nodes, processedData.edges, setNodes, setEdges, theme]);

  // Handle background click to reset selection
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    
    // Reset all nodes and edges to default styling
    setNodes(currentNodes => 
      currentNodes.map(n => {
        const nodeStyle = { ...(n.style || {}) };
        return {
          ...n,
          style: {
            ...nodeStyle,
            opacity: 1,
            borderWidth: 1,
            borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
          }
        };
      })
    );
    
    setEdges(currentEdges => 
      currentEdges.map(e => {
        const edgeStyle = { ...(e.style || {}) };
        
        // Create a new markerEnd object instead of spreading
        return {
          ...e,
          animated: false,
          style: {
            ...edgeStyle,
            opacity: 1,
            stroke: theme === 'dark' ? '#4b5563' : '#9ca3af',
            strokeWidth: 1.5,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: theme === 'dark' ? '#4b5563' : '#9ca3af',
          }
        };
      })
    );
  }, [setNodes, setEdges, theme]);

  // Calculate node statistics
  const nodeStats = useMemo(() => {
    const types = new Map<string, number>();

    processedData.nodes.forEach(node => {
      const type = node.type || 'unknown';
      types.set(type, (types.get(type) || 0) + 1);
    });

    return {
      total: processedData.nodes.length,
      types: Object.fromEntries(types.entries())
    };
  }, [processedData.nodes]);

  // Function to get node color based on type
  function getNodeColor(type: string, theme: 'light' | 'dark'): string {
    const colorMap: Record<string, { light: string, dark: string }> = {
      'component': { light: '#dbeafe', dark: '#1e40af' },
      'page': { light: '#fbcfe8', dark: '#831843' },
      'hook': { light: '#dcfce7', dark: '#166534' },
      'util': { light: '#fef3c7', dark: '#92400e' },
      'context': { light: '#f3e8ff', dark: '#6b21a8' },
    };
    
    const defaultColor = { light: '#f3f4f6', dark: '#374151' };
    const colors = colorMap[type.toLowerCase()] || defaultColor;
    
    return colors[theme];
  }

  return (
    <div style={{ width: '100%', height: '100%' }} className={theme === 'dark' ? 'dark' : ''}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        connectionLineType={ConnectionLineType.SmoothStep}
        className={theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}
      >
        <Controls 
          position="bottom-right" 
          className={theme === 'dark' ? 'text-white bg-gray-800 border-gray-700' : ''}
        />
        <Background 
          color={theme === 'dark' ? '#4b5563' : '#e5e7eb'} 
          gap={16} 
          size={1} 
        />
        
        <Panel position="top-left" className={theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-white border-gray-200'}>
          <GraphStats nodeCount={processedData.nodes.length} edgeCount={processedData.edges.length} theme={theme} />
        </Panel>
        
        {selectedNode && (
          <Panel position="top-right" className={theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-white border-gray-200'}>
            <NodeDetailsPanel 
              node={selectedNode} 
              onClose={() => setSelectedNode(null)}
              theme={theme}
            />
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
};

/**
 * Main Graph component that wraps with ReactFlowProvider
 */
export const Graph: React.FC<GraphProps> = (props) => {
  return (
    <ReactFlowProvider>
      <GraphInner {...props} />
    </ReactFlowProvider>
  );
};

export default Graph;