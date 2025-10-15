interface FilePaginationProps {
  itemsPerPage: number;
  setItemsPerPage: (value: number) => void;
  setCurrentPage: (value: number) => void;
  pageCount: number;
  currentPage: number;
  totalItems: number;
}

const FilePagination = ({
  itemsPerPage,
  setItemsPerPage,
  setCurrentPage,
  pageCount,
  currentPage,
  totalItems,
}: FilePaginationProps) => {
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when items per page changes
  }

  return (
    <div className="mt-4 flex-shrink-0 flex items-center justify-between text-sm">
      <div>
        <p className="text-gray-700 dark:text-gray-400">
          Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{' '}
          <span className="font-medium">{totalItems}</span> files
        </p>
      </div>

      {pageCount > 1 && (
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              aria-current={number === currentPage ? 'page' : undefined}
              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                ${
                  number === currentPage
                    ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600 dark:bg-gray-900 dark:border-indigo-400 dark:text-white'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                }
                ${number === 1 ? 'rounded-l-md' : ''}
                ${number === pageCount ? 'rounded-r-md' : ''}
              `}
            >
              {number}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
};

export default FilePagination;