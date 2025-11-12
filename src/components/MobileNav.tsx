import { Link, useLocation } from "react-router-dom";
import { Home, ClipboardList, User } from "lucide-react";

const MobileNav = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-50">
      <ul className="flex items-center justify-around h-16">
        <li className="flex-1">
          <Link
            to="/dashboard"
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              isActive("/dashboard") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Home className="w-5 h-5 mb-1" />
            <span className="text-xs">Home</span>
          </Link>
        </li>
        <li className="flex-1">
          <Link
            to="/orders"
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              isActive("/orders") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <ClipboardList className="w-5 h-5 mb-1" />
            <span className="text-xs">Orders</span>
          </Link>
        </li>
        <li className="flex-1">
          <Link
            to="/account"
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              isActive("/account") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <User className="w-5 h-5 mb-1" />
            <span className="text-xs">Account</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default MobileNav;
