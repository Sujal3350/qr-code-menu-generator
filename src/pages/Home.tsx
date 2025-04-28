
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { QrCode } from 'lucide-react';
import { isAuthenticated } from '@/services/auth';

const Home = () => {
  const isAuth = isAuthenticated();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Navigation */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-brand-600 p-2 rounded-full mr-2">
              <QrCode size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-semibold">QR Menu</h1>
          </div>
          
          <nav>
            <div className="flex items-center space-x-2">
              {isAuth ? (
                <Link to="/dashboard">
                  <Button>Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline">Log In</Button>
                  </Link>
                  <Link to="/register">
                    <Button>Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-brand-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
                Create beautiful digital menus with QR codes
              </h1>
              <p className="text-lg text-gray-600">
                Transform your restaurant experience with our easy-to-use digital menu system. 
                Design beautiful menus, generate QR codes, and give your customers a contactless experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" className="bg-brand-600 hover:bg-brand-700 w-full sm:w-auto">
                    Get Started for Free
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg">Cafe Italiano</h3>
                  <div className="h-12 w-12 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center">
                    <QrCode size={20} />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-gray-100 h-12 rounded-md w-full"></div>
                  <div className="bg-gray-100 h-24 rounded-md w-full"></div>
                  <div className="bg-gray-100 h-12 rounded-md w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Create digital menus in minutes with our easy three-step process
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="h-12 w-12 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Your Menu</h3>
              <p className="text-gray-600">
                Enter your menu items, descriptions, and prices. Upload images to make your dishes look irresistible.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="h-12 w-12 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose a Theme</h3>
              <p className="text-gray-600">
                Select from beautiful pre-designed templates that match your restaurant's brand and style.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="h-12 w-12 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Generate QR Code</h3>
              <p className="text-gray-600">
                Get your unique QR code to display in your restaurant. Customers scan it to view your digital menu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Benefits</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Why restaurants love our digital menu system
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Easy Menu Updates</h3>
              <p className="text-gray-600">
                Change prices, add seasonal items, or update descriptions in seconds. No more printing costs.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Contactless Experience</h3>
              <p className="text-gray-600">
                Provide a hygienic option for customers to view your menu without touching shared physical menus.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Beautiful Design</h3>
              <p className="text-gray-600">
                Our professionally designed templates make your menu look great on any device.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Customer Insights</h3>
              <p className="text-gray-600">
                Track menu views and understand customer behavior with integrated analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to digitize your menu?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of restaurants already using our QR menu system. Get started for free today!
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary" className="bg-white text-brand-600 hover:bg-gray-100">
              Create Your Digital Menu
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-white p-1 rounded-full mr-2">
                <QrCode size={20} className="text-brand-600" />
              </div>
              <span className="font-semibold">QR Menu</span>
            </div>
            
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} QR Menu. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
