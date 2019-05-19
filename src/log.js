const envString = () => (navigator && navigator.serviceWorker ? "main" : "sw");

export default (message, format) =>
  console.log(
    `${format != null ? "%c" : ""}${envString()} | ${message}`,
    format
  );
