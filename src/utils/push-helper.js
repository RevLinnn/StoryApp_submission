const VAPID_PUBLIC_KEY = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

function encodeKey(key) {
  return btoa(String.fromCharCode(...new Uint8Array(key)));
}

export async function subscribeUserToPush(registration, token) {
  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });

    const pushData = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: encodeKey(subscription.getKey('p256dh')),
        auth: encodeKey(subscription.getKey('auth')),
      }
    };

    const response = await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pushData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Subscribe failed: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    console.log(' Berhasil subscribe push notification:', data);
  } catch (error) {
    console.error(' Gagal subscribe push notification:', error);
  }
}
