import ApplicationLogo from "@/SvgIcons/ApplicationLogo";
import { Link, router } from "@inertiajs/react";
import NavLink from "./NavLink";
import Permission from "./Permission";
import { grey } from "@mui/material/colors";
import React from "react";
import ResponsiveNavLink from "./ResponsiveNavLink";
import TailwindTopnavDropdown from "./TailwindTopnavDropdown";
import QuickSearch from "./QuickSearch";

export const elements = [
  ['dashboard', 'Dashboard', null]
  , ['background.pending', 'Pending Loans', 'view background check']
  , ['background.check', 'Background Check', 'view background check']
  , ['attendance', 'Attendance', 'view attendance']
  , ['employees.on.duty', 'Employees on Duty', 'view attendance']
  , ['my.department', 'My Department', 'view my department']
  , ['gallery', 'Gallery', 'view gallery']
  , ['users', 'Users', 'view users']
  , ['roles', 'Roles', 'view roles']
  , ['dev.cache', 'DEV/Cache', 'is developer']
];

function NavItem(params) {
  return <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex text-center">
    {params.children}
  </div>
}

function NavigationButton({routeName, label, permission = null, ...params}){
  const navItem = <NavItem>
    <NavLink href={route(routeName)} active={route().current(routeName)}>
      {label}
    </NavLink>
  </NavItem>

  if(permission !== null){
    return <Permission can={permission}>
      {navItem}
    </Permission>
  }else{
    return navItem;
  }
}

function ResponsiveNavigationButton({routeName, label, permission = null, ...params}){
  const navItem = <ResponsiveNavLink href={route(routeName)}
    active={route().current(routeName)}>
      {label}
    </ResponsiveNavLink>

  if(permission !== null){
    return <Permission can={permission}>
      {navItem}
    </Permission>
  }else{
    return navItem;
  }
}

export function TopNavigation(){
  return <React.Fragment>
    <QuickSearch elements={elements}
      searchLabel='jump to'
      onEnterButtonPress={element => router.visit(route(element[0]))}
    />
      <div className="flex">
        <div className="shrink-0 flex items-center">
          <Link href="/">
            <ApplicationLogo sx={{
              fontSize: 36,
              color: grey[600]
            }} />
          </Link>
        </div>

        <NavigationButton
          key="dashboard"
          routeName="dashboard"
          label="Dashboard"
        />

        <TailwindTopnavDropdown
          title="Jump to"
          /**
           * displaying dashboard separately above, outside of menu
           *   dropdown
           */
          elements={elements.filter(([routeName]) => routeName !== 'dashboard')}
        />
      </div>
    </React.Fragment>
}

export function ResponsiveNavigation(){
  return <div className="pt-2 pb-3 space-y-1">
    {elements.map(([routeName, label, permission]) => (
      <ResponsiveNavigationButton
        key={routeName}
        routeName={routeName}
        label={label}
        permission={permission}
      />
    ))}
  </div>
}
