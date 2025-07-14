import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const firebaseAdminConfig = {
  credential: cert({
    projectId: 'dev-pla',
    clientEmail: "firebase-adminsdk-fbsvc@dev-pla.iam.gserviceaccount.com",
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC6UCXlbaeClxxP\nweoO7vaKr6f+mixHlsJqygtWIMBEN6bFn6s1QkXLa6l/rUbeLXqiNDfCi/DZ4WHM\nUvOqSq54OauLluYay2hZQ77h3AGE/PzF0GV1qFiqW/hGREhkJMTdb7OKvsVfPAJX\nrlAXh+07iYuhaWy976TY2sc5S1afDxkp8mOoyCkkf+xDLUMgxgrtoT5wRxPCXCeI\nbB5prIlqn4T3H/HMTRH1YcWkFIWvMPzYsvbcHqrtGLao4ApG19jyQhxq9x/lY4V4\nwGtcg5rcEEsbxsIcvJoa7vJM0SrTyRQxb1fWojE12Hq0T7wMuwmKvtBXOyXuw02I\na5HjxfMZAgMBAAECggEABsQaXDabOrbaJFtacKhk86xlYW2f5gmnjdFAkCQoV1He\nEJc31HtPpY+HXEeipzbnmTRkQgBrAr6Ymp74klqb82nEvREB0j9IztUS/YjL1VSK\nqXRj+t3eOnGUlpisOFbNf20rDALZkBfRzfVam0AocV0RYQ8/D7bAOc/YJFCEGMqX\norVOt/cTK6DQA1Im3ddzp+ubNB5VsN9yeYaAynonakmPrwPX53GU9xgCC5xvixO5\nwuEkfTn3Xbo3UFSppTal1+o6e0C7fB2ZBP57WA1M+IA/0Hxp5YacSJTTskG2Gsi1\nIJTc6cwbAGEHoFnUzpotz3PmwICpb4hRPzTnkrt4AQKBgQDxGIS9b2F/JNF15Zwm\n1ZGY8qqzwFQTIm7t9Y9y+7ERwYkYTht9heDt5dlJtfQGSIQYKgz/47gOKFhEKqNG\nh1oNGPwercyPTxpoZ/CtX3pzpdkoGx4GeialzB0T24+4gTBKAb2qfRT2MlgD10C5\n+T3mcEBx/doQmZsbTHVeLUypWQKBgQDF1KlNBnA4+2F8X+peH4ACLqwzzlTnwV0p\nHpa4O1N3Lsp88qQxqaacdWXw/+4/xrNBxEdgjrmWWQS+zdYm7zfEQj9HlTzFara0\nqncS5+JSCw8W4F2c4OrzGqPNVLUlQRWSi43OMW28d6qg4TRQxABR01Fim7N7tjSW\n9uPVGKyfwQKBgESWSQzrJr1Y6A22KFoT37u3LUC9si1PWmdvuENpvtHiUPINJlzr\nPTXwcYQ6sxUmhA2ryM7zJWVBrPqXdqOV1dRsCy1fHBaY1lZlW163Dsrfn4t9S2lk\nTqJUEuGXUKeYePhUznQ16USwxcEx90Pw1986h9rl8KdQS4PUmH8WO/zhAoGAMQWx\nrlSaGoSwc5GREiHcJq5KHcxTXdqcq0PZNW3+ENqXcr7t0SCpGLw+tqm08Djc0r9A\nsLytYIROmLmJB7zfpNKFu8dPd9wpyjszpouvmYUECDcw+18A2Z0QWiFTghfOsLHE\nQgQdnUZKEfO8cwcezSgAUt8iatWL0pz7eCLVJAECgYAUF075BDEE3DxmfR0WIv3H\ntcfevkLfR0Y3fQSVWqxftc9Ojx6EopHBjY0Kgm3s0DgV/YSevlvVU3Gt129Eeujz\nfG1iGRcuvNJjgEHL2iDnZBd5+li6DPtvLI+HoOZ8bSEZLPNr6y89YVdKK38/W0Qv\nFvrZEeVmJj6HJdzUA2DJ3A==\n-----END PRIVATE KEY-----\n".replace(/\\n/g, '\n'),
  }),
};

const app = getApps().length === 0 ? initializeApp(firebaseAdminConfig) : getApps()[0];
export const adminAuth = getAuth(app);