import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Theme Constants
const theme = {
  bgDark: '#0a0a0c',
  bgCard: '#151518',
  textPrimary: '#f5f5f7',
  textSecondary: '#a1a1aa',
  accentGold: '#d4af37',
  accentGreen: '#10b981',
  glassBorder: 'rgba(255, 255, 255, 0.08)',
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  if (isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.logo}>GOA</Text>
            <TouchableOpacity onPress={() => setIsAuthenticated(false)}>
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.card, styles.profileCard]}>
            <View style={styles.profileTop}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>JD</Text>
              </View>
              <View>
                <Text style={styles.profileName}>John Doe</Text>
                <Text style={styles.profileId}>GOA ID: GOA-8924</Text>
              </View>
            </View>

            <View style={styles.profileStats}>
              <View>
                <Text style={styles.statLabel}>Status</Text>
                <Text style={styles.statValue}>Member</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.statLabel}>Stored Bottles</Text>
                <Text style={[styles.statValue, { color: theme.accentGold }]}>2</Text>
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Upcoming Reservations</Text>
          
          <View style={styles.card}>
            <View style={styles.reservationHeader}>
              <View>
                <Text style={styles.reservationTitle}>Main Room • Table V1</Text>
                <Text style={styles.reservationDate}>Friday, Oct 24 • 11:00 PM</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Confirmed</Text>
              </View>
            </View>
            
            <View style={{ marginTop: 24, alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 8 }}>
              {/* Fallback QR representation since we haven't installed react-native-qrcode-svg yet */}
              <View style={{ width: 150, height: 150, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' }}>
                 <Text style={{ color: '#fff', textAlign: 'center' }}>[QR Code: GOA-RES-9382]</Text>
              </View>
              <Text style={{ color: '#000', marginTop: 12, fontWeight: 'bold' }}>GOA-RES-9382</Text>
            </View>
            <Text style={{ color: theme.textSecondary, textAlign: 'center', marginTop: 16, fontSize: 12 }}>Present this pass to the door staff</Text>
          </View>

        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.authContainer}>
        
        <View style={styles.authHeader}>
          <Text style={styles.logoLarge}>GOA</Text>
          <Text style={styles.subtitle}>The Premium Nightlife Experience</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{isLogin ? 'Welcome Back' : 'Create GOA ID'}</Text>
          
          {!isLogin && (
            <View style={styles.formGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Enter your full name" 
                placeholderTextColor="#52525b" 
              />
            </View>
          )}

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Enter your email" 
              placeholderTextColor="#52525b" 
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={[styles.formGroup, { marginBottom: 32 }]}>
            <Text style={styles.label}>Password</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Enter your password" 
              placeholderTextColor="#52525b" 
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={() => setIsAuthenticated(true)}>
            <Text style={styles.btnPrimaryText}>{isLogin ? 'Sign In' : 'Create Account'}</Text>
          </TouchableOpacity>

          <View style={styles.toggleContainer}>
            <Text style={styles.toggleText}>
              {isLogin ? "Don't have a GOA ID?" : "Already have a GOA ID?"}
            </Text>
            <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={{ marginTop: 16 }}>
              <View style={[styles.btn, styles.btnSecondary]}>
                <Text style={styles.btnSecondaryText}>{isLogin ? 'Create GOA ID' : 'Sign In instead'}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bgDark,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 24,
  },
  logo: {
    color: theme.textPrimary,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 2,
  },
  signOutText: {
    color: theme.textSecondary,
    fontSize: 14,
  },
  card: {
    backgroundColor: theme.bgCard,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: theme.glassBorder,
    marginBottom: 24,
  },
  profileCard: {
    backgroundColor: '#1a1a20', // Slight gradient approximation
  },
  profileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.bgDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: theme.accentGold,
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileName: {
    color: theme.textPrimary,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  profileId: {
    color: theme.textSecondary,
    fontSize: 14,
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: theme.glassBorder,
    paddingTop: 16,
    marginTop: 8,
  },
  statLabel: {
    color: theme.textSecondary,
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    color: theme.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    color: theme.textPrimary,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  reservationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  reservationTitle: {
    color: theme.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  reservationDate: {
    color: theme.textSecondary,
    fontSize: 14,
  },
  badge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: theme.accentGreen,
    fontSize: 12,
    fontWeight: '600',
  },
  // Auth Styles
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  authHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoLarge: {
    color: theme.textPrimary,
    fontSize: 40,
    fontWeight: '700',
    letterSpacing: 4,
    marginBottom: 8,
  },
  subtitle: {
    color: theme.textSecondary,
    fontSize: 16,
  },
  cardTitle: {
    color: theme.textPrimary,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    color: theme.textSecondary,
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: theme.bgCard,
    borderWidth: 1,
    borderColor: theme.glassBorder,
    borderRadius: 8,
    padding: 12,
    color: theme.textPrimary,
    fontSize: 16,
  },
  btn: {
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimary: {
    backgroundColor: theme.accentGold,
  },
  btnPrimaryText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  btnSecondary: {
    backgroundColor: theme.bgCard,
    borderWidth: 1,
    borderColor: theme.glassBorder,
  },
  btnSecondaryText: {
    color: theme.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  toggleContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  toggleText: {
    color: theme.textSecondary,
  }
});
