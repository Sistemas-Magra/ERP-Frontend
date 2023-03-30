import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EntidadFondos } from '../talento-humano/models/entidad-fondos';

@Injectable({
  providedIn: 'root'
})
export class EntidadFondosService {

  private urlEndPoint: string = environment.apiURL + 'api/entidad-fondos'

  constructor(private http: HttpClient) { }

  getAll(): Observable<EntidadFondos[]> {
    return this.http.get<EntidadFondos[]>(`${this.urlEndPoint}/all`).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }
}
