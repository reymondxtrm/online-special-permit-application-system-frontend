import { useMemo } from "react";

export const useSelectedPaymentDetails = (selectedRow = [], data = []) => {
  return useMemo(() => {
    if (!selectedRow?.length || !data?.length) {
      return {
        billed_amount: 0,
        total_amount: 0,
        quantity: 0,
        fullname: "",
        created_at: "",
      };
    }
    return data
      .filter((app) => selectedRow.includes(app.id))
      .reduce(
        (acc, app) => {
          const billed = app.order_of_payment?.billed_amount || 0;
          const total = app.order_of_payment?.total_amount || 0;

          acc.billed_amount += billed;
          acc.total_amount += total;
          acc.fullname = app.order_of_payment?.fullname || "";
          acc.created_at = app.order_of_payment?.created_at || "";
          acc.quantity += 1;

          return acc;
        },
        {
          billed_amount: 0,
          total_amount: 0,
          quantity: 0,
          fullname: "",
          created_at: "",
        },
      );
  }, [selectedRow, data]);
};
