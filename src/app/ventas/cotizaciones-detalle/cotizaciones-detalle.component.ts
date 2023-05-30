import { Component, OnInit } from '@angular/core';
import { Cliente } from 'src/app/maestros/models/cliente';
import { ClienteService } from '../cliente.service';
import { MessageService } from 'primeng/api';
import { TablaAuxiliarDetalle } from 'src/app/auxiliar/models/tabla-auxiliar-detalle';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModalAgregarAuxiliarComponent } from 'src/app/commons/modal-agregar-auxiliar/modal-agregar-auxiliar.component';
import { AuxiliarService } from 'src/app/auxiliar/auxiliar.service';
import { Observable, forkJoin } from 'rxjs';
import { DepartamentoService } from 'src/app/ubicacion/departamento.service';
import { Departamento } from 'src/app/ubicacion/models/departamento';
import { Provincia } from 'src/app/ubicacion/models/provincia';
import { OrdenVenta } from '../models/orden-venta';
import { ModalAgregarContactoClienteComponent } from './modal-agregar-contacto-cliente/modal-agregar-contacto-cliente.component';
import { Moneda } from 'src/app/maestros/models/moneda';
import { MonedaService } from 'src/app/maestros/moneda.service';
import { TipoCambioService } from 'src/app/maestros/tipo-cambio.service';
import { ProductoVentaService } from '../producto-venta.service';
import { ProductoVenta } from '../models/producto-venta';
import { OrdenVentaDetalle } from '../models/orden-venta-detalle';
import { ModalRegistroDespachosComponent } from './modal-registro-despachos/modal-registro-despachos.component';
import { CotizacionService } from '../cotizacion.service';
import { AuthService } from 'src/app/seguridad/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as FileSaver from 'file-saver'


@Component({
  selector: 'app-cotizaciones-detalle',
  templateUrl: './cotizaciones-detalle.component.html',
  styleUrls: ['./cotizaciones-detalle.component.css']
})
export class CotizacionesDetalleComponent implements OnInit {

  ordenVenta: OrdenVenta = new OrdenVenta();

  subtotal: number = 0;

  cliente: Cliente = new Cliente();
  clientesAutocomplete: Cliente[];
  documentoIdentidadSelect: TablaAuxiliarDetalle[];

  formasPagoSelect: TablaAuxiliarDetalle[];
  metodosPagoSelect: TablaAuxiliarDetalle[];
  monedaSelect: Moneda[]

  departamentos: Departamento[];
  departamentoSeleccionado: Departamento = new Departamento();
  provinciaSeleccionada: Provincia = new Provincia();

  listadoProductosAutocomplete: ProductoVenta[] = [];

  indFilaEditada: number = -1;

  ref: DynamicDialogRef;

  indPasarVenta: boolean = false;

  blnEditar: boolean = false;

