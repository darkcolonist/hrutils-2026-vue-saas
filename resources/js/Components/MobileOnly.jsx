export default function MobileOnly({ children }) {
  return <div className="block md:hidden">
    {children}
  </div>
}