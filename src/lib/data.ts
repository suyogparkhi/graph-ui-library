import { GraphData } from "../types/graph";

export const sampleData: GraphData = {
  projectName: "react-dashboard",
  language: "TypeScript",
  version: "1.0.0",
  analyzedAt: "2025-03-22T16:30:00Z",
  nodes: [
    {
      id: "component1",
      name: "DashboardLayout",
      type: "component",
      language: "typescript",
      filepath: "src/components/layouts/DashboardLayout.tsx",
      metadata: {
        isDefault: true,
        description: "Main dashboard layout component",
        props: ["children: ReactNode", "sidebar?: boolean"],
      },
    },
    {
      id: "component2",
      name: "useAuth",
      type: "hook",
      language: "typescript",
      filepath: "src/hooks/useAuth.ts",
      metadata: {
        description: "Authentication hook",
        returns: "AuthContextValue",
        dependencies: ["useContext", "useState"],
      },
    },
    {
      id: "component3",
      name: "ApiService",
      type: "service",
      language: "typescript",
      filepath: "src/services/ApiService.ts",
      metadata: {
        description: "API communication service",
        methods: ["get<T>", "post<T>", "put<T>", "delete"],
      },
    },
    {
      id: "component4",
      name: "DataGrid",
      type: "component",
      language: "typescript",
      filepath: "src/components/DataGrid/index.tsx",
      metadata: {
        description: "Reusable data grid component",
        props: ["data: T[]", "columns: Column[]", "onSort?: SortFn"],
      },
    },
    {
      id: "component5",
      name: "ThemeProvider",
      type: "context",
      language: "typescript",
      filepath: "src/contexts/ThemeContext.tsx",
      metadata: {
        description: "Theme context provider",
        exports: ["ThemeProvider", "useTheme"],
      },
    },
    {
      id: "component6",
      name: "utils",
      type: "module",
      language: "typescript",
      filepath: "src/utils/index.ts",
      metadata: {
        description: "Common utility functions",
        exports: ["formatDate", "formatCurrency", "debounce"],
      },
    },
  ],
  edges: [
    {
      source: "component1",
      target: "component2",
      type: "uses",
      metadata: {
        usage: "Authentication check",
        location: "useEffect",
      },
    },
    {
      source: "component1",
      target: "component5",
      type: "uses",
      metadata: {
        usage: "Theme consumption",
        hook: "useTheme",
      },
    },
    {
      source: "component4",
      target: "component6",
      type: "imports",
      metadata: {
        functions: ["debounce"],
      },
    },
    {
      source: "component2",
      target: "component3",
      type: "uses",
      metadata: {
        methods: ["post('/auth/login')", "post('/auth/logout')"],
      },
    },
    {
      source: "component3",
      target: "component6",
      type: "imports",
      metadata: {
        functions: ["formatDate"],
      },
    },
  ],
  metadata: {
    generatedBy: "TSProjectAnalyzer",
    totalFiles: 32,
    analysisTime: "1.12s",
    configuration: {
      includeTests: true,
      analyzeTypes: true,
    },
    stats: {
      componentCount: 8,
      hookCount: 5,
      contextCount: 3,
      utilityCount: 12,
    },
  },
};
