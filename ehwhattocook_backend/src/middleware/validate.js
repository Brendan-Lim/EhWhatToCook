export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params
    });

    if (!result.success) {
      const error = new Error("Invalid request");
      error.status = 400;
      error.expose = true;
      error.details = result.error.flatten();
      return next(error);
    }

    req.validated = result.data;
    return next();
  };
}
