import { receivedColumn, releasedColumn } from "./offlineColumn";

export const getColumnsByStatus = (status) => {
  switch (status) {
    case "received":
      return receivedColumn;
    case "released":
      return releasedColumn;
    default:
      return receivedColumn;
  }
};
