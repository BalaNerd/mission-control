const fs = require('fs');
const path = require('path');

const routes = [
  '/tasks',
  '/notes',
  '/goals',
  '/habits',
  '/planner',
  '/analytics',
  '/exams/cds',
  '/exams/afcat',
  '/exams/capf',
  '/exams/pyq',
  '/exams/mocks',
  '/settings'
];

const basePath = path.join(__dirname, 'app');

routes.forEach(route => {
  const dirPath = path.join(basePath, route);
  fs.mkdirSync(dirPath, { recursive: true });
  
  const pageName = route.split('/').pop();
  const title = pageName.charAt(0).toUpperCase() + pageName.slice(1);
  
  const content = `export default function ${title.replace(/[^a-zA-Z0-9]/g, '')}Page() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">${title}</h1>
        <p className="text-muted-foreground mt-1">Manage your ${title.toLowerCase()} here.</p>
      </div>
      <div className="glass-card rounded-xl p-8 flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Work in progress...</p>
      </div>
    </div>
  );
}`;

  fs.writeFileSync(path.join(dirPath, 'page.tsx'), content);
});

console.log('Routes created successfully.');
