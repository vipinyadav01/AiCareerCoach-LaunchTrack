"use client";

import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error) {
    // Update state so the next render shows the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Log error for debugging; could wire telemetry here later
    console.error("Unhandled error in UI:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" style={{ padding: 16, background: "#fff3cd", color: "#7f6000" }}>
          Something went wrong while loading this section.
          <button
            onClick={() => this.setState({ hasError: false })}
            style={{ marginLeft: 12, padding: "6px 10px", borderRadius: 4, border: "1px solid #d4a017", background: "white" }}
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
