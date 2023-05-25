import { Component, OnInit } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { OrdenVentaDespacho } from '../../models/orden-venta-despacho';
import { ModalRegistroProductosDespachosComponent } from './modal-registro-productos-despachos/modal-registro-productos-despachos.component';
import { OrdenVentaDetalle } from '../../models/orden-venta-detalle';
import { OrdenVentaDespachoDetalle } from '../../models/orden-venta-despacho-detalle';
import { FuncionesComunesService } from 'src/app/commons/funciones-comunes.service';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-modal-registro-despachos',
  templateUrl: './modal-registro-despachos.component.html',
  styleUrls: ['./modal-registro-despachos.component.css']
})
export class ModalRegistroDespachosComponent implements OnInit {

  despachos: OrdenVentaDespacho[] = [];
  productos: OrdenVentaDetalle[];
  productosAux: OrdenVentaDetalle[];

  fechaMax: Date;
  total: number;
  adelanto: number;

  refModal: DynamicDialogRef;

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private dialogService: DialogService,
    private messageService: MessageService,
    private funcionesComunes: FuncionesComunesService,
    private pipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.config.data.despachos.forEach(d => {
      d.minDate = new Date(d.minDate);
      d.fechaPropuesta = new Date(d.fechaPropuesta);
    })
    
    this.productos  = this.config.data.productos;
    this.despachos  = this.config.data.despachos;
    this.fechaMax   = this.config.data.fechaEntrega;
    this.total   = this.config.data.total;
    this.adelanto   = this.config.data.adelanto==null?0:this.config.data.adelanto;

    this.productosAux = JSON.parse(JSON.stringify(this.productos))
  }

  addDespacho() {
    if(this.despachos.length > 0 && !this.despachos[this.despachos.length - 1].fechaPropuesta) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe asignar una fecha al último despacho agregado.'})
      return;
    }

    let despacho: OrdenVentaDespacho = new OrdenVentaDespacho();
    if(this.despachos.length > 0) {
      //console.log(this.funcionesComunes.agregarDias(this.pipe.transform(this.despachos[this.despachos.length-1].fechaPropuesta, 'yyyy-mm-dd'), 1))
      despacho.minDate = new Date(this.funcionesComunes.agregarDias(this.pipe.transform(this.despachos[this.despachos.length-1].fechaPropuesta, 'yyyy-MM-dd'), 1) + ' 00:00:00.00000')
    }
    this.despachos.push(despacho);
  }

  quitar(index: number) {
    let despacho: OrdenVentaDespachoDetalle[] = this.despachos[index].detalle;
 
    despacho.forEach(d => {
      this.productos.find(p => p.producto.id == d.producto.id).cantidad += d.cantidad
    })

    this.despachos = this.despachos.filter((l,h) => h != index);
  }

  close(){
    this.ref.close()
  }

  asignar() {
    if(this.despachos.find(d => d.detalle.length == 0)) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Hay despachos sin productos de entrega asignados.'})
      return;
    }

    this.ref.close(this.despachos)
  }

  registrarProductos(i: number) {
    this.refModal = this.dialogService.open(ModalRegistroProductosDespachosComponent, {
      data: {
        productos: this.productos,
        aux: this.productosAux,
        asignados: JSON.parse(JSON.stringify(this.despachos[i].detalle))
      },
      width: '1000px',
      height: '700px'
    })

    this.refModal.onClose.subscribe(res => {
      if(res) {
        this.despachos[i].detalle = res;

        let montoDespacho: number = 0
        this.despachos[i].detalle.forEach(dp => {
          montoDespacho = Number(montoDespacho) + Number(dp.precioTotal);
        })

        this.despachos[i].precioTotal= (this.total - this.adelanto)*montoDespacho/this.total;
      }
    })

  }

}
