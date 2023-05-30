import { Component, OnInit } from '@angular/core';
import { MessageService, SelectItemGroup } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Planta } from 'src/app/maestros/models/planta';
import { PlantaService } from 'src/app/maestros/planta.service';
import { forkJoin } from 'rxjs'
import { AuxiliarService } from 'src/app/auxiliar/auxiliar.service';
import { TablaAuxiliarDetalle } from 'src/app/auxiliar/models/tabla-auxiliar-detalle';
import { FormatosService } from '../../formatos.service';

@Component({
  selector: 'app-modal-formatos',
  templateUrl: './modal-formatos.component.html',
  styleUrls: ['./modal-formatos.component.css']
})
export class ModalFormatosComponent implements OnInit {

  fecha: string;

  listadoFormatos: SelectItemGroup[] = [
    {
      label: 'POSTES',
      items: [
        {label: 'Mezclado'      , value: 1},
        {label: 'Estructura'    , value: 2},
        {label: 'Tubos y Pines' , value: 3},
        {label: 'Centrifugado'  , value: 4},
        {label: 'Desencrofado'  , value: 5},
        {label: 'Curado'        , value: 6},
      ]
    },

    {
      label: 'ACCESORIOS',
      items: [
        {label: 'Mezclado'      , value: 7},
        {label: 'Armado'        , value: 8},
        {label: 'Vibración'     , value: 9},
        {label: 'Acabado'       , value: 10}
      ]
    }
  ];

  formatoSeleccionado: any;

  plantas: Planta[];
  plantaSeleccionada: Planta;

  listado: any[] = [];
  listadoColumnas: any[] = [];

  listadoDiametrosVarillas: TablaAuxiliarDetalle[];
  listadoDiametrosAnillos: TablaAuxiliarDetalle[];
  listadoDiametrosRoldanas: TablaAuxiliarDetalle[];
  
  listadoDiametrosPines: TablaAuxiliarDetalle[];
  listadoDiametrosPistones: TablaAuxiliarDetalle[];

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private plantaService: PlantaService,
    private auxiliarService: AuxiliarService,
    private formatoService: FormatosService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.fecha = this.config.data.fecha;

    let fork = forkJoin([
      this.plantaService.getPlantasActivas(),
      this.auxiliarService.getListSelect('MEDVAR'),
      this.auxiliarService.getListSelect('MEDANI'),
      this.auxiliarService.getListSelect('MEDROL'),
      this.auxiliarService.getListSelect('MEDPIN'),
      this.auxiliarService.getListSelect('MEDPIS')
    ])

    fork.subscribe({
      next: res => {
        this.plantas = res[0];

        this.listadoDiametrosVarillas = res[1];
        this.listadoDiametrosAnillos = res[2];
        this.listadoDiametrosRoldanas = res[3];
        
        this.listadoDiametrosPines = res[4];
        this.listadoDiametrosPistones = res[5];
      }
    })
  }

  selectFormatos() {
    if(!this.formatoSeleccionado) {
      return;
    }
    
    if(!this.plantaSeleccionada) {
      return;
    }

    this.formatoService.getListadoFormatoVista(this.config.data.id, this.plantaSeleccionada?.id, this.formatoSeleccionado).subscribe({
      next: res => {
        this.listado = res.listado;
      }, error: err => {
        if(err.status == 409) {
          this.messageService.add({severity:'warn', summary:'Advertencia', detail:err.error.mensaje});
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail: 'Error por parte del servidor.'});
        }
      }
    })
  }

  close() {
    this.ref.close();
  }

}
