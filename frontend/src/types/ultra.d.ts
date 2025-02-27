interface UltraAccount {
  accountName: string;
  publicKey: string;
}

interface UltraSession {
  id: string;
  origin: string;
  name: string;
  description?: string;
  icon?: string;
  createdAt: number;
}

interface UltraSessionCreateOptions {
  name: string;
  description?: string;
  icon?: string;
}

interface UltraSessions {
  createSession(options: UltraSessionCreateOptions): Promise<UltraSession>;
  getSession(): Promise<UltraSession | null>;
  removeSession(): Promise<void>;
}

interface UltraAccounts {
  getAccount(): Promise<UltraAccount>;
}

interface UltraWallet {
  sessions: UltraSessions;
  accounts: UltraAccounts;
}

interface Window {
  ultra?: UltraWallet;
}