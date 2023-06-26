import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ProtocoloPrueba } from './models/protocolo-prueba';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProtocoloService {

  private urlEndPoint: string = environment.apiURL + "api/protocolo";

  constructor(private http: HttpClient) { }

  getById(id: number): Observable<ProtocoloPrueba> {
    return this.http.get<ProtocoloPrueba>(`${this.urlEndPoint}/get/${id}`).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  getListado(cliente: string, ordenTrabajo: string, producto: string, fecha: string): Observable<any[]> {
    let url: string = `${this.urlEndPoint}/get-listado`;

    if(cliente) {
      url += `&cl=${cliente}`;
    }

    if(ordenTrabajo) {
      url += `&ot=${ordenTrabajo}`;
    }

    if(producto) {
      url += `&pr=${producto}`;
    }

    if(fecha) {
      url += `&f=${fecha}`;
    }

    url = url.replace('&', '?');

    return this.http.get<any[]>(url).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  update(protocolo: ProtocoloPrueba): Observable<any> {
    return this.http.put(`${this.urlEndPoint}/update`, protocolo).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  create(protocolo: ProtocoloPrueba): Observable<any> {
    return this.http.post(`${this.urlEndPoint}/create`, protocolo).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }
}