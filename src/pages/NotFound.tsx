
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100">
      <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto">
        <h1 className="text-6xl font-bold text-vinyl-primary mb-4">404</h1>
        <div className="w-16 h-16 mx-auto mb-6 opacity-60">
          <div className="vinyl-container">
            <div className="vinyl-grooves"></div>
            <div className="vinyl-label"></div>
            <div className="vinyl-spindle"></div>
          </div>
        </div>
        <p className="text-xl text-gray-800 mb-6">The record you're looking for has been misplaced</p>
        <Button
          asChild
          className="bg-vinyl-primary hover:bg-vinyl-primary/90"
        >
          <a href="/">Return to Player</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
