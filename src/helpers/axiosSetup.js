import axios from "axios";

const NETWORK_ERROR_MESSAGE =
  "Unable to reach the server. Please check your internet connection and try again.";

const STATUS_MESSAGES = {
  400: "The request could not be processed. Please check your input and try again.",
  401: "Your session has expired. Please log in again.",
  403: "You are not allowed to perform this action.",
  404: "The requested record was not found.",
  405: "This action is not allowed.",
  408: "The request timed out. Please try again.",
  413: "The uploaded files are too large. Please upload smaller files and try again.",
  419: "Your session has expired. Please refresh the page and try again.",
  422: "Some of the information you entered is invalid. Please check the form and try again.",
  429: "Too many attempts. Please wait a minute and try again.",
  500: "Something went wrong while processing your request. Please try again.",
  502: "The server is temporarily unavailable. Please try again later.",
  503: "The system is under maintenance. Please try again later.",
  504: "The server took too long to respond. Please try again.",
};

const isHtml = (text) => /^\s*</.test(text);

// Turns string | string[] | { field: string[] } into one readable line per message
const flattenMessages = (value) => {
  if (!value) return [];
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(flattenMessages);
  if (typeof value === "object") return Object.values(value).flatMap(flattenMessages);
  return [String(value)];
};

// Message sent by the server itself, or null when there is none worth showing
const extractServerMessage = (response) => {
  const data = response.data;
  let messages = [];

  if (typeof data === "string") {
    // IIS / proxy error pages come back as HTML: don't show markup to the user
    if (data.trim() && !isHtml(data)) messages = [data.trim()];
  } else if (data && typeof data === "object") {
    if (response.status === 422 && data.errors) {
      messages = flattenMessages(data.errors);
    }
    if (!messages.length) messages = flattenMessages(data.message);
    if (!messages.length) messages = flattenMessages(data.error);
  }

  messages = [...new Set(messages.filter((m) => m && m.trim()))];
  return messages.length ? messages.join("\n") : null;
};

const defaultMessage = (error) => {
  const status = error.response?.status;
  if (!status) {
    return error.code === "ECONNABORTED"
      ? STATUS_MESSAGES[408]
      : NETWORK_ERROR_MESSAGE;
  }
  return STATUS_MESSAGES[status] || STATUS_MESSAGES[500];
};

/**
 * Readable message for any axios error (or plain Error).
 * Handles Laravel validation errors, { message } / { error } bodies,
 * IIS HTML error pages, and requests that never got a response (CORS/network).
 * `fallback` (a screen-specific message) is used when the server sent no
 * message of its own; connection failures always get the connection message.
 */
export const getErrorMessage = (error, fallback) => {
  if (!error) return fallback || STATUS_MESSAGES[500];
  if (axios.isCancel(error)) return "The request was cancelled.";

  const response = error.response;
  if (!response || !response.status) return defaultMessage(error);

  // Already normalized by the interceptor: response.data was rewritten
  if (error.isNormalized) {
    return error.serverMessage || fallback || response.data.message;
  }

  return extractServerMessage(response) || fallback || defaultMessage(error);
};

const readBlobText = (blob) =>
  typeof blob.text === "function"
    ? blob.text()
    : new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsText(blob);
      });

// JSON error bodies of blob downloads arrive as a Blob; read them back as JSON
const parseBlobBody = async (response) => {
  const data = response?.data;
  if (typeof Blob === "undefined" || !(data instanceof Blob)) return;
  try {
    const text = await readBlobText(data);
    response.data = JSON.parse(text);
  } catch (e) {
    response.data = {};
  }
};

/**
 * Guarantees every rejected request has error.response.status and a readable
 * string in error.response.data.message (and error.message), so existing
 * `error.response.data.message` / thunk `payload.message` code never crashes
 * and always has something to show. Requests that never got a response
 * (CORS, network down, server unreachable) get status 0.
 */
const normalizeError = async (error) => {
  if (axios.isCancel(error)) return error;

  if (error.response) await parseBlobBody(error.response);

  const serverMessage =
    error.response && error.response.status
      ? extractServerMessage(error.response)
      : null;
  const message = serverMessage || defaultMessage(error);

  if (!error.response) {
    error.response = {
      status: 0,
      statusText: "Network Error",
      headers: {},
      config: error.config,
      data: { message },
    };
  } else {
    const data = error.response.data;
    error.response.data =
      data && typeof data === "object" && !Array.isArray(data)
        ? { ...data, message }
        : { message };
  }

  error.message = message;
  error.serverMessage = serverMessage;
  error.isNormalized = true;
  return error;
};

let unauthorizedHandler = null;

// Lets App (which has the router history) decide what happens on 401
export const setUnauthorizedHandler = (handler) => {
  unauthorizedHandler = handler;
};

let isConfigured = false;

export const setupAxios = () => {
  if (isConfigured) return;
  isConfigured = true;

  axios.defaults.baseURL =
    window.location.protocol + "//" + process.env.REACT_APP_API;
  // Every request (GET too) must ask for JSON, otherwise Laravel answers
  // auth/validation failures with a redirect instead of a JSON error.
  axios.defaults.headers.common["Accept"] = "application/json";
  axios.defaults.headers.post["Content-Type"] = "application/json";
  axios.defaults.withCredentials = true;
  axios.defaults.withXSRFToken = true;

  axios.interceptors.request.use(function (config) {
    const token = localStorage.getItem("authToken");
    config.headers.Authorization = token ? `Bearer ${token}` : "";
    return config;
  });

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const normalized = await normalizeError(error);
      const status = normalized.response?.status;

      if (status === 401 && unauthorizedHandler) {
        unauthorizedHandler(normalized);
      } else if (status === 503) {
        console.log(status);
      }

      return Promise.reject(normalized);
    },
  );
};

setupAxios();
