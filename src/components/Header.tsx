export function Header() {
  return (
    <header className="bg-arxiv-dark text-white py-4 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold tracking-tight">
          <span className="text-arxiv-red">arXiv</span> Viewer
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Browse new arXiv papers with Semantic Scholar figure thumbnails
        </p>
      </div>
    </header>
  );
}
