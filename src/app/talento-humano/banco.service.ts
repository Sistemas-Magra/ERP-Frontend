import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Banco } from './models/banco';

@Injectable({
  providedIn: 'root'
})
export class BancoService {

  private urlEndPoint: string = environment.apiURL + "api/banco";

  constructor(private http: HttpClient) { }

  getBancosActivos(): Observable<Banco[]> {

    return this.http.get<Banco[]>(`${this.urlEndPoint}/get-activos`).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }
}