import { Component, OnInit } from '@angular/core';
import { Cliente } from 'src/app/maestros/models/cliente';
import { ProductoVenta } from 'src/app/ventas/models/producto-venta';
import { ProtocoloPrueba } from '../models/protocolo-prueba';
import { ClienteService } from 'src/app/ventas/cliente.service';
import { CotizacionService } from 'src/app/ventas/cotizacion.service';
import { OrdenVenta } from 'src/app/ventas/models/orden-venta';
import { MessageService } from 'primeng/api';
import { AuxiliarService } from 'src/app/auxiliar/auxiliar.service';
import { forkJoin } from 'rxjs';
import { TablaAuxiliarDetalle } from 'src/app/auxiliar/models/tabla-auxiliar-detalle';
import { ProtocoloPruebaCargaTrabajo } from '../models/protocolo-prueba-carga-trabajo';
import { ProtocoloPruebaCargaTrabajoMuestra } from '../models/protocolo-prueba-carga-trabajo-muestra';
import { ProtocoloPruebaRotura } from '../models/protocolo-prueba-rotura';
import { ProtocoloPruebaRoturaMuestra } from '../models/protocolo-prueba-rotura-muestra';
import { ProtocoloService } from '../protocolo.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-protocolo-prueba-calidad',
  templateUrl: './protocolo-prueba-calidad.component.html',
  styleUrls: ['./protocolo-prueba-calidad.component.css']
})
export class ProtocoloPruebaCalidadComponent implements OnInit {

  clientesAutocomplete: Cliente[] = [];
  ordenesVentaAutocomplete: OrdenVenta[] = [];
  productosAutocomplete: ProductoVenta[] = [];
  productosAutocompleteAux: ProductoVenta[] = [];

  protocolo: ProtocoloPrueba = new ProtocoloPrueba();

  listaPorcentajesCargaTrabajo: TablaAuxiliarDetalle[];
  listaPorcentajesRotura: TablaAuxiliarDetalle[];
  tiposPrueba: TablaAuxiliarDetalle[];

  constructor(
    private clienteService: ClienteService,
    private ordenVentaService: CotizacionService,
    private auxiliarService: AuxiliarService,
    private messageService: MessageService,
    private protocoloService: ProtocoloService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    let fork = forkJoin([
      this.auxiliarService.getListSelect('PORCCT'),
      this.auxiliarService.getListSelect('PORCCR'),
      this.auxiliarService.getListSelect('TIPPRU')
    ])

    fork.subscribe({
      next: res => {
        this.tiposPrueba = res[2];

        this.activatedRoute.params.subscribe({
          next: param => {
            if(+param['id'] != 0) {
              this.protocoloService.getById(+param['id']).subscribe({
                next: res => {
                  this.listaPorcentajesCargaTrabajo = res.pruebasCargaTrabajo[0].muestras.map(m => m.porcentaje);
                  this.listaPorcentajesRotura = res.pruebasRotura[0].muestras.map(m => m.porcentaje);

                  setTimeout(() => {
                    this.protocolo = res;
                  }, 200)
                }
              })
            } else {
              this.listaPorcentajesCargaTrabajo = res[0];
              this.listaPorcentajesRotura = res[1];
            }
          }
        })
      }
    })
  }

  validarObject(obj): boolean {
    return typeof(obj) == "string" || obj==null;
  }

  searchCliente(event) {
    this.clienteService.getClientesAutocomplete(event.query).subscribe({
      next: res => {
        this.clientesAutocomplete = res;
      }
    })
  }

  validarAutocompletePedido() {
    if(typeof(this.protocolo.cliente)=="string") {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe seleccionar un cliente del listado'});
      (document.getElementById('auto-cliente').firstChild.firstChild as HTMLElement).focus()
    }
  }

  searchOrdenVentaByCliente(event) {
    this.ordenVentaService.autocompleteByCliente(this.protocolo.cliente.id, event.query).subscribe({
      next: res => {
        this.ordenesVentaAutocomplete = res;
      }
    })
  }

  setOrdenVenta(event) {
    let ov: OrdenVenta = event;
    this.productosAutocompleteAux = ov.detalle.map(ovd => ovd.producto).filter(p => p.tipoProducto.tablaAuxiliarDetalleId.id == 1);
  }

  validarAutocompleteProducto() {
    if(typeof(this.protocolo.ordenVenta)=="string") {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe seleccionar un pedido del listado'});
      (document.getElementById('auto-pedido').firstChild.firstChild as HTMLElement).focus()
    }
  }

  searchProducto(event) {
    let term: string = event.query
    this.productosAutocomplete = this.productosAutocompleteAux.filter(p => p.nombre.toUpperCase().includes(term.toUpperCase()));
  }

