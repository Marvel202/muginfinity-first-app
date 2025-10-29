'use server';

import { createClient } from '@/src/supabase/server';

async function sendPushNotification({
  expoPushToken,
  title,
  body,
}: {
  expoPushToken: string;
  title: string;
  body: string;
}) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title,
    body,
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

export const getUserNotificationToken = async (userId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('users')
    .select('expo_notification_token')
    .eq('id', userId)
    .single();

  if (error) {
    console.warn('Could not fetch notification token:', error.message);
    return null;
  }

  return data;
};

export const sendNotification = async (userId: string, status: string) => {
  try {
    console.log('🔔 Attempting to send notification to user:', userId, 'Status:', status);
    const tokenData = await getUserNotificationToken(userId);

    if (!tokenData?.expo_notification_token) {
      console.log('❌ No notification token found for user:', userId);
      console.log('👉 The mobile app needs to save the Expo push token to the database');
      return;
    }

    console.log('✅ Found push token, sending notification...');
    await sendPushNotification({
      expoPushToken: tokenData.expo_notification_token,
      title: 'Your Order Status',
      body: `Your order is now ${status}`,
    });
    console.log('✅ Notification sent successfully');
  } catch (error) {
    console.error('❌ Error sending notification:', error);
    // Don't throw error - notifications are optional
  }
};