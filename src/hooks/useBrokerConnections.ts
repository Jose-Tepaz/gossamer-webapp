'use client';

import { useState, useEffect } from 'react';

export type BrokerConnection = {
  id: string;
  name: string;
  connectedAt: string;
  status: 'connected' | 'disconnected' | 'connecting';
}

const STORAGE_KEY = "connected_brokers";

export const useBrokerConnections = () => {
  const [connections, setConnections] = useState<Record<string, BrokerConnection>>({});

  // Load connections from localStorage
  useEffect(() => {
    const loadConnections = () => {
      if (typeof window === "undefined") return {};
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const savedConnections = JSON.parse(raw);
          // Convert old format to new format if needed
          const convertedConnections: Record<string, BrokerConnection> = {};
          Object.entries(savedConnections).forEach(([id, isConnected]) => {
            if (isConnected) {
              convertedConnections[id] = {
                id,
                name: getBrokerName(id),
                connectedAt: new Date().toISOString(),
                status: 'connected'
              };
            }
          });
          setConnections(convertedConnections);
        }
      } catch (error) {
        console.error('Error loading broker connections:', error);
      }
    };

    loadConnections();
  }, []);

  const getBrokerName = (id: string): string => {
    const brokerNames: Record<string, string> = {
      'binance': 'Binance',
      'coinbase': 'Coinbase',
      'kraken': 'Kraken',
      'robinhood': 'Robinhood'
    };
    return brokerNames[id] || id;
  };

  const connectBroker = (id: string, name: string) => {
    const newConnection: BrokerConnection = {
      id,
      name,
      connectedAt: new Date().toISOString(),
      status: 'connected'
    };

    const updatedConnections = { ...connections, [id]: newConnection };
    setConnections(updatedConnections);
    
    // Save to localStorage
    const simpleConnections: Record<string, boolean> = {};
    Object.keys(updatedConnections).forEach(key => {
      simpleConnections[key] = true;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(simpleConnections));
  };

  const disconnectBroker = (id: string) => {
    const updatedConnections = { ...connections };
    delete updatedConnections[id];
    setConnections(updatedConnections);
    
    // Save to localStorage
    const simpleConnections: Record<string, boolean> = {};
    Object.keys(updatedConnections).forEach(key => {
      simpleConnections[key] = true;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(simpleConnections));
  };

  const getConnectedBrokers = (): BrokerConnection[] => {
    return Object.values(connections).filter(conn => conn.status === 'connected');
  };

  const isConnected = (id: string): boolean => {
    return connections[id]?.status === 'connected';
  };

  const getConnectionCount = (): number => {
    return getConnectedBrokers().length;
  };

  return {
    connections,
    connectBroker,
    disconnectBroker,
    getConnectedBrokers,
    isConnected,
    getConnectionCount
  };
};
