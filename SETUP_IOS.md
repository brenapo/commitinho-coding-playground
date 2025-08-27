# 📱 Setup iOS para Commitinho

## ✅ Status Atual
- ✅ Plataforma iOS adicionada ao projeto
- ✅ Configurações iOS otimizadas
- ✅ Assets sincronizados
- ✅ Plugins iOS configurados

## 🛠 Para completar no macOS:

### 1. **Instalar Xcode**
```bash
# Baixar da App Store ou Developer Portal
# Versão mínima: Xcode 14+
```

### 2. **Instalar CocoaPods**
```bash
sudo gem install cocoapods
```

### 3. **Instalar dependências iOS**
```bash
cd ios/App
pod install
```

### 4. **Abrir no Xcode**
```bash
npx cap open ios
```

### 5. **Configurações no Xcode**
- **Bundle Identifier**: `com.commitinho.app`
- **Display Name**: `Commitinho`
- **Version**: `1.0`
- **Build**: `1`
- **Deployment Target**: iOS 13.0+

### 6. **Build e Run**
```bash
# Via CLI
npx cap run ios

# Ou no Xcode: Cmd+R
```

## 🔧 Configurações já aplicadas:

### iOS-specific no capacitor.config.ts:
```typescript
ios: {
  scheme: 'Commitinho',
  backgroundColor: '#1a1a1a',
  contentInset: 'automatic',
  scrollEnabled: true,
  limitsNavigationsToAppBoundDomains: true,
  handleApplicationEvents: true
}
```

### Plugins configurados:
- ✅ Status Bar (style: dark)
- ✅ Splash Screen (2s duration, dark theme)
- ✅ Haptics (feedback nativo iOS)
- ✅ Preferences (storage seguro)
- ✅ Share (compartilhamento nativo)

## 📱 Alternativas para Windows:

### Opção A: **Ionic Appflow** (Recomendado)
```bash
npm install -g @ionic/cli
ionic signup
ionic link
ionic capacitor build ios --aab
```

### Opção B: **MacinCloud** (Mac na nuvem)
- Aluguel: $20-50/mês
- Xcode completo
- Simuladores iOS

### Opção C: **Expo EAS Build**
```bash
npx eas-cli@latest build --platform ios
```

## 🚀 Próximos passos:

1. **Quando tiver acesso ao Mac:**
   - Execute os comandos acima
   - Teste no simulador iOS
   - Configure certificates para device real

2. **Para publicar na App Store:**
   - Apple Developer Account ($99/ano)
   - Code signing certificates
   - App Store Connect setup

3. **Comandos úteis:**
```bash
# Sync changes
npx cap sync ios

# Open in Xcode
npx cap open ios

# Run on simulator
npx cap run ios

# Build release
npx cap build ios
```

## 📋 Checklist iOS:
- [ ] macOS disponível
- [ ] Xcode instalado
- [ ] CocoaPods instalado
- [ ] Projeto buildando
- [ ] Testado no simulador
- [ ] Apple Developer Account (para device real)
- [ ] Certificados configurados
- [ ] App Store Connect configurado

O projeto está **100% pronto para iOS** - só precisa de um Mac para compilar! 🍎