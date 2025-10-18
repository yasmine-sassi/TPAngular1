import { Injectable, signal } from '@angular/core';
import { CredentialsDto } from '../dto/credentials.dto';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated = signal<boolean>(false);
  user = signal<{ id: string; email: string } | null>(null);
  private token: string | null = null;

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  login(credentials: CredentialsDto): Observable<any> {
    // Load users from JSON and check credentials
    return this.http.get<any[]>('assets/users.json').pipe(
      map(users => {
        const found = users.find(u => u.email === credentials.email && u.password === credentials.password);
        if (found) {
          const mockResponse = {
            id: 'mock-token-' + found.id,
            userId: found.id
          };
          this.token = mockResponse.id;
          this.isAuthenticated.set(true);
          this.user.set({ id: String(found.id), email: found.email });
          localStorage.setItem('token', mockResponse.id);
          localStorage.setItem('user', JSON.stringify({ id: String(found.id), email: found.email }));
          return mockResponse;
        }
        throw { error: 'Invalid credentials' };
      })
    );
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