import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-5 text-center">
          <IconAlertTriangle size={64} className="text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-mine-shaft-100 mb-2">Something went wrong</h1>
          <p className="text-mine-shaft-300 max-w-md mb-6">
            We apologize, but an unexpected error has occurred. Please try refreshing the page or contact support if the problem persists.
          </p>
          <div className="flex gap-4">
            <Button variant="light" color="brightSun.4" onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
            <Button variant="outline" color="mineShaft.3" onClick={() => window.location.href = '/'}>
              Go Home
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
