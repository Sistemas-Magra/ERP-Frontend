import { Component, OnInit } from '@angular/core';
import { AuxiliarService } from 'src/app/auxiliar/auxiliar.service';
import { TablaAuxiliarDetalle } from 'src/app/auxiliar/models/tabla-auxiliar-detalle';
import { Planta } from 'src/app/maestros/models/planta';
import { PlantaService } from 'src/app/maestros/planta.service';
import { ProduccionService } from '../produccion.service';
import { forkJoin } from 'rxjs'
import { DatePipe } from '@angular/common';
import { MenuItem, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModalFormatosComponent } from './modal-formatos/modal-formatos.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listado-registro-programacion-produccion',
  templateUrl: './listado-registro-programacion-produccion.component.html',
  styleUrls: ['./listado-registro-programacion-produccion.component.css']
})
export class ListadoRegistroProgramacionProduccionComponent implements OnInit {

  fechaFilter: Date[] = [new Date(), new Date()];
  plantas: Planta[];
  estadosSelect: TablaAuxiliarDetalle[];
  estadoFilter: TablaAuxiliarDetalle;

  listadosRegistrosProduccion: any[];

  optionsRc: MenuItem[] = [];
  rowSelected: any;
  
  ref: DynamicDialogRef;

  validarFila: number = -1;

  constructor(
    private auxiliarService: AuxiliarService,
    private plantaService: PlantaService,
    private produccionService: ProduccionService,
    private dialogService: DialogService,
    private pipe: DatePipe,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {

    this.optionsRc = [
      {label: 'Revisar Formatos', icon: 'pi pi-fw pi-eye', command: () => this.abrirModalFormatos(this.rowSelected)},
      {label: 'Registrar calidad', icon: 'pi pi-fw pi-check', command: () => this.registrarCalidad(this.rowSelected)},
    ]

    let fork = forkJoin([
      this.plantaService.getPlantasActivas(),
      this.auxiliarService.getListSelect('ESTPRD'),
      this.produccionService.getListado(this.pipe.transform(this.fechaFilter[0], 'yyyy-MM-dd'), this.pipe.transform(this.fechaFilter[1], 'yyyy-MM-dd'), 1)
    ])

    fork.subscribe({
      next: res => {
        this.plantas = res[0];
        this.estadosSelect = res[1];
        this.listadosRegistrosProduccion = res[2];
      }
    })
  }

  asignarFila(i: number) {
    this.validarFila = i;
  }

  registrarCalidad(item) {
    sessionStorage.setItem("idCalidad", item.id);
    this.router.navigate(['/produccion/registro-produccion-postes'])
  }

  abrirModalFormatos(item: any) {
    this.ref = this.dialogService.open(ModalFormatosComponent, {
      data: {
        id: item.id,
        fecha: item.fecha
      },
      width: '1200px',
      height: '900px'
    })
  }

  buscar() {
    this.produccionService.getListado(
      this.pipe.transform(this.fechaFilter[0], 'yyyy-MM-dd'),
      this.pipe.transform(this.fechaFilter[1], 'yyyy-MM-dd'), 
      this.estadoFilter?.tablaAuxiliarDetalleId?.id
    ).subscribe({

      next: res => {
        console.log(res)
        this.listadosRegistrosProduccion = res;
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
