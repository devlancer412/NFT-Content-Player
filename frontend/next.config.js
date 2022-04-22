require("dotenv").config();

module.exports = {
  async rewrites() {
    return !process.env.NODE_ENV === "production"
      ? [
          {
            source: "/api/:slug*",
            destination: `http://localhost:5000/api/:slug*`,
          },
        ]
      : [];
  },
};
