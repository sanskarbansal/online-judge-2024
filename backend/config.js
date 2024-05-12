require("dotenv").config();

module.exports = {
    dbURL: process.env.DB_URL,
    port: 4000,
    secretKey: process.env.SECRET_KEY || "askdjfkljsdfjk",
};