  constructor(
    private clienteService: ClienteService,
    private departamentoService: DepartamentoService,
    private monedaService: MonedaService,
    private tipoCambioService: TipoCambioService,
    private productoVentaService: ProductoVentaService,
    private messageService: MessageService,
    private dialogService: DialogService,
    private cotizacionService: CotizacionService,
    private authService: AuthService,
    private auxiliarService: AuxiliarService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    
    let fork = forkJoin(
      [
        this.auxiliarService.getListSelect('TIPDOC'),
        this.auxiliarService.getListSelect('TIPFPG'),
        this.auxiliarService.getListSelect('TIPMPG'),
        this.monedaService.getAllMonedas(),
        this.departamentoService.getAll(),
        this.tipoCambioService.getUltimoTipoCambio(),
        this.auxiliarService.getDetalleById('ESTVEN', 1),
        this.auxiliarService.getDetalleById('ESTVEN', 2)
      ]
    )

    fork.subscribe(resp => {
      this.documentoIdentidadSelect = resp[0]
      this.formasPagoSelect = resp[1]
      this.metodosPagoSelect = resp[2]
      this.monedaSelect = resp[3]
      this.departamentos = resp[4];

      this.activatedRoute.params.subscribe(param => {
        this.ordenVenta.id = +param['id'];

        let numInd: number = sessionStorage.getItem("indEditar")?Number(sessionStorage.getItem("indEditar")):null;
        sessionStorage.removeItem("indEditar");
        console.log(numInd)
        this.blnEditar = (numInd == 0);

        if(!this.ordenVenta.id || this.ordenVenta.id == 0) {

          setTimeout(()=> {
            this.ordenVenta.tipoMoneda = this.monedaSelect[0];
            this.ordenVenta.tipoCambio = this.monedaSelect[0].tipoCambio;
            this.ordenVenta.estado = resp[6];
          }, 200)

        } else {

          this.cotizacionService.getById(this.ordenVenta.id).subscribe({
            next: res => {

              let enc: boolean = false;

              for(let i: number = 0; i < this.departamentos.length; i++) {
                for(let j: number = 0; j < this.departamentos[i].provincias.length; j++) {
                  if(this.departamentos[i].provincias[j].distritos.find(d => d.id == res.cliente.distrito.id)) {
                    this.departamentoSeleccionado = this.departamentos[i];
                    setTimeout(() => {
                      this.provinciaSeleccionada = this.departamentos[i].provincias[j];
                      enc = true;
                    }, 200)
                    break;
                  }

                  if(enc) {
                    break;
                  }
                }
              }

              this.cliente = res.cliente;
              setTimeout(()=> {
                this.ordenVenta = res;
                this.ordenVenta.contacto = this.cliente.contactos.find(cont => cont.id == res.contacto.id);
                this.subtotal = this.ordenVenta.subtotal + this.ordenVenta.descuentoTotal;
                this.ordenVenta.estado = resp[7];
              }, 200)

              this.indPasarVenta = true;
            }, error: err => {
              if(err.status == 409) {
                this.messageService.add({severity:'warn', summary:'Advertencia', detail:err.error.mensaje});
              } else {
                this.messageService.add({severity:'error', summary:'Error', detail: 'Error por parte del servidor.'});
              }
            }
          })
        }
      })
    })
  }

  showPreview(event, i: number) {
    if((event.target as HTMLInputElement).files[0]) {
      this.ordenVenta.detalle[i].planoFile = (event.target as HTMLInputElement).files[0];
      this.ordenVenta.detalle[i].plano = this.ordenVenta.detalle[i].planoFile.name;
    }
  }

  showPreviewEspTec(event, i: number) {
    console.log(event)
    if((event.target as HTMLInputElement).files[0]) {
      this.ordenVenta.detalle[i].especificacionesTecnicasFile = (event.target as HTMLInputElement).files[0];
      this.ordenVenta.detalle[i].especificacionesTecnicas = this.ordenVenta.detalle[i].especificacionesTecnicasFile.name;
    }
  }

  downloadFile(i: number) {
    let ordVentaDetalle: OrdenVentaDetalle = this.ordenVenta.detalle[i];

    if(!ordVentaDetalle.id) {
      FileSaver.saveAs(ordVentaDetalle.planoFile, this.ordenVenta.detalle[i].plano)
    } else {
      this.cotizacionService.downloadFile(ordVentaDetalle.plano, 1).subscribe({
        next: res => {
          FileSaver.saveAs(res, ordVentaDetalle.plano)
        }, error: err => {
          if(err.status == 409) {
            this.messageService.add({severity:'warn', summary:'Advertencia', detail:err.error.mensaje});
          } else {
            this.messageService.add({severity:'error', summary:'Error', detail: 'Error por parte del servidor.'});
          }
        }
      })
    }
  }

  downloadFileEspTec(i: number) {
    let ordVentaDetalle: OrdenVentaDetalle = this.ordenVenta.detalle[i];

    if(!ordVentaDetalle.id) {
      FileSaver.saveAs(ordVentaDetalle.especificacionesTecnicasFile, this.ordenVenta.detalle[i].especificacionesTecnicas)
    } else {
      this.cotizacionService.downloadFile(ordVentaDetalle.especificacionesTecnicas, 2).subscribe({
        next: res => {
          FileSaver.saveAs(res, ordVentaDetalle.especificacionesTecnicas)
        }, error: err => {
          if(err.status == 409) {
            this.messageService.add({severity:'warn', summary:'Advertencia', detail:err.error.mensaje});
          } else {
            this.messageService.add({severity:'error', summary:'Error', detail: 'Error por parte del servidor.'});
          }
        }
      })
    }
  }

