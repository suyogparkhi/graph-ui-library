# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
# graph-ui-library

# Graph UI Library

A modern, interactive library for visualizing dependency graphs and node relationships.

## Features

- **Interactive Graph Visualization**: Built with ReactFlow for smooth, interactive graph experiences
- **Multiple Layout Options**: Choose from circular, force-directed, and spiral layouts
- **Dependency Views**: Full graph view, dependencies-only view, and dependents-only view
- **Dark/Light Theme Support**: Fully themable interface that works in both dark and light modes
- **Responsive Design**: Works across different screen sizes
- **Project Structure Visualization**: Visualize complex projects with node types and relationships

## Usage

To start the development server:

```bash
npm run dev
```

## Graph Features

- **Zoom & Pan**: Use mouse wheel to zoom, click and drag to pan
- **Node Selection**: Click on nodes to see details and highlight connections
- **Multiple Views**: Toggle between full graph, dependencies, and dependents
- **Interactive UI**: Nodes are draggable and the graph is fully interactive

## Implementation

This library uses ReactFlow under the hood, providing a robust and performant graph visualization solution. Key components include:

- **Graph Component**: Main component handling graph rendering and interaction
- **Node Representation**: Custom nodes with proper styling and interactive behavior
- **Edge Handling**: Properly styled and animated edges between nodes
- **Layout Algorithms**: Various layout options for different visualization needs

## Data Structure

The graph visualization requires data in the following format:

```typescript
interface GraphData {
  nodes: Node[];
  edges: Edge[];
  metadata?: Record<string, any>;
  projectName?: string;
  language?: string;
}

interface Node {
  id: string;
  title?: string;
  name?: string;
  type?: string;
  filepath?: string;
  metadata?: Record<string, any>;
  sections?: {
    id: string;
    name: string;
    items: { id: string; value: string }[];
  }[];
}

interface Edge {
  source: string;
  target: string;
  type?: string;
}
```

## Customization

You can customize the visualization by changing the props of the Graph component:

```tsx
<Graph 
  data={graphData} 
  width={800} 
  height={700} 
  autoLayout="force" // Options: 'circular', 'force', 'spiral', 'donut'
  nodeSizeScale={1}
  theme="dark" // or 'light'
/>
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
