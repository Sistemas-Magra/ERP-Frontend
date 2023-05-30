import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Role } from '../../models/role';
import { RoleService } from '../../role.service';

@Component({
  selector: 'app-modal-asignar-roles',
  templateUrl: './modal-asignar-roles.component.html',
  styleUrls: ['./modal-asignar-roles.component.css']
})
export class ModalAsignarRolesComponent implements OnInit {

  rolesAsignados: Role[] = [];
  
  rolesAutocomplete: Role[];
  roleSeleccionado: Role;

  blnEditando: boolean;

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private roleService: RoleService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.blnEditando = this.config.data.indEditando
    this.roleService.getAllRoles().subscribe({
      next: res => {
        this.rolesAsignados = res.filter(r => this.config.data.roles.includes(r.id));
      }, error: err => {
        if(err.status == 409) {
          this.messageService.add({severity:'warn', summary:'Advertencia', detail:err.error.mensaje});
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail: 'Error por parte del servidor.'});
        }
      }
    })
  }

  seleccionarRol() {
    if(this.rolesAsignados.find(r => r.id == this.roleSeleccionado.id)) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'El rol ya está asignado al usuario.'})
      return;
    }

    this.rolesAsignados.push(this.roleSeleccionado);
    this.roleSeleccionado = null;
  }

  roleAutocomplete(event) {
    this.roleService.autocompleteAsignacion(event.query).subscribe({
      next: res => {
        this.rolesAutocomplete = res;
      }, error: err => {
        if(err.status == 409) {
          this.messageService.add({severity:'warn', summary:'Advertencia', detail:err.error.mensaje});
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail: 'Error por parte del servidor.'});
        }
      }
    })
  }

  quitar(id: number) {
    this.rolesAsignados = this.rolesAsignados.filter(r => r.id != id);
  }

  asignar() {
    this.ref.close(JSON.parse(JSON.stringify(this.rolesAsignados.map(r => r.id))));
  }

  close() {
    this.ref.close();
  }

}
