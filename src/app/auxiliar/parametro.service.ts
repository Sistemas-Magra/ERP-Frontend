import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Parametro } from './models/parametro';

@Injectable({
  providedIn: 'root'
})
export class ParametroService {

  private urlEndPoint: string = environment.apiURL + 'api/parametro';

  constructor(private http: HttpClient) { }
  
  getParametroById(id: number): Observable<Parametro> {
    return this.http.get<Parametro>(`${this.urlEndPoint}/get-by-id/${id}`).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
	}
}
