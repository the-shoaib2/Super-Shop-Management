import React, { useState } from 'react';
import { Copy, QrCode, Settings } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { StoreCardDialog } from "@/components/dialogs/store-card-dialog";
import { StoreSettingsDialog } from "@/components/dialogs/store-settings-dialog";

export default function StoreInfoCard({ 
  currentStore, 
  onCopyStoreId, 
  onShowQRCode, 
  onShowSettings 
}) {
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);

  const handleCopyStoreId = () => {
    if (currentStore?.storeId) {
      navigator.clipboard.writeText(currentStore.storeId);
      toast.success('Store ID copied to clipboard');
    }
  };

  return (
    <>
      <div className="bg-white/80 rounded-lg shadow">
        <div className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            {/* Left Section - Store Info */}
            <div className="flex items-center space-x-4 w-full md:w-auto">
              {/* Store Icon and Name */}
              <div className="flex items-center space-x-3 flex-1 md:flex-none">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h1 className="text-xl font-semibold text-gray-900 truncate">
                    {(currentStore?.name && currentStore?.name.length > 0) ? currentStore.name : 'No Store Selected'}
                  </h1>
                  <div className="flex items-center space-x-2 flex-wrap">
                    <p className="text-sm text-muted-foreground truncate">
                      {currentStore?.description || 'No description available'}
                    </p>
                    <span className="text-sm text-muted-foreground hidden md:inline">•</span>
                    <span className="text-sm font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {currentStore?.category || 'Uncategorized'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center space-x-4 w-full md:w-auto">
              {/* Store ID Section */}
              <div className="flex items-center space-x-2 bg-secondary/20 rounded-lg px-3 py-1.5 flex-1 md:flex-none">
                <span className="text-sm text-muted-foreground">ID:</span>
                <code className="text-sm font-mono text-primary truncate">
                  {currentStore?.storeId || 'N/A'}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopyStoreId}
                  className="h-6 w-6 p-0 hover:bg-secondary flex-shrink-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              {/* Store Status */}
              <div className="flex items-center space-x-2 bg-secondary/20 rounded-lg px-3 py-1.5">
                <span className={`h-2 w-2 rounded-full ${currentStore?.active ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm text-muted-foreground">
                  {currentStore?.active ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Actions Buttons */}
              <div className="flex items-center space-x-2">
                {/* QR Code Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => setShowQRDialog(true)}
                >
                  <QrCode className="h-5 w-5" />
                </Button>

                {/* Settings Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => setShowSettingsDialog(true)}
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Dialog */}
      <StoreCardDialog 
        isOpen={showQRDialog} 
        onClose={() => setShowQRDialog(false)} 
        store={currentStore} 
      />

      {/* Settings Dialog */}
      <StoreSettingsDialog 
        isOpen={showSettingsDialog} 
        onClose={() => setShowSettingsDialog(false)} 
        store={currentStore}
        onUpdate={(updatedStore) => {
          // Handle store update if needed
          setShowSettingsDialog(false);
        }}
      />
    </>
  );
}