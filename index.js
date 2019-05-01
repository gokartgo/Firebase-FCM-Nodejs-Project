const admin = require('firebase-admin')
const { google } = require('googleapis')
const axios = require('axios')
const firebaseConfig = require('./config-firebase')
const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging'
const SCOPES = [MESSAGING_SCOPE]
const databaseURL = 'https://project-iot-d2603.firebaseio.com'
const URL =
  'https://fcm.googleapis.com/v1/projects/project-iot-d2603/messages:send'
const deviceToken = ['ewyj9Kbsixo:APA91bGIllJwbfwkniIR4MP-AJumYBwiMV-Ug3Gu3Qb1y2Sw_Voa33RIkP8RCwzLnGP_NeioefcnwrvtC1E_x7XdQPnKNvIVLvfDf_mAOh-xqDzJI41OCRJLj0AtYokGn6LnuggDMv24', 'daajPRDp5gQ:APA91bFBXdlDgqzw1BBczTp9nEyvSqW8lqWSAmgKWcLZE1YbW7B_ciGSn8pV-fI5sWkUdWag0pdRWZYCRuss2Z1cxnk8IHA3PQ6VowtoO1TPXZpoPG6AdIDzK6v4_rzS6QMumigwBapa']
/* โหลด Express มาใช้งาน */
var app = require('express')();

/* ใช้ port 7777 หรือจะส่งเข้ามาตอนรัน app ก็ได้ */
var port = process.env.PORT || 7777;

console.log('firebase config', firebaseConfig.private_key)

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: firebaseConfig.project_id,
    clientEmail: firebaseConfig.client_email,
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDnv0Q6kEolWxLi\nZGiEcRxOmaAb5JFQabC33vjBDZCghoTq7pRQtKqbvOitQbB3vi1KqvD82jgIAjvz\nEluNGAH4Qh4ASZjt++lLcXqO4MqDG0FuQdf1ccj9ZcnDajJkaHEAN10OgCcmw1/f\nGWiWstEFYQZcYUMnjoGlctDCvuwXzLP7US7axdY8PbJsWK9nhHakHUThgIjDdG7C\nxaJ/tODOfGFqC/o6Wo9T/AfQCA+CFxSDlFj8FAdGPx9A4INlQDq+hCmDfdknhT4d\nImubte3faUe/eundLTpuQT6xp+rMsQzwg1IYswnSDtDvcmgy5pzH5sxDFS1TAXTm\nCqwzLZyzAgMBAAECggEAbOAliFQAmaM7cIQWvF49m8m9+Ey+XmaBISlOebhLQbdh\nG9SBdpcibi9mqvspEmCU+7bqqAhHea+/BXgS7eshBcbePGlXQTtwA8Mo/pYqXkUA\nTPH/KS9Pa4kWLMooKZcNu7nG7MiVXDc+w9w2kFIrNBk8uUryl1Nyok2aOVwkJBth\nblitgKpazFPAM2NnMEbzX10OAUhWwEVsVS9HPAwE+cUNl53sKS4pQNS5AcHQjrf3\nLDTLILrCb8A+2P0pxmgm3Xx2Z7AYcjQmoULGNIzNUQQ+Ojqk/MBZQhKd2KM4o34P\nbzUIY1aAdaMeExdCAc05tb1YIsLUOiB0LnZWz6O4pQKBgQD3+3kuXpYiPDUDbR7T\neYFk19C/yrsf86DI3RvhDG5FT4gX6OQgMqJX4Tfb4KmXKKdlYdNyKCiSvUr9zFSI\nb5yXjPBfHOq+WDUK7LF9qi/qEQMb13fwj4f84VPkJs61WeF+eUbV15cxKQDtcuBX\nW3uJaOrh3m4s544UTzJ4K+7DFwKBgQDvPWqCWueMzL/hoqr6QFU6bbJmGRE2b/eY\nUqDPVkXL6tOdyZRGYDd5npej8E9fWwpwZsj+OpWRqBCoMK3uM0ePaHmyR2ycjSIO\nRPIO9j3u57D++7BiRmemiNMyZdLGc7UDVAyq8hN0WlG5nOlK6eypXHS7FjnVAX0p\nMtZYyXfkxQKBgH2W/4VrY+/MvDCTCCSkCdMvtcoce26wLULtMFxmtkYmBE/PpBFm\nc2+8YVTbUCh872JaDANpsTq34Y3t+PXsSMs8FtSkyYJDHAH/Y9i343JQ0Vk9Y8IS\nfxWkbJ9ExDV2Ysxx0V0lxa2hDZY0MsgrTcKGv0ZLJ1NYpk1E2tOftFlbAoGACMtA\nJASFaGaKUxfwovxEZb5shVY8jLy25DF9WcG5FRLProgfXCrjPyQ2PL9zm3S0QId2\nsemjX9RGsHgBnLTj14CmoIgBlQuXCeE86JHimuqHVggYZrRh0PxMjxixE7xjFfk7\n8fiuAGPlhyYeaTOKEHumis35WDwSxrXorSDSuGUCgYEAlecCZBT1F/yrv+OvIAUc\n1n+ueKI2+9PiXgo2BF28ETMcik0gNeHtCEAEo5MH51MJwMDbc/AWcHY8QrsYGgXg\nvuelDnZdpOKAzDa6eOANeE/w9giFe/UpCV1gGykHFeekaSbEe644BZ/Bm0rUis0P\nI8JcqnZbnzGPqplOb0p9AjY=\n-----END PRIVATE KEY-----\n"
  }),
  databaseURL: databaseURL
})

