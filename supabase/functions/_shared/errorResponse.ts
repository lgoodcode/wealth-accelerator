export const errorResponse = (error: Error) => {
  return new Response(
    JSON.stringify({
      error: error.message,
    }),
    {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};
