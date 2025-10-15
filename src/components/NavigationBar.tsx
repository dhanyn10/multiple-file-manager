function NavigationBar() {
  return (
    <header className="sticky top-0 z-10 bg-gray-800 text-white shadow-lg">
      <nav className="container mx-auto px-4 py-3 flex items-center">
        <a href="#" className="font-bold text-xl">File Manager</a>
        <div className="ml-10 flex items-baseline space-x-4">
          <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</a>
          <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Link</a>
        </div>
      </nav>
    </header>
  );
}

export default NavigationBar;