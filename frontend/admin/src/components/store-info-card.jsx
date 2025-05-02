import React, { useState } from 'react';
import { Copy, QrCode, Settings } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
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
      <Card>
        <CardHeader className="pb-2">
          {/* <CardTitle>Store Information</CardTitle>
          <CardDescription>Manage your store details and settings</CardDescription> */}
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center">
            {/* Left Section - Store Info */}
            <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center md:space-x-4 w-full md:w-auto">
              {/* Store Icon and Name */}
              <div className="flex items-start space-x-3 w-full md:w-auto">
                <div className="p-2 rounded-lg bg-muted">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
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
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg md:text-xl font-semibold truncate">
                    {(currentStore?.name && currentStore?.name.length > 0) ? currentStore.name : 'No Store Selected'}
                  </h1>
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 mt-1">
                    <p className="text-sm text-muted-foreground truncate">
                      {(currentStore?.description?.length > 50
                        ? currentStore.description.slice(0, 50) + '...'
                        : currentStore?.description) || 'No description available'}
                    </p>

                    <span className="hidden sm:inline text-sm text-muted-foreground">•</span>
                    <Badge variant="secondary">
                      {currentStore?.category || 'Uncategorized'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Actions */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
              {/* Store ID Section */}
              <div className="flex items-center space-x-2 rounded-lg border px-3 py-1.5 w-full sm:w-auto">
                <span className="text-sm text-muted-foreground whitespace-nowrap">ID:</span>
                <code className="text-sm font-mono truncate flex-1">
                  {currentStore?.storeId || 'N/A'}
                </code>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCopyStoreId}
                        className="h-6 w-6 p-0 flex-shrink-0"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Copy Store ID</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Store Status and Actions */}
              <div className="flex items-center justify-between space-x-4">
                {/* Store Status */}
                <div className="flex items-center space-x-2 rounded-lg border px-3 py-1.5">
                  <span className={`h-2 w-2 rounded-full ${currentStore?.active ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {currentStore?.active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <Separator orientation="vertical" className="h-6" />

                {/* Actions Buttons */}
                <div className="flex items-center space-x-2">
                  {/* QR Code Button */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowQRDialog(true)}
                        >
                          <QrCode className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Show QR Code</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* Settings Button */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowSettingsDialog(true)}
                        >
                          <Settings className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Store Settings</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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