import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { OrdenVentaDespachoDetalle } from 'src/app/ventas/models/orden-venta-despacho-detalle';
import { OrdenVentaDetalle } from 'src/app/ventas/models/orden-venta-detalle';

@Component({
  selector: 'app-modal-registro-productos-despachos',
  templateUrl: './modal-registro-productos-despachos.component.html',
  styleUrls: ['./modal-registro-productos-despachos.component.css']
})
export class ModalRegistroProductosDespachosComponent implements OnInit {

  productosDisponibles: OrdenVentaDetalle[] = [];
  productosAsignados: OrdenVentaDespachoDetalle[] = [];

  productosDisponiblesAux: OrdenVentaDetalle[];
  productosAsignadosAux: OrdenVentaDespachoDetalle[];

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.productosDisponibles = this.config.data.productos;
    this.productosDisponiblesAux = JSON.parse(JSON.stringify(this.config.data.productos));
    this.productosAsignados = this.config.data.asignados;
  }

  asignar(i) {

    let prodDisp: OrdenVentaDetalle = this.productosDisponibles[i];
    let asig =  this.productosAsignados.find(p => p.producto.id == prodDisp.producto.id)

    if(asig) {
      asig.cantidad = Number(asig.cantidad) + Number(1);
      asig.precioTotal = asig.cantidad*prodDisp.precioVentaUnitario*1.18;

      prodDisp.cantidad -= 1;
    } else {

      let producto: OrdenVentaDespachoDetalle = new OrdenVentaDespachoDetalle();
  
      producto.producto = prodDisp.producto;
      producto.precioTotal = prodDisp.precioVentaUnitario*producto.cantidad*1.18;
      producto.maxAsig = Number(prodDisp.cantidad);

      this.productosAsignados.push(producto)
      
      prodDisp.cantidad -= 1;
    }
  }

  close(){
    this.ref.close()
  }

  changeAsignacion(i, event) {
    let prodAsig = this.productosAsignados[i];

    let prodDispAux = this.productosDisponiblesAux.find(d => d.producto.id == prodAsig.producto.id)
    let prodDisp = this.productosDisponibles.find(d => d.producto.id == prodAsig.producto.id)

    if(Number(event.value) > Number(prodDispAux.cantidad)) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'No puede asignar una cantidad de despacho mayor al que está en el pedido.'})
      this.productosAsignados[i].cantidad = null;
      prodDisp.cantidad = prodDispAux.cantidad;
      return;
    }

    prodDisp.cantidad = prodDispAux.cantidad - Number(event.value);
  }

  desasignar(i) {
    let prodAsig = this.productosAsignados[i];

    let prodDispAux = this.productosDisponiblesAux.find(d => d.producto.id == prodAsig.producto.id)
    let prodDisp = this.productosDisponibles.find(d => d.producto.id == prodAsig.producto.id)

    prodDisp.cantidad = prodDispAux.cantidad

    this.productosAsignados = this.productosAsignados.filter(pa => pa.producto.id != prodAsig.producto.id)
  }

  guardar() {
    this.ref.close(this.productosAsignados)
  }

}
