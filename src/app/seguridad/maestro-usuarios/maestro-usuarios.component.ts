import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { EmpleadoService } from 'src/app/talento-humano/empleado.service';
import { Empleado } from 'src/app/talento-humano/models/empleado';
import { DatePipe } from '@angular/common';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModalAsignarRolesComponent } from './modal-asignar-roles/modal-asignar-roles.component';
import { UsuarioService } from '../usuario.service';
import { ModalSiNoComponent } from 'src/app/commons/modal-si-no/modal-si-no.component';

@Component({
  selector: 'app-maestro-usuarios',
  templateUrl: './maestro-usuarios.component.html',
  styleUrls: ['./maestro-usuarios.component.css']
})
export class MaestroUsuariosComponent implements OnInit {

  usuarios: any[] = [];
  blnEditandoCreando: boolean = false;
  blnCargando: boolean = false;
  indFilaEditada: number = -1;

  empleadosAutocomplete: Empleado[];
  empleadoSelected: Empleado;

  ref: DynamicDialogRef;

  nombreFilter: string;
  usernameFilter: string;
  correoFilter: string;
  indVerInactivosFilter: number;

  constructor(
    private messageService: MessageService,
    private empleadoService: EmpleadoService,
    private usuarioService: UsuarioService,
    public dialogService: DialogService,
    private pipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.blnCargando=true;
    this.filtrar();
  }

  filtrar() {
    
    this.blnCargando = true;
    this.usuarioService.getListMaestro(this.nombreFilter, this.usernameFilter, this.correoFilter, this.indVerInactivosFilter).subscribe({
      next: res => {
        this.usuarios = res;
        this.indFilaEditada = -1;
        this.blnEditandoCreando = false;
        this.blnCargando = false;
      }
    })
  }

  addUser() {
    this.blnEditandoCreando = true;
    this.indFilaEditada = 0;
    this.usuarios.unshift({cant_roles: 0})
  }

  editar(i) {
    this.blnEditandoCreando = true;
    this.indFilaEditada = i;
  }

  cancelar(i: number) {
    if(this.blnEditandoCreando) {
      this.filtrar();
    } else {
      this.ref = this.dialogService.open(ModalSiNoComponent, {
        data: {
          titulo: "Confirmación de Eliminación de Usuario",
          texto: "Está a punto de eliminar un usuario. ¿Está seguro que desea continuar?",
          botonAceptacion: "Sí",
          botonDeclinacion: "No"
        },
        width: '400px',
        height: '180px',
      })

      this.ref.onClose.subscribe(res => {
        if(res.res == 1) {
          this.usuarioService.inactivarActivar(this.usuarios[i].id, 0).subscribe({
            next: res => {
              this.messageService.add({severity:'success', summary:'Éxito', detail:'Usuario actualizado con éxito.'})
              this.filtrar();
            }, error: err => {
              console.log(err)
              this.messageService.add({severity:'error', summary:'Error', detail:'Error al actualizar usuario.'})
            }
          })
        }
      })
    }
  }

  activarUsuario(i: number) {
    if(this.usuarios[i].estado == 0) {
      this.ref = this.dialogService.open(ModalSiNoComponent, {
        data: {
          titulo: "Confirmación de Reactivación de Usuario",
          texto: `¿Desea volver a activar al usuario ${this.usuarios[i].empleado}?`,
          botonAceptacion: "Sí",
          botonDeclinacion: "No"
        },
        width: '400px',
        height: '170px',
      })
  
      this.ref.onClose.subscribe(res => {
        if(res.res == 1) {
          this.usuarioService.inactivarActivar(this.usuarios[i].id, 1).subscribe({
            next: res => {
              this.messageService.add({severity:'success', summary:'Éxito', detail:'Usuario actualizado con éxito.'})
              this.filtrar();
            }, error: err => {
              console.log(err)
              this.messageService.add({severity:'error', summary:'Error', detail:'Error al actualizar usuario.'})
            }
          })
        }
      })
    }
  }

  getEmpleadoAutocomplete(event) {
    this.empleadoService.autocomplete(event.query).subscribe({
      next: res => {
        this.empleadosAutocomplete = res;
      }
    })
  }

