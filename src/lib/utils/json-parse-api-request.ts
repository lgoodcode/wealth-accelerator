export const JsonParseApiRequest = async (request: Request) => {
  return await request
    .json()
    .then((obj: Record<string, any>) => obj)
    .catch((err: Error) => err);
};
