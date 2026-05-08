import { useEffect, useRef } from 'react'

interface Props {
  text: string
  isStreaming: boolean
}

export default function NarrativeArea({ text, isStreaming }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight
    }
  }, [text])

  return (
    <div
      ref={ref}
      className="flex-1 overflow-y-auto px-5 py-4 text-sm leading-relaxed"
    >
      {text ? (
        <p className="text-game-text whitespace-pre-wrap">
          {text}
          {isStreaming && <span className="inline-block w-1.5 h-4 bg-game-accent animate-pulse ml-0.5 align-middle" />}
        </p>
      ) : (
        <div className="flex items-center justify-center h-full text-game-text-dim">
          <p>正在生成场景...</p>
        </div>
      )}
    </div>
  )
}
