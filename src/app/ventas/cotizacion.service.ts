import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, catchError, throwError, map } from 'rxjs';
import { OrdenVenta } from './models/orden-venta';
import { Pago } from './models/pago';

@Injectable({
  providedIn: 'root'
})
export class CotizacionService {

  private urlEndPoint: string = environment.apiURL + "api/orden-venta";

  constructor(private http: HttpClient) { }

  autocomplete(term:string): Observable<OrdenVenta[]> {
    return this.http.get<OrdenVenta[]>(`${this.urlEndPoint}/autocomplete/${term}`).pipe(
      catchError(err => {
        return throwError(() => {return err});
      })
    );
  }

  downloadFile(filename: string, ind: number): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/descargar-archivos/${ind}/${filename}`, { responseType: 'blob' }).pipe(
      catchError(err => {
        return throwError(() => {return err});
      })
    );
  }

  autocompleteByCliente(clienteId: number, term: string): Observable<OrdenVenta[]> {
    return this.http.get<OrdenVenta[]>(`${this.urlEndPoint}/autocomplete-c/${clienteId}/${term}`).pipe(
      catchError(err => {
        return throwError(() => {return err});
      })
    );
  }

  registrarPagos(id: number, pago: Pago, adelanto: number, total: number, pendiente: number): Observable<any> {
    let url: string = `${this.urlEndPoint}/registrar-pago/${id}`;
    
    if(adelanto) {
      url += `&ad=${adelanto}`;
    }
    
    if(total) {
      url += `&to=${total}`;
    }
    
    if(pendiente) {
      url += `&pen=${pendiente}`;
    }

    url = url.replace('&', '?');

    return this.http.put(url, pago).pipe(
      catchError(err => {
        return throwError(() => {return err});
      })
    );
  }

  subirPlanoEspecificaciones(plano: File, esp: File, i: string, ovd: string): Observable<any> {
    let formData = new FormData();

    formData.append("plano", plano);
    formData.append("esp", esp);
    formData.append("number", i);
    formData.append("id", ovd);

    return this.http.put(`${this.urlEndPoint}/upload-files`, formData).pipe(
      catchError(err => {
        return throwError(() => {return err})
      })
    );
  }

  updateVenta(id: number, venta: OrdenVenta): Observable<any> {
    return this.http.put(`${this.urlEndPoint}/update/${id}`, venta).pipe(
      catchError(err => {
        return throwError(() => {return err})
      })
    );
  }

  getById(id: number): Observable<OrdenVenta> {
    return this.http.get<OrdenVenta>(`${this.urlEndPoint}/get/${id}`).pipe(
      map(res => {
        if(res.cliente?.contactos) {
          res.cliente.contactos.forEach(c => {
            c.nombreCompleto = c.nombres + ' ' + c.apellidoPaterno + ' ' + c.apellidoMaterno; 
          })
        }

        res.detalle.forEach(r => {
          r.producto.busqueda = r.producto.codigo + ' - ' + r.producto.resumen
        })

        return res;
      }),
      catchError(err => {
        return throwError(() => {return err})
      })
    );
  }

  getListadoMaestro(cliente: string, fechaDesde: string, fechaHasta: string, indVerAnulados: number): Observable<any[]> {
    let url: string = `${this.urlEndPoint}/listado`;

    if(cliente && cliente.length > 0) {
      url += `&cli=${cliente}`
    }

    if(fechaDesde && fechaDesde.length > 0) {
      url += `&fdes=${fechaDesde}`
    }

    if(fechaHasta && fechaHasta.length > 0) {
      url += `&fhas=${fechaHasta}`
    }

    if(indVerAnulados) {
      url += `&anu=${indVerAnulados}`
    }

    url = url.replace('&', '?');

    return this.http.get<any[]>(url).pipe(
      catchError(err => {
        return throwError(() => {return err})
      })
    );
  }

  create(ov: OrdenVenta, empresaId: number): Observable<any> {
    return this.http.post(`${this.urlEndPoint}/create/${empresaId}`, ov).pipe(
      catchError(err => {
        return throwError(() => {return err})
      })
    );
  }
}
