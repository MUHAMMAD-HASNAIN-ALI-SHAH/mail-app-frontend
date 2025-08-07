import { useState, useRef, useEffect } from "react";
import { MenuIcon } from "lucide-react";
import useSidebarStore from "../store/useSidebarStore";
import useAuthStore from "../store/useAuthStore";

const Navbar = () => {
  const { toggle } = useSidebarStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuthStore();

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full h-16 bg-white shadow-md px-6 flex items-center justify-between relative">
      {/* Left: Menu toggle and title */}
      <div className="flex items-center gap-2">
        <MenuIcon
          onClick={toggle}
          className="w-6 h-6 text-blue-600 cursor-pointer hover:text-blue-800 transition"
        />
        <h1 className="text-3xl font-bold text-blue-600 select-none">M</h1>
        <span className="text-xl font-semibold text-gray-800">MailHub</span>
      </div>

      {/* Center: Search bar */}
      <div className="flex-1 max-w-md mx-6">
        <input
          type="text"
          placeholder="Search mail..."
          className="w-full px-4 py-2 border border-blue-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Right: Profile image and dropdown */}
      <div className="flex items-center gap-4 relative" ref={dropdownRef}>
        <img
          src="https://i.pravatar.cc/300"
          alt="User"
          className="w-9 h-9 rounded-full object-cover border cursor-pointer"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
        />

        {isDropdownOpen && (
          <div className="absolute right-0 top-14 bg-white border border-blue-200 rounded-md shadow-lg w-48 z-50">
            <ul className="py-2">
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Profile
              </li>
              <li
                onClick={logout}
                className="px-4 py-2 text-red-600 hover:bg-red-50 cursor-pointer"
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
