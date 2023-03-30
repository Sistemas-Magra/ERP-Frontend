import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Area } from './models/area';

@Injectable({
  providedIn: 'root'
})
export class AreaService {

  private urlEndPoint: string = environment.apiURL + 'api/area'

  constructor(private http: HttpClient) { }

  getAll(): Observable<Area[]> {
    return this.http.get<Area[]>(`${this.urlEndPoint}/all`).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }
}
