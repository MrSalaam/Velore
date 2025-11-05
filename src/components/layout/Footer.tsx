import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Send } from 'lucide-react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { FOOTER_LINKS, SOCIAL_LINKS } from '../../utils/constants';

export const Footer: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [isSubscribing, setIsSubscribing] = React.useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Newsletter subscription:', email);
      setEmail('');
      setIsSubscribing(false);
      // Show success toast
    }, 1000);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-white border-t border-gray-100 ">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12 mt-10">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-5">
            <Link to="/" className="flex items-center gap-3 group mb-4" aria-label="VELORÉ Home">
              <div className="relative">

              </div>
              <div className="-ml-3 flex flex-col">
                  {/* Logo Text */}
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent tracking-wider">
                  VELORÉ
                </h1>
                {/* Tagline */}
                <p className="text-xs pl-1 text-gray-800 font-medium tracking-wide">LUXURY PERFUMES...</p>
              </div>
            </Link>
            
            <p className="text-gray-600 text-sm mb-8 leading-relaxed max-w-md">
              Discover the world's most exquisite fragrances. Curated for the discerning individual.
            </p>

            {/* Newsletter */}
            <div>
              <h4 className="text-gray-900 font-semibold text-sm mb-3">Stay Updated</h4>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-md">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="text-sm"
                />
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSubscribing}
                  loadingText="..."
                  className="px-4"
                >
                  <Send size={16} />
                </Button>
              </form>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-gray-900 font-semibold text-sm mb-4">Company</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-600 hover:text-emerald-600 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-2">
            <h4 className="text-gray-900 font-semibold text-sm mb-4">Support</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.help.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-600 hover:text-emerald-600 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h4 className="text-gray-900 font-semibold text-sm mb-4">Contact</h4>
            <div className="space-y-3">
              <a href="tel:+1234567890" className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors text-sm group">
                <Phone size={16} className="text-emerald-600" />
                <span>+1 (234) 567-890</span>
              </a>
              <a href="mailto:support@oud.com" className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors text-sm group">
                <Mail size={16} className="text-emerald-600" />
                <span>support@oud.com</span>
              </a>
              <div className="flex items-start gap-2 text-gray-600 text-sm">
                <MapPin size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>123 Perfume Lane<br />New York, NY 10001</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center hover:border-emerald-600 hover:bg-emerald-50 transition-all"
                aria-label="Facebook"
              >
                <Facebook size={16} className="text-gray-600" />
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center hover:border-emerald-600 hover:bg-emerald-50 transition-all"
                aria-label="Instagram"
              >
                <Instagram size={16} className="text-gray-600" />
              </a>
              <a
                href={SOCIAL_LINKS.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center hover:border-emerald-600 hover:bg-emerald-50 transition-all"
                aria-label="Twitter"
              >
                <Twitter size={16} className="text-gray-600" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 my-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6">
            <p className="text-gray-500 text-xs">
              © {currentYear} Oud. All rights reserved.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
              {FOOTER_LINKS.legal.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-xs text-gray-500 hover:text-emerald-600 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-xs">We Accept:</span>
            <div className="flex items-center gap-2">
              <div className="w-7 h-5 bg-gray-50 border border-gray-200 rounded flex items-center justify-center">
                <span className="text-[10px] font-bold text-blue-600">VISA</span>
              </div>
              <div className="w-7 h-5 bg-gray-50 border border-gray-200 rounded flex items-center justify-center">
                <span className="text-[10px] font-bold text-red-600">MC</span>
              </div>
              <div className="w-7 h-5 bg-gray-50 border border-gray-200 rounded flex items-center justify-center">
                <span className="text-[10px] font-bold text-blue-600">PP</span>
              </div>
              <div className="w-7 h-5 bg-gray-50 border border-gray-200 rounded flex items-center justify-center">
                <span className="text-[10px] font-bold text-green-600">AMEX</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};