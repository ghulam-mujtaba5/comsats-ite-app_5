'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FallbackWarning() {
  const [showWarning, setShowWarning] = useState(false);
  const [browserInfo, setBrowserInfo] = useState({
    name: '',
    version: '',
    isOutdated: false
  });

  useEffect(() => {
    // Check if browser supports required features
    const checkBrowserCompatibility = () => {
      try {
        // Check for modern JavaScript features
        const hasFeatures = (
          typeof Promise !== 'undefined' &&
          typeof fetch !== 'undefined' &&
          typeof localStorage !== 'undefined' &&
          typeof IntersectionObserver !== 'undefined' &&
          typeof ResizeObserver !== 'undefined'
        );

        // Get browser info
        const userAgent = navigator.userAgent;
        let browserName = 'Unknown';
        let browserVersion = 'Unknown';
        let isOutdated = false;

        // Simple browser detection
        if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
          browserName = 'Chrome';
          const match = userAgent.match(/Chrome\/(\d+)/);
          if (match) {
            browserVersion = match[1];
            isOutdated = parseInt(match[1]) < 60; // Chrome 60+ recommended
          }
        } else if (userAgent.includes('Firefox')) {
          browserName = 'Firefox';
          const match = userAgent.match(/Firefox\/(\d+)/);
          if (match) {
            browserVersion = match[1];
            isOutdated = parseInt(match[1]) < 55; // Firefox 55+ recommended
          }
        } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
          browserName = 'Safari';
          const match = userAgent.match(/Version\/(\d+)/);
          if (match) {
            browserVersion = match[1];
            isOutdated = parseInt(match[1]) < 12; // Safari 12+ recommended
          }
        } else if (userAgent.includes('Edg')) {
          browserName = 'Edge';
          const match = userAgent.match(/Edg\/(\d+)/);
          if (match) {
            browserVersion = match[1];
            isOutdated = parseInt(match[1]) < 79; // Edge 79+ recommended (Chromium-based)
          }
        }

        setBrowserInfo({
          name: browserName,
          version: browserVersion,
          isOutdated: isOutdated || !hasFeatures
        });

        // Show warning if browser is outdated or missing features
        if (!hasFeatures || isOutdated) {
          setShowWarning(true);
        }
      } catch (error) {
        // If we can't detect browser features, assume it might be outdated
        setShowWarning(true);
      }
    };

    // Run compatibility check
    checkBrowserCompatibility();
  }, []);

  if (!showWarning) {
    return null;
  }

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg shadow-lg p-4 dark:bg-yellow-900/20 dark:border-yellow-800">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Browser Compatibility Warning
            </h3>
            <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
              <p>
                {browserInfo.isOutdated 
                  ? `Your ${browserInfo.name} browser (version ${browserInfo.version}) may not support all features of this application.`
                  : 'Your browser may not support all features of this application.'}
              </p>
              <p className="mt-1">
                For the best experience, please update your browser or try a modern browser like Chrome, Firefox, or Edge.
              </p>
            </div>
            <div className="mt-3 flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="h-8 text-xs"
                onClick={handleRefresh}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Reload
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 text-xs"
                onClick={() => setShowWarning(false)}
              >
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}