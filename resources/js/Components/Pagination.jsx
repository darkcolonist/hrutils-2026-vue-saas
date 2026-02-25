import React from 'react';
import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
  console.debug(links);

  function prepareLabel(label){
    label = label.replace('&laquo; Previous', '«');
    label = label.replace('Next &raquo;', '»');

    return label;
  }

  function getClassName(active) {
    if (active) {
      return "mr-1 mb-1 px-4 py-3 text-sm leading-4 border rounded hover:bg-white focus:border-primary focus:text-primary bg-gray-300 text-gray-800";
    } else {
      return "mr-1 mb-1 px-4 py-3 text-sm leading-4 border rounded hover:bg-yellow-800 focus:border-primary focus:text-primary text-gray-300";
    }
  }

  return (
    links.length > 3 && (
      <div className="mb-4">
        <div className="flex flex-wrap mt-8">
          {links.map((link, key) => (
            link.url === null ? (
              <div key={key} className="mr-1 mb-1 px-4 py-3 text-sm leading-4 text-gray-300 border rounded">
                {prepareLabel(link.label)}
              </div>
            ) : (
              <Link key={key} className={getClassName(link.active)} href={link.url}>
                {prepareLabel(link.label)}
              </Link>
            )
          ))}
        </div>
      </div>
    )
  );
}
