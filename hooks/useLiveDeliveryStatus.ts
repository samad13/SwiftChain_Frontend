import { useState, useEffect } from 'react';
import { deliverySocketService, DeliveryStatus } from '../services/deliverySocketService';

export const useLiveDeliveryStatus = (deliveryId: string) => {
  // The issue requires "Pending" to be the default starting state
  const [status, setStatus] = useState<DeliveryStatus>('Pending');
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    if (!deliveryId) return;

    setIsConnected(true);
    
    // Subscribe to the service
    deliverySocketService.connect(deliveryId, (newStatus) => {
      setStatus(newStatus);
    });

    // Cleanup function runs on unmount to close the connection
    return () => {
      deliverySocketService.disconnect();
      setIsConnected(false);
    };
  }, [deliveryId]);

  return { status, isConnected };
};