import { customAlphabet } from "nanoid";

export async function generateSKU(
  productName: string,
  shopId: number
): Promise<string> {
  const nanoid = customAlphabet("1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ", 8);
  const namePrefix = productName
    .substring(0, 3)
    .toUpperCase()
    .replace(/[^A-Z]/g, "X");

  return `${namePrefix}-${shopId}-${nanoid()}`;
}
