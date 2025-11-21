import { useState } from "react";
import axios from "axios";

export default function useGetImage() {
  const [currentImage, setCurrentImage] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  const getImageHandle = async ({ path, url }) => {
    setIsFetching(true);
    try {
      const response = await axios({
        url,
        method: "GET",
        params: { filepath: path },
        responseType: "blob",
      });

      if (response?.data) {
        const blobUrl = URL.createObjectURL(response.data);
        setCurrentImage(blobUrl);
      }
    } catch (error) {
      console.log(error?.response?.data?.message || error);
    }

    setIsFetching(false);
  };

  return {
    getImageHandle,
    currentImage,
    isFetching,
  };
}
