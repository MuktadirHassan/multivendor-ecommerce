// file: ~/server/api/token.get.ts
import { getToken } from "#auth";

export default eventHandler(async (event) => {
  const token = await getToken({ event });

  return token || "no token present";
});
