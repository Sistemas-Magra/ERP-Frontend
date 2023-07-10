import { Component, OnInit } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EmpresaTransporteService } from 'src/app/transporte/empresa-transporte.service';
import { EmpresaTransporte } from 'src/app/transporte/models/empresa-transporte';
import { VehiculoEmpresaTransporte } from 'src/app/transporte/models/vehiculo-empresa-transporte';
import { ModalIngresarEmpresaTransporteComponent } from './modal-ingresar-empresa-transporte/modal-ingresar-empresa-transporte.component';
import { ModalIngresarVehiculoComponent } from './modal-ingresar-vehiculo/modal-ingresar-vehiculo.component';
import { ModalIngresarConductorComponent } from './modal-ingresar-conductor/modal-ingresar-conductor.component';
import { AuxiliarService } from 'src/app/auxiliar/auxiliar.service';
import { TablaAuxiliarDetalle } from 'src/app/auxiliar/models/tabla-auxiliar-detalle';
import { MessageService } from 'primeng/api';
import { Formulario } from '../../models/formulario';
import { ConductorEmpresaTransporte } from 'src/app/transporte/models/conductor-empresa-transporte';
import { FormularioService } from '../../formulario.service';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-modal-datos-despacho',
  templateUrl: './modal-datos-despacho.component.html',
  styleUrls: ['./modal-datos-despacho.component.css']
})
export class ModalDatosDespachoComponent implements OnInit {

  empresaTransporteSelect: EmpresaTransporte[];
  motivosTraslado: TablaAuxiliarDetalle[];

  motivoTrasladoSeleccionado: TablaAuxiliarDetalle;
  empresaTransporte:EmpresaTransporte;
  vehiculo: VehiculoEmpresaTransporte;
  conductor: ConductorEmpresaTransporte;
  destino: string;

  formulario: Formulario;

  modal: DynamicDialogRef;

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private dialogService: DialogService,
    private auxiliarService: AuxiliarService,
    private empresaTransporteService: EmpresaTransporteService,
    private formularioService: FormularioService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {

    this.formulario = this.config.data.formulario;

    this.auxiliarService.getListSelect('TIPMTT').subscribe({
      next: res => {
        this.motivosTraslado = res;
      }
    })

    this.empresaTransporteService.getAll().subscribe({
      next: res => {
        this.empresaTransporteSelect = res;
      }
    })
  }

  imprimir() {

    if(!this.motivoTrasladoSeleccionado) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail: 'Debe seleccionar el motivo de traslado.'});
      return;
    }

    if(!this.empresaTransporte) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail: 'Debe seleccionar la empresa de transporte.'});
      return;
    }

    if(!this.vehiculo) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail: 'Debe seleccionar un vehículo.'});
      return;
    }

    if(!this.conductor) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail: 'Debe seleccionar un conductor.'});
      return;
    }

    if(!this.destino || this.destino.length == 0) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail: 'Debe ingresar un destino.'});
      return;
    }

    this.formulario.empresaTransporte = this.empresaTransporte;
    this.formulario.vehiculo = this.vehiculo;
    this.formulario.conductor = this.conductor;
    this.formulario.destino = this.destino;
    this.formulario.motivoTraslado = this.motivoTrasladoSeleccionado;

    this.formularioService.generarRemision(this.formulario).subscribe({
      next: (blob: Blob) => {
        FileSaver.saveAs(blob, `remision.pdf`);
      }
    })

  }

  aniadirConductor() {
    this.modal = this.dialogService.open(ModalIngresarConductorComponent, {
      data: {
        empresaTransporte: this.empresaTransporte
      },
      width: '700px',
      height: '300px'
    })

    this.modal.onClose.subscribe({
      next: res => {
        if(res) {          
          this.empresaTransporteService.getAll().subscribe({
            next: emps => {
              this.empresaTransporteSelect = emps;
              this.empresaTransporte = this.empresaTransporteSelect.find(e => e.id == res.id);
            }
          })
        }
      }
    })

  }

  aniadirVehiculo() {
    this.modal = this.dialogService.open(ModalIngresarVehiculoComponent, {
      data: {
        empresaTransporte: this.empresaTransporte
      },
      width: '700px',
      height: '300px'
    })

    this.modal.onClose.subscribe({
      next: res => {
        if(res) {          
          this.empresaTransporteService.getAll().subscribe({
            next: emps => {
              this.empresaTransporteSelect = emps;
              this.empresaTransporte = this.empresaTransporteSelect.find(e => e.id == res.id);
            }
          })
        }
      }
    })
  }

  aniadirEmpresa() {
    this.modal = this.dialogService.open(ModalIngresarEmpresaTransporteComponent, {
      width: '700px',
      height: '300px'
    })

    this.modal.onClose.subscribe({
      next: res => {
        if(res) {          
          this.empresaTransporteService.getAll().subscribe({
            next: emps => {
              this.empresaTransporteSelect = emps;
              this.empresaTransporte = this.empresaTransporteSelect.find(e => e.id == res.id);
            }
          })
        }
      }
    })
  }

  close() {
    this.ref.close()
  }

}