function getAccessToken() {
  return new Promise(function (resolve, reject) {
    var client_email = firebaseConfig.client_email
    var private_key = firebaseConfig.private_key
    var jwtClient = new google.auth.JWT(
      client_email,
      null,
      "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDnv0Q6kEolWxLi\nZGiEcRxOmaAb5JFQabC33vjBDZCghoTq7pRQtKqbvOitQbB3vi1KqvD82jgIAjvz\nEluNGAH4Qh4ASZjt++lLcXqO4MqDG0FuQdf1ccj9ZcnDajJkaHEAN10OgCcmw1/f\nGWiWstEFYQZcYUMnjoGlctDCvuwXzLP7US7axdY8PbJsWK9nhHakHUThgIjDdG7C\nxaJ/tODOfGFqC/o6Wo9T/AfQCA+CFxSDlFj8FAdGPx9A4INlQDq+hCmDfdknhT4d\nImubte3faUe/eundLTpuQT6xp+rMsQzwg1IYswnSDtDvcmgy5pzH5sxDFS1TAXTm\nCqwzLZyzAgMBAAECggEAbOAliFQAmaM7cIQWvF49m8m9+Ey+XmaBISlOebhLQbdh\nG9SBdpcibi9mqvspEmCU+7bqqAhHea+/BXgS7eshBcbePGlXQTtwA8Mo/pYqXkUA\nTPH/KS9Pa4kWLMooKZcNu7nG7MiVXDc+w9w2kFIrNBk8uUryl1Nyok2aOVwkJBth\nblitgKpazFPAM2NnMEbzX10OAUhWwEVsVS9HPAwE+cUNl53sKS4pQNS5AcHQjrf3\nLDTLILrCb8A+2P0pxmgm3Xx2Z7AYcjQmoULGNIzNUQQ+Ojqk/MBZQhKd2KM4o34P\nbzUIY1aAdaMeExdCAc05tb1YIsLUOiB0LnZWz6O4pQKBgQD3+3kuXpYiPDUDbR7T\neYFk19C/yrsf86DI3RvhDG5FT4gX6OQgMqJX4Tfb4KmXKKdlYdNyKCiSvUr9zFSI\nb5yXjPBfHOq+WDUK7LF9qi/qEQMb13fwj4f84VPkJs61WeF+eUbV15cxKQDtcuBX\nW3uJaOrh3m4s544UTzJ4K+7DFwKBgQDvPWqCWueMzL/hoqr6QFU6bbJmGRE2b/eY\nUqDPVkXL6tOdyZRGYDd5npej8E9fWwpwZsj+OpWRqBCoMK3uM0ePaHmyR2ycjSIO\nRPIO9j3u57D++7BiRmemiNMyZdLGc7UDVAyq8hN0WlG5nOlK6eypXHS7FjnVAX0p\nMtZYyXfkxQKBgH2W/4VrY+/MvDCTCCSkCdMvtcoce26wLULtMFxmtkYmBE/PpBFm\nc2+8YVTbUCh872JaDANpsTq34Y3t+PXsSMs8FtSkyYJDHAH/Y9i343JQ0Vk9Y8IS\nfxWkbJ9ExDV2Ysxx0V0lxa2hDZY0MsgrTcKGv0ZLJ1NYpk1E2tOftFlbAoGACMtA\nJASFaGaKUxfwovxEZb5shVY8jLy25DF9WcG5FRLProgfXCrjPyQ2PL9zm3S0QId2\nsemjX9RGsHgBnLTj14CmoIgBlQuXCeE86JHimuqHVggYZrRh0PxMjxixE7xjFfk7\n8fiuAGPlhyYeaTOKEHumis35WDwSxrXorSDSuGUCgYEAlecCZBT1F/yrv+OvIAUc\n1n+ueKI2+9PiXgo2BF28ETMcik0gNeHtCEAEo5MH51MJwMDbc/AWcHY8QrsYGgXg\nvuelDnZdpOKAzDa6eOANeE/w9giFe/UpCV1gGykHFeekaSbEe644BZ/Bm0rUis0P\nI8JcqnZbnzGPqplOb0p9AjY=\n-----END PRIVATE KEY-----\n",
      SCOPES,
      null
    )
    jwtClient.authorize(function (err, tokens) {
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
ref.on("value", (snapshot) => {
  Object.keys(snapshot.val()).every((data) => {
    if (snapshot.val()[data].amount == 0) {
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
