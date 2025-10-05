import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Login() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Wait for SDK to be available
    if (window.ApperSDK) {
      setIsInitialized(true);
      const { ApperUI } = window.ApperSDK;
      ApperUI.showLogin("#authentication");
    }
  }, []);

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="loading flex items-center justify-center p-6">
          <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v4"></path>
            <path d="m16.2 7.8 2.9-2.9"></path>
            <path d="M18 12h4"></path>
            <path d="m16.2 16.2 2.9 2.9"></path>
            <path d="M12 18v4"></path>
            <path d="m4.9 19.1 2.9-2.9"></path>
            <path d="M2 12h4"></path>
            <path d="m4.9 4.9 2.9 2.9"></path>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8 bg-surface rounded-lg shadow-card">
        <div className="flex flex-col gap-6 items-center justify-center">
          <div className="w-14 h-14 shrink-0 rounded-xl flex items-center justify-center bg-gradient-to-r from-primary to-accent text-white text-2xl font-bold">
            C
          </div>
          <div className="flex flex-col gap-1 items-center justify-center">
            <div className="text-center text-lg xl:text-xl font-bold">
              Sign in to Clarity Budget
            </div>
            <div className="text-center text-sm text-slate-500">
              Welcome back, please sign in to continue
            </div>
          </div>
        </div>
        <div id="authentication" />
        <div className="text-center mt-4">
          <p className="text-sm text-slate-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-primary hover:text-accent">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;