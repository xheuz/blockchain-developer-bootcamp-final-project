export function randomString(length) {
  let result = "";
  let characters =
    "ABCDEFabcdef0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const mockAddress = () => `0x${randomString(40)}`;
