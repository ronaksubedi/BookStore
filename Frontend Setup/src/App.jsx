import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./components/RootLayout.jsx";
import Home from "./features/home/Home.jsx";
import Login from "./features/auth/Login.jsx";
import Register from "./features/auth/Register.jsx";
import Dashboard from "./features/users/Dashboard.jsx";
import CartPage from "./features/cart/CartPage.jsx";
import CheckoutPage from "./features/orders/CheckoutPage.jsx";
import OrdersPage from "./features/orders/OrdersPage.jsx";
import AdminDashboard from "./features/admin/AdminDashboard.jsx";
import BooksPage from "./features/books/BooksPage.jsx";
import BookDetailPage from "./features/books/BookDetailPage.jsx";
import ContactPage from "./features/contact/ContactPage.jsx";
import AboutPage from "./features/about/AboutPage.jsx";

function RouteErrorPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-sm p-8 text-center">
        <p className="text-sm font-semibold text-[#008080] uppercase tracking-wide mb-2">Page error</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Something went wrong</h1>
        <p className="text-gray-600 mb-6">
          The page could not be rendered. Please go back and try again.
        </p>
        <a
          href="/books"
          className="inline-flex items-center justify-center rounded-lg bg-[#008080] px-5 py-3 text-white font-semibold hover:bg-[#006666] transition"
        >
          Browse Books
        </a>
      </div>
    </div>
  );
}

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <RouteErrorPage />,
      children: [
        {
         index: true,
         element: <Home /> 
        },
        {
          path: 'login',
          element: <Login />
        },
        {
          path:'register',
          element: <Register />
        },
        {
          path:'dashboard',
          element: <Dashboard />
        },
        {
          path: 'cart',
          element:<CartPage />
        },
        {
          path:'checkout',
          element: <CheckoutPage />
        },
        {
          path:'orders',
          element: <OrdersPage />
        },
        {
          path:'admin',
          element: <AdminDashboard />
        },
        {
          path: 'books',
          element: <BooksPage />
        },
        {
          path: 'books/:id',
          element: <BookDetailPage />
        },
        {
          path: 'contact',
          element: <ContactPage />
        },
        {
          path: 'about',
          element: <AboutPage />
        }
      ]

    }
  ])

  return <RouterProvider router={router} />
}