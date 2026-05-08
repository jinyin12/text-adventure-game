const START_MARKERS = ['"narrative":"', '"narrative": "']

export function extractStreamingNarrative(raw: string): string {
  let start = -1

  for (const marker of START_MARKERS) {
    const idx = raw.indexOf(marker)
    if (idx !== -1) {
      start = idx + marker.length
      break
    }
  }

  if (start === -1) return ''

  let result = ''
  let escaping = false

  for (let i = start; i < raw.length; i++) {
    const ch = raw[i]

    if (escaping) {
      result += unescapeChar(ch)
      escaping = false
      continue
    }

    if (ch === '\\') {
      escaping = true
      continue
    }

    if (ch === '"') {
      const rest = raw.slice(i + 1).trimStart()
      if (rest.startsWith(',') || rest.startsWith('}')) break
      result += ch
      continue
    }

    result += ch
  }

  return result
}

function unescapeChar(ch: string): string {
  switch (ch) {
    case 'n': return '\n'
    case 'r': return '\r'
    case 't': return '\t'
    case '\\': return '\\'
    case '"': return '"'
    default: return ch
  }
}

// RAF-throttled streaming text buffer - avoids re-rendering on every SSE token
export class StreamingBuffer {
  private buffer = ''
  private rafId = 0
  private lastFlush = 0
  private readonly minInterval: number
  private onChange: (text: string) => void

  constructor(onChange: (text: string) => void, fps = 20) {
    this.onChange = onChange
    this.minInterval = 1000 / fps
  }

  append(chunk: string) {
    this.buffer += chunk
    this.scheduleFlush()
  }

  private scheduleFlush() {
    if (this.rafId) return
    this.rafId = requestAnimationFrame(() => {
      const now = performance.now()
      if (now - this.lastFlush >= this.minInterval && this.buffer) {
        const extracted = extractStreamingNarrative(this.buffer)
        this.onChange(extracted)
        this.lastFlush = now
      }
      this.rafId = 0
      if (this.buffer) this.scheduleFlush()
    })
  }

  reset() {
    cancelAnimationFrame(this.rafId)
    this.rafId = 0
    this.buffer = ''
    this.lastFlush = 0
  }
}
