class TagFormError extends Error {
  constructor(message: string) {
    super(`TagForm: ${message}`);
  }
}
