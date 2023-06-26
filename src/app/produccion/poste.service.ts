import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PosteService {

  private urlEndPoint: string = environment.apiURL + "api/poste";

  constructor(private http: HttpClient) { }

  autocompleteAccesorios(term: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlEndPoint}/autocomplete-acc/${term}`).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  autocompleteSticker(term: string, ordenVentaId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlEndPoint}/autocomplete/${ordenVentaId}/${term}`).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }
}
