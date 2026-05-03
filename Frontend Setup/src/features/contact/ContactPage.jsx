import { useState } from "react";
import { useForm } from "react-hook-form";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import Swal from "sweetalert2";

export default function ContactPage() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Simulate sending email
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Swal.fire(
        "Message Sent!",
        "Thank you for contacting us. We'll get back to you soon.",
        "success"
      );
      reset();
    } catch (error) {
      Swal.fire(
        "Error",
        "Failed to send message. Please try again.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "support@bookstore.com",
      description: "We'll respond within 24 hours"
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+1 (555) 123-4567",
      description: "Available Mon-Fri, 9AM-6PM EST"
    },
    {
      icon: MapPin,
      title: "Address",
      value: "123 Book Street, NYC 10001",
      description: "Visit our showroom"
    },
    {
      icon: Clock,
      title: "Hours",
      value: "9:00 AM - 6:00 PM",
      description: "Monday to Friday"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Have a question about our books or services? We'd love to hear from you. Reach out to us and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  {...register("name", { required: "Full name is required" })}
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#008080] text-sm"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                  })}
                  type="email"
                  placeholder="john@example.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#008080] text-sm"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  {...register("phone", { required: "Phone number is required" })}
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#008080] text-sm"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  {...register("subject", { required: "Subject is required" })}
                  type="text"
                  placeholder="How can we help?"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#008080] text-sm"
                />
                {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  {...register("message", { required: "Message is required" })}
                  placeholder="Your message here..."
                  rows="5"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#008080] text-sm resize-none"
                ></textarea>
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#008080] text-white font-bold py-2.5 px-4 rounded-lg hover:bg-[#006666] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="space-y-4">
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0">
                        <Icon className="size-6 text-[#008080]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                        <p className="font-bold text-gray-800 mb-1">{item.value}</p>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Map Placeholder */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden h-64">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.00601629999999!3d40.7127837!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a31989f59c1%3A0x40c6a5770666d8d3!2s123%20Book%20Street%2C%20New%20York%2C%20NY%2010001!5e0!3m2!1sen!2sus!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What's your shipping policy?</h3>
              <p className="text-gray-600 text-sm">We offer free shipping on orders over $50. Standard delivery takes 5-7 business days.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Do you accept returns?</h3>
              <p className="text-gray-600 text-sm">Yes! We offer 30-day returns on all items in original condition.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How do I track my order?</h3>
              <p className="text-gray-600 text-sm">You'll receive a tracking number via email once your order ships.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600 text-sm">We accept all major credit cards, PayPal, and Apple Pay.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
