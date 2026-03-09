import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import useImageCompressor from "./useImageCompressor";

export default function useGetImage() {
  const [currentImage, setCurrentImage] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [fileType, setFileType] = useState("image");
  const [error, setError] = useState(null);
  const lastUrlRef = useRef(null);
  const {
    compressedFiles,
    isCompressing,
    errors: compressionErrors,
    handleImageChange,
  } = useImageCompressor({
    maxSizeMB: 2,
    maxWidthOrHeight: 1920,
  });

  useEffect(() => {
    return () => {
      if (lastUrlRef.current) {
        URL.revokeObjectURL(lastUrlRef.current);
        lastUrlRef.current = null;
      }
    };
  }, []);

  const getImageHandle = async ({ path, url, showLoader = false }) => {
    setIsFetching(true);
    setError(null);

    if (showLoader) {
      Swal.fire({
        title: "Fetching image...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
    }

    try {
      const response = await axios({
        url,
        method: "GET",
        params: { filepath: path },
        responseType: "blob",
      });

      if (response?.data) {
        setFileType(response.data.type.startsWith("image") ? "image" : "file");
        if (lastUrlRef.current) {
          try {
            URL.revokeObjectURL(lastUrlRef.current);
          } catch (e) {}
          lastUrlRef.current = null;
        }
        if (showLoader) {
          Swal.close();
        }
        const blobUrl = URL.createObjectURL(response.data);
        lastUrlRef.current = blobUrl;
        setCurrentImage(blobUrl);
      }
      setIsFetching(false);
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Unknown error";
      setError(message);
      setCurrentImage(null);
      if (showLoader) {
        Swal.fire({
          icon: "error",
          title: "Request failed",
          text: message,
          showConfirmButton: true,
          confirmButtonText: "OK", // optional, customize the text
        });
      }
      setIsFetching(false);
      throw new Error(message);
    }

    // finally {
    //   setIsFetching(false);
    //   if (showLoader) {
    //     Swal.close(); // close loader when done
    //   }
    // }
  };

  const cleanup = () => {
    if (lastUrlRef.current) {
      try {
        URL.revokeObjectURL(lastUrlRef.current);
      } catch (e) {}
      lastUrlRef.current = null;
    }
    setCurrentImage(null);
    setError(null);
    setIsFetching(false);
  };

  return {
    getImageHandle,
    currentImage,
    isFetching,
    error,
    cleanup,
    fileType,
  };
}
