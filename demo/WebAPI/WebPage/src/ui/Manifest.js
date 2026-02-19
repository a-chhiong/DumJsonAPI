// Views
import { AppShell } from './AppShell.js';
import { LaunchView } from './views/LaunchView.js';
import { LoginView } from './views/LoginView.js';
import { HomeView } from './views/HomeView.js';

// Components
import { ProfileHeader } from './components/ProfileHeader.js';
import { VaultIdentity } from './components/VaultIdentity.js';
import { BiometricCard } from './components/BiometricCard.js';
import { FinancialSlots } from './components/FinancialSlots.js';
import { CryptoAssets } from './components/CryptoAssets.js';

const tags = {
    // Views
    'app-shell': AppShell,
    'launch-view': LaunchView,
    'login-view': LoginView,
    'home-view': HomeView,
    // Components
    'profile-header': ProfileHeader,
    'biometric-card': BiometricCard,
    'vault-identity': VaultIdentity,
    'financial-slots': FinancialSlots,
    'crypto-assets': CryptoAssets,
};

export const manifesto = () => {
    console.group("🚀 UI Manifest");
    Object.entries(tags).forEach(([tag, cls]) => {
        if (!customElements.get(tag)) {
            console.debug(`Defining: <${tag}>`);
            customElements.define(tag, cls);
        }
    });
    console.groupEnd();
};