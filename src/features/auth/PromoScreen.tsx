import React from 'react';
import { View, Text, Image, ScrollView, ImageSourcePropType } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/Screen';
import { Logo } from '../../components/Logo';
import { PillButton } from '../../components/PillButton';
import { colors, spacing, fontFamily, typography } from '../../theme';

// Ecra "pop_up_Inicio" do Figma (node 47:136): promo com +20 especialidades,
// 4 features em cards, foto, testemunho e oferta de 1 mes gratis.

const FEATURES: { icone: ImageSourcePropType; titulo: string }[] = [
  { icone: require('../../../assets/images/historico.png'), titulo: 'Histórico médico\ncompleto' },
  { icone: require('../../../assets/images/monitoramento.png'), titulo: 'Monitoramento\ncompleto de saúde' },
  { icone: require('../../../assets/images/transporte.png'), titulo: 'Solicitação de\ntransporte médico' },
  { icone: require('../../../assets/images/teleconsulta.png'), titulo: 'Teleconsultas com\nmédicos' },
];

function FeatureCard({ icone, titulo }: { icone: ImageSourcePropType; titulo: string }) {
  return (
    <View
      style={{
        width: '47%',
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 16,
        alignItems: 'center',
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.sm,
        backgroundColor: colors.surface,
      }}
    >
      <Image source={icone} style={{ width: 32, height: 32 }} resizeMode="contain" />
      <Text
        style={{
          fontFamily: fontFamily.medium,
          fontSize: 13,
          color: colors.primary,
          textAlign: 'center',
          marginTop: spacing.sm,
        }}
      >
        {titulo}
      </Text>
    </View>
  );
}

export function PromoScreen() {
  const router = useRouter();
  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxl }}>
        <View style={{ alignItems: 'center', paddingVertical: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <Logo />
        </View>

        <View style={{ paddingHorizontal: spacing.xl }}>
          <Text style={[typography.h2, { textAlign: 'center', marginTop: spacing.xl }]}>
            +20 especialidades registradas no +Saudável
          </Text>
          <Text style={[typography.body, { color: '#626262', textAlign: 'center', marginTop: spacing.md, paddingHorizontal: spacing.lg }]}>
            Registre, acompanhe e partilhe os seus dados clínicos com segurança e total controlo
          </Text>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: spacing.lg, marginTop: spacing.xl }}>
            {FEATURES.map((f) => (
              <FeatureCard key={f.titulo} icone={f.icone} titulo={f.titulo} />
            ))}
          </View>

          <Text style={[typography.h2, { textAlign: 'center', marginTop: spacing.xxl }]}>Mais qualidade de vida!</Text>
          <Text style={[typography.body, { color: '#626262', textAlign: 'center', marginTop: spacing.md }]}>
            O +Saudável simplifica o acompanhamento diário e devolve autonomia ao paciente e à família. Cuidar da saúde
            nunca foi fácil!
          </Text>
          <Text style={[typography.body, { fontFamily: fontFamily.bold, textAlign: 'center', marginTop: spacing.md }]}>
            Com o +Saudável é tudo mais prático!
          </Text>
        </View>

        <Image
          source={require('../../../assets/images/welcome-photo.png')}
          style={{ width: '100%', height: 260, marginTop: spacing.xl }}
          resizeMode="cover"
        />

        <View style={{ paddingHorizontal: spacing.xl, alignItems: 'center' }}>
          <Text style={[typography.title, { textAlign: 'center', marginTop: spacing.xl }]}>
            Onde a saúde encontra a atenção que merece!
          </Text>

          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: colors.action,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: spacing.xl,
            }}
          >
            <Text style={{ fontFamily: fontFamily.bold, fontSize: 22, color: colors.white }}>”</Text>
          </View>

          <Text style={[typography.body, { color: '#626262', textAlign: 'center', marginTop: spacing.lg }]}>
            O +Saudável simplifica o acompanhamento diário e devolve autonomia ao paciente e à família. Cuidar da saúde
            nunca foi fácil!
          </Text>

          <Image
            source={require('../../../assets/images/doctor.png')}
            style={{ width: 72, height: 72, borderRadius: 36, marginTop: spacing.lg }}
            resizeMode="cover"
          />
          <Text style={[typography.title, { marginTop: spacing.sm }]}>Fortunato Joaquim</Text>
          <Text style={typography.caption}>Médico clínico geral</Text>

          <Text style={[typography.h2, { fontSize: 18, textAlign: 'center', marginTop: spacing.xxl }]}>
            Aproveite 1 mês de uso gratuito com acompanhamento e consulta de clínico geral
          </Text>

          <View style={{ marginTop: spacing.xl }}>
            <PillButton title="Continuar" onPress={() => router.push('/(auth)/login')} />
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
