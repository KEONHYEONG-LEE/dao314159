
import { Youtube, Twitter, Facebook, Instagram, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">GPNR</h2>
            <p className="text-slate-400 mb-6 max-w-md">
              Global Pi Newsroom (GPNR) is your premier source for the latest updates, 
              analysis, and community news within the Pi Network ecosystem.
            </p>
            <div className="flex space-x-4">
              <Twitter className="w-5 h-5 cursor-pointer hover:text-blue-400" />
              <Facebook className="w-5 h-5 cursor-pointer hover:text-blue-600" />
              <Instagram className="w-5 h-5 cursor-pointer hover:text-pink-500" />
              <Youtube className="w-5 h-5 cursor-pointer hover:text-red-500" />
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-slate-400">
              <li className="hover:text-white cursor-pointer">About Us</li>
              <li className="hover:text-white cursor-pointer">Privacy Policy</li>
              <li className="hover:text-white cursor-pointer">Terms of Service</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Contact</h3>
            <div className="flex items-center space-x-2 text-slate-400">
              <Mail className="w-4 h-4" />
              <span>contact@gpnr.news</span>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-500 text-sm">
          <p>© 2026 GPNR - Global Pi Newsroom. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
