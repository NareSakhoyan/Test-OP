const jwt = require("jsonwebtoken");

const auth = (request, response, next) => {
  const authorization = request.headers.authorization;
  const token = authorization
    ? request.headers.authorization.split(" ")[1]
    : "";
    if (token) {
    jwt.verify(token, "LOLIPOP", function (err, decoded) {
      next();
    });
  } else response.status(403).send({ error: "You are not authorized" });
};

module.exports = { auth };
