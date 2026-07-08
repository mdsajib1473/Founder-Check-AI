import React from 'react'

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
}

/**
 * Catches render errors inside a results tab so one broken tab cannot
 * unmount the whole app. Give it a key (for example the active tab name)
 * to reset the boundary automatically when the user switches tabs.
 */
class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Tab render error:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="section" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h3>This section could not be displayed</h3>
          <p style={{ color: '#8b9096', marginTop: '10px' }}>
            The rest of your analysis is unaffected. Switch to another tab or try again.
          </p>
          <button
            className="btn-secondary"
            style={{ marginTop: '16px' }}
            onClick={() => this.setState({ hasError: false })}
          >
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

/**
 * Defers evaluation of JSX into this component's own render pass.
 * Inline expressions written directly in a parent's JSX run during the
 * parent's render, where an ErrorBoundary between them cannot catch a
 * throw. Passing them as a render function moves the evaluation here,
 * inside the boundary.
 */
export const Defer = ({ render }: { render: () => React.ReactNode }) => <>{render()}</>

export default ErrorBoundary
