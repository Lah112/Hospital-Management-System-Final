export const sendResponse = (user, message, statusCode, res) => {
  // Optional: set a cookie with role info or session ID if needed
  const cookieName = user.role === "Admin" ? "adminSession" : "patientSession";
  res
    .status(statusCode)
    .cookie(cookieName, user._id, {
      // Using user ID as cookie value (just as an example)
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      httpOnly: true,
    })
    .json({
      success: true,
      message,
      user,
    });
};
