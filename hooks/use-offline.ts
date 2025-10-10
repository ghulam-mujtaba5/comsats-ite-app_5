import { useState, useEffect } from 'react'

interface OfflineStatus {
  isOnline: boolean
  isOffline: boolean
  pendingSyncCount: number
  lastSync: Date | null
}

export function useOffline() {
  const [status, setStatus] = useState<OfflineStatus>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isOffline: typeof navigator !== 'undefined' ? !navigator.onLine : false,
    pendingSyncCount: 0,
    lastSync: null
  })

  useEffect(() => {
    const handleOnline = () => {
      setStatus(prev => ({
        ...prev,
        isOnline: true,
        isOffline: false
      }))
    }

    const handleOffline = () => {
      setStatus(prev => ({
        ...prev,
        isOnline: false,
        isOffline: true
      }))
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Check for pending sync actions
    checkPendingSync()

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const checkPendingSync = async () => {
    try {
      // In a real implementation, this would check IndexedDB for pending actions
      // For now, we'll simulate with a random number
      const pendingCount = Math.floor(Math.random() * 5)
      setStatus(prev => ({
        ...prev,
        pendingSyncCount: pendingCount
      }))
    } catch (error) {
      console.error('Error checking pending sync:', error)
    }
  }

  const triggerSync = async () => {
    if ('serviceWorker' in navigator && 'sync' in (navigator.serviceWorker as any).registration) {
      try {
        const registration = await navigator.serviceWorker.ready
        await (registration as any).sync.register('sync-admin-actions')
        return { success: true, message: 'Sync started successfully' }
      } catch (error) {
        console.error('Error registering background sync:', error)
        return { success: false, message: 'Failed to start sync' }
      }
    }
    return { success: false, message: 'Background sync not supported' }
  }

  const saveForOffline = async (data: any, key: string) => {
    try {
      // Save data to localStorage for offline access
      localStorage.setItem(`offline_${key}`, JSON.stringify({
        ...data,
        timestamp: new Date().toISOString()
      }))
      return { success: true, message: 'Data saved for offline use' }
    } catch (error) {
      console.error('Error saving data for offline use:', error)
      return { success: false, message: 'Failed to save data for offline use' }
    }
  }

  const getOfflineData = (key: string) => {
    try {
      const data = localStorage.getItem(`offline_${key}`)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Error retrieving offline data:', error)
      return null
    }
  }

  return {
    ...status,
    triggerSync,
    saveForOffline,
    getOfflineData,
    checkPendingSync
  }
}