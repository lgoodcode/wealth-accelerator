export const JsonParseApiRequest = async <T = Record<string, any>>(request: Request) => {
  return await request
    .json()
    .then((obj: T) => obj)
    .catch((err: Error) => err);
};
