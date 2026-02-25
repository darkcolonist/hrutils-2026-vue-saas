export default function DesktopOnly({children}){
  return <div className="hidden md:block">
    {children}
  </div>
}