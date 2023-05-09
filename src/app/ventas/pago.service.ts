import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, catchError, throwError, map } from 'rxjs';
import { Pago } from './models/pago';

@Injectable({
  providedIn: 'root'
})
export class PagoService {

  private urlEndPoint: string = environment.apiURL + "api/pagos";

  constructor(private http: HttpClient) { }

  getPagosByOrdenVentaId(ordenVentaId: number): Observable<Pago[]> {
    return this.http.get<Pago[]>(`${this.urlEndPoint}/get-by-ovid/${ordenVentaId}`).pipe(
      catchError(err => {
        return throwError(() => {return err});
      })
    );
  }
}
