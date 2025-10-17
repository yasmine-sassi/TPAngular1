import { Injectable, inject } from '@angular/core';
import { CredentialsDto } from '../dto/credentials.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { HttpClient } from '@angular/common/http';
import { API } from '../../../config/api.config';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  login(credentials: CredentialsDto): Observable<LoginResponseDto> {
    // DEV: return a fake token locally so you can log in without backend
    const fakeResponse: LoginResponseDto = {
      id: 'dev-token',
      ttl: 1209600,
      created: new Date(),
      userId: 1,
    };
    return of(fakeResponse); // import { of } from 'rxjs';
  }  

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }
}
