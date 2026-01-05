import { Link, useLocation } from 'react-router-dom';
import { useMemo } from 'react';

export default function Breadcrumbs() {
  const location = useLocation();

  const breadcrumbs = useMemo(() => {
    const paths = location.pathname.split('/').filter(Boolean);
    const crumbs = [{ name: 'Home', path: '/' }];

    let currentPath = '';
    paths.forEach((segment) => {
      currentPath += `/${segment}`;
      // Convert path segment to readable name
      const name = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      crumbs.push({ name, path: currentPath });
    });

    return crumbs;
  }, [location.pathname]);

  // Don't show breadcrumbs on home page or auth pages
  if (location.pathname === '/' || location.pathname.startsWith('/login') || location.pathname.startsWith('/register')) {
    return null;
  }

  return (
    <nav className="bg-gray-100 dark:bg-gray-800 py-3 px-5 rounded-md mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center flex-wrap gap-2 text-sm">
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.path} className="flex items-center">
            {index > 0 && (
              <svg
                className="w-4 h-4 text-gray-400 dark:text-gray-500 mx-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {index === breadcrumbs.length - 1 ? (
              <span className="text-gray-500 dark:text-gray-400 font-medium">
                {crumb.name}
              </span>
            ) : (
              <Link
                to={crumb.path}
                className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {crumb.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
