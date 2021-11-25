export const shortenAddress = (address, num = 3) => {
  if (!address) return "";
  return (
    !!address &&
    `${address.substring(0, num + 2)}...${address.substring(
      address.length - num - 1
    )}`
  );
};

export const secondsToDays = (seconds) => seconds / 24 / 60 / 60;
export const timestampToDate = (timestamp) => new Date(timestamp * 1000).toDateString();
