interface NavigationBarProps {
  actionsSlot?: React.ReactNode;
}

function NavigationBar({ actionsSlot }: NavigationBarProps) {
  return (
    <header className="sticky top-0 z-20 bg-slate-800 text-white shadow-lg">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        <a href="#" className="font-bold text-xl">File Manager</a>
        <div className="flex items-center space-x-4">
          {actionsSlot}
          <a href="#" className="text-slate-300 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</a>
          <a href="#" className="text-slate-300 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Link</a>
        </div>
      </nav>
    </header>
  );
}

export default NavigationBar;