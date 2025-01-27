export function verifiyEmailAddress(email) {
  // Check if the email is valid.
  if (!email.includes('@')) {
    return false;
  }
  const emailParts = email.split('@');
  if (emailParts.length !== 2 || emailParts[0].length === 0 || emailParts[1].length === 0) {
    return false;
  }
  return true;
}

export async function evalEmailAddress(email) {
  if (!process.env.HUNTER_API_KEY) {
    console.error("Hunter API key not found.");
    return {
      success: true,
    };
  }

  // Use hunter.io API to check if the email is valid.
  try {
    const response = await fetch("https://api.hunter.io/v2/email-verifier?email=" + email + "&api_key=" + process.env.HUNTER_API_KEY);
    const data = await response.json();
    if (response.status !== 200) {
      // Hunter api will not return `error`, instead it using `errors`.
      throw data.errors || new Error(`Request failed with status ${response.status}`);
    }

    if (data.data.result !== "deliverable" || data.data.score < 80) {
      return {
        success: false,
        error: "The email address provided does not meet our verification standards. Please use a different email address to proceed with the registration.",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Email evaluation not working:", error);
    if (error) {
      return {
        success: false,
        error: error[0].details,
      };
    } else {
      return {
        success: true,
        error: "Email evaluation not working.",
      };
    }
  }
}
