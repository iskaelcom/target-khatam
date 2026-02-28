import { GOOGLE_WEB_CLIENT_ID } from '@/constants/google';
import { AppColors } from '@/constants/Colors';
import { useLanguage } from '@/context/LanguageContext';
import { useProgress } from '@/context/ProgressContext';
import { checkBackupStatus, clearToken, exchangeCodeForTokens, getValidToken, getUserEmail, performBackup, performRestore } from '@/services/googleDrive';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

// Platform-specific imports
let GoogleSignin: any = null;
let statusCodes: any = null;
if (Platform.OS !== 'web') {
    const gsi = require('@react-native-google-signin/google-signin');
    GoogleSignin = gsi.GoogleSignin;
    statusCodes = gsi.statusCodes;
}

// Web-only imports
let makeRedirectUri: any = null;
let useAuthRequest: any = null;
let ResponseType: any = null;
let WebBrowser: any = null;
if (Platform.OS === 'web') {
    const authSession = require('expo-auth-session');
    makeRedirectUri = authSession.makeRedirectUri;
    useAuthRequest = authSession.useAuthRequest;
    ResponseType = authSession.ResponseType;
    WebBrowser = require('expo-web-browser');
    WebBrowser.maybeCompleteAuthSession();
}

const discovery = {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
};

function showAlert(msg: string) {
    if (Platform.OS === 'web') {
        window.alert(msg);
    } else {
        Alert.alert('', msg);
    }
}

// Configure native Google Sign-In
if (GoogleSignin) {
    GoogleSignin.configure({
        webClientId: GOOGLE_WEB_CLIENT_ID,
        scopes: ['https://www.googleapis.com/auth/drive.appdata'],
        offlineAccess: true,
    });
}

