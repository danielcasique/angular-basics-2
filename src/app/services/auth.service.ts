import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { Auth } from './../models/auth.model';
import { User } from './../models/users.model';
import { TokenService } from './../services/token.service'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiURL = `${environment.API_URL}/api/auth`;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }

  login(email: string, password: string){
    return this.http.post<Auth>(`${this.apiURL}/login`, {email, password})
    .pipe(
      tap(response => this.tokenService.saveToken(response.access_token))
    );
  }

  profile(token: string){
   /* const headers = new HttpHeaders();
    headers.set('Authorization', `Bearer ${token}`);
    headers.set('Content-Type', 'application/json');
    return this.http.get<User>(`${this.apiURL}/profile`, {headers});
    */
    return this.http.get<User>(`${this.apiURL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

}
