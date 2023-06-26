import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Despacho } from './models/despacho';

@Injectable({
  providedIn: 'root'
})
export class DespachoService {

  private urlEndPoint: string = environment.apiURL + "api/despacho";

  constructor(private http: HttpClient) { }

  getByFecha(fecha: Date): Observable<Despacho> {
    return this.http.get<Despacho>(`${this.urlEndPoint}/find?f=${fecha}`).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

}
