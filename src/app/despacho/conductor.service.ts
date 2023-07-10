import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConductorService {

  private urlEndPoint: string = environment.apiURL + "api/conductor";

  constructor(private http: HttpClient) { }

  getDatosFromReniec(empresaTransporteId: number, nroDocumento: string): Observable<any> {

    return this.http.get(`${this.urlEndPoint}/datos/${empresaTransporteId}/${nroDocumento}`).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );

  }
}
