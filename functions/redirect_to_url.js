export default async function redirectToUrl(paramObject) {
  const url = paramObject.url;
  const blank = paramObject.blank;
  if (!url) {
    return {
      success: false,
      error: "Please provide a URL."
    }
  }

  if (!url.startsWith("http")) {
    return {
      success: false,
      error: "Please provide a URL starts with `http`."
    }
  }
  return {
    success: true,
    message: "Redirected to " + url + " successfully." + " Please don't need to redirect again.",  // It's actually redirecting but AI required to be told it is redirected
    event: { name: "redirect", parameters: { url, blank }, },
  };
}
