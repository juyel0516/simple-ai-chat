export function isMobileDevice() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // Patterns to check for in user agent string
  const mobileRegexPatterns = [
      /Android/i,
      /webOS/i,
      /iPhone/i,
      /iPad/i,
      /iPod/i,
      /BlackBerry/i,
      /Windows Phone/i
  ];

  // Check if any of the patterns match the user agent string
  return mobileRegexPatterns.some((pattern) => pattern.test(userAgent));
}

export function isScreenSmallerThan(width) {
  return window.innerWidth < width;
}
