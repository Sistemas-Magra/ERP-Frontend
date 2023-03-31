import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { forkJoin } from 'rxjs';
import { AuxiliarService } from 'src/app/auxiliar/auxiliar.service';
import { TablaAuxiliarDetalle } from 'src/app/auxiliar/models/tabla-auxiliar-detalle';
import { FuncionesComunesService } from 'src/app/commons/funciones-comunes.service';
import { ModalAgregarAuxiliarComponent } from 'src/app/commons/modal-agregar-auxiliar/modal-agregar-auxiliar.component';
import { AreaService } from 'src/app/maestros/area.service';
import { CargoService } from 'src/app/maestros/cargo.service';
import { EntidadFondosService } from 'src/app/maestros/entidad-fondos.service';
import { Area } from 'src/app/maestros/models/area';
import { Cargo } from 'src/app/maestros/models/cargo';
import { SubArea } from 'src/app/maestros/models/sub-area';
import { environment } from 'src/environments/environment';
import { BancoService } from '../banco.service';
import { EmpleadoService } from '../empleado.service';
import { Banco } from '../models/banco';
import { Empleado } from '../models/empleado';
import { EntidadFondos } from '../models/entidad-fondos';
import { ModalHijosEmpleadoComponent } from './modal-hijos-empleado/modal-hijos-empleado.component';

@Component({
  selector: 'app-empleado-detalle',
  templateUrl: './empleado-detalle.component.html',
  styleUrls: ['./empleado-detalle.component.css']
})
export class EmpleadoDetalleComponent implements OnInit {

  empleado: Empleado = new Empleado();

  categoriaSelect: TablaAuxiliarDetalle[];
  documentoIdentidadSelect: TablaAuxiliarDetalle[];
  gradoInstruccionSelect: TablaAuxiliarDetalle[];
  estadoCivilSelect: TablaAuxiliarDetalle[];
  ladoDominanteSelect: TablaAuxiliarDetalle[];
  tipoPagoSelect: TablaAuxiliarDetalle[];
  periocidadPagoSelect: TablaAuxiliarDetalle[];
  bancoSelect: Banco[];

  cargoSelect: Cargo[];
  entidadFondosSelect: EntidadFondos[];
  areaSelect: Area[];
  areaSelected: Area;
  subareas: SubArea[];

  rutaFotos: string = 'assets/icons/user.png'//environment.apiURL + 'api/getFotoPersonal/';
  fotoAux: string;

  ref: DynamicDialogRef;
  foto: File;

  constructor(
    private messageService: MessageService,
    private auxiliarService: AuxiliarService,
    private cargoService: CargoService,
    private entidadFondosService: EntidadFondosService,
    private areaService: AreaService,
    private activatedRoute: ActivatedRoute,
    private empleadoService: EmpleadoService,
    private bancoService: BancoService,
    private dialogService: DialogService,
    private pipe: DatePipe,
    private router: Router,
    private funcionesComunes: FuncionesComunesService
  ) { }

  ngOnInit(): void {
    
    let fork = forkJoin(
      this.auxiliarService.getListSelect('CATEMP'),
      this.auxiliarService.getListSelect('TIPDOC'),
      this.auxiliarService.getListSelect('GRDINS'),
      this.auxiliarService.getDetalleById('ESTGRL', 1),
      this.cargoService.getAll(),
      this.entidadFondosService.getAll(),
      this.areaService.getAll(),
      this.auxiliarService.getListSelect('ESTCIV'),
      this.auxiliarService.getListSelect('LADDOM'),
      this.bancoService.getBancosActivos(),
      this.auxiliarService.getListSelect('TIPPEM'),
      this.auxiliarService.getListSelect('PERPAG')
    )

    fork.subscribe(res => {
      this.categoriaSelect = res[0];
      this.documentoIdentidadSelect = res[1];
      this.gradoInstruccionSelect = res[2];
      this.estadoCivilSelect = res[7];
      this.ladoDominanteSelect = res[8];

      this.tipoPagoSelect= res[10];
      this.periocidadPagoSelect = res[11]

      this.bancoSelect = res[9];

      this.empleado.estado = res[3];

      this.cargoSelect = res[4];
      this.entidadFondosSelect = res[5];
      this.areaSelect = res[6];

      this.activatedRoute.params.subscribe(param => {
        this.empleado.id = +param['id'];
        if(this.empleado.id == 0) {
          this.rutaFotos = 'assets/icons/user.png';
        } else {
          this.empleadoService.getEmpleadoById(this.empleado.id).subscribe({
            next: emp => {
              this.areaSelected = emp.area;
              this.subareas = this.areaSelected.subareas;

              setTimeout(() => {
                let empl: Empleado = emp.empleado;

                if(empl.foto && empl.foto.length > 0) {
                  this.rutaFotos = `${environment.apiURL}api/empleado/get-foto/${empl.foto}`
                }

                empl.fechaNacimientoStr = this.pipe.transform(empl.fechaNacimiento, 'dd MMM yyyy');
                empl.fechaIngresoStr = this.pipe.transform(empl.fechaIngreso, 'dd MMM yyyy');
                
                empl.fechaInicioPruebaStr = this.pipe.transform(empl.fechaInicioPrueba, 'dd MMM yyyy');
                empl.fechaFinPruebaStr = this.pipe.transform(empl.fechaFinPrueba, 'dd MMM yyyy');

                empl.edad = this.funcionesComunes.calcularEdad(this.pipe.transform(empl.fechaNacimiento, 'yyyy-mm-dd'));

                this.empleado = JSON.parse(JSON.stringify(empl));
                this.fotoAux = empl.foto;
              },200)
            }
          })
        }
      })
    })
  }

