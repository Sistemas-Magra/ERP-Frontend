import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, catchError, throwError, map } from 'rxjs';
import { Empleado } from './models/empleado';
import { Permiso } from './models/permiso';
import { Cese } from './models/cese';
import { Contrato } from './models/contrato';
import { TablaAuxiliar } from '../auxiliar/models/tabla-auxiliar';
import { TablaAuxiliarDetalle } from '../auxiliar/models/tabla-auxiliar-detalle';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  private urlEndPoint: string = environment.apiURL + "api/empleado";

  constructor(private http: HttpClient) { }

  getActivos(fecha:string, ind: number): Observable<any[]> {
    let url: string = `${this.urlEndPoint}/get-activos?fecha=${fecha}&indVerActiv=${ind}`
    
    return this.http.get<any[]>(url).pipe(
      map((response) => {

        response.forEach(res => {
          res.marcacion_entity = res.marcacion_entity as TablaAuxiliarDetalle;
        });

        return response;
      })
    )
  }

  getPeriodosCeseActivos(): Observable<any> {
    return this.http.get<any>(`${this.urlEndPoint}/get-periodos-cese-activos`);
  }

  registrarContrato(contrato: Contrato): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/registrar-contrato`, contrato)
  }

  registrarCese(cese: Cese, idEmpleado: number): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/registrar-cese/${idEmpleado}`, cese)
  }

  registrarPermiso(permiso: Permiso, idEmpleado: number): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/registrar-permiso/${idEmpleado}`, permiso)
  }

  registrarVacaciones(fechaDesde: string, fechaFin: string, empleadoId: number, cantidadDias: number, userId: number): Observable<any> {
    let url: string = `${this.urlEndPoint}/registrar-vacaciones`

    if(fechaDesde && fechaDesde.length > 0) {
      url += `&fechaDesde=${fechaDesde}`
    }

    if(fechaFin && fechaFin.length > 0) {
      url += `&fechaHasta=${fechaFin}`
    }

    if(empleadoId) {
      url += `&empleadoId=${empleadoId}`
    }

    if(cantidadDias) {
      url += `&cantidadDias=${cantidadDias}`
    }

    if(userId) {
      url += `&userId=${userId}`
    }

    url = url.replace('&', '?')
    return this.http.post<any>(url, null)
  }

  getEmpleadoById(id: number): Observable<any> {
    return this.http.get<any>(`${this.urlEndPoint}/find/${id}`)
  }

  subirFoto(foto: File, id: number): Observable<any> {
    let formData = new FormData();

    formData.append('foto', foto)

    return this.http.put(`${this.urlEndPoint}/subir-foto/${id}`, formData)
  }

  getCodigo(codigo: string): Observable<any> {
    let url: string = `${this.urlEndPoint}/get-codigo`

    if(codigo && codigo.length > 0) {
      url += `&codigo=${codigo}`
    }

    url = url.replace('&', '?')
    
    return this.http.get<any>(url)
  }

  create(empleado: Empleado): Observable<any> {
    return this.http.post(`${this.urlEndPoint}/create`, empleado)
  }

  updateCondicion(id: number, ind: number, estadoId: number): Observable<any> {
    return this.http.put(`${this.urlEndPoint}/update-condicion/${id}/${ind}/${estadoId}`, null)
  }

  update(empleado: Empleado): Observable<any> {
    return this.http.put(`${this.urlEndPoint}/update`, empleado)
  }

  autocomplete(term: string): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(`${this.urlEndPoint}/autocomplete/${term}`)
  }

  cantidadEmpleados(): Observable<number> {
    return this.http.get<number>(`${this.urlEndPoint}/total-empleados`)
  }

  listadoEmpleado(nombreCompleto: string, nroDoc: string, fecIngDesde: string, fecIngHasta: string, indVerInac: number, page: number, size: number): Observable<any[]> {
    let url: string = `${this.urlEndPoint}/listado-empleados`

    if(nombreCompleto && nombreCompleto.length > 0) {
      url += `&nombreCompleto=${nombreCompleto}`
    }

    if(nroDoc && nroDoc.length > 0) {
      url += `&nroDoc=${nroDoc}`
    }

    if(fecIngDesde && fecIngDesde.length > 0) {
      url += `&fecIngDesde=${fecIngDesde}`
    }

    if(fecIngHasta && fecIngHasta.length > 0) {
      url += `&fecIngHasta=${fecIngHasta}`
    }

    if(indVerInac) {
      url += `&indVerInac=${indVerInac}`
    }

    if(page) {
      url += `&page=${page}`
    }

    if(size) {
      url += `&size=${size}`
    }

    url = url.replace('&', '?')

    return this.http.get<any[]>(url)
  }
}
