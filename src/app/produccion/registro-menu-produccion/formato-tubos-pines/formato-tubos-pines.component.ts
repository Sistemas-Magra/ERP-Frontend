import { Component, OnInit } from '@angular/core';
import { Planta } from 'src/app/maestros/models/planta';
import { PlantaService } from 'src/app/maestros/planta.service';
import { ProduccionRegistroTubosPines } from '../../models/produccion-registro-tubos-pines';
import { MessageService } from 'primeng/api';
import { OrdenTrabajoService } from '../../orden-trabajo.service';
import { OrdenTrabajo } from '../../models/orden-trabajo';
import { FormatosService } from '../../formatos.service';
import { TablaAuxiliarDetalle } from 'src/app/auxiliar/models/tabla-auxiliar-detalle';
import { AuxiliarService } from 'src/app/auxiliar/auxiliar.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-formato-tubos-pines',
  templateUrl: './formato-tubos-pines.component.html',
  styleUrls: ['./formato-tubos-pines.component.css']
})
export class FormatoTubosPinesComponent implements OnInit {

  listado: ProduccionRegistroTubosPines[] = [];

  fecha: Date = new Date();
  responsable: string;

  plantas: Planta[];
  plantaSeleccionada: Planta;

  listadoOrdenesTrabajo: OrdenTrabajo[];

  listaMedidaPines: TablaAuxiliarDetalle[];
  listaMedidaPistones: TablaAuxiliarDetalle[]

  validarFila: number = -1;
  blnFilaAniadidaSinGuardar: boolean = false;

  constructor(
    private plantaService: PlantaService,
    private messageService: MessageService,
    private ordenTrabajoService: OrdenTrabajoService,
    private auxiliarService: AuxiliarService,
    private formatoService: FormatosService,
  ) { }

  ngOnInit(): void {
    let fork = forkJoin([
      this.plantaService.getPlantasActivas(),
      this.auxiliarService.getListSelect('MEDPIS'),
      this.auxiliarService.getListSelect('MEDPIN'),
    ])

    fork.subscribe({
      next: res => {
        this.plantas = res[0];

        this.listaMedidaPistones = res[1];
        this.listaMedidaPines = res[2];
      }
    })
  }

  setListado() {
    this.formatoService.getListadoFormato(this.plantaSeleccionada.id, 3).subscribe({
      next: res => {
        if(res.listado) {
          this.listado = res.listado;
        } else {
          this.listado = [];
        }
      },
      error: err => {
        if(err.status == 409) {
          this.messageService.add({severity:'error', summary:'Error', detail:err.error.mensaje})
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail:'Error al obtener información del servidor.'})
        }
      }
    })
  }

  asignarFila(i: number) {
    if(this.blnFilaAniadidaSinGuardar) {
      return;
    }
    
    this.validarFila = i;
  }

  addRegistro() {
    if(this.blnFilaAniadidaSinGuardar) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe terminar de guardar el registro para añadir otro.'})
      return;
    }

    let mezcla: ProduccionRegistroTubosPines = new ProduccionRegistroTubosPines();

    mezcla.indConforme = true;
    mezcla.responsable = this.responsable;

    this.validarFila = this.listado.length;
    this.blnFilaAniadidaSinGuardar = true;
    this.listado.push(mezcla);
  }

  ordenTrabajoAutocomplete(event) {
    this.ordenTrabajoService.autocomplete(event.query).subscribe({
      next: res => {
        this.listadoOrdenesTrabajo = res;
      },
      error: err => {
        if(err.status == 409) {
          this.messageService.add({severity:'error', summary:'Error', detail:err.error.mensaje})
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail:'Error al obtener información del servidor.'})
        }
      }
    })
  }

  setOrdenTrabajo(event, i: number) {
    this.listado[i].listadoAutocompleteAux = event.detalle;
  }

  findProducto(event, i: number) {
    let term: string = event.query;
    this.listado[i].listadoAutocompleteAux = this.listado[i].ordenTrabajo.detalle.filter(otd => otd.ordenVentaDetalle.producto.nombre.toUpperCase().includes(term.toUpperCase()))
  }

  guardar(i) {
    let tubosPines: ProduccionRegistroTubosPines = this.listado[i];

    if(!tubosPines.ordenTrabajo || typeof(tubosPines.ordenTrabajo) == "string") {
      this.messageService.add({severity:'warn', summary:'Error', detail: 'Debe seleccionar una orden de trabajo del autocompletado.'})
      return;
    }

    if(!tubosPines.ordenTrabajoDetalle || typeof(tubosPines.ordenTrabajoDetalle) == "string") {
      this.messageService.add({severity:'warn', summary:'Error', detail: 'Debe seleccionar un producto del autocompletado.'})
      return;
    }

    if(!tubosPines.cantidadPines || tubosPines.cantidadPines == 0) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar la cantidad de pines usados.'});
      return;
    }

    if(!tubosPines.longitudPines || tubosPines.longitudPines == 0) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar la longitud de los pines usados.'});
      return;
    }

    if(!tubosPines.medidaDiametroPines) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe seleccionar el diámetro de los pines usados.'});
      return;
    }

    if(!tubosPines.cantidadPistones || tubosPines.cantidadPistones == 0) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar la cantidad de pistones usados.'});
      return;
    }

    if(!tubosPines.longitudPistones || tubosPines.longitudPistones == 0) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar la longitud de los pistones usados.'});
      return;
    }

    if(!tubosPines.medidaDiametroPistones) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe seleccionar el diámetro de los pistones usados.'});
      return;
    }

    this.formatoService.saveRegistroTubosPines(this.plantaSeleccionada.id, tubosPines).subscribe({
      next: res => {
        this.messageService.add({severity:'success', summary:'Éxito', detail:'Registro de tubos y pines guardado correctamente.'});
        this.blnFilaAniadidaSinGuardar = false;
        this.validarFila = -1;
        this.setListado()
      },
      error: err => {
        if(err.status == 409) {
          this.messageService.add({severity:'error', summary:'Error', detail:err.error.mensaje})
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail:'Error al obtener información del servidor.'})
        }
      }
    })
  }

}
