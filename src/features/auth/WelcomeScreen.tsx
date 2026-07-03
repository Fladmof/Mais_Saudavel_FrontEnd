import React from 'react';
import { View, Text, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/Screen';
import { Logo } from '../../components/Logo';
import { PillButton } from '../../components/PillButton';
import { colors, spacing, fontFamily } from '../../theme';

// Ecra "Inicio" do Figma (node 35:4): logo, foto arredondada com destaque,
// titulo verde, subtitulo, dots e botao pill "Começar" com seta.
export function WelcomeScreen() {
  const router = useRouter();
  return (
    <LinearGradient colors={['#E7F8E8', '#FFFFFF', '#E7F8E8']} style={{ flex: 1 }}>
      <Screen style={{ backgroundColor: 'transparent' }}>
        <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: spacing.xl }}>
          <View style={{ marginTop: spacing.xl }}>
            <Logo />
          </View>

          <View style={{ width: '100%', height: 293, borderRadius: 32, overflow: 'hidden', marginTop: spacing.xxl }}>
            <Image
              source={require('../../../assets/images/welcome-photo.png')}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
            <View style={{ position: 'absolute', right: 16, bottom: 12, width: 138, height: 129, borderRadius: 32, overflow: 'hidden' }}>
              <Image
                source={require('../../../assets/images/welcome-photo-small.png')}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            </View>
          </View>

          <View style={{ alignItems: 'center', marginTop: 48, width: 372, maxWidth: '100%' }}>
            <Text
              style={{
                fontFamily: fontFamily.bold,
                fontSize: 34,
                lineHeight: 40,
                color: colors.primary,
                textAlign: 'center',
              }}
            >
              Controle a sua saúde com o +Saudável
            </Text>
            <Text
              style={{
                fontFamily: fontFamily.regular,
                fontSize: 15,
                lineHeight: 20,
                color: '#626262',
                textAlign: 'center',
                width: 278,
                marginTop: spacing.lg,
              }}
            >
              O +Saudável centraliza tudo num único lugar, acessível a qualquer momento
            </Text>
            <View style={{ flexDirection: 'row', gap: 4, marginTop: spacing.xxl }}>
              <View style={{ width: 4, height: 4, borderRadius: 56, backgroundColor: '#3D3C3C', opacity: 0.3 }} />
              <View style={{ width: 17, height: 4, borderRadius: 56, backgroundColor: colors.primary }} />
              <View style={{ width: 4, height: 4, borderRadius: 56, backgroundColor: '#3D3C3C', opacity: 0.3 }} />
            </View>
          </View>

          <View style={{ flex: 1 }} />

          <View style={{ marginBottom: spacing.xxl }}>
            <PillButton title="Começar" onPress={() => router.push('/(auth)/promo')} />
          </View>
        </View>
      </Screen>
    </LinearGradient>
  );
}
