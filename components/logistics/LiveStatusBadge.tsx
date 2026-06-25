import React, { useEffect, useState } from 'react';
import { useLiveDeliveryStatus } from '../../hooks/useLiveDeliveryStatus';
import { DeliveryStatus } from '../../services/deliverySocketService';

interface LiveStatusBadgeProps {
  deliveryId: string;
}

// Map statuses to their specific Tailwind color configurations
const statusConfig: Record<DeliveryStatus, { bg: string; text: string; dot: string; ring: string }> = {
  'Pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500', ring: 'ring-yellow-400' },
  'In Transit': { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500', ring: 'ring-blue-400' },
  'Delivered': { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500', ring: 'ring-green-400' },
  'Unknown': { bg: 'bg-gray-100', text: 'text-gray-800', dot: 'bg-gray-500', ring: 'ring-gray-400' },
};

export const LiveStatusBadge: React.FC<LiveStatusBadgeProps> = ({ deliveryId }) => {
  const { status } = useLiveDeliveryStatus(deliveryId);
  const [isPulsing, setIsPulsing] = useState(false);

  // Trigger the pulse animation whenever the status changes
  useEffect(() => {
    setIsPulsing(true);
    const timer = setTimeout(() => setIsPulsing(false), 2000); // Stop pulse after 2 seconds
    return () => clearTimeout(timer);
  }, [status]);

  const config = statusConfig[status] || statusConfig['Unknown'];

  return (
    <div
      className={`
        inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
        transition-colors duration-300 ease-in-out
        ${config.bg} ${config.text}
        ${isPulsing ? `animate-pulse ring-2 ring-offset-2 ring-opacity-50 ${config.ring}` : ''}
      `}
    >
      {/* Small indicator dot inside the badge */}
      <span className={`w-2 h-2 mr-2 rounded-full ${config.dot}`}></span>
      {status}
    </div>
  );
};