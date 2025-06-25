import { useEffect, useState } from 'react'

export const GameBoyBattery = () => {
  const [batteryLevel, setBatteryLevel] = useState(100)
  const [isCharging, setIsCharging] = useState(false)

  useEffect(() => {
    // Simulate battery drain based on activity
    const interval = setInterval(() => {
      setBatteryLevel(prev => {
        if (prev <= 0) return 100 // Reset when empty
        return prev - 0.1 // Slow drain
      })
    }, 5000) // Update every 5 seconds

    // Check if device is charging (if supported)
    if ('getBattery' in navigator) {
      (navigator as unknown as { getBattery: () => Promise<{ charging: boolean; level: number; addEventListener: (event: string, callback: () => void) => void }> }).getBattery().then((battery) => {
        setIsCharging(battery.charging)
        setBatteryLevel(battery.level * 100)
        
        battery.addEventListener('chargingchange', () => {
          setIsCharging(battery.charging)
        })
        
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(battery.level * 100)
        })
      }).catch(() => {
        // Fallback for unsupported browsers
        console.log('Battery API not supported')
      })
    }

    return () => clearInterval(interval)
  }, [])

  const getBatteryColor = () => {
    if (batteryLevel > 50) return 'var(--gameboy-light)'
    if (batteryLevel > 20) return 'var(--gameboy-lightest)'
    return '#ff6b6b' // Red for low battery
  }

  return (
    <div className="gb-battery">
      <div className="gb-battery-icon">
        <div 
          className="gb-battery-fill" 
          style={{ 
            width: `${batteryLevel}%`,
            background: getBatteryColor()
          }}
        />
      </div>
      <span>{Math.round(batteryLevel)}%</span>
      {isCharging && <span className="animate-pulse">⚡</span>}
    </div>
  )
}