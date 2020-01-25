// API
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#adminDeleteUser-property
module.exports = async function getCognitoUsers(list) {
  if (!process.env.CI) {
    let uuid = require('uuid/v4')
    return list.map(item => ({ ...item, cognito_id: uuid() }))
  }

  let util = require('util')
  let AWS = require('aws-sdk')
  let UserPoolId = process.env.AWS_COGNITO_USER_POOL_ID
  let service = new AWS.CognitoIdentityServiceProvider({
    region: process.env.AWS_DEFAULT_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  })
  let { Users } = await util.promisify(service.listUsers.bind(service))({
    UserPoolId,
  })

  let emails = new Set(list.map(item => item.email))
  // delete extra users
  await Users.filter(
    item =>
      !item.Attributes.some(
        item => item.Name === 'email' && emails.has(item.Value)
      )
  ).map(item =>
    util.promisify(service.adminDeleteUser.bind(service))({
      UserPoolId,
      Username: item.Attributes.find(item => item.Name === 'sub').Value,
    })
  )

  return await Promise.all(
    list.map(async item => {
      let user = Users.find(uitem =>
        uitem.Attributes.some(
          aitem => aitem.Name === 'email' && aitem.Value === item.email
        )
      )

      if (!user) {
        let TemporaryPassword = 'Password2019!'
        // if there's no user, make it
        let res = await util.promisify(service.adminCreateUser.bind(service))({
          UserPoolId,
          Username: item.email,
          MessageAction: 'SUPPRESS',
          // this will put a temporary password to it
          TemporaryPassword,
          UserAttributes: [
            {
              Name: 'email',
              Value: item.email,
            },
            {
              Name: 'email_verified',
              Value: 'true',
            },
          ],
        })
        user = res.User

        console.log(
          `User ${item.email} has a temporary password "${TemporaryPassword}". Login to reset it and change it to "${item.password}"`
        )
      }

      return {
        ...item,
        cognito_id: user.Attributes.find(item => item.Name === 'sub').Value,
      }
    })
  )
}
