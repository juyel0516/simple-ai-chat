export function initializeSession() {
  console.log("Session initializing...");
  const time = Date.now()
  sessionStorage.setItem("time", time);
  sessionStorage.setItem("queryId", time);
}

// Session ID is a string of number.
export function attachSession(sessionId) {
  const verifyResult = verifySessionId(sessionId);

  if (!verifyResult.success) {
    return verifyResult.message;
  }

  sessionStorage.setItem("time", sessionId);
  sessionStorage.setItem("queryId", sessionId);
  return "Attached. To navigate between session histories: use `J` or `→` to navigate to the next, and use `K` or ←` to navigate to the previous.";
}

function containsOnlyNumbers(str) {
  return /^\d+$/.test(str);
}

export function verifySessionId(queryId) {
  if (!queryId) {
    return {
      success: false,
      message: "Session ID (`query_id`) is required." 
    };
  }

  if (!containsOnlyNumbers(queryId)) {
    return {
      success: false,
      message: "Session ID must be a number." 
    };
  }

  if (queryId.length != 13 || queryId <= 1669766400000 || queryId >= 2016921600000) {
    return {
      success: false,
      message: "Time traveler detected."
    };
  }

  return {
    success: true,
    message: "Session ID is valid."
  };
}
