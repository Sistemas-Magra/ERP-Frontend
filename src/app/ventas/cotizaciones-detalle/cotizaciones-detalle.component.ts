import { Component, OnInit } from '@angular/core';
import { Cliente } from 'src/app/maestros/models/cliente';
import { ClienteService } from '../cliente.service';
import { MessageService } from 'primeng/api';
import { TablaAuxiliarDetalle } from 'src/app/auxiliar/models/tabla-auxiliar-detalle';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModalAgregarAuxiliarComponent } from 'src/app/commons/modal-agregar-auxiliar/modal-agregar-auxiliar.component';
import { AuxiliarService } from 'src/app/auxiliar/auxiliar.service';
import { forkJoin } from 'rxjs';
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
import { Router } from '@angular/router';

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
  saldosPagoSelect: TablaAuxiliarDetalle[];
  monedaSelect: Moneda[]

  departamentos: Departamento[];
  departamentoSeleccionado: Departamento = new Departamento();
  provinciaSeleccionada: Provincia = new Provincia();

  listadoProductosAutocomplete: ProductoVenta[] = [];

  indFilaEditada: number = -1;

  ref: DynamicDialogRef;

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
    private router: Router
  ) { }

  ngOnInit(): void {
    
    let fork = forkJoin(
      [
        this.auxiliarService.getListSelect('TIPDOC'),
        this.auxiliarService.getListSelect('TIPFPG'),
        this.auxiliarService.getListSelect('TIPSPG'),
        this.monedaService.getAllMonedas(),
        this.departamentoService.getAll(),
        this.tipoCambioService.getUltimoTipoCambio(),
        this.auxiliarService.getDetalleById('ESTVEN', 1)
      ]
    )

    fork.subscribe(res => {
      this.documentoIdentidadSelect = res[0]
      this.formasPagoSelect = res[1]
      this.saldosPagoSelect = res[2]
      this.monedaSelect = res[3]
      this.departamentos = res[4];
      this.ordenVenta.estado = res[6];

      setTimeout(()=> {
        this.ordenVenta.tipoMoneda = this.monedaSelect[0];
        this.ordenVenta.tipoCambio = this.monedaSelect[0].tipoCambio;
      })
    })
  }

  asignarCliente(event) {
    console.log(event)

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
      case 'TIPSPG': {
        id = this.saldosPagoSelect.length + 1;
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
          case 'TIPSPG': {
            this.saldosPagoSelect.push(resp.response);
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
      }
    })
  }

  autocompleteProducto(event) {
    this.productoVentaService.autocomplete(event.query).subscribe({
      next: res => {
        this.listadoProductosAutocomplete = res;
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
        productos: JSON.parse(JSON.stringify(this.ordenVenta.detalle))
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
    
    if(!this.ordenVenta.formaPago) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe seleccionar una forma de pago.'});
      return;
    }
    
    if(!this.ordenVenta.saldoPago) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe seleccionar un saldo de pago.'});
      return;
    }
    
    if(!this.ordenVenta.fechaEntregaBase) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe seleccionar una fecha de entrega.'});
      return;
    }
    
    if(!this.ordenVenta.tipoMoneda) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe seleccionar una moneda de pago.'});
      return;
    }
    
    if(!this.ordenVenta.diasValidez) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar una cantidad de días de validez.'});
      return;
    }
    
    if(!this.ordenVenta.aniosGarantia) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar los años de garantía.'});
      return;
    }
    
    if(!this.ordenVenta.diasValidez) {
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
    
    if(this.ordenVenta.despacho.length == 0) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar al menos un despacho.'});
      return;
    }

    this.ordenVenta.cliente = this.cliente;

    this.ordenVenta.detalle.forEach(p => {
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

      d.precioTotal= montoDespacho;
    })

    this.ordenVenta.idUsuarioCrea = this.authService.usuario.id;
    this.ordenVenta.fechaCrea = new Date();

    this.cotizacionService.create(this.ordenVenta).subscribe({
      next: res => {
        this.messageService.add({severity:'success', summary:'Éxito', detail:'Cotización registrada correctamente.'});
        this.router.navigate(['/cotizacion'])

      }, error: err => {
        this.messageService.add({severity:'error', summary:'Error', detail:'Error al registrar cotización.'});
      }
    })
  }

}