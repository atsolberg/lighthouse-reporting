const ignore_all = `
User-Agent: *
Disallow: /
`;

export const loader = async () => {
  return new Response(ignore_all, {
    status: 200,
    headers: { 'Content-Type': 'text/plain' },
  });
};
