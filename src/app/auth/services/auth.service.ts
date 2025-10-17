import { Injectable, signal } from '@angular/core';
import { CredentialsDto } from '../dto/credentials.dto';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated = signal<boolean>(false);
  user = signal<{ id: string; email: string } | null>(null);
  private token: string | null = null;

  // Mock user for testing
  private readonly MOCK_USER = {
    email: 'test@test.com',
    password: 'test123'
  };

  constructor() {
    this.loadUserFromStorage();
  }

  login(credentials: CredentialsDto): Observable<any> {
    // Mock authentication logic
    if (credentials.email === this.MOCK_USER.email && 
        credentials.password === this.MOCK_USER.password) {
      const mockResponse = {
        id: 'mock-token-123',
        userId: '1'
      };
      
      this.token = mockResponse.id;
      this.isAuthenticated.set(true);
      this.user.set({ id: String(mockResponse.userId), email: credentials.email });
      localStorage.setItem('token', mockResponse.id);
      localStorage.setItem('user', JSON.stringify({ 
        id: String(mockResponse.userId), 
        email: credentials.email 
      }));

      return of(mockResponse);
    }
    
    // Return error for invalid credentials
    return new Observable(subscriber => {
      subscriber.error({ error: 'Invalid credentials' });
    });
  }

  logout() {
    this.token = null;
    this.isAuthenticated.set(false);
    this.user.set(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('token');
  }

  private loadUserFromStorage() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      this.token = token;
      this.isAuthenticated.set(true);
      this.user.set(JSON.parse(user));
    }
  }
}