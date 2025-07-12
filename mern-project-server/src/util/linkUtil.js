// Example UserAgent:
// Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0
// Mozilla/5.0 (Linux; Android 14; SM-S928W) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.230 Mobile Safari/537.36
const getDeviceInfo = (userAgent) => {
  const isMobile = /mobile/i.test(userAgent);
  const isTablet = /tablet/i.test(userAgent);

  // Check for iPad specifically first
  const isIPad = /iPad/i.test(userAgent);

  // Improved browser detection - check for Edge first since it contains "Chrome" in UA
  let browser = "unknown";

  if (userAgent.includes("Edg/")) {
    browser = "Edge";
  } else if (userAgent.includes("Brave/")) {
    browser = "Brave";
  } else if (userAgent.includes("Firefox/")) {
    browser = "Firefox";
  } else if (userAgent.includes("Safari/") && !userAgent.includes("Chrome/")) {
    browser = "Safari";
  } else if (userAgent.includes("Chrome/")) {
    browser = "Chrome";
  } else if (userAgent.includes("Opera/") || userAgent.includes("OPR/")) {
    browser = "Opera";
  } else if (userAgent.includes("MSIE") || userAgent.includes("Trident/")) {
    browser = "Internet Explorer";
  }

  // Determine device type
  let deviceType = "desktop";
  if (isIPad) {
    deviceType = "tablet";
  } else if (isTablet) {
    deviceType = "tablet";
  } else if (userAgent.includes("Android") && !userAgent.includes("Mobile")) {
    deviceType = "tablet";
  } else if (isMobile) {
    deviceType = "mobile";
  }

  return {
    isMobile,
    browser,
    deviceType,
  };
};
module.exports = { getDeviceInfo };
