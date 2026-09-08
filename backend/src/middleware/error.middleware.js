export function notFoundHandler(request, _response, next) {
  const error = new Error(`Route not found: ${request.method} ${request.originalUrl}`);
  error.statusCode = 404;
  error.code = 'NOT_FOUND';
  next(error);
}

export function errorHandler(error, _request, response, _next) {
  const statusCode = error.statusCode
    || (error.name === 'ValidationError' ? 400 : 0)
    || (error.name === 'CastError' ? 400 : 0)
    || (error.code === 11000 ? 409 : 500);
  const isProduction = process.env.NODE_ENV === 'production';
  const errorCode = error.code === 11000
    ? 'DUPLICATE_RESOURCE'
    : error.code || (error.name === 'ValidationError' || error.name === 'CastError'
      ? 'VALIDATION_ERROR'
      : 'INTERNAL_SERVER_ERROR');
  const message = statusCode === 500 && isProduction
    ? 'An unexpected server error occurred.'
    : error.name === 'ValidationError'
      ? 'Scheme data failed validation.'
      : error.name === 'CastError'
        ? 'The requested identifier is invalid.'
        : error.code === 11000
          ? 'A scheme with the same identifier already exists.'
          : error.message;

  response.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message,
      ...(isProduction ? {} : { details: error.stack })
    }
  });
}
