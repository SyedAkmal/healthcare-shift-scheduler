import { store } from '../store';
import {
  updateWebsocketStatus,
  updateLastUpdated,
  addConflict,
  setSelectedShift
} from '../store/slices/shiftSlice';
import { showNotification } from '../store/slices/uiSlice';

class WebSocketService {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectTimeout = 5000; // 5 seconds
  }

  connect() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found for WebSocket connection');
      return;
    }

    try {
      this.ws = new WebSocket(`${process.env.REACT_APP_WS_URL}?token=${token}`);
      this.setupEventHandlers();
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.handleReconnect();
    }
  }

  setupEventHandlers() {
    this.ws.onopen = () => {
      console.log('WebSocket connected');
      store.dispatch(updateWebsocketStatus(true));
      this.reconnectAttempts = 0;
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      store.dispatch(updateWebsocketStatus(false));
      this.handleReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      store.dispatch(showNotification({
        type: 'error',
        message: 'Lost connection to server. Attempting to reconnect...'
      }));
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleWebSocketMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
  }

  handleWebSocketMessage(data) {
    switch (data.type) {
      case 'SHIFT_CREATED':
      case 'SHIFT_UPDATED':
      case 'SHIFT_DELETED':
        store.dispatch(updateLastUpdated());
        store.dispatch(showNotification({
          type: 'info',
          message: data.message
        }));
        break;

      case 'STAFF_ASSIGNED':
      case 'STAFF_UNASSIGNED':
        store.dispatch(updateLastUpdated());
        if (data.shiftId === store.getState().shifts.selectedShift?.id) {
          store.dispatch(setSelectedShift(data.shift));
        }
        store.dispatch(showNotification({
          type: 'info',
          message: data.message
        }));
        break;

      case 'CONFLICT_DETECTED':
        store.dispatch(addConflict(data.conflict));
        store.dispatch(showNotification({
          type: 'warning',
          message: data.message
        }));
        break;

      case 'CAPACITY_CHANGED':
        store.dispatch(updateLastUpdated());
        break;

      default:
        console.warn('Unknown WebSocket message type:', data.type);
    }
  }

  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      setTimeout(() => this.connect(), this.reconnectTimeout);
    } else {
      store.dispatch(showNotification({
        type: 'error',
        message: 'Failed to connect to server. Please refresh the page.'
      }));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  // Send a message to the server
  send(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
      store.dispatch(showNotification({
        type: 'error',
        message: 'Not connected to server. Please refresh the page.'
      }));
    }
  }
}

// Create a singleton instance
const websocketService = new WebSocketService();

export default websocketService; 