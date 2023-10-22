class CustomAPIErrorHandler extends Error {
  constructor(
    public message: string,
    public StatusCode: number,
  ) {
    super(message);
  }
}

export default CustomAPIErrorHandler;
