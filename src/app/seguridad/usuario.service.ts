import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private urlEndPoint: string = environment.apiURL + "api/usuario";

  constructor(private http: HttpClient) { }

  changePassword(token: string, password: string): Observable<any> {
    return this.http.put(`${this.urlEndPoint}/changedPassword/${token}/${password}`, null).pipe(
      catchError(err => {
        return throwError(() => {return err})
      })
    )
  }

  validStayInPage(token: string): Observable<any> {
    return this.http.get<any>(`${this.urlEndPoint}/comprobar/${token}`).pipe(
      catchError(err => {
        return throwError(() => {return err})
      })
    )
  }

  inactivarActivar(id: number, ind: number): Observable<any> {
    return this.http.put(`${this.urlEndPoint}/inactivar/${id}/${ind}`, null).pipe(
      catchError(err => {
        return throwError(() => {return err})
      })
    )
  }

  update(id: number, body: any): Observable<any> {
    return this.http.put(`${this.urlEndPoint}/update/${id}`, body).pipe(
      catchError(err => {
        return throwError(() => {return err})
      })
    )
  }

  create(json: string): Observable<any> {
    return this.http.post(`${this.urlEndPoint}/create`, json).pipe(
      catchError(err => {
        return throwError(() => {return err})
      })
    )
  }

  getListMaestro(nombre: string, username: string, correo: string, indVerInactivos: number): Observable<any[]> {
    let url: string = this.urlEndPoint + '/list-maestro'

    if(indVerInactivos) {
      let ind: number = indVerInactivos?1:0
      url += `&indVerInactivos=${ind}`;
    }

    if(correo && correo.length > 0) {
      url += `&correo=${correo}`;
    }

    if(username && username.length > 0) {
      url += `&username=${username}`;
    }

    if(nombre && nombre.length > 0) {
      url += `&nombre=${nombre}`;
    }

    url = url.replace('&', '?')

    return this.http.get<any[]>(url).pipe(
      catchError(err => {
        return throwError(() => {return err})
      })
    )
  }
}
