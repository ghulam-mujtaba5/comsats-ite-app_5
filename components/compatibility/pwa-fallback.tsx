'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export function PwaFallback() {
  const [showWarning, setShowWarning] = useState(false);
  const [pwaSupport, setPwaSupport] = useState({
    supported: true,
    installable: false,
    message: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    // Check PWA support
    const checkPwaSupport = () => {
      try {
        // Check if we're in standalone mode (already installed as PWA)
        if (window.matchMedia('(display-mode: standalone)').matches || 
            (window.navigator as any).standalone === true) {
          // Already installed as PWA
          return {
            supported: true,
            installable: false,
            message: 'Already installed as PWA'
          };
        }

        // Check for PWA features
        const hasBeforeInstallPrompt = 'onbeforeinstallprompt' in window;
        const hasServiceWorker = 'serviceWorker' in navigator;
        const hasManifest = !!document.querySelector('link[rel="manifest"]');
        
        // Check for required APIs
        const hasRequiredApis = (
          typeof Promise !== 'undefined' &&
          typeof fetch !== 'undefined' &&
          typeof localStorage !== 'undefined' &&
          typeof IntersectionObserver !== 'undefined'
        );

        // Overall support check
        const isSupported = hasServiceWorker && hasManifest && hasRequiredApis;
        const isInstallable = isSupported && hasBeforeInstallPrompt;

        // Determine message
        let message = '';
        if (!isSupported) {
          message = 'Your browser does not support Progressive Web App features.';
        } else if (!isInstallable) {
          message = 'PWA installation is not available in your browser.';
        }

        return {
          supported: isSupported,
          installable: isInstallable,
          message: message
        };
      } catch (error) {
        return {
          supported: false,
          installable: false,
          message: 'Unable to determine PWA support.'
        };
      }
    };

    // Run PWA support check
    const support = checkPwaSupport();
    setPwaSupport(support);
    
    // Show warning if PWA is not supported
    if (!support.supported || support.message) {
      setShowWarning(true);
    }
  }, []);

  const handleInstall = () => {
    // Try to trigger PWA installation
    if ((window as any).deferredPrompt) {
      // Show the install prompt
      (window as any).deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      (window as any).deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          toast({
            title: 'App Installed',
            description: 'CampusAxis has been installed on your device.',
          });
        }
        
        // Clear the saved prompt since it can't be used again
        (window as any).deferredPrompt = null;
      });
    } else {
      toast({
        title: 'Installation Not Available',
        description: 'PWA installation is not available in your browser.',
        variant: 'destructive',
      });
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  if (!showWarning) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-blue-50 border border-blue-200 rounded-lg shadow-lg p-4 dark:bg-blue-900/20 dark:border-blue-800">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
              PWA Compatibility
            </h3>
            <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
              <p>
                {pwaSupport.message || 'Progressive Web App features may not be fully supported in your browser.'}
              </p>
              <p className="mt-1">
                You can still use all features of CampusAxis, but some offline capabilities may be limited.
              </p>
            </div>
            <div className="mt-3 flex gap-2 flex-wrap">
              {pwaSupport.installable && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-8 text-xs"
                  onClick={handleInstall}
                >
                  <Download className="h-3 w-3 mr-1" />
                  Install App
                </Button>
              )}
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