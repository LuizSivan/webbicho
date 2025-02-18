import {Injectable} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {Observable} from 'rxjs';
import {AuthenticatedToken} from '../../shared/interfaces/authenticated-token';
import {RequestBuilder} from '../../shared/utils/request-builder';
import {HttpClient} from '@angular/common/http';
import {User} from '../../shared/models/entities/user';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	
	readonly endpoint: string = 'auth';
	
	constructor(
			private cookieService: CookieService,
			private http: HttpClient
	) {
	}
	
	setToken(token: string): void {
		this.cookieService.set('jwtToken', token, 1, '/', '', false, 'Strict');
	}
	
	getToken(): string {
		return this.cookieService.get('jwtToken');
	}
	
	removeToken(): void {
		this.cookieService.delete('jwtToken');
	}
	
	checkAuthStatus(): Observable<AuthenticatedToken> {
		return new RequestBuilder<AuthenticatedToken>(this.http)
				.setEndpoint(this.endpoint)
				.doGet();
	}
	
	verifyAccount(token: string): Observable<User> {
		return new RequestBuilder<User>(this.http)
				.setEndpoint(this.endpoint)
				.setUri('verify-account')
				.addParam('token', token)
				.doPatch();
	}
	
	
	register(user: User): Observable<User> {
		return new RequestBuilder<User>(this.http)
				.setEndpoint(this.endpoint)
				.setUri('register')
				.addBody(user)
				.doPost();
	}
	
	login(user: User): Observable<User> {
		return new RequestBuilder<User>(this.http)
				.setEndpoint(this.endpoint)
				.setUri('login')
				.addBody(user)
				.doPost();
	}
}
