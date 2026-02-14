
// Custom error classes
export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Network error occurred') {
    super(message, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 'AUTH_ERROR', 401);
    this.name = 'AuthenticationError';
  }
}

export class PermissionError extends AppError {
  constructor(message: string = 'Permission denied') {
    super(message, 'PERMISSION_DENIED', 403);
    this.name = 'PermissionError';
  }
}

// Error handler utility
export const handleError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    // Handle specific error types
    if (error.message.includes('Network') || error.message.includes('fetch')) {
      return new NetworkError(error.message);
    }

    if (error.message.includes('Unauthorized') || error.message.includes('401')) {
      return new AuthenticationError(error.message);
    }

    if (error.message.includes('Forbidden') || error.message.includes('403')) {
      return new PermissionError(error.message);
    }

    // Generic error
    return new AppError(error.message);
  }

  // Unknown error
  return new AppError('Server error occurred');
};

// Toast error handler
export const handleToastError = (error: unknown, showToast: (options: any) => void) => {
  const appError = handleError(error);
  
  showToast({
    title: 'Error',
    description: appError.message,
    variant: 'destructive',
  });
};

// Async error wrapper
export const withErrorHandling = async <T>(
  asyncFn: () => Promise<T>,
  errorHandler?: (error: AppError) => void
): Promise<T | null> => {
  try {
    return await asyncFn();
  } catch (error) {
    const appError = handleError(error);
    
    if (errorHandler) {
      errorHandler(appError);
    } else {
      console.error('Unhandled error:', appError);
    }
    
    return null;
  }
};

// Retry utility
export const withRetry = async <T>(
  asyncFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: unknown;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await asyncFn();
    } catch (error) {
      lastError = error;
      
      if (i < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }

  throw handleError(lastError);
};
