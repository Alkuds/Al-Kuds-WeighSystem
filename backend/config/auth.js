const jwt = require('jsonwebtoken')
const UserV2 = require('../models/user')

const requireAuth = async (req, res, next) => {
  // verify user is authenticated
  const { authorization } = req.headers
  console.log(authorization)
  if (!authorization) {
    return res.status(401).json({error: 'Authorization token required'})
  }

  const token = authorization.split(' ')[1]

  try {
    const { _id } = jwt.verify(token, process.env.SECRET)
    req.user = await UserV2.findOne({ _id })
    next()

  } catch (error) {
    console.log(error)
    console.log(token)
    res.status(401).json({'error': error})
  }
}

module.exports = requireAuth