import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Empleado } from './models/empleado';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  private urlEndPoint: string = environment.apiURL + "api/empleado";

  constructor(private http: HttpClient) { }

  autocomplete(term: string): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(`${this.urlEndPoint}/autocomplete/${term}`)
  }
}
