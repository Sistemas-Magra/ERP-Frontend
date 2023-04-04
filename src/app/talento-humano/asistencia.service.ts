import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {

  private urlEndPoint: string = environment.apiURL + "api/asistencia";

  constructor(private http: HttpClient) { }

  registrarAsistencia(json: string): Observable<any> {
    return this.http.post(`${this.urlEndPoint}/registrar`, json).pipe(
      catchError(err => {
        return throwError(() => {return err})
      })
    )
  }
}
