import { usePage } from "@inertiajs/react";
import React from "react";
// import { useAuthStore } from "./appState";
// import UnauthorizedSection from "./UnauthorizedSection";

export function detectIfCan(can){
  const {auth} = usePage().props;

  const permissions = auth.permissions;
  if(permissions.includes(can)) return true;
  return false;
}


// export function PermitWithFallback({ can, fallback, ...props }) {
//   fallback = fallback || <UnauthorizedSection />

//   if (detectIfCan(can)) return props.children;

//   return fallback;
// }

export default function({can, additionalFlags = [], ...props}){
  if (!detectIfCan(can) || additionalFlags.some(flag => flag === false))
    return undefined;

  return <React.Fragment {...props}></React.Fragment>

}