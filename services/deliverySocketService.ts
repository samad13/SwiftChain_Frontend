
export type DeliveryStatus = 'Pending' | 'In Transit' | 'Delivered' | 'Unknown';

class DeliverySocketService {
  private socket: WebSocket | null = null;

  // Connects to the backend WebSocket and listens for updates
  connect(deliveryId: string, onMessage: (status: DeliveryStatus) => void) {
    // Replace this URL with your actual backend WebSocket endpoint
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080/logistics';
    this.socket = new WebSocket(`${wsUrl}?deliveryId=${deliveryId}`);

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // Ensure this maps correctly to your backend's actual response object
        if (data && data.status) {
          onMessage(data.status);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };
  }

  // Cleans up the connection
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

// Export as a singleton to avoid multiple connection instances
export const deliverySocketService = new DeliverySocketService();