  asignarCliente(event) {

    let enc: boolean = false;

    for(let i: number = 0; i < this.departamentos.length; i++) {
      for(let j: number = 0; j < this.departamentos[i].provincias.length; j++) {
        if(this.departamentos[i].provincias[j].distritos.find(d => d.id == event.distrito.id)) {
          this.departamentoSeleccionado = this.departamentos[i];
          setTimeout(() => {
            this.provinciaSeleccionada = this.departamentos[i].provincias[j];
            setTimeout(() => {
              this.cliente = event;
              this.cliente.nroDocumentoIdentidad = event.nroDocumentoIdentidad;
              this.cliente.distrito = this.departamentos[i].provincias[j].distritos.find(d => d.id == event.distrito.id);

              enc = true;
            }, 200)
          }, 200)
          break;
        }

        if(enc) {
          break;
        }
      }
    }
  }

  getClienteAutocomplete(event) {
    this.clienteService.getClientesAutocomplete(event.query).subscribe({
      next: res => {
        this.clientesAutocomplete = res;
      }, error: err => {
        if(err.status == 409) {
          this.messageService.add({severity:'warn', summary:'Advertencia', detail:err.error.mensaje});
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail: 'Error por parte del servidor.'});
        }
      }
    })
  }

  agregarContacto() {

    if(!this.cliente) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar el correo del nuevo contacto.'});
      return;
    }

    this.ref = this.dialogService.open(ModalAgregarContactoClienteComponent,{
      width: '900px',
      height: '200px'
    })

    this.ref.onClose.subscribe(resp => {
      if(resp){
        this.cliente.contactos.push(resp);
      }
    })
  }

  setMoneda() {
    this.ordenVenta.tipoCambio = this.ordenVenta.tipoMoneda.tipoCambio;
  }

  agregarAuxiliar(codAux: string) {
    let id: number;

    switch(codAux) {
      case 'TIPDOC': {
        id = this.documentoIdentidadSelect.length + 1;
        break;
      }
      case 'TIPFPG': {
        id = this.formasPagoSelect.length + 1;
        break;
      }
      case 'TIPMPG': {
        id = this.metodosPagoSelect.length + 1;
        break;
      }
    }

    this.ref = this.dialogService.open(ModalAgregarAuxiliarComponent,{
      data: {
        id: id,
        codAux: codAux,
      },
      width: '500px',
      height: '200px'
    })

    this.ref.onClose.subscribe(resp => {
      if(resp?.response){
        switch(codAux) {
          case 'TIPDOC': {
            this.documentoIdentidadSelect.push(resp.response);
            break;
          }
          case 'TIPFPG': {
            this.formasPagoSelect.push(resp.response);
            break;
          }
          case 'TIPMPG': {
            this.metodosPagoSelect.push(resp.response);
            break;
          }
        }
      }
    })
  }

  buscarRuc() {

    if(!this.cliente.tipoDocumentoIdentidad) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail: 'Seleccione un tipo de documento de identidad.'});
      return;
    }

    if(!this.cliente.tipoDocumentoIdentidad.valor) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail: 'El tipo de documento seleccionado no tiene una comunicación para consultar datos de identidad. Ingrese los datos manualmente, por favor.'});
      return;
    }

    if(!this.cliente.nroDocumentoIdentidad) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail: 'Debe ingresar un número de documento de identidad.'});
      return;
    }

    if(+this.cliente.tipoDocumentoIdentidad.valor==1 && this.cliente.nroDocumentoIdentidad.length != 8) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail: 'En el caso de DNI debe ingresar un número de documento de 8 dígitos. Gracias.'});
      return;
    }

    if(+this.cliente.tipoDocumentoIdentidad.valor==2 && this.cliente.nroDocumentoIdentidad.length != 11) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail: 'En el caso de RUC debe ingresar un número de documento de 11 dígitos. Gracias.'});
      return;
    }

    this.clienteService.buscarRuc(this.cliente.nroDocumentoIdentidad, +this.cliente.tipoDocumentoIdentidad.valor).subscribe({
      next: res => {
        if(res.error) {
          this.messageService.add({severity:'warn', summary:'Advertencia', detail: res.error});
          return;
        } else if(res.mensaje) {
          this.messageService.add({severity:'warn', summary:'Advertencia', detail: res.mensaje});
          return;
        } else {
          console.log(res)
          this.cliente.id = res.id
          this.cliente.razonSocial = res.nombre
          this.cliente.situacionSunat = res.condicion
          this.cliente.estadoSunat = res.estado
          this.cliente.direccion = res.direccion.replace('-', '');

          this.cliente.contactos = res.contactos?res.contactos:[];

          let enc: boolean = false;

          for(let i: number = 0; i < this.departamentos.length; i++) {
            for(let j: number = 0; j < this.departamentos[i].provincias.length; j++) {
              if(this.departamentos[i].provincias[j].distritos.find(d => d.ubigeoSunat == res.ubigeo)) {
                this.departamentoSeleccionado = this.departamentos[i];
                setTimeout(() => {
                  this.provinciaSeleccionada = this.departamentos[i].provincias[j];
                  setTimeout(() => {
                    this.cliente.distrito = this.departamentos[i].provincias[j].distritos.find(d => d.ubigeoSunat == res.ubigeo);
                    enc = true;
                  }, 200)
                }, 200)
                break;
              }

              if(enc) {
                break;
              }
            }
          }
        }
      }, error: err => {
        if(err.status == 409) {
          this.messageService.add({severity:'warn', summary:'Advertencia', detail:err.error.mensaje});
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail: 'Error por parte del servidor.'});
        }
      }
    })
  }

  autocompleteProducto(event) {
    this.productoVentaService.autocomplete(event.query).subscribe({
      next: res => {
        this.listadoProductosAutocomplete = res;
      }, error: err => {
        if(err.status == 409) {
          this.messageService.add({severity:'warn', summary:'Advertencia', detail:err.error.mensaje});
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail: 'Error por parte del servidor.'});
        }
      }
    })
  }

  asignarPrecio(i: number, event) {
    if(this.ordenVenta.detalle.find((d, l) => d.producto?.id == event.id && l != i)) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Ya hay un registro con el producto seleccionado.'});
      this.ordenVenta.detalle[i].producto = null;
    } else {
      this.ordenVenta.detalle[i].precioVentaUnitario = this.ordenVenta.detalle[i].producto.precioVentaBase;
    }
  }

  addItem() {
    let detalle: OrdenVentaDetalle = new OrdenVentaDetalle();
    detalle.cantidad = 0;
    detalle.descuentoMonto = 0;
    detalle.descuentoPorcentaje = 0;
    detalle.precioVentaUnitario = 0;
    detalle.total = 0;
    this.ordenVenta.detalle.push(detalle);
  }
  
  quitar(i) {
    this.ordenVenta.detalle = this.ordenVenta.detalle.filter((d, l) => l != i)
  }

  calcularTotal(i: number, event, ind: number) {
    let det = this.ordenVenta.detalle[i];

    let total = det.cantidad*det.precioVentaUnitario;

    if(ind == 3) {
      det.descuentoMonto = Number((total*det.descuentoPorcentaje/100).toFixed(2));
    } else if(ind == 4) {
      det.descuentoPorcentaje = Number((det.descuentoMonto/total*100).toFixed(2));
    }

    det.total = total - det.descuentoMonto;

    let acumulado: number = 0;
    let descuento: number = 0;

    this.ordenVenta.detalle.forEach(d => {
      acumulado += d.cantidad*d.precioVentaUnitario;
      descuento += d.descuentoMonto;
    })

    this.subtotal = acumulado;
    this.ordenVenta.descuentoTotal = descuento;
    this.ordenVenta.subtotal = acumulado - descuento;
    this.ordenVenta.montoIgv = Number((this.ordenVenta.subtotal*0.18).toFixed(2))*(this.ordenVenta.indIncluyeIgv?1:0);
    this.ordenVenta.total = Number((this.ordenVenta.subtotal*(this.ordenVenta.indIncluyeIgv?1.18:1)).toFixed(2));
  }

  calcularTotal2() {

    let acumulado: number = 0;
    let descuento: number = 0;

    this.ordenVenta.detalle.forEach(d => {
      acumulado += d.cantidad*d.precioVentaUnitario;
      descuento += d.descuentoMonto;
    })

    this.subtotal = acumulado;
    this.ordenVenta.descuentoTotal = descuento;
    this.ordenVenta.subtotal = acumulado - descuento;
    this.ordenVenta.montoIgv = Number((this.ordenVenta.subtotal*0.18).toFixed(2))*(this.ordenVenta.indIncluyeIgv?1:0);
    this.ordenVenta.total = Number((this.ordenVenta.subtotal*(this.ordenVenta.indIncluyeIgv?1.18:1)).toFixed(2));

  }
  
  registrarDespachos() {
    if(this.ordenVenta.detalle.length == 0) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe registrar productos para asignar los despachos.'});
      return;
    }
    
    if(this.ordenVenta.detalle.find(p => p.cantidad == 0)) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe asignar las cantidades de los productos del pedido para poder asignar los despachos.'});
      return;
    }

    this.ref = this.dialogService.open(ModalRegistroDespachosComponent, {
      data: {
        despachos: JSON.parse(JSON.stringify(this.ordenVenta.despacho)),
        productos: JSON.parse(JSON.stringify(this.ordenVenta.detalle)),
        fechaEntrega: this.ordenVenta.fechaEntregaBase,
        adelanto: this.ordenVenta.adelanto,
        total: this.ordenVenta.total
      },
      width: '400px',
      height: '320px'
    })

    this.ref.onClose.subscribe(res => {
      if(res) {
        this.ordenVenta.despacho = res;
      }
    })
  }

  setMetodoPago(){
    if(this.ordenVenta.tipoPago?.tablaAuxiliarDetalleId?.id == 1) {
      this.ordenVenta.adelanto = null;
      this.ordenVenta.adelantoPorc = null;
    } else if(this.ordenVenta.tipoPago?.tablaAuxiliarDetalleId?.id == 2) {
      this.ordenVenta.metodoPago = null;
      this.ordenVenta.diasPagoCredito = null;

      this.ordenVenta.adelantoPorc = 50;
      this.ordenVenta.adelanto = this.ordenVenta.adelantoPorc*this.ordenVenta.total/100;
    }
  }

  inputAdelanto(event) {
    let adelanto: number = Number(event.value);
    this.ordenVenta.adelantoPorc = 100*adelanto/this.ordenVenta.total;
  }

  inputAdelantoPorc(event) {
    let adelanto: number = Number(event.value);
    this.ordenVenta.adelanto = this.ordenVenta.total*adelanto/100;
  }

  guardar() {

    if(!this.cliente.tipoDocumentoIdentidad) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe seleccionar el tipo de documento de identidad del cliente.'});
      return;
    }
    
    if(!this.cliente.nroDocumentoIdentidad || this.cliente.nroDocumentoIdentidad.length == 0) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar el número de documento de identidad del cliente.'});
      return;
    }
    
    if(!this.cliente.razonSocial || this.cliente.razonSocial.length == 0) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar el nombre del cliente.'});
      return;
    }
    
    if(!this.cliente.distrito) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe seleccionar el distrito del cliente.'});
      return;
    }
    
    if(!this.cliente.razonSocial || this.cliente.razonSocial.length == 0) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar la dirección del cliente.'});
      return;
    }
    
    if(!this.ordenVenta.contacto) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe seleccionar un contacto del cliente.'});
      return;
    }
    
    if(!this.ordenVenta.fechaEntregaBase && this.indPasarVenta) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe seleccionar una fecha de entrega.'});
      return;
    }
    
    if(!this.ordenVenta.tipoMoneda && this.indPasarVenta) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe seleccionar una moneda de pago.'});
      return;
    }
    
    if(!this.ordenVenta.diasValidez && this.indPasarVenta) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar una cantidad de días de validez.'});
      return;
    }
    
    if(!this.ordenVenta.aniosGarantia && this.indPasarVenta) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar los años de garantía.'});
      return;
    }
    
    if(!this.ordenVenta.diasValidez && this.indPasarVenta) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar un plazo de entrega.'});
      return;
    }
    
    if(this.ordenVenta.detalle.length == 0) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar al menos un producto.'});
      return;
    }
    
    if(this.ordenVenta.detalle.find(d => d.cantidad == 0)) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Hay productos que tienen cantidad 0.'});
      return;
    }
    
    if(this.ordenVenta.despacho.length == 0 && this.indPasarVenta) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar al menos un despacho.'});
      return;
    }
    
    if((!this.ordenVenta.nombreTrabajo || this.ordenVenta.nombreTrabajo.length == 0) && this.indPasarVenta) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar el nombre de la obra.'});
      return;
    }
    
    if(this.ordenVenta.detalle.find(d => !d.plano || !d.planoFile) && this.indPasarVenta) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar los planos faltantes de los productos.'});
      return;
    }
    
    if(!this.ordenVenta.tipoPago && this.indPasarVenta) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe seleccionar un tipo de pago.'});
      return;
    }
    
    if(this.ordenVenta.diasPagoCredito == 0 && this.indPasarVenta && this.ordenVenta.tipoPago.tablaAuxiliarDetalleId.id==1) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar los días de crédito.'});
      return;
    }
    
    if(!this.ordenVenta.metodoPago && this.indPasarVenta && this.ordenVenta.tipoPago.tablaAuxiliarDetalleId.id==1) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar el método de pago.'});
      return;
    }
    
    if((!this.ordenVenta.adelanto || !this.ordenVenta.adelantoPorc) && this.indPasarVenta && this.ordenVenta.tipoPago.tablaAuxiliarDetalleId.id==2) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar el adelanto de la venta.'});
      return;
    }
    
    if(this.ordenVenta.detalle.find(d => !d.especificacionesTecnicas || !d.especificacionesTecnicasFile) && this.indPasarVenta) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar las espcificaciones técnicas faltantes de los productos.'});
      return;
    }

    this.ordenVenta.cliente = this.cliente;

    /*this.ordenVenta.detalle.forEach(p => {
      p.idUsuarioCrea = this.authService.usuario.id;
      this.ordenVenta.despacho.forEach(d => {
        d.detalle.forEach(dp => {
          if(dp.producto.id == p.producto.id) {
            dp.precioTotal = dp.cantidad*(p.precioVentaUnitario - p.descuentoMonto)*1.18;
          }
        })
      })
    })

    this.ordenVenta.despacho.forEach(d => {
      let montoDespacho: number = 0
      d.detalle.forEach(dp => {
        montoDespacho += dp.precioTotal;
      })

      d.precioTotal=  (this.ordenVenta.total-this.ordenVenta.adelanto)*montoDespacho/this.ordenVenta.adelanto;
    })*/

    if(this.indPasarVenta) {

      this.ordenVenta.idUsuarioModifica = this.authService.usuario.id;
      this.ordenVenta.fechaModifica = new Date();
      this.ordenVenta.pagoPendiente = this.ordenVenta.total;

      this.cotizacionService.updateVenta(this.ordenVenta.id, this.ordenVenta).subscribe({
        next: res => {
          let observables: Observable<any>[] = [];

          this.ordenVenta.detalle.forEach((d, i) => {
            observables.push(this.cotizacionService.subirPlanoEspecificaciones(d.planoFile, d.especificacionesTecnicasFile, `${i}`, `${d.id}`))
          })

          let fork  = forkJoin(observables)

          fork.subscribe({
            next: res => {
              if(res[observables.length - 1]) {
                this.messageService.add({severity:'success', summary:'Éxito', detail:'Venta registrada correctamente.'});
                this.router.navigate(['/ventas/cotizacion'])
              }
            }
          })
        }, error: err => {
          if(err.status == 409) {
            this.messageService.add({severity:'warn', summary:'Advertencia', detail:err.error.mensaje});
          } else {
            this.messageService.add({severity:'error', summary:'Error', detail: 'Error por parte del servidor.'});
          }
        }
      })

    } else {

      this.ordenVenta.idUsuarioCrea = this.authService.usuario.id;
      this.ordenVenta.fechaCrea = new Date();

      let empresaId: number = Number(localStorage.getItem('empresa_id'))
  
      this.cotizacionService.create(this.ordenVenta, empresaId).subscribe({
        next: res => {
          this.messageService.add({severity:'success', summary:'Éxito', detail:'Cotización registrada correctamente.'});
          this.router.navigate(['/ventas/cotizacion'])
  
        }, error: err => {
          this.messageService.add({severity:'error', summary:'Error', detail:'Error al registrar cotización.'});
        }
      })

    }
  }

}