export default function CloudBackupSection() {
    const { t } = useLanguage();
    const { reloadData } = useProgress();

    const [isSignedIn, setIsSignedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingText, setLoadingText] = useState('');
    const [lastBackupDate, setLastBackupDate] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);

    // Check for saved token on mount
    useEffect(() => {
        (async () => {
            const token = await getValidToken();
            if (token) {
                try {
                    const email = await getUserEmail(token);
                    setUserEmail(email);
                    setIsSignedIn(true);
                    const status = await checkBackupStatus(token);
                    if (status.exists && status.lastModified) {
                        setLastBackupDate(status.lastModified);
                    }
                } catch {
                    await clearToken();
                }
            }
        })();
    }, []);

    // --- Sign In Handler ---
    const handleSignIn = useCallback(async () => {
        if (Platform.OS !== 'web' && GoogleSignin) {
            // Native Google Sign-In for Android/iOS
            try {
                await GoogleSignin.hasPlayServices();
                const response = await GoogleSignin.signIn();

                if (response.type === 'cancelled') return;

                const serverAuthCode = response.data?.serverAuthCode;
                if (!serverAuthCode) {
                    showAlert('Sign in failed: no auth code received');
                    return;
                }

                // Exchange serverAuthCode for access + refresh tokens
                const tokenData = await exchangeCodeForTokens(serverAuthCode);
                const email = await getUserEmail(tokenData.accessToken);
                setUserEmail(email);
                setIsSignedIn(true);
                const status = await checkBackupStatus(tokenData.accessToken);
                if (status.exists && status.lastModified) {
                    setLastBackupDate(status.lastModified);
                }
            } catch (e: any) {
                if (e.code === statusCodes?.SIGN_IN_CANCELLED) return;
                if (e.code === statusCodes?.IN_PROGRESS) return;
                console.error('[Google Auth] Native sign-in failed:', e);
                showAlert(`Sign in failed: ${e.message}`);
            }
        }
        // Web sign-in is handled via promptAsync() directly on the button
    }, []);

    const handleSignOut = useCallback(async () => {
        await clearToken();
        if (Platform.OS !== 'web' && GoogleSignin) {
            try {
                await GoogleSignin.signOut();
            } catch { /* ignore */ }
        }
        setIsSignedIn(false);
        setUserEmail(null);
        setLastBackupDate(null);
    }, []);

    const handleBackup = useCallback(async () => {
        setIsLoading(true);
        setLoadingText(t.backup.backingUp);
        try {
            const token = await getValidToken();
            if (!token) throw new Error('TOKEN_EXPIRED');
            await performBackup(token);
            setLastBackupDate(new Date().toISOString());
            showAlert(t.backup.backupSuccess);
        } catch (e: any) {
            if (e.message === 'TOKEN_EXPIRED') {
                await handleSignOut();
            }
            showAlert(t.backup.backupFailed);
        } finally {
            setIsLoading(false);
            setLoadingText('');
        }
    }, [t, handleSignOut]);

    const doRestore = useCallback(async () => {
        setIsLoading(true);
        setLoadingText(t.backup.restoring);
        try {
            const token = await getValidToken();
            if (!token) throw new Error('TOKEN_EXPIRED');
            await performRestore(token);
            await reloadData();
            showAlert(t.backup.restoreSuccess);
        } catch (e: any) {
            if (e.message === 'TOKEN_EXPIRED') {
                await handleSignOut();
            }
            const msg = e.message === 'NO_BACKUP' ? t.backup.noBackup : t.backup.restoreFailed;
            showAlert(msg);
        } finally {
            setIsLoading(false);
            setLoadingText('');
        }
    }, [t, reloadData, handleSignOut]);

    const handleRestore = useCallback(() => {
        if (Platform.OS === 'web') {
            if (window.confirm(t.backup.restoreConfirm)) {
                doRestore();
            }
        } else {
            Alert.alert('', t.backup.restoreConfirm, [
                { text: t.common.cancel, style: 'cancel' },
                { text: t.common.confirm, onPress: doRestore },
            ]);
        }
    }, [t, doRestore]);

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        const day = date.getDate();
        const month = date.toLocaleDateString('id-ID', { month: 'short' });
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day} ${month} ${year}, ${hours}:${minutes}`;
    };

    return (
        <View style={styles.section}>
            <View style={styles.headerRow}>
                <MaterialCommunityIcons name="cloud-outline" size={22} color={AppColors.primary} />
                <Text style={styles.sectionTitle}>{t.backup.title}</Text>
            </View>

            {!isSignedIn ? (
                Platform.OS === 'web' ? (
                    <WebSignInButton t={t} />
                ) : (
                    <Pressable
                        style={styles.googleButton}
                        onPress={handleSignIn}
                    >
                        <MaterialCommunityIcons name="google" size={20} color="#4285F4" />
                        <Text style={styles.googleButtonText}>{t.backup.signIn}</Text>
                    </Pressable>
                )
            ) : (
                <View style={styles.content}>
                    <View style={styles.accountRow}>
                        <Text style={styles.accountText} numberOfLines={1}>
                            {t.backup.connectedAs}: {userEmail}
                        </Text>
                        <Pressable onPress={handleSignOut}>
                            <Text style={styles.signOutText}>{t.backup.signOut}</Text>
                        </Pressable>
                    </View>

                    <View style={styles.statusRow}>
                        <MaterialCommunityIcons
                            name={lastBackupDate ? 'cloud-check-outline' : 'cloud-off-outline'}
                            size={16}
                            color={AppColors.textSecondary}
                        />
                        <Text style={styles.statusText}>
                            {lastBackupDate
                                ? `${t.backup.lastBackup}: ${formatDate(lastBackupDate)}`
                                : t.backup.noBackup}
                        </Text>
                    </View>

                    <View style={styles.buttonRow}>
                        <Pressable
                            style={[styles.actionButton, styles.backupButton]}
                            onPress={handleBackup}
                            disabled={isLoading}
                        >
                            <MaterialCommunityIcons name="cloud-upload-outline" size={18} color={AppColors.white} />
                            <Text style={styles.backupButtonText}>{t.backup.backupNow}</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.actionButton, styles.restoreButton]}
                            onPress={handleRestore}
                            disabled={isLoading}
                        >
                            <MaterialCommunityIcons name="cloud-download-outline" size={18} color={AppColors.primary} />
                            <Text style={styles.restoreButtonText}>{t.backup.restore}</Text>
                        </Pressable>
                    </View>
                </View>
            )}

            {isLoading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="small" color={AppColors.primary} />
                    <Text style={styles.loadingText}>{loadingText}</Text>
                </View>
            )}
        </View>
    );
}

// Web-only sign-in component using expo-auth-session hooks
function WebSignInButton({ t }: { t: any }) {
    const redirectUri = makeRedirectUri();

    const [request, response, promptAsync] = useAuthRequest(
        {
            clientId: GOOGLE_WEB_CLIENT_ID,
            scopes: ['https://www.googleapis.com/auth/drive.appdata', 'email'],
            responseType: ResponseType.Code,
            redirectUri,
            usePKCE: true,
            extraParams: {
                access_type: 'offline',
                prompt: 'consent',
            },
        },
        discovery
    );

    useEffect(() => {
        console.log('[Google Auth] Redirect URI:', redirectUri);
    }, [redirectUri]);

    useEffect(() => {
        if (!response) return;
        if (response.type === 'error') {
            showAlert(`Auth error: ${response.error?.message || 'Unknown error'}`);
            return;
        }
        if (response.type === 'success' && response.params?.code) {
            const code = response.params.code;
            (async () => {
                try {
                    await exchangeCodeForTokens(code, redirectUri, request?.codeVerifier);
                    // Reload the parent by triggering a re-mount
                    window.location.reload();
                } catch (e: any) {
                    showAlert(`Sign in failed: ${e.message}`);
                    await clearToken();
                }
            })();
        }
    }, [response, request, redirectUri]);

    return (
        <Pressable
            style={styles.googleButton}
            onPress={() => promptAsync()}
            disabled={!request}
        >
            <MaterialCommunityIcons name="google" size={20} color="#4285F4" />
            <Text style={styles.googleButtonText}>{t.backup.signIn}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    section: {
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: AppColors.textPrimary,
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: AppColors.card,
        borderRadius: 8,
        paddingVertical: 14,
        borderWidth: 1,
        borderColor: AppColors.cardBorder,
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)',
        elevation: 2,
    },
    googleButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: AppColors.textPrimary,
    },
    content: {
        gap: 12,
    },
    accountRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    accountText: {
        fontSize: 13,
        color: AppColors.textSecondary,
        flex: 1,
        marginRight: 8,
    },
    signOutText: {
        fontSize: 13,
        fontWeight: '600',
        color: AppColors.danger,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statusText: {
        fontSize: 13,
        color: AppColors.textSecondary,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 4,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 12,
        borderRadius: 8,
    },
    backupButton: {
        backgroundColor: AppColors.primary,
    },
    backupButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: AppColors.white,
    },
    restoreButton: {
        backgroundColor: AppColors.card,
        borderWidth: 1,
        borderColor: AppColors.primary,
    },
    restoreButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: AppColors.primary,
    },
    loadingOverlay: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 12,
        paddingVertical: 8,
        backgroundColor: AppColors.background,
        borderRadius: 8,
    },
    loadingText: {
        fontSize: 13,
        color: AppColors.textSecondary,
    },
});
