import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, catchError, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PermisoService {

  private urlEndPoint: string = environment.apiURL + "api/permiso";

  constructor(private http: HttpClient) { }

  getByUserId(empleadoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlEndPoint}/listado-permisos-empleado/${empleadoId}`).pipe(
      catchError(err => {
        return throwError(() => {return err})
      })
    )
  }
}
