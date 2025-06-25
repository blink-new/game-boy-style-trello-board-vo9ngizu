import { useEffect } from 'react'

interface GameBoyNotificationProps {
  message: string
  isVisible: boolean
  onClose: () => void
  type?: 'success' | 'error' | 'info'
}

export const GameBoyNotification = ({ 
  message, 
  isVisible, 
  onClose, 
  type = 'info' 
}: GameBoyNotificationProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, 2000) // Auto-close after 2 seconds

      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  const getNotificationIcon = () => {
    switch (type) {
      case 'success': return '✓'
      case 'error': return '✗'
      case 'info': return 'ℹ'
      default: return '•'
    }
  }

  return (
    <div className="gb-notification">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{getNotificationIcon()}</span>
        <span className="text-sm">{message}</span>
      </div>
    </div>
  )
}