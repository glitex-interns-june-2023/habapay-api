const verifyGoogleToken = async (token) => {
    const { OAuth2Client } = require("google-auth-library");
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
  
      const payload = ticket.getPayload();
      return payload;
    } catch (err) {
      return null;
    }
  };


  module.exports = {
    verifyGoogleToken,
  }