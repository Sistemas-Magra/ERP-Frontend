import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProgramacionSemanalService } from '../../programacion-semanal.service';
import { DatePipe } from '@angular/common';
import { FuncionesComunesService } from 'src/app/commons/funciones-comunes.service';
import { Planta } from 'src/app/maestros/models/planta';
import { PlantaService } from 'src/app/maestros/planta.service';
import { forkJoin } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-modal-materiales-requeridos',
  templateUrl: './modal-materiales-requeridos.component.html',
  styleUrls: ['./modal-materiales-requeridos.component.css']
})
export class ModalMaterialesRequeridosComponent implements OnInit {

  listado: any[] = [];
  listadoShow: any[] = [];

  fechas: any[] = [];

  plantas: Planta[];
  plantaSeleccionada:Planta;
  materialFilter: string = '';
  posteFilter: string = '';
  nroOrdenFilter: string = '';
  anioNroOrden: string;

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private programacionService: ProgramacionSemanalService,
    private plantaService: PlantaService,
    private pipe: DatePipe,
    private funcionesComunes: FuncionesComunesService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    let fork = forkJoin([
      this.plantaService.getPlantasActivas()
    ])

    fork.subscribe({
      next: res => {
        this.plantas = res[0];
        this.plantaSeleccionada = this.plantas[0];
        this.buscar();
      }, error: err => {
        this.messageService.add({severity:'error', summary:'Error', detail: 'Error por parte del servidor.'});
      }
    })
  }

  filterNroOrden(event) {
    this.listadoShow = this.listado.filter(i => i.orden_trabajo.includes(event.target.value) && i.resumen.includes(this.posteFilter) && i.ninsumo.includes(this.materialFilter))
  }

  filterPoste(event) {
    this.listadoShow = this.listado.filter(i => i.orden_trabajo.includes(this.nroOrdenFilter) && i.resumen.includes(event.target.value) && i.ninsumo.includes(this.materialFilter))
  }

  filterMaterial(event) {
    this.listadoShow = this.listado.filter(i => i.orden_trabajo.includes(this.nroOrdenFilter) && i.resumen.includes(this.posteFilter) && i.ninsumo.includes(event.target.value))
  }

  buscar() {
    this.fechas = [];
    this.programacionService.getMaterialesProgramados(this.config.data.id, this.plantaSeleccionada.id).subscribe({
      next: res => {

        let fechaInicio: string = res[0].fecha_inicio;
        let fechaFin: string = res[0].fecha_fin;

        this.anioNroOrden = fechaInicio.split('-')[0]

        while(fechaFin != fechaInicio) {
          let fech: any = {};

          fech.show = this.pipe.transform(new Date(`${fechaInicio} 00:00:00.000000`), 'dd MMM yyyy').toUpperCase();
          fech.comp = fechaInicio;
          
          this.fechas.push(fech);

          fechaInicio = this.funcionesComunes.agregarDias(fechaInicio, 1);

          if(fechaFin == fechaInicio) {

            let newFetch: any = {}

            newFetch.show = this.pipe.transform(new Date(`${fechaInicio} 00:00:00.000000`), 'dd MMM yyyy').toUpperCase();
            newFetch.comp = fechaInicio;
  
            this.fechas.push(newFetch);
          }
        }

        let producto: string;
        let cont: number = 0;

        res.forEach((item, i) => {
          if(item.resumen != producto) {

            if(cont%2 == 0) {
              item.ind = 0;
            } else {
              item.ind = 1;
            }

            producto = item.resumen;

            cont = cont + 1;

          } else {
            item.ind = res[i-1].ind
          }
        })

        this.listado= res;
        this.listadoShow = JSON.parse(JSON.stringify(this.listado));
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
