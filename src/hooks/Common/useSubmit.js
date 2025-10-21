import Swal from "sweetalert2";
import axios from "axios";
import { useDispatch } from "react-redux";

const useSubmit = () => {
  const dispatch = useDispatch();

  const handleApprove = (
    { url, params, message, headers = {} },
    forDispatchArray,
    toggleArray
  ) => {
    Swal.fire({
      title: message?.title
        ? message?.title
        : "Are you sure you want to Submit",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Processing...",
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          },
          showCancelButton: false,
        });

        axios
          .post(url, params, {
            headers: {
              ...headers,
            },
            withCredentials: true,
          })
          .then((res) => {
            Swal.fire({
              icon: "success",
              title: message?.success ? message?.success : "Success!",
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              forDispatchArray.forEach((forDispatch) => dispatch(forDispatch));
              toggleArray.forEach((toggle) => toggle());
            });
          })
          .catch((error) => {
            let errorMessage = message?.error
              ? message?.error
              : "Unknown error occurred"; // Default error message

            if (
              error.response &&
              error.response.data &&
              error.response.data.message
            ) {
              const backendMessage = error.response.data.message;
              if (
                typeof backendMessage === "object" &&
                backendMessage !== null
              ) {
                // If the message is an object, get its values and join them into a string
                errorMessage = Object.values(backendMessage).join(",");
              } else {
                // If the message is a string or other type, use it directly
                errorMessage = backendMessage;
              }
            } else if (error.message) {
              // Add more detail to the error message
              errorMessage = `${errorMessage} (Error: ${error.message})`;
            }

            Swal.fire({
              icon: "warning",
              title: message?.failedTitle ? message?.failedTitle : "FAILED",
              text: errorMessage,
              showConfirmButton: false,
              timer: 3000,
            });
          });
      } else {
        console.log("Submission canceled");
      }
    });
  };

  return handleApprove;
};

export default useSubmit;
