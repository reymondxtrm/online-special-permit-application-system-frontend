import { useState, useCallback } from "react";
import imageCompression from "browser-image-compression";
function useImageCompressor(options = {}) {
  const [compressedFiles, setCompressedFiles] = useState([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [errors, setErrors] = useState([]);
  const defaultOptions = {
    maxSizeMB: 2,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    ...options,
  };
  const compressImage = useCallback(
    async (file, index) => {
      if (!file) return;
      setIsCompressing(true);
      setErrors((prev) => {
        const newErrors = [...prev];
        newErrors[index] = null;
        return newErrors;
      });
      try {
        const compressed = await imageCompression(file, defaultOptions);
        setCompressedFiles((prev) => {
          const newFiles = [...prev];
          newFiles[index] = compressed;
          return newFiles;
        });
        return compressed;
      } catch (error) {
        console.error("Compression failed:", error);
        setErrors((prev) => {
          const newErrors = [...prev];
          newErrors[index] = error.message;
          return newErrors;
        });
        return null;
      } finally {
        setIsCompressing(false);
      }
    },
    [defaultOptions]
  );
  const handleImageChange = useCallback(
    (event, index) => {
      const file = event.target.files[0];
      return compressImage(file, index);
    },
    [compressImage]
  );
  const removeImage = useCallback((index) => {
    setCompressedFiles((prev) => {
      const newFiles = [...prev];
      newFiles[index] = null;
      return newFiles;
    });
    setErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = null;
      return newErrors;
    });
  }, []);
  const reset = useCallback(() => {
    setCompressedFiles([]);
    setErrors([]);
    setIsCompressing(false);
  }, []);
  const getValidFiles = useCallback(() => {
    return compressedFiles.filter(
      (file) => file !== null && file !== undefined
    );
  }, [compressedFiles]);
  return {
    compressedFiles,
    isCompressing,
    errors,
    handleImageChange,
    compressImage,
    removeImage,
    reset,
    getValidFiles,
  };
}
export default useImageCompressor;
