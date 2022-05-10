import React, { Component, ReactNode } from "react";
import { BrowserRouter as Router, Redirect } from "react-router-dom";

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.log(error, errorInfo, "ErrorBoundary error");
  }

  render() {
    if (this.state.hasError) {
      return (
        <Router>
          <Redirect to="/404" />
        </Router>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}
