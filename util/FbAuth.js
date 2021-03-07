const { admin } = require('./admin')

const FbAuth = (request, response, next) => {
  const headerToken = request.headers.authorization
  if (!headerToken) {
    return response.send({ message: "No token provided" }).status(401)
  }

  if (headerToken && headerToken.split(" ")[0] !== "Bearer") {
    response.send({ message: "Invalid token" }).status(401)
  }

  admin.auth().verifySessionCookie(request.cookies.session || '', true)
  .catch(err => {
    console.error(err)
    response.redirect('/login')
  })

  const token = headerToken.split(" ")[1]
  admin
    .auth()
    .verifyIdToken(token)
    .then(() => next())
    .catch(() => response.send({ message: "Could not authorize" }).status(403))
}

module.exports = FbAuth