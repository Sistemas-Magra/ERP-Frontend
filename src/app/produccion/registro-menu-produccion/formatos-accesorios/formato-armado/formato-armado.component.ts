import { Component, OnInit } from '@angular/core';
import { Planta } from 'src/app/maestros/models/planta';
import { PlantaService } from 'src/app/maestros/planta.service';
import { OrdenTrabajo } from '../../../models/orden-trabajo';
import { MessageService } from 'primeng/api';
import { OrdenTrabajoService } from '../../../orden-trabajo.service';
import { FormatosService } from '../../../formatos.service';
import { TablaAuxiliarDetalle } from 'src/app/auxiliar/models/tabla-auxiliar-detalle';
import { forkJoin } from 'rxjs';
import { AuxiliarService } from 'src/app/auxiliar/auxiliar.service';
import { ProduccionAccesorioRegistroArmado } from 'src/app/produccion/models/produccion-accesorio-registro-armado';

@Component({
  selector: 'app-formato-armado',
  templateUrl: './formato-armado.component.html',
  styleUrls: ['./formato-armado.component.css']
})
export class FormatoArmadoComponent implements OnInit {

  listado: ProduccionAccesorioRegistroArmado[] = [];

  listadoFierroEstructura: TablaAuxiliarDetalle[] = [];
  listadoFierroAnillo: TablaAuxiliarDetalle[] = [];
  listadoAlambreEspiral: TablaAuxiliarDetalle[] = [];
  listadoAlambreAmarre: TablaAuxiliarDetalle[] = [];
  listadoMedidaRoldana: TablaAuxiliarDetalle[] = [];

  fecha: Date = new Date();
  responsable: string;

  plantas: Planta[];
  plantaSeleccionada: Planta;

  listadoOrdenesTrabajo: OrdenTrabajo[];

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
      this.auxiliarService.getListSelect('MEDVAR'),
      this.auxiliarService.getListSelect('MEDANI'),
      this.auxiliarService.getListSelect('NUMESP'),
      this.auxiliarService.getListSelect('NUMAMR'),
      this.auxiliarService.getListSelect('MEDROL'),
    ])

    fork.subscribe({
      next: res => {
        this.plantas = res[0];

        this.listadoFierroEstructura = res[1]
        this.listadoFierroAnillo = res[2]
        this.listadoAlambreEspiral = res[3]
        this.listadoAlambreAmarre = res[4]
        this.listadoMedidaRoldana = res[5]
      }
    })
  }

  setListado() {
    this.formatoService.getListadoFormato(this.plantaSeleccionada.id, 8).subscribe({
      next: res => {
        if(res.listado) {
          let listadoAux: ProduccionAccesorioRegistroArmado[] = res.listado;

          listadoAux.forEach(est => {
            est.listadoDiametrosRoldanaAux = JSON.parse(est.cantRoldanas);
            est.listadoDiametrosVarillaAux = JSON.parse(est.longitudesVarillasDiametro);

            est.listadoDiametrosRoldanaAux = est.listadoDiametrosRoldanaAux.sort((a, b) => a.id - b.id)
            est.listadoDiametrosVarillaAux = est.listadoDiametrosVarillaAux.sort((a, b) => a.id - b.id)
          })

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
    
    let estruct: ProduccionAccesorioRegistroArmado = new ProduccionAccesorioRegistroArmado();

    estruct.indConforme = true;
    estruct.responsable = this.responsable;

    this.listadoFierroEstructura.forEach(vari => {
      estruct.listadoDiametrosVarillaAux.push({id: vari.tablaAuxiliarDetalleId.id, cantidad: 0})
    })

    this.listadoMedidaRoldana.forEach(rol => {
      estruct.listadoDiametrosRoldanaAux.push({id: rol.tablaAuxiliarDetalleId.id, cantidad: 0})
    })

    this.validarFila = this.listado.length;
    this.blnFilaAniadidaSinGuardar = true;
    this.listado.push(estruct);
  }

  sumCantVarillas(event, i, j) {
    let cantIng: number  = Number(event.value);

    let sum: number = 0;

    this.listado[i].listadoDiametrosVarillaAux.forEach((v, index) => {
      if(index != j) {
        sum += Number(v.cantidad);
      } else {
        sum += Number(cantIng)
      }
    })

    this.listado[i].cantVarillas = sum;
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

  guardar(i: number) {
    let estructura: ProduccionAccesorioRegistroArmado = this.listado[i];

    if(!estructura.ordenTrabajo || typeof(estructura.ordenTrabajo) == "string") {
      this.messageService.add({severity:'warn', summary:'Error', detail: 'Debe seleccionar una orden de trabajo del autocompletado.'})
      return;
    }

    if(!estructura.ordenTrabajoDetalle || typeof(estructura.ordenTrabajoDetalle) == "string") {
      this.messageService.add({severity:'warn', summary:'Error', detail: 'Debe seleccionar un producto del autocompletado.'})
      return;
    }

    if(!estructura.hora) {
      this.messageService.add({severity:'warn', summary:'Error', detail: 'Debe seleccionar la hora de armado de la estructura.'})
      return;
    }

    if(!estructura.cantVarillas || estructura.cantVarillas == 0) {
      this.messageService.add({severity:'warn', summary:'Error', detail: 'Debe ingresar al menos una cantidad en un tipo de varilla.'})
      return;
    }

    if(!estructura.nroAlambreAmarre) {
      this.messageService.add({severity:'warn', summary:'Error', detail: 'Debe seleccionar el número de alambre en el amarre.'})
      return;
    }

    estructura.longitudesVarillasDiametro = JSON.stringify(estructura.listadoDiametrosVarillaAux);
    estructura.cantRoldanas = JSON.stringify(estructura.listadoDiametrosRoldanaAux);

    this.formatoService.saveRegistroArmadoAccesorio(this.plantaSeleccionada.id, estructura).subscribe({
      next: res => {
        this.messageService.add({severity:'success', summary:'Éxito', detail:'Registro de mezcla guardado correctamente.'});
        this.blnFilaAniadidaSinGuardar = false;
        this.validarFila = -1;
        this.setListado();
      }
    })

  }

}
