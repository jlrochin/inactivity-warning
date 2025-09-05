import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createApp } from 'vue'
import InactivityWarning from '../src/components/InactivityWarning.vue'

// Mock the composable
vi.mock('../src/composables/useInactivityTimer.js', () => ({
  useInactivityTimer: () => ({
    isActive: { value: true },
    isWarningVisible: { value: true },
    timeRemaining: { value: 30 },
    formatTimeRemaining: () => '0:30',
    extendSession: vi.fn(),
    startMonitoring: vi.fn(),
    stopMonitoring: vi.fn()
  })
}))

describe('InactivityWarning Component', () => {
  it('should render when visible', () => {
    const wrapper = mount(InactivityWarning, {
      props: {
        isVisible: true,
        timeRemaining: 30,
        theme: 'default',
        showButtons: true
      }
    })

    expect(wrapper.find('.inactivity-warning').exists()).toBe(true)
    expect(wrapper.find('.warning-modal').exists()).toBe(true)
  })

  it('should not render when not visible', () => {
    const wrapper = mount(InactivityWarning, {
      props: {
        isVisible: false,
        timeRemaining: 0,
        theme: 'default',
        showButtons: true
      }
    })

    expect(wrapper.find('.inactivity-warning').exists()).toBe(false)
  })

  it('should display correct time remaining', () => {
    const wrapper = mount(InactivityWarning, {
      props: {
        isVisible: true,
        timeRemaining: 45,
        theme: 'default',
        showButtons: true
      }
    })

    expect(wrapper.text()).toContain('0:45')
  })

  it('should apply correct theme class', () => {
    const wrapper = mount(InactivityWarning, {
      props: {
        isVisible: true,
        timeRemaining: 30,
        theme: 'dark',
        showButtons: true
      }
    })

    expect(wrapper.find('.warning-modal').classes()).toContain('theme-dark')
  })

  it('should show buttons when showButtons is true', () => {
    const wrapper = mount(InactivityWarning, {
      props: {
        isVisible: true,
        timeRemaining: 30,
        theme: 'default',
        showButtons: true
      }
    })

    expect(wrapper.find('.warning-buttons').exists()).toBe(true)
    expect(wrapper.find('.extend-btn').exists()).toBe(true)
    expect(wrapper.find('.logout-btn').exists()).toBe(true)
  })

  it('should not show buttons when showButtons is false', () => {
    const wrapper = mount(InactivityWarning, {
      props: {
        isVisible: true,
        timeRemaining: 30,
        theme: 'default',
        showButtons: false
      }
    })

    expect(wrapper.find('.warning-buttons').exists()).toBe(false)
  })

  it('should emit extend event when extend button is clicked', async () => {
    const wrapper = mount(InactivityWarning, {
      props: {
        isVisible: true,
        timeRemaining: 30,
        theme: 'default',
        showButtons: true
      }
    })

    await wrapper.find('.extend-btn').trigger('click')
    
    expect(wrapper.emitted('extend')).toBeTruthy()
  })

  it('should emit logout event when logout button is clicked', async () => {
    const wrapper = mount(InactivityWarning, {
      props: {
        isVisible: true,
        timeRemaining: 30,
        theme: 'default',
        showButtons: true
      }
    })

    await wrapper.find('.logout-btn').trigger('click')
    
    expect(wrapper.emitted('logout')).toBeTruthy()
  })

  it('should emit logout event when overlay is clicked', async () => {
    const wrapper = mount(InactivityWarning, {
      props: {
        isVisible: true,
        timeRemaining: 30,
        theme: 'default',
        showButtons: true
      }
    })

    await wrapper.find('.warning-overlay').trigger('click')
    
    expect(wrapper.emitted('logout')).toBeTruthy()
  })
})
