import { Stack } from 'expo-router';
import Head from 'expo-router/head';
import { StatusBar } from 'expo-status-bar';
import { LanguageProvider } from '@/context/LanguageContext';
import { ProgressProvider } from '@/context/ProgressContext';

export default function RootLayout() {
  return (
    <LanguageProvider>
      <ProgressProvider>
        <Head>
          <title>Target Khatam</title>
        </Head>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="juz/[id]"
            options={{
              headerShown: false,
              presentation: 'card',
            }}
          />
          <Stack.Screen name="privacy-policy" options={{ headerShown: false }} />
          <Stack.Screen name="delete-account" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="dark" />
      </ProgressProvider>
    </LanguageProvider>
  );
}
