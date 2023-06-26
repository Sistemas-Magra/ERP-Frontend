import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdenTrabajoDetalleService {

  private urlEndPoint: string = environment.apiURL + "api/orden-trabajo-detalle";

  constructor(private http: HttpClient) { }

  getPendientes(ordenVentaId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlEndPoint}/get-pendientes/${ordenVentaId}`).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }
}
