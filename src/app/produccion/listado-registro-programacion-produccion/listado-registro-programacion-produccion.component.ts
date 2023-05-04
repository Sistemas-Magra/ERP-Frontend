import { Component, OnInit } from '@angular/core';
import { AuxiliarService } from 'src/app/auxiliar/auxiliar.service';
import { TablaAuxiliarDetalle } from 'src/app/auxiliar/models/tabla-auxiliar-detalle';
import { Planta } from 'src/app/maestros/models/planta';
import { PlantaService } from 'src/app/maestros/planta.service';
import { ProduccionService } from '../produccion.service';
import { forkJoin } from 'rxjs'
import { DatePipe } from '@angular/common'

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

  constructor(
    private auxiliarService: AuxiliarService,
    private plantaService: PlantaService,
    private produccionService: ProduccionService,
    private pipe: DatePipe
  ) { }

  ngOnInit(): void {
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

  buscar() {
    this.produccionService.getListado(
      this.pipe.transform(this.fechaFilter[0], 'yyyy-MM-dd'),
      this.pipe.transform(this.fechaFilter[1], 'yyyy-MM-dd'), 
      this.estadoFilter?.tablaAuxiliarDetalleId?.id
    ).subscribe({

      next: res => {
        this.listadosRegistrosProduccion = res;
      }

    })
  }

}
