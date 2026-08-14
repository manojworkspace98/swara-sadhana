const STORAGE_KEY = 'swara-sadhana:input-device'

export interface InputDevice {
  deviceId: string
  label: string
  /** True for AirPods and similar, where the mic is worth naming. */
  isBluetooth: boolean
}

/**
 * Which microphone to listen on.
 *
 * Labels are empty until permission has been granted once — the browser hides
 * them from unpermitted pages — so the picker only becomes useful after the
 * first successful listen, and says so rather than showing blank rows.
 */
export async function listInputDevices(): Promise<InputDevice[]> {
  if (!navigator.mediaDevices?.enumerateDevices) return []
  const all = await navigator.mediaDevices.enumerateDevices()
  return all
    .filter((d) => d.kind === 'audioinput')
    .map((d, i) => ({
      deviceId: d.deviceId,
      label: d.label || `Microphone ${i + 1}`,
      isBluetooth: /airpod|bluetooth|wireless|beats/i.test(d.label),
    }))
}

export function preferredDeviceId(): string | null {
  return localStorage.getItem(STORAGE_KEY)
}

export function setPreferredDevice(deviceId: string | null): void {
  if (deviceId) localStorage.setItem(STORAGE_KEY, deviceId)
  else localStorage.removeItem(STORAGE_KEY)
}

/**
 * Bluetooth headsets have two modes. A2DP is the high-quality one, but it is
 * output only; the moment a page opens the microphone, macOS switches the
 * device into the hands-free profile, which resamples to roughly 16 kHz and
 * applies its own noise processing. Pitch detection still works there, but a
 * wired or built-in microphone gives a cleaner fundamental — worth saying once
 * rather than letting someone wonder why AirPods read worse than the laptop.
 */
export const BLUETOOTH_MIC_NOTE =
  'AirPods and other Bluetooth headsets drop to a low-quality microphone mode whenever a page is listening, which can make pitch readings less steady. They are fine for practice; the built-in or a wired microphone reads a little more accurately.'
