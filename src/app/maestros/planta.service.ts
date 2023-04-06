import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Planta } from './models/planta';

@Injectable({
  providedIn: 'root'
})
export class PlantaService {

  private urlEndpoint: string = `${environment.apiURL}api/planta`

  constructor(private http: HttpClient) { }

  getPlantasActivas(): Observable<Planta[]> {
    return this.http.get<Planta[]>(`${this.urlEndpoint}/get-activos`).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    )
  }
}
