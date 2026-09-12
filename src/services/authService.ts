import { User } from '../types';

const USERS_STORAGE_KEY = 'tlb_users_v2';
const CURRENT_USER_KEY = 'tlb_current_user_v2';

interface StoredUser extends User {
  password?: string;
}

// Seed demo customer user so evaluators can test instant customer login
const DEMO_CUSTOMER: StoredUser = {
  id: 'usr_demo_midnight',
  name: 'Ren Takahashi',
  email: 'wanderer@thelastbowl.com',
  phone: '+1 (555) 839-2695',
  role: 'customer',
  password: 'ramen123',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
  addresses: [
    {
      id: 'addr_1',
      label: 'Midnight Studio',
      houseFlat: 'Apt 402, Lantern Heights',
      street: '4th Avenue East',
      area: 'Neon District',
      city: 'Nightfall Quarter',
      state: 'NQ',
      pinCode: '700012',
      isDefault: true
    }
  ],
  preferences: {
    dietaryPreference: 'all',
    spiceTolerance: 2,
    quietSeatingPreferred: true,
    themePreference: 'light'
  },
  createdAt: '2026-01-15T01:00:00.000Z'
};

// Seed demo admin user for restaurant operations and table/order management
const DEMO_ADMIN: StoredUser = {
  id: 'usr_admin_kenji',
  name: 'Master Kenji (Kitchen Admin)',
  email: 'admin@thelastbowl.com',
  phone: '+1 (555) 990-1122',
  role: 'admin',
  password: 'admin123',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  addresses: [],
  preferences: {
    themePreference: 'dark'
  },
  createdAt: '2026-01-01T00:00:00.000Z'
};

class AuthService {
  private getUsers(): StoredUser[] {
    try {
      const saved = localStorage.getItem(USERS_STORAGE_KEY);
      let users: StoredUser[] = saved ? JSON.parse(saved) : [];

      // Ensure demo users are always present in the pool
      let updated = false;
      if (!users.some(u => u.email.toLowerCase() === DEMO_CUSTOMER.email.toLowerCase())) {
        users.push(DEMO_CUSTOMER);
        updated = true;
      }
      if (!users.some(u => u.email.toLowerCase() === DEMO_ADMIN.email.toLowerCase())) {
        users.push(DEMO_ADMIN);
        updated = true;
      }

      if (updated || !saved) {
        this.saveUsers(users);
      }
      return users;
    } catch {
      return [DEMO_CUSTOMER, DEMO_ADMIN];
    }
  }

  private saveUsers(users: StoredUser[]): void {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save users', e);
    }
  }

  public getCurrentUser(): User | null {
    try {
      const saved = localStorage.getItem(CURRENT_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  public login(email: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = this.getUsers();
        const cleanEmail = email.trim().toLowerCase();
        const user = users.find(u => u.email.toLowerCase() === cleanEmail);

        if (!user) {
          reject(new Error('No account found with this email address. Please check your spelling or sign up.'));
          return;
        }

        // Validate password against demo credentials or user-created password
        const expectedPassword = user.email.toLowerCase() === DEMO_ADMIN.email.toLowerCase()
          ? 'admin123'
          : (user.email.toLowerCase() === DEMO_CUSTOMER.email.toLowerCase() ? 'ramen123' : user.password || 'ramen123');

        if (password.trim() !== expectedPassword) {
          reject(new Error('Incorrect password. Please check your credentials and try again.'));
          return;
        }

        // Return user session without exposing raw password
        const { password: _pw, ...cleanUser } = user;
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(cleanUser));
        resolve(cleanUser as User);
      }, 400);
    });
  }

  public signup(data: { name: string; email: string; phone: string; password: string }): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = this.getUsers();
        const cleanEmail = data.email.trim().toLowerCase();
        const exists = users.some(u => u.email.toLowerCase() === cleanEmail);
        if (exists) {
          reject(new Error('An account with this email already exists. Please log in instead.'));
          return;
        }

        // Customers can never sign up as admin
        const newUser: StoredUser = {
          id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          name: data.name.trim(),
          email: cleanEmail,
          phone: data.phone.trim(),
          role: 'customer',
          password: data.password,
          addresses: [],
          preferences: {
            themePreference: 'light'
          },
          createdAt: new Date().toISOString()
        };

        users.push(newUser);
        this.saveUsers(users);

        const { password: _pw, ...cleanUser } = newUser;
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(cleanUser));
        resolve(cleanUser as User);
      }, 500);
    });
  }

  public logout(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  public updateProfile(userId: string, partial: Partial<User>): Promise<User> {
    return new Promise((resolve, reject) => {
      const users = this.getUsers();
      const index = users.findIndex(u => u.id === userId);
      if (index === -1) {
        reject(new Error('User not found'));
        return;
      }

      const updated: StoredUser = {
        ...users[index],
        ...partial
      };

      users[index] = updated;
      this.saveUsers(users);

      const current = this.getCurrentUser();
      if (current?.id === userId) {
        const { password: _pw, ...cleanCurrent } = updated;
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(cleanCurrent));
      }

      const { password: _pw, ...cleanUser } = updated;
      resolve(cleanUser as User);
    });
  }

  public forgotPassword(email: string): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`A recovery whisper has been sent to ${email}. Check your inbox for reset instructions.`);
      }, 400);
    });
  }
}

export const authService = new AuthService();
