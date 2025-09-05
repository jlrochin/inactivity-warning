import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useInactivityTimer } from '../src/composables/useInactivityTimer.js'

describe('useInactivityTimer', () => {
  let mockConfig
  let inactivityTimer

  beforeEach(() => {
    mockConfig = {
      timeoutSeconds: 5,
      warningSeconds: 2,
      onLogout: vi.fn(),
      onWarning: vi.fn(),
      onExtend: vi.fn()
    }
    
    // Mock timers
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('should initialize with default values', () => {
    inactivityTimer = useInactivityTimer(mockConfig)
    
    expect(inactivityTimer.isActive.value).toBe(false)
    expect(inactivityTimer.isWarningVisible.value).toBe(false)
    expect(inactivityTimer.timeRemaining.value).toBe(0)
  })

  it('should start monitoring when startMonitoring is called', () => {
    inactivityTimer = useInactivityTimer(mockConfig)
    inactivityTimer.startMonitoring()
    
    expect(inactivityTimer.isActive.value).toBe(true)
  })

  it('should stop monitoring when stopMonitoring is called', () => {
    inactivityTimer = useInactivityTimer(mockConfig)
    inactivityTimer.startMonitoring()
    inactivityTimer.stopMonitoring()
    
    expect(inactivityTimer.isActive.value).toBe(false)
  })

  it('should show warning after warning time', () => {
    inactivityTimer = useInactivityTimer(mockConfig)
    inactivityTimer.startMonitoring()
    
    // Fast forward to warning time
    vi.advanceTimersByTime(3000 * 1000) // 3 seconds
    
    expect(inactivityTimer.isWarningVisible.value).toBe(true)
    expect(mockConfig.onWarning).toHaveBeenCalled()
  })

  it('should trigger logout after timeout', () => {
    inactivityTimer = useInactivityTimer(mockConfig)
    inactivityTimer.startMonitoring()
    
    // Fast forward to timeout
    vi.advanceTimersByTime(5000 * 1000) // 5 seconds
    
    expect(mockConfig.onLogout).toHaveBeenCalled()
  })

  it('should extend session when extendSession is called', () => {
    inactivityTimer = useInactivityTimer(mockConfig)
    inactivityTimer.startMonitoring()
    
    // Show warning first
    vi.advanceTimersByTime(3000 * 1000)
    
    // Extend session
    inactivityTimer.extendSession()
    
    expect(inactivityTimer.isWarningVisible.value).toBe(false)
    expect(mockConfig.onExtend).toHaveBeenCalled()
  })

  it('should format time remaining correctly', () => {
    inactivityTimer = useInactivityTimer(mockConfig)
    inactivityTimer.startMonitoring()
    
    // Show warning
    vi.advanceTimersByTime(3000 * 1000)
    
    const formatted = inactivityTimer.formatTimeRemaining()
    expect(formatted).toMatch(/\d+:\d+/)
  })

  it('should update config when updateConfig is called', () => {
    inactivityTimer = useInactivityTimer(mockConfig)
    
    const newConfig = {
      timeoutSeconds: 10,
      warningSeconds: 5
    }
    
    inactivityTimer.updateConfig(newConfig)
    
    expect(inactivityTimer.config.timeoutSeconds).toBe(10)
    expect(inactivityTimer.config.warningSeconds).toBe(5)
  })

  it('should reset timer when resetTimer is called', () => {
    inactivityTimer = useInactivityTimer(mockConfig)
    inactivityTimer.startMonitoring()
    
    // Show warning
    vi.advanceTimersByTime(3000 * 1000)
    
    // Reset timer
    inactivityTimer.resetTimer()
    
    expect(inactivityTimer.isWarningVisible.value).toBe(false)
    expect(inactivityTimer.timeRemaining.value).toBe(0)
  })
})
