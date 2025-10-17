// Bu fonksiyon Auth0 kimliğini alıp, ona özel bir Firebase anahtarı üretir.
const admin = require('firebase-admin');

// Firebase yönetici anahtarını güvenli ortam değişkeninden alıyoruz.
// Bu bilgi asla herkese açık kodda yer almaz.
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// Firebase Admin SDK'sını daha önce başlatılmadıysa başlat
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { auth0_user_id } = JSON.parse(event.body);
    if (!auth0_user_id) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Auth0 user ID is required.' }) };
    }

    // Auth0 ID'sini kullanarak özel bir Firebase anahtarı (custom token) oluştur
    const firebaseToken = await admin.auth().createCustomToken(auth0_user_id);

    return {
      statusCode: 200,
      body: JSON.stringify({ firebaseToken: firebaseToken }),
    };
  } catch (error) {
    console.error('Error creating Firebase custom token:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create custom token.' }),
    };
  }
};
