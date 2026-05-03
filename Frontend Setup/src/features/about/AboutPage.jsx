import { HiOutlineCheckCircle } from "react-icons/hi2";
import { Link } from "react-router-dom";

export default function AboutPage() {
  const shellClass = "max-w-6xl mx-auto px-4";
  const features = [
    {
      title: "Wide Selection",
      description: "Browse thousands of books across all genres and categories."
    },
    {
      title: "Competitive Prices",
      description: "Get the best deals and discounts on your favorite books."
    },
    {
      title: "Fast Shipping",
      description: "Free shipping on orders over $50, delivered in 5-7 business days."
    },
    {
      title: "Easy Returns",
      description: "30-day return policy with no questions asked."
    }
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image: "👩‍💼"
    },
    {
      name: "Michael Chen",
      role: "Head of Operations",
      image: "👨‍💼"
    },
    {
      name: "Emily Davis",
      role: "Customer Service Manager",
      image: "👩‍💼"
    },
    {
      name: "James Wilson",
      role: "Tech Director",
      image: "👨‍💼"
    }
  ];

  return (
    <div className="w-full py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex items-center justify-between gap-6">
        {/* Hero Section */}
      <div className=" w-full ">
        <div className="max-w-full px-0">
          <div className="bg-linear-to-r from-[#008080] to-[#006666] text-white py-16 md:py-20 rounded-3xl">
            <div className="text-center w-full">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">About BookStore</h1>
              <p className="text-lg md:text-xl text-gray-100 max-w-xl mx-auto">
                Your trusted destination for discovering and purchasing quality books since 2020.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="w-full py-16">
        <div className={shellClass}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                BookStore was founded in 2020 with a simple mission: to make quality books accessible to everyone. 
                We believe that reading opens doors to new worlds, ideas, and possibilities.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                What started as a small online bookshop has grown into a thriving community of book lovers. 
                Today, we pride ourselves on offering an extensive collection of books across all genres, 
                competitive pricing, and exceptional customer service.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our team is passionate about connecting readers with the books they love. 
                We're committed to providing a seamless shopping experience and building lasting relationships with our customers.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#008080] mb-2">50,000+</div>
                  <p className="text-gray-600">Books in our catalog</p>
                </div>
                <div className="text-center border-t pt-6">
                  <div className="text-4xl font-bold text-[#008080] mb-2">100,000+</div>
                  <p className="text-gray-600">Happy customers worldwide</p>
                </div>
                <div className="text-center border-t pt-6">
                  <div className="text-4xl font-bold text-[#008080] mb-2">4.8/5</div>
                  <p className="text-gray-600">Average customer rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="w-fullbg-white py-16">
        <div className={shellClass}>
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">Why Choose BookStore?</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Here's what makes us different from other online bookstores.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-4">
                <HiOutlineCheckCircle className="size-6 text-[#008080] shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="w-full py-16">
        <div className={shellClass}>
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-8 hover:shadow-lg transition">
              <h3 className="text-2xl font-bold text-[#008080] mb-3">Customer First</h3>
              <p className="text-gray-600">
                We put our customers' needs at the center of everything we do. Your satisfaction is our success.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-8 hover:shadow-lg transition">
              <h3 className="text-2xl font-bold text-[#008080] mb-3">Quality</h3>
              <p className="text-gray-600">
                We curate our book collection carefully to ensure we offer only quality titles that matter.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-8 hover:shadow-lg transition">
              <h3 className="text-2xl font-bold text-[#008080] mb-3">Integrity</h3>
              <p className="text-gray-600">
                We operate with honesty and transparency in all our dealings with customers and partners.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="w-fullbg-gray-100 py-16">
        <div className={shellClass}>
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-lg transition">
                <div className="text-6xl mb-4">{member.image}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-sm text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-linear-to-r from-[#008080] to-[#006666] rounded-2xl text-white py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Reading?</h2>
          <p className="text-gray-100 mb-8">
            Explore our collection of thousands of books and find your next favorite read.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/books"
              className="bg-white text-[#008080] font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition"
            >
              Browse Books
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white/10 transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
