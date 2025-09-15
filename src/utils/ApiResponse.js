class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data; //data will come as a json object
    this.message = message;
    this.success = statusCode < 400;
  }
}

export { ApiResponse };
