import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

export default function RootLayout() {
  return (
    <div>
      <Header />
      <main className="p-5">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}