  selectArea() {
    this.subareas = this.areaSelected.subareas
  }

  agregarAuxiliar(codAux: string) {
    let id: number;

    switch(codAux) {
      case 'TIPDOC': {
        id = this.documentoIdentidadSelect.length + 1;
        break;
      }
      
      case 'CATEMP': {
        id = this.categoriaSelect.length + 1;
        break;
      }
      
      case 'GRDINS': {
        id = this.gradoInstruccionSelect.length + 1;
        break;
      }
      
      case 'ESTCIV': {
        id = this.estadoCivilSelect.length + 1;
        break;
      }
      
      case 'LADDOM': {
        id = this.ladoDominanteSelect.length + 1;
        break;
      }
    }

    this.ref = this.dialogService.open(ModalAgregarAuxiliarComponent,{
      data: {
        id: id,
        codAux: codAux,
      },
      width: '500px',
      height: '200px'
    })

    this.ref.onClose.subscribe(resp => {
      if(resp?.response){
        switch(codAux) {
          case 'TIPDOC': {
            this.documentoIdentidadSelect.push(resp.response);
            break;
          }
          
          case 'CATEMP': {
            this.categoriaSelect.push(resp.response);
            break;
          }
          
          case 'GRDINS': {
            this.gradoInstruccionSelect.push(resp.response);
            break;
          }
          
          case 'ESTCIV': {
            this.estadoCivilSelect.push(resp.response);
            break;
          }
          
          case 'LADDOM': {
            this.ladoDominanteSelect.push(resp.response);
            break;
          }
        }
      }
    })
  }

  showPreview(event) {
    this.foto = (event.target as HTMLInputElement).files[0];

    let reader = new FileReader();
    reader.onload = () => {
      this.rutaFotos = reader.result as string;
    }

    reader.readAsDataURL(this.foto); 
    this.empleado.foto = this.foto.name;
  }

  quitarFoto() {
    this.rutaFotos = 'assets/icons/user.png';
    this.foto = null;
    this.empleado.foto = null;
  }

  setCodigo() {
    this.empleado.codigo = '';

    console.log(this.areaSelect)

    this.empleado.codigo += this.empleado.categoria?this.empleado.categoria.abreviatura:'';
    this.empleado.codigo += this.empleado.subArea?this.empleado.subArea.abreviatura2:'';

    this.empleadoService.getCodigo(this.empleado.codigo).subscribe({
      next: res => {
        this.empleado.codigo = res.codigo
      }
    })

  }

  verHijos() {
    this.ref = this.dialogService.open(ModalHijosEmpleadoComponent, {
      data: {
        hijos: this.empleado.hijos
      },
      width: '600px',
      height: '400px'
    })

    this.ref.onClose.subscribe(hjs => {
      if(hjs) {
        this.empleado.hijos = hjs;
      }
    })
  }

  setEdad() {
    this.empleado.fechaNacimiento = new Date(this.empleado.fechaNacimientoStr)
    this.empleado.edad = this.funcionesComunes.calcularEdad(this.pipe.transform(this.empleado.fechaNacimiento, 'yyyy-MM-dd'))
  }

  validar(): boolean {
    if(!this.empleado.tipoDocumentoIdentidad) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe seleccionar un tipo de documento de identidad.'})
      return false;
    }

