import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuxiliarService } from 'src/app/auxiliar/auxiliar.service';
import { TablaAuxiliarDetalle } from 'src/app/auxiliar/models/tabla-auxiliar-detalle';
import { EmpresaTransporteService } from 'src/app/transporte/empresa-transporte.service';
import { EmpresaTransporte } from 'src/app/transporte/models/empresa-transporte';
import { VehiculoEmpresaTransporte } from 'src/app/transporte/models/vehiculo-empresa-transporte';

@Component({
  selector: 'app-modal-ingresar-vehiculo',
  templateUrl: './modal-ingresar-vehiculo.component.html',
  styleUrls: ['./modal-ingresar-vehiculo.component.css']
})
export class ModalIngresarVehiculoComponent implements OnInit {

  tiposVehiculoSelect: TablaAuxiliarDetalle[];

  vehiculo: VehiculoEmpresaTransporte = new VehiculoEmpresaTransporte();

  empresaTransporte: EmpresaTransporte;

  blnHabilitar: boolean = false;

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private auxiliarService: AuxiliarService,
    private empresaTransporteService: EmpresaTransporteService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {

    this.empresaTransporte = this.config.data.empresaTransporte;

    this.auxiliarService.getListSelect('TIPVEH').subscribe({
      next: res => {
        this.tiposVehiculoSelect = res;
      }
    })

  }

  guardar() {

    if(!this.vehiculo.tipoVehiculo) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail: 'Debe seleccionar el tipo de vehículo.'});
      return;
    }

    if(!this.vehiculo.placaDelantera) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail: 'Debe ingresar la placa delantera del vehículo.'});
      return;
    }

    if(!this.vehiculo.placaTrasera) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail: 'Debe ingresar la placa trasera del vehículo.'});
      return;
    }

    if(!this.vehiculo.marca) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail: 'Debe ingresar la marca del vehículo.'});
      return;
    }

    this.vehiculo.stringBusqueda = `${this.vehiculo.tipoVehiculo.nombre} ${this.vehiculo.placaDelantera}/${this.vehiculo.placaTrasera}`;

    this.empresaTransporte.vehiculos.push(this.vehiculo);

    this.empresaTransporteService.createUpdate(this.empresaTransporte).subscribe({
      next: res => {
        this.ref.close(res);
      }
    })

  }

  close() {
    this.ref.close()
  }

}
