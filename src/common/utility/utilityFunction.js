import axios from "axios";

export const formateDateIntoString = (date) => {
  const formatted = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return formatted;
};

export const updateTabNotification = async (permitType, permit_id, stage) => {
  console.log(permitType, permit_id, stage);
  try {
    const response = await axios.post("api/admin/update-tab-notification", {
      permit_type: permitType,
      permit_id: permit_id,
      stage: stage,
    });
    if (response) {
      return "success";
    }
  } catch (error) {
    return "failed";
  }
};
