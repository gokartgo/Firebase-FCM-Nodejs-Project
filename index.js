const admin = require('firebase-admin')
const { google } = require('googleapis')
const axios = require('axios')

const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging'
const SCOPES = [MESSAGING_SCOPE]

const serviceAccount = require('./project-iot-d2603-firebase-adminsdk-fr8hn-89dc277f59.json')
const databaseURL = 'https://project-iot-d2603.firebaseio.com'
const URL =
  'https://fcm.googleapis.com/v1/projects/project-iot-d2603/messages:send'
  const deviceToken = ['ewyj9Kbsixo:APA91bGIllJwbfwkniIR4MP-AJumYBwiMV-Ug3Gu3Qb1y2Sw_Voa33RIkP8RCwzLnGP_NeioefcnwrvtC1E_x7XdQPnKNvIVLvfDf_mAOh-xqDzJI41OCRJLj0AtYokGn6LnuggDMv24','daajPRDp5gQ:APA91bFBXdlDgqzw1BBczTp9nEyvSqW8lqWSAmgKWcLZE1YbW7B_ciGSn8pV-fI5sWkUdWag0pdRWZYCRuss2Z1cxnk8IHA3PQ6VowtoO1TPXZpoPG6AdIDzK6v4_rzS6QMumigwBapa']
/* โหลด Express มาใช้งาน */
var app = require('express')();
 
/* ใช้ port 7777 หรือจะส่งเข้ามาตอนรัน app ก็ได้ */
var port = process.env.PORT || 7777;
  
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL
})

function getAccessToken() {
  return new Promise(function(resolve, reject) {
    var key = serviceAccount
    var jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES,
      null
    )
    jwtClient.authorize(function(err, tokens) {
      if (err) {
        reject(err)
        return
      }
      resolve(tokens.access_token)
    })
  })
}

function manageBody(token) {
  const body = {
    message: {
      token,
      data: { key: 'value' },
      notification: {
        title: 'Product In Shelve Empty',
        body: 'Add Product To Shelve'
      },
      android: {
        notification: {
            icon: 'shelve',
            sound: 'default'
        },
      },
      webpush: {
        headers: {
          Urgency: 'high'
        },
        notification: {
          requireInteraction: 'true'
        }
      },
    }
  }
  return body
}

async function init() {
  

  try {
    const accessToken = await getAccessToken()
    console.log('accessToken: ', accessToken)
    await deviceToken.forEach((data) => {
      axios.post(URL, JSON.stringify(manageBody(data)), {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      })
    })
  } catch (err) {
    console.log('err: ', err.message)
  }
}

var db = admin.database()
var ref = db.ref("product")
ref.on("value",(snapshot) => {
    Object.keys(snapshot.val()).every((data) => {
        if(snapshot.val()[data].amount == 0){
            init()
            return false
        }
        return true
    })
})

app.get('/', (req, res) => {
  res.json({
    server: 'is running'
  })
})

app.listen(port, () => {
  console.log(`Server is listening on ${port}`)
})
