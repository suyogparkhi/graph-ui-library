import { GraphData } from "../types/graph";

export const sampleData: GraphData = {
  projectName: "react-dashboard",
  language: "TypeScript",
  version: "1.0.0",
  analyzedAt: "2025-03-22T16:30:00Z",
  nodes: [
    {
      id: "dashboard",
      name: "Dashboard",
      type: "component",
      language: "typescript",
      filepath: "src/components/Dashboard.tsx",
      metadata: {
        description: "Main dashboard component that orchestrates the layout",
        props: ["theme: 'light' | 'dark'", "user: User"],
        exports: ["Dashboard"],
        dependencies: ["useAuth", "ThemeProvider", "Sidebar", "MainContent"]
      },
    },
    {
      id: "sidebar",
      name: "Sidebar",
      type: "component",
      language: "typescript",
      filepath: "src/components/Sidebar.tsx",
      metadata: {
        description: "Navigation sidebar component",
        props: ["items: NavItem[]", "onSelect: (item: NavItem) => void"],
        exports: ["Sidebar"],
        dependencies: ["useAuth", "ThemeProvider"]
      },
    },
    {
      id: "mainContent",
      name: "MainContent",
      type: "component",
      language: "typescript",
      filepath: "src/components/MainContent.tsx",
      metadata: {
        description: "Main content area component",
        props: ["children: ReactNode"],
        exports: ["MainContent"],
        dependencies: ["DataGrid", "useData"]
      },
    },
    {
      id: "useAuth",
      name: "useAuth",
      type: "hook",
      language: "typescript",
      filepath: "src/hooks/useAuth.ts",
      metadata: {
        description: "Authentication hook for managing user state",
        returns: "AuthContextValue",
        exports: ["useAuth"],
        dependencies: ["AuthContext", "useState", "useEffect"]
      },
    },
    {
      id: "authContext",
      name: "AuthContext",
      type: "context",
      language: "typescript",
      filepath: "src/contexts/AuthContext.tsx",
      metadata: {
        description: "Authentication context provider",
        exports: ["AuthProvider", "AuthContext"],
        dependencies: ["useAuth"]
      },
    },
    {
      id: "themeProvider",
      name: "ThemeProvider",
      type: "context",
      language: "typescript",
      filepath: "src/contexts/ThemeContext.tsx",
      metadata: {
        description: "Theme context provider",
        exports: ["ThemeProvider", "useTheme"],
        dependencies: ["useTheme"]
      },
    },
    {
      id: "useTheme",
      name: "useTheme",
      type: "hook",
      language: "typescript",
      filepath: "src/hooks/useTheme.ts",
      metadata: {
        description: "Theme management hook",
        returns: "ThemeContextValue",
        exports: ["useTheme"],
        dependencies: ["ThemeContext"]
      },
    },
    {
      id: "dataGrid",
      name: "DataGrid",
      type: "component",
      language: "typescript",
      filepath: "src/components/DataGrid.tsx",
      metadata: {
        description: "Reusable data grid component",
        props: ["data: T[]", "columns: Column[]", "onSort?: SortFn"],
        exports: ["DataGrid"],
        dependencies: ["useData", "useSort"]
      },
    },
    {
      id: "useData",
      name: "useData",
      type: "hook",
      language: "typescript",
      filepath: "src/hooks/useData.ts",
      metadata: {
        description: "Data fetching and management hook",
        returns: "DataContextValue",
        exports: ["useData"],
        dependencies: ["DataContext", "useEffect"]
      },
    },
    {
      id: "useSort",
      name: "useSort",
      type: "hook",
      language: "typescript",
      filepath: "src/hooks/useSort.ts",
      metadata: {
        description: "Sorting functionality hook",
        returns: "SortContextValue",
        exports: ["useSort"],
        dependencies: ["SortContext"]
      },
    }
  ],
  edges: [
    {
      source: "dashboard",
      target: "sidebar",
      type: "uses",
      metadata: {
        usage: "Layout composition",
        location: "Dashboard.tsx",
        functions: ["render"]
      },
    },
    {
      source: "dashboard",
      target: "mainContent",
      type: "uses",
      metadata: {
        usage: "Layout composition",
        location: "Dashboard.tsx",
        functions: ["render"]
      },
    },
    {
      source: "dashboard",
      target: "useAuth",
      type: "uses",
      metadata: {
        usage: "Authentication check",
        location: "useEffect",
        functions: ["useAuth"]
      },
    },
    {
      source: "dashboard",
      target: "themeProvider",
      type: "uses",
      metadata: {
        usage: "Theme consumption",
        location: "useTheme",
        functions: ["useTheme"]
      },
    },
    {
      source: "sidebar",
      target: "useAuth",
      type: "uses",
      metadata: {
        usage: "User info display",
        location: "render",
        functions: ["useAuth"]
      },
    },
    {
      source: "mainContent",
      target: "dataGrid",
      type: "uses",
      metadata: {
        usage: "Data display",
        location: "render",
        functions: ["DataGrid"]
      },
    },
    {
      source: "dataGrid",
      target: "useData",
      type: "uses",
      metadata: {
        usage: "Data fetching",
        location: "useEffect",
        functions: ["useData"]
      },
    },
    {
      source: "dataGrid",
      target: "useSort",
      type: "uses",
      metadata: {
        usage: "Sorting functionality",
        location: "onSort",
        functions: ["useSort"]
      },
    },
    {
      source: "useAuth",
      target: "authContext",
      type: "uses",
      metadata: {
        usage: "Context consumption",
        location: "useContext",
        functions: ["useContext"]
      },
    },
    {
      source: "useTheme",
      target: "themeProvider",
      type: "uses",
      metadata: {
        usage: "Context consumption",
        location: "useContext",
        functions: ["useContext"]
      },
    }
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
      componentCount: 4,
      hookCount: 4,
      contextCount: 2,
      utilityCount: 0,
    },
  },
};

