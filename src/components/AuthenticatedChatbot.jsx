'use client';

import { useEffect, useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import Chatbot from "./Chatbot";

export default function AuthenticatedChatbot() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  // Public routes that don't require authentication
  const publicRoutes = useMemo(() => ["/", "/terms", "/privacy", "/verify-email"], []);

  useEffect(() => {
    const checkAuth = () => {
      // Check both localStorage and cookies for user data (same logic as AuthGuard)
      const user = localStorage.getItem("user");

      if (user) {
        try {
          const userData = JSON.parse(user);
          if (userData && userData.id) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }

      setIsLoading(false);
    };

    checkAuth();

    // Listen for storage changes (when user logs in/out)
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also check periodically in case of programmatic changes
    const interval = setInterval(checkAuth, 5000); // Check every 5 seconds

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [pathname]);

  // Don't render anything while loading or if not authenticated
  if (isLoading || !isAuthenticated) {
    return null;
  }

  // Only render chatbot on non-public routes for authenticated users
  const isPublicRoute = publicRoutes.includes(pathname);
  if (isPublicRoute) {
    return null;
  }

  return <Chatbot />;
}
