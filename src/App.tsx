
import { Graph } from './components/Graph';
import { sampleData } from './lib/data';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          TypeScript Project Dependency Graph
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <h2 className="text-xl font-semibold mb-2">Project Details</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Project:</span>
              <div className="font-medium">{sampleData.projectName}</div>
            </div>
            <div>
              <span className="text-gray-600">Language:</span>
              <div className="font-medium">{sampleData.language}</div>
            </div>
            <div>
              <span className="text-gray-600">Components:</span>
              <div className="font-medium">{sampleData.metadata.stats.componentCount}</div>
            </div>
            <div>
              <span className="text-gray-600">Hooks:</span>
              <div className="font-medium">{sampleData.metadata.stats.hookCount}</div>
            </div>
          </div>
        </div>
        <Graph data={sampleData} />
      </div>
    </div>
  );
}

export default App;