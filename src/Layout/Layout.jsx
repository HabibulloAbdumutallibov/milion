import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery } from "../redux/productSlice";
import { Link, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  ShoppingBagIcon,
  ClockIcon,
  ShoppingCartIcon,
  UserIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import logo from "../assets/logo.svg";

function Layout({ children }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchQuery = useSelector((state) => state.products.searchQuery);
  const products = useSelector((state) => state.products.products);
  const [searchVisible, setSearchVisible] = useState(false);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [categories, setCategories] = useState([]); // Kategoriyalar ro'yxati

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNavi = (product) => {
    navigate("/full", { state: { product } });
    setSearchVisible(false);
    dispatch(setSearchQuery(""));
  };

  const clearSearch = () => {
    dispatch(setSearchQuery('')); // Qidiruv so'rovini tozalash
  };

  const handleCategoryClick = (category) => {
    if (location.pathname !== "/") {
      navigate("/", { state: { category } }); // Home sahifasiga o'tish
    } else {
      const element = document.getElementById(category);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };
  

  useEffect(() => {
    const groupedProducts = {};
    products.forEach(product => {
      if (!groupedProducts[product.category]) {
        groupedProducts[product.category] = [];
      }
      groupedProducts[product.category].push(product);
    });
    setCategories(Object.keys(groupedProducts)); // Kategoriyalarni o'rnatish
  }, [products]);

  return (
    <div className="flex  flex-col min-h-screen bg-gray-100">
     <header className="bg-gray-800 fixed top-0 left-0 w-full text-white p-1 flex flex-col items-center shadow-lg z-50">
  <div className="flex w-full max-w-7xl justify-between items-center">
    {/* Logo */}
    <Link to="/">
      <img src={logo} alt="Logo" className="h-10 md:h-12" />
    </Link>

    {/* Navbar - Desktop */}
    <nav className="hidden md:flex gap-6">
      <Link to="/" className="hover:text-gray-400 transition">Home</Link>
      <Link to="/browse" className="hover:text-gray-400 transition">Browse</Link>
      <Link to="/cart" className="relative">
        Store
        {cartItems.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {cartItems.length}
          </span>
        )}
      </Link>
      <Link to="/order" className="hover:text-gray-400 transition">Orders</Link>
      <Link to="/profile" className="hover:text-gray-400 transition">Profile</Link>
    </nav>

    {/* Search & Icons - Desktop */}
    <div className="hidden md:flex gap-6 items-center">
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          className="bg-gray-300 text-gray-900 px-3 py-2 rounded-full shadow-md border focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        />
      </div>
      <Link to="/likes">
        <HeartIcon className="h-6 w-6 text-red-500 hover:text-red-700 transition" />
      </Link>
      <Link to="/cart" className="relative">
        <ShoppingCartIcon className="h-6 w-6 text-white hover:text-gray-400 transition" />
        {cartItems.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {cartItems.length}
          </span>
        )}
      </Link>
    </div>

    {/* Mobile Navbar */}
    <div className="flex gap-4 md:hidden items-center">
      <Link to="/likes">
        <HeartIcon className="h-6 w-6 text-red-500 hover:text-red-700 transition" />
      </Link>
      <Link to="/cart" className="relative">
        <ShoppingCartIcon className="h-6 w-6 text-white hover:text-gray-400 transition" />
        {cartItems.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {cartItems.length}
          </span>
        )}
      </Link>
      <MagnifyingGlassIcon
        className="h-6 w-6 text-white cursor-pointer hover:text-gray-400 transition"
        onClick={() => setSearchVisible(true)}
      />
    </div>
  </div>

  {/* Mobile Search */}
  {searchVisible && (
    <div className="absolute z-50 top-full left-0 w-full bg-gray-800 p-3 flex flex-col items-start gap-2 shadow-md md:hidden">
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search..."
          className="w-full text-gray-900 bg-white p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        />
        <XMarkIcon
          className="h-6 w-6 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700 cursor-pointer hover:text-gray-900 transition duration-200"
          onClick={() => setSearchVisible(false)}
        />
      </div>

      {searchQuery && filteredProducts.length > 0 && (
        <div className="w-full bg-gray-700 z-50 rounded-md p-2 mt-2">
          <h3 className="text-gray-300 font-semibold">Natijalar:</h3>
          <ul className="max-h-40 overflow-y-auto">
            {filteredProducts.map((product) => (
              <li key={product.id} className="p-2 hover:bg-gray-500 transition">
                <button onClick={() => handleNavi(product)}>
                  {product.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )}

  {/* Categories */}
  <ul className="w-full overflow-x-auto whitespace-nowrap  shadow-lg flex gap-2 text-white px-4 py-1">
  {categories.map((category) => (
    <li
      key={category}
      className="bg-gray-700 text-gray-300 px-3 py-1 text-sm rounded-full hover:bg-gray-600 transition cursor-pointer"
      onClick={() => handleCategoryClick(category)}
    >
      {category}
    </li>
  ))}
</ul>

</header>


      

      <main className="flex-grow mt-20  p-4">{children}</main>

      <nav className="fixed bottom-0 w-full bg-gray-800 text-white flex justify-around items-center p-2 shadow-lg border-t border-gray-700 md:hidden">
        <Link
          to="/"
          className="flex flex-col items-center hover:text-gray-400 transition"
        >
          <HomeIcon className="h-6 w-6" />
          <span className="text-xs">Home</span>
        </Link>
        <Link
          to="/browse"
          className="flex flex-col items-center hover:text-gray-400 transition"
        >
          <ShoppingBagIcon className="h-6 w-6" />
          <span className="text-xs">Browse</span>
        </Link>
        <Link to="/cart" className="relative">
          <ShoppingCartIcon className="h-6 w-6 text-white hover:text-gray-400 transition" />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {cartItems.length}
            </span>
          )}
        </Link>
        <Link
          to="/order"
          className="flex flex-col items-center hover:text-gray-400 transition"
        >
          <ClockIcon className="h-6 w-6" />
          <span className="text-xs">Orders</span>
        </Link>
        <Link
          to="/profile"
          className="flex flex-col items-center hover:text-gray-400 transition"
        >
          <UserIcon className="h-6 w-6" />
          <span className="text-xs">Profile</span>
        </Link>
      </nav>
    </div>
  );
}

export default Layout;
