import { useState, useEffect } from "react";
import { useLocation } from "wouter";

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  loginTime: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(() => {
    // Initialize state synchronously from localStorage
    const isAuthenticated = localStorage.getItem("admin_authenticated") === "true";
    const username = localStorage.getItem("admin_username");
    const loginTime = localStorage.getItem("admin_login_time");
    
    // Check session validity immediately
    if (isAuthenticated && loginTime) {
      const loginTimestamp = new Date(loginTime).getTime();
      const currentTime = new Date().getTime();
      const sessionDuration = 24 * 60 * 60 * 1000;
      
      if (currentTime - loginTimestamp > sessionDuration) {
        // Session expired
        return {
          isAuthenticated: false,
          username: null,
          loginTime: null,
        };
      }
    }
    
    return {
      isAuthenticated,
      username,
      loginTime,
    };
  });
  const [location, setLocation] = useLocation();

  useEffect(() => {
    // Verify session with server on component mount and periodically
    const verifySession = async () => {
      try {
        const response = await fetch('/api/auth/status', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.authenticated) {
            // Server confirms authentication - sync with localStorage
            localStorage.setItem("admin_authenticated", "true");
            localStorage.setItem("admin_username", data.username);
            localStorage.setItem("admin_login_time", data.loginTime);
            
            setAuthState({
              isAuthenticated: true,
              username: data.username,
              loginTime: data.loginTime,
            });
          } else {
            // Server says not authenticated - clear local state
            logout();
          }
        } else {
          // API error - check local session validity as fallback
          checkLocalAuth();
        }
      } catch (error) {
        console.error('Session verification failed:', error);
        // Network error - check local session validity as fallback
        checkLocalAuth();
      }
    };

    const checkLocalAuth = () => {
      const isAuthenticated = localStorage.getItem("admin_authenticated") === "true";
      const username = localStorage.getItem("admin_username");
      const loginTime = localStorage.getItem("admin_login_time");

      // Check if session is still valid (24 hours)
      if (isAuthenticated && loginTime) {
        const loginTimestamp = new Date(loginTime).getTime();
        const currentTime = new Date().getTime();
        const sessionDuration = 24 * 60 * 60 * 1000;

        if (currentTime - loginTimestamp > sessionDuration) {
          logout();
          return;
        }
      }

      setAuthState({
        isAuthenticated,
        username,
        loginTime,
      });
    };

    // Initial session verification
    verifySession();

    // Set up periodic session verification (every 5 minutes)
    const interval = setInterval(verifySession, 5 * 60 * 1000);

    // Listen for storage changes from other tabs
    window.addEventListener('storage', verifySession);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', verifySession);
    };
  }, []);

  const logout = async () => {
    try {
      // Call server logout endpoint
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Server logout failed:', error);
      // Continue with client-side logout even if server call fails
    }
    
    // Clear local storage
    localStorage.removeItem("admin_authenticated");
    localStorage.removeItem("admin_username");
    localStorage.removeItem("admin_login_time");
    
    // Update state
    setAuthState({
      isAuthenticated: false,
      username: null,
      loginTime: null,
    });
    
    // Redirect to login
    setLocation("/admin-login");
  };

  const requireAuth = () => {
    if (!authState.isAuthenticated) {
      setLocation("/admin-login");
      return false;
    }
    return true;
  };

  return {
    ...authState,
    logout,
    requireAuth,
  };
}