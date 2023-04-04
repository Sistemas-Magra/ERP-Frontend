import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Contrato } from './models/contrato';

@Injectable({
  providedIn: 'root'
})
export class ContratoService {

  private urlEndPoint: string = environment.apiURL + "api/contrato";

  constructor(private http: HttpClient) { }

  getContratoByEmpleado(empleadoId: number): Observable<Contrato> {
    return this.http.get<Contrato>(`${this.urlEndPoint}/get-by-empleado/${empleadoId}`)
  }

  getDatosContrato(empleadoId: number, mes: number, anio: number): Observable<Contrato> {
    return this.http.get<Contrato>(`${this.urlEndPoint}/get-datos/${empleadoId}/${mes}/${anio}`)
  }
}
