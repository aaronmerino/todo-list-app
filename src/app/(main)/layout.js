import { NavBar } from '../components/NavBar'

export default function Layout({
  children, 
}) {
  return (
    <section>
      {/* Include shared UI here e.g. a header or sidebar */}
      <NavBar/>
 
      {children}
    </section>
  )
}