  setProducto(event) {
    this.protocolo.empotramiento = event.longitud*0.1 + 0.5;
    this.protocolo.deflexMax = this.protocolo.porcentajeDeflexMax*(this.protocolo.producto.longitud - this.protocolo.empotramiento)*1000/100;
    this.protocolo.deformMax = this.protocolo.porcentajeDeformxMax*this.protocolo.deflexMax/100;
  }

  setDeflexValue(event) {
    this.protocolo.deflexMax = event.value*(this.protocolo.producto.longitud - this.protocolo.empotramiento)*1000/100;
    this.protocolo.deformMax = this.protocolo.porcentajeDeformxMax*this.protocolo.deflexMax/100;
  }

  setDeformValue(event) {
    this.protocolo.deformMax = event.value*this.protocolo.deflexMax/100;
  }

  getPorcentajeCarga(porc: string): string {
    if(isNaN(+porc)){
      return '';
    } else {
      return (+porc*this.protocolo.producto.cargaTrabajo*this.protocolo.coeficienteSeguridad).toString() + ' Kg.'
    }
  }

  addFilaCargaTrabajo() {
    let newMuestra: ProtocoloPruebaCargaTrabajo = new ProtocoloPruebaCargaTrabajo();
    
    this.listaPorcentajesCargaTrabajo.forEach(ct => {
      let newMuestraCarga: ProtocoloPruebaCargaTrabajoMuestra = new ProtocoloPruebaCargaTrabajoMuestra();

      newMuestraCarga.kilogramosPrueba = Number(ct.valor)*this.protocolo.producto.cargaTrabajo*this.protocolo.coeficienteSeguridad;
      newMuestraCarga.porcentaje = ct;

      newMuestra.muestras.push(newMuestraCarga);
    });

    this.protocolo.pruebasCargaTrabajo.push(newMuestra);
  }

  addFilaRotura() {
    let newMuestra: ProtocoloPruebaRotura = new ProtocoloPruebaRotura();

    this.listaPorcentajesRotura.forEach(ct => {
      let newMuestraCarga: ProtocoloPruebaRoturaMuestra = new ProtocoloPruebaRoturaMuestra();

      newMuestraCarga.kilogramosPrueba = Number(ct.valor)*this.protocolo.producto.cargaTrabajo*this.protocolo.coeficienteSeguridad;
      newMuestraCarga.porcentaje = ct;

      newMuestra.muestras.push(newMuestraCarga);
    });

    this.protocolo.pruebasRotura.push(newMuestra);
  }

  quitar(i: number, ind: number) {
    if(ind == 1) {
      this.protocolo.pruebasCargaTrabajo = this.protocolo.pruebasCargaTrabajo.filter((pr, j) => j != i);
    } else if(ind == 2) {
      this.protocolo.pruebasRotura = this.protocolo.pruebasRotura.filter((pr, j) => j != i);
    }
  }

  guardar() {

    if(!this.protocolo.cliente) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe seleccionar un cliente.'});
      return;
    }
    
    if(!this.protocolo.ordenVenta) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe seleccionar una orden de venta.'});
      return;
    }
    
    if(!this.protocolo.producto) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe seleccionar un producto.'});
      return;
    }
    
    if(!this.protocolo.entidadLicitante || this.protocolo.entidadLicitante.length == 0) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar una entidad licitante.'});
      return;
    }
    
    if(!this.protocolo.tipoPrueba) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe seleccionar un tipo de prueba.'});
      return;
    }
    
    if(!this.protocolo.lote) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe seleccionar un lote de muestras.'});
      return;
    }
    
    if(!this.protocolo.empotramiento) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar el empotramiento.'});
      return;
    }
    
    if(!this.protocolo.coeficienteSeguridad) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar el coeficiente de seguridad.'});
      return;
    }
    
    if(!this.protocolo.porcentajeDeflexMax) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar el porcentaje de deflexión máxima.'});
      return;
    }
    
    if(!this.protocolo.porcentajeDeformxMax) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar el porcentaje de deformación máxima.'});
      return;
    }
    
    if(this.protocolo.pruebasCargaTrabajo.length == 0) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe añadir al menos un registro de carga de trabajo.'});
      return;
    }
    
    if(this.protocolo.pruebasRotura.length == 0) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe añadir al menos un registro de carga de trabajo.'});
      return;
    }

    if(this.protocolo.id) {

      this.protocoloService.update(this.protocolo).subscribe({
        next: res => {
          this.messageService.add({severity:'success', summary:'Éxito', detail:'Protocolo de prueba actualizado correctamente.'});
        }
      })
    } else {

      this.protocoloService.create(this.protocolo).subscribe({
        next: res => {
          this.messageService.add({severity:'success', summary:'Éxito', detail:'Protocolo de prueba registrado correctamente.'});
        }
      })
    }
  }

}