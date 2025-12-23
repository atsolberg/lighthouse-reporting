import React from 'react';
import { Link, useLocation } from 'react-router';
import { cn } from '~/lib/utils';

const links = [
  { label: 'Home', href: '/' },
  { label: 'Report Stats', href: '/report-stats' },
  { label: 'Latest Report', href: '/latest-report' },
  { label: 'User Data', href: '/user-data' },
];

function PageLinks() {
  const path = useLocation().pathname;

  return (
    <div className="flex items-center gap-2 text-sm underline-offset-4">
      {links.map((link, index) => {
        const active = path == link.href;
        return (
          <React.Fragment key={link.href}>
            <Link
              key={link.href}
              to={link.href}
              className={cn('hover:underline', active && 'text-sky-500')}
            >
              {link.label}
            </Link>
            {index < links.length - 1 && <span>&#47;&#47;</span>}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default PageLinks;