  asignarEmpleado(i: number) {
    console.log(this.empleadoSelected)
    this.usuarios[i].empleado_id = this.empleadoSelected.id;
    this.usuarios[i].tip_doc = this.empleadoSelected.tipoDocumentoIdentidad.abreviatura;
    this.usuarios[i].nro_doc = this.empleadoSelected.nroDocumentoIdentidad;
    this.usuarios[i].fec_nac = this.pipe.transform(this.empleadoSelected.fechaNacimiento, 'dd MMM yyyy').replace('.', '').toUpperCase() ;
    this.usuarios[i].username = (this.empleadoSelected.nombres[0] + this.empleadoSelected.apellidoPaterno.split(' ').join('') + 
                                this.empleadoSelected.apellidoMaterno[0]).toLowerCase()
  }

  asignarRoles(i: number) {
    this.ref = this.dialogService.open(ModalAsignarRolesComponent, {
      data: {
        roles: this.usuarios[i].roles?this.usuarios[i].roles:[],
        indEditando: this.blnEditandoCreando
      },
      width: '500px',
      height: '400px',
    })

    this.ref.onClose.subscribe(res => {
      if(res) {
        this.usuarios[i].roles = res;
        this.usuarios[i].cant_roles = res.length;
      }
    })
  }

  validacionCrear(i: number): boolean {

    if(typeof(this.empleadoSelected) == "string" || this.empleadoSelected == null || this.empleadoSelected == undefined) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe asignar un empleado al nuevo usuario.'})
      return false;
    }

    if(this.usuarios[i].username == null || this.usuarios[i].username == undefined || this.usuarios[i].username.length == 0) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar un username para el nuevo usuario.'})
      return false;
    }

    if(this.usuarios[i].celular == null || this.usuarios[i].celular == undefined || this.usuarios[i].celular.length == 0) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar un username para el nuevo usuario.'})
      return false;
    }

    if(this.usuarios[i].correo == null || this.usuarios[i].correo == undefined || this.usuarios[i].correo.length == 0) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar un username para el nuevo usuario.'})
      return false;
    }

    if(this.usuarios[i].cant_roles == 0) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe asignar al menos un rol al nuevo usuario.'})
      return false;
    }

    return true;
  }

  validacionEditar(i: number): boolean {

    if(this.usuarios[i].username == null || this.usuarios[i].username == undefined || this.usuarios[i].username.length == 0) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar un username para el nuevo usuario.'})
      return false;
    }

    if(this.usuarios[i].celular == null || this.usuarios[i].celular == undefined || this.usuarios[i].celular.length == 0) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar un username para el nuevo usuario.'})
      return false;
    }

    if(this.usuarios[i].correo == null || this.usuarios[i].correo == undefined || this.usuarios[i].correo.length == 0) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar un username para el nuevo usuario.'})
      return false;
    }

    if(this.usuarios[i].cant_roles == 0) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe asignar al menos un rol al nuevo usuario.'})
      return false;
    }

    return true;
  }

  registrar(i: number) {
    if(this.usuarios[i].id) {

      if(!this.validacionEditar(i)) {
        return;
      }
      this.blnCargando = true;
      this.usuarioService.update(this.usuarios[i].id, this.usuarios[i]).subscribe({
        next: res => {
          this.blnCargando = false;
          this.messageService.add({severity:'success', summary:'Éxito', detail:'Usuario actualizado con éxito.'})
          this.filtrar()
        }, error: err => {
          console.log(err)
          this.blnCargando = false;
          if(err.status == 409) {
            this.messageService.add({severity:'warn', summary:'Advertencia', detail:err.error.mensaje})
          } else {
            this.messageService.add({severity:'error', summary:'Error', detail:'Error al registrar usuario por parte del servidor'})
          }
        }
      })

    } else {

      if(!this.validacionCrear(i)) {
        return;
      }
  
      this.blnCargando = true;
      this.usuarioService.create(JSON.stringify(this.usuarios[i])).subscribe({
        next: res => {
          this.blnCargando = false;
          this.messageService.add({severity:'success', summary:'Éxito', detail:'Usuario creado con éxito.'})
          this.filtrar()
        }, error: err => {
          console.log(err)
          this.blnCargando = false;
          if(err.status == 409) {
            this.messageService.add({severity:'warn', summary:'Advertencia', detail:err.error.mensaje})
          } else {
            this.messageService.add({severity:'error', summary:'Error', detail:'Error al registrar usuario por parte del servidor'})
          }
        }
      })

    }
  }

}