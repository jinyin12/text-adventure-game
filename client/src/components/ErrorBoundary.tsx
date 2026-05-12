import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="h-screen bg-game-bg text-game-text flex flex-col items-center justify-center p-6">
          <p className="text-4xl mb-4">💥</p>
          <p className="text-lg font-bold mb-2">出错了</p>
          <p className="text-sm text-game-text-dim text-center mb-6">
            {this.state.error.message}
          </p>
          <button
            onClick={() => {
              this.setState({ error: null })
              window.location.href = '/'
            }}
            className="px-6 py-3 bg-game-accent text-game-bg rounded-xl font-bold"
          >
            返回主页
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