    if(!this.empleado.nroDocumentoIdentidad || this.empleado.nroDocumentoIdentidad.length == 0) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar un número de documento de identidad.'})
      return false;
    }

    if(!this.empleado.nombres || this.empleado.nombres.length == 0) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar un nombre.'})
      return false;
    }

    if(!this.empleado.apellidoPaterno || this.empleado.apellidoPaterno.length == 0) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar un apellido paterno.'})
      return false;
    }

    if(!this.empleado.apellidoMaterno || this.empleado.apellidoMaterno.length == 0) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar un apellido materno.'})
      return false;
    }

    if(!this.empleado.direccion || this.empleado.direccion.length == 0) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar una dirección.'})
      return false;
    }

    if(!this.empleado.correo || this.empleado.correo.length == 0) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar un correo.'})
      return false;
    }

    if(!this.empleado.celular || this.empleado.celular.length == 0) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar un número de celular.'})
      return false;
    }

    if(!this.empleado.fechaNacimientoStr || this.empleado.fechaNacimientoStr.length == 0) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar una fecha de nacimiento.'})
      return false;
    }

    let edad: number = this.funcionesComunes.calcularEdad(this.pipe.transform(this.empleado.fechaNacimiento, 'yyyy-MM-dd'));

    if(edad < 18) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'El personal es menor de edad.'})
      return false;
    }

    if(!this.empleado.fechaIngresoStr || this.empleado.fechaIngresoStr.length == 0) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar una fecha de ingreso.'})
      return false;
    }

    if(!this.empleado.cargo) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe seleccionar el cargo correspondiente al personal.'})
      return false;
    }

    if(!this.empleado.categoria) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe seleccionar la categoria correspondiente al personal.'})
      return false;
    }

    if(!this.empleado.subArea) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe seleccionar el sub área correspondiente al personal.'})
      return false;
    }

    if(!this.empleado.nroCalzado || this.empleado.nroCalzado.length == 0) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar el número de calzado del personal.'})
      return false;
    }

    if(!this.empleado.tallaPantalon || this.empleado.tallaPantalon.length == 0) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar el número de talla de pantalón.'})
      return false;
    }

    if(!this.empleado.tallaPolo || this.empleado.tallaPolo.length == 0) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar el número de talla de polo.'})
      return false;
    }

    if(!this.empleado.contactoEmergencia || this.empleado.contactoEmergencia.length == 0) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar el nombre del contacto de emergencia.'})
      return false;
    }

    if(!this.empleado.telefonoEmergencia || this.empleado.telefonoEmergencia.length == 0) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar el teléfono de emergencia.'})
      return false;
    }

    if(!this.empleado.bancoCts) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe seleccionar el banco correspondiente a la cuenta CTS del personal.'})
      return false;
    }

    if(!this.empleado.cuentaCts || this.empleado.cuentaCts.length == 0) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar la cuenta CTS del personal.'})
      return false;
    }

    if(!this.empleado.bancoSueldo) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe seleccionar el banco correspondiente a la cuenta sueldo del personal.'})
      return false;
    }

    if(!this.empleado.cuentaSueldo || this.empleado.cuentaSueldo.length == 0) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar la cuenta sueldo del personal.'})
      return false;
    }

    return true;
  }

  guardar() {

    if(!this.validar()) {
      return;
    }

    this.empleado.nombreCompleto = this.empleado.nombres + ' ' + this.empleado.apellidoPaterno + ' ' + this.empleado.apellidoMaterno;
    this.empleado.fechaNacimiento = new Date(this.empleado.fechaNacimientoStr);
    this.empleado.fechaIngreso = new Date(this.empleado.fechaIngresoStr);

    if(this.empleado.id == 0) {

      this.empleado.vacacionesAcumuladas = 0;
      this.empleado.vacacionesDisponibles = 0;
      this.empleado.vacacionesOcupadas = 0;

      if(!this.empleado.fechaInicioPruebaStr || this.empleado.fechaInicioPruebaStr.length == 0) {
        this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar una fecha de inicio de pruebas.'})
        return;
      }

      if(!this.empleado.fechaFinPruebaStr || this.empleado.fechaFinPruebaStr.length == 0) {
        this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar una fecha de término de pruebas.'})
        return;
      }

      this.empleado.fechaInicioPrueba = new Date(this.empleado.fechaInicioPruebaStr);
      this.empleado.fechaFinPrueba = new Date(this.empleado.fechaFinPruebaStr);

      this.empleadoService.create(this.empleado).subscribe({
        next: res => {
          if(this.foto) {
            this.empleadoService.subirFoto(this.foto, res.id).subscribe({
              next: succ => {
                this.messageService.add({severity:'success', summary:'Éxito', detail:'Personal asignado correctamente.'})
                this.router.navigate(['/empleado'])
              }
            })
          } else {
            this.messageService.add({severity:'success', summary:'Éxito', detail:'Personal asignado correctamente.'})
            this.router.navigate(['/empleado'])
          }
        }
      })

    } else {

      this.empleado.fechaInicioPrueba = new Date(this.empleado.fechaInicioPruebaStr);
      this.empleado.fechaFinPrueba = new Date(this.empleado.fechaFinPruebaStr);

      this.empleadoService.update(this.empleado).subscribe({
        next: res => {
          if(this.foto && this.fotoAux != this.empleado.foto) {
            this.empleadoService.subirFoto(this.foto, res.id).subscribe({
              next: succ => {
                this.messageService.add({severity:'success', summary:'Éxito', detail:'Personal asignado correctamente.'})
                this.router.navigate(['/empleado'])
              }
            })
          } else {
            this.messageService.add({severity:'success', summary:'Éxito', detail:'Personal asignado correctamente.'})
            this.router.navigate(['/empleado'])
          }
        }
      })

    }

  }

}
