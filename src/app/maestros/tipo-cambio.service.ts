import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
import { TipoCambio } from './models/tipo-cambio';

@Injectable({
  providedIn: 'root'
})
export class TipoCambioService {

  private urlEndPoint: string = environment.apiURL + "api/tipo-cambio";

  constructor(private http: HttpClient) { }

  getUltimoTipoCambio(): Observable<TipoCambio>{
    return this.http.get<TipoCambio>(`${this.urlEndPoint}/last`).pipe(
      catchError(err => {
        return throwError(() => {return err})
      })
    );
  }
}
