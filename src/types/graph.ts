export interface Node{
    id:string,
    name: string,
    type: string,
    language: string,
    filepath: string,
    metadata: Record<string,any>;
}

export interface Edge{
    source: string,
    target: string,
    type: string,
    metadata: Record<string,any>;
}

export interface GraphData{
    projectName: string,
    language: string,
    version: string,
    analyzedAt: string,
    nodes: Node[],
    edges: Edge[],
    metadata: Record<string,any>;
}