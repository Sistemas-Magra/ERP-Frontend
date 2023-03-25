import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
import { Role } from './models/role';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private urlEndPoint: string = environment.apiURL + "api/role";

  constructor(private http: HttpClient) { }

  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.urlEndPoint}/all`).pipe(
      catchError(err => {
        return throwError(() => {return err})
      })
    )
  }

  getByUserId(userId: number): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.urlEndPoint}/byUser/${userId}`).pipe(
      catchError(err => {
        return throwError(() => {return err})
      })
    )
  }

  autocompleteAsignacion(term: string): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.urlEndPoint}/asignacion-autocomplete/${term}`).pipe(
      catchError(err => {
        return throwError(() => {return err})
      })
    )
  }
}
