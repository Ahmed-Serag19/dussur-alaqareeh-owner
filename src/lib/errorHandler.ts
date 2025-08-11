/**
 * Error handling utility for extracting meaningful error messages from API responses
 */

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

/**
 * Extracts the actual error message from various error response formats
 */
export const extractErrorMessage = (error: any): string => {
  // Debug logging to see what error format we're receiving
  console.log("Error handler received:", error);
  console.log("Error response data:", error?.response?.data);

  // If it's already a string, return it
  if (typeof error === "string") {
    return error;
  }

  // Check for axios error response structure FIRST (before checking Error.message)
  if (error?.response?.data) {
    const responseData = error.response.data;

    // Handle different error response formats
    if (typeof responseData === "string") {
      return responseData;
    }

    if (responseData.error) {
      return responseData.error;
    }

    if (responseData.message) {
      return responseData.message;
    }

    if (responseData.detail) {
      return responseData.detail;
    }

    // Handle validation errors
    if (responseData.errors && Array.isArray(responseData.errors)) {
      return responseData.errors
        .map((err: any) => err.message || err)
        .join(", ");
    }

    // Handle object with field-specific errors
    if (typeof responseData === "object") {
      const errorMessages = Object.values(responseData)
        .filter((value) => typeof value === "string")
        .join(", ");

      if (errorMessages) {
        return errorMessages;
      }
    }
  }

  // If it's an Error object with a custom message (from our axios interceptor)
  if (error instanceof Error && error.message) {
    return error.message;
  }

  // Handle network errors
  if (
    error?.code === "NETWORK_ERROR" ||
    error?.message?.includes("Network Error")
  ) {
    return "فشل في الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.";
  }

  // Handle timeout errors
  if (error?.code === "ECONNABORTED" || error?.message?.includes("timeout")) {
    return "انتهت مهلة الاتصال. يرجى المحاولة مرة أخرى.";
  }

  // Fallback error messages based on status codes
  if (error?.response?.status) {
    const status = error.response.status;
    switch (status) {
      case 400:
        return "بيانات غير صحيحة. يرجى التحقق من المدخلات والمحاولة مرة أخرى.";
      case 401:
        return "غير مصرح لك بالوصول. يرجى تسجيل الدخول مرة أخرى.";
      case 403:
        return "ليس لديك صلاحية لتنفيذ هذا الإجراء.";
      case 404:
        return "المورد المطلوب غير موجود.";
      case 409:
        return "هناك تضارب في البيانات. يرجى التحقق والمحاولة مرة أخرى.";
      case 422:
        return "البيانات المرسلة غير صحيحة. يرجى التحقق من المدخلات.";
      case 429:
        return "تم تجاوز الحد المسموح من الطلبات. يرجى المحاولة لاحقاً.";
      case 500:
        return "حدث خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.";
      case 502:
      case 503:
      case 504:
        return "الخادم غير متاح حالياً. يرجى المحاولة مرة أخرى لاحقاً.";
      default:
        return `حدث خطأ غير متوقع (${status}). يرجى المحاولة مرة أخرى.`;
    }
  }

  // Generic fallback
  return "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.";
};

/**
 * Creates a standardized error object
 */
export const createApiError = (error: any): ApiError => {
  return {
    message: extractErrorMessage(error),
    status: error?.response?.status,
    code: error?.code,
  };
};

/**
 * Logs error for debugging (only in development)
 */
export const logError = (error: any, context?: string) => {
  if (process.env.NODE_ENV === "development") {
    console.error(`[${context || "API Error"}]:`, error);
  }
};
