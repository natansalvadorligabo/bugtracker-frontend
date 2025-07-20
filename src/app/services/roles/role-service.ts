import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Role } from '../../model/role.js';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private readonly API_URL = '/bugtracker';

  private httpClient = inject(HttpClient);

  getRoles() {
    return this.httpClient.get<Role[]>(`${this.API_URL}/roles`);
  }
}
