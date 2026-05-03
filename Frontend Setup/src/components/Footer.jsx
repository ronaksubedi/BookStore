import footerLogo  from "../assets/footer-logo.png"
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";


export default function Footer() {
  return (
    <div>
       <footer className="bg-[#008080] text-white py-10 px-4">
      {/* Top Section */}
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Left Side - Logo and Nav */}
        <div className="md:w-1/2 w-full">
          <img src={footerLogo} alt="Logo" className="mb-5 w-36" />
          <ul className="flex flex-col md:flex-row gap-4">
            <li><Link to="/" className="hover:text-gray-200">Home</Link></li>
            <li><Link to="/books" className="hover:text-gray-200">Books</Link></li>
            <li><Link to="/about" className="hover:text-gray-200">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-gray-200">Contact</Link></li>
          </ul>
        </div>

        {/* Right Side - Newsletter */}
        <div className="md:w-1/2 w-full">
          <p className="mb-4">
            Subscribe to our newsletter to receive the latest updates, news, and offers!
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-l-md border border-amber-500 focus:outline-none "
            />
            <button className="bg-[#008080] px-6 py-2 rounded-r-md hover:bg-[#006666]">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center mt-10 border-t border-gray-700 pt-6">
        {/* Left Side - Privacy Links */}
        <ul className="flex gap-6 mb-4 md:mb-0">
          <li><a href="#privacy" className="hover:text-gray-200">Privacy Policy</a></li>
          <li><a href="#terms" className="hover:text-gray-200">Terms of Service</a></li>
        </ul>

        {/* Right Side - Social Icons */}
        <div className="flex gap-6">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200">
            <FaFacebook size={24} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200">
            <FaTwitter size={24} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200">
            <FaInstagram size={24} />
          </a>
        </div>
      </div>
    </footer>
    </div>
  )
}