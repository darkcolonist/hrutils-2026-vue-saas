import React from 'react';
import Dropdown from '@/Components/Dropdown';
import Permission from './Permission';
import { getActiveClasses } from './NavLink';

function NavigationDropdownItem({ routeName, label, permission = null, ...params }) {
  const navItem = <Dropdown.Link href={route(routeName)}
    className={
      route().current(routeName) ? "dark:bg-indigo-600" : null
    }
  >
    {label}
  </Dropdown.Link>

  if (permission !== null) {
    return <Permission can={permission}>
      {navItem}
    </Permission>
  } else {
    return navItem;
  }
}

const findFirstMatchedItem = (arr, str) => {
  return arr.find(subArr => subArr[0] === str);
};

export default function TailwindTopnavDropdown({ title, elements, ...props }) {
  const [selectedElement,setSelectedElement] = React.useState(null);

  React.useEffect(() => {
    const _elem = findFirstMatchedItem(elements, route().current());

    if(_elem !== undefined)
      setSelectedElement(_elem);
  },[elements]);

  return (
    <div className={`hidden sm:flex sm:items-center sm:ml-6 ${selectedElement ? getActiveClasses() : null}`}>
      <div className="ml-3 relative">
        <Dropdown>
          <Dropdown.Trigger>
            <span className="inline-flex rounded-md">
              <button
                type="button"
                className="inline-flex
                           items-center
                           px-3
                           py-2
                           border
                           border-transparent
                           text-sm
                           leading-4
                           font-medium
                           rounded-md
                           text-gray-500
                           dark:text-gray-400
                           bg-white
                           dark:bg-gray-800
                           hover:text-gray-700
                           dark:hover:text-gray-300
                           focus:outline-none
                           transition
                           ease-in-out
                           duration-150">
                {selectedElement
                  ? selectedElement[1]
                  : title}

                <svg
                  className="ml-2 -mr-0.5 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </span>
          </Dropdown.Trigger>

          <Dropdown.Content>
            {elements.map(([routeName, label, permission]) => (
              <NavigationDropdownItem
                key={routeName}
                routeName={routeName}
                label={label}
                permission={permission}
              />
            ))}
          </Dropdown.Content>
        </Dropdown>
      </div>
    </div>
  );
}