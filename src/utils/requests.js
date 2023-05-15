function OKResponse(data = {}, message = "") {
  return {
    result: true,
    data,
    message
  }
}

function ErrorResponse(error) {
  return {
    result: false,
    error,
    message: error.message
  }
}

module.exports = {
  OKResponse,
  ErrorResponse
}