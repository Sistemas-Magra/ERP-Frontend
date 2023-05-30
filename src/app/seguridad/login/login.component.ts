import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { Usuario } from '../models/usuario';
import { ModuloService } from '../modulo.service';
import { Empresa } from 'src/app/gestion/models/empresa';
import { Sede } from 'src/app/gestion/models/sede';
import { EmpresaService } from 'src/app/gestion/empresa.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  empresa: string = environment.empresa;
  blnRecordar: boolean = false;
  correo: string = '';
  usuario: Usuario = new Usuario();

  blnCargando: boolean = false;

  empresas: Empresa[];
  empresaSeleccionada: Empresa = new Empresa();

  sedes: Sede[] = [];
  sedeSeleccionada: Sede;

  constructor(
    private router: Router,
    private authService: AuthService,
    private moduloService: ModuloService,
    private messageService: MessageService,
    private empresaService: EmpresaService,
  ) { }

  ngOnInit(): void {
    if(this.authService.isAuthenticated()) {
      this.messageService.add({severity: 'info', summary: 'Info', detail: 'Su sesión ya está iniciada'});
      this.router.navigate(['/']);
    }

    this.empresaService.getEmpresasActivas().subscribe({
      next: res => {
        this.empresas = res;
        this.empresaSeleccionada = this.empresas[0];
      }, error: err => {
        if(err.status == 409) {
          this.messageService.add({severity:'warn', summary:'Advertencia', detail:err.error.mensaje});
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail: 'Error por parte del servidor.'});
        }
      }
    })

    /**/
  }

  setEmpresa() {
    this.sedes = this.empresaSeleccionada.sedes?this.empresaSeleccionada.sedes:[];
  }

  registrarUsuario() {
    this.router.navigate(['/registrar-usuario'])
  }

  login(): void {

    if(!this.empresaSeleccionada) {
      this.messageService.add({severity: 'warn', summary: 'Advertencia', detail: 'Debe seleccionar una empresa.'});
      return;
    }

    if(!this.sedeSeleccionada) {
      this.messageService.add({severity: 'warn', summary: 'Advertencia', detail: 'Debe seleccionar una sede.'});
      return;
    }

    if(this.usuario.username == null || this.usuario.username == '') {
      this.messageService.add({severity: 'warn', summary: 'Advertencia', detail: 'Debe ingresar su nombre de usuario.'});
      return;
    }

    if(this.usuario.password == null || this.usuario.password == '') {
      this.messageService.add({severity: 'warn', summary: 'Advertencia', detail: 'Debe ingresar su contraseña.'});
      return;
    }

    this.blnCargando = true;

    this.authService.login(this.usuario).subscribe({
      next: (res) => {
        this.moduloService.getModulosByUsername(this.usuario.username).subscribe({
          next: (mod) => {
            
            this.authService.guardarUsuario(res.access_token);
            this.authService.guardarToken(res.access_token);
            this.authService.guardarModulos(mod);
            
            localStorage.setItem("empresa_id", this.empresaSeleccionada.id.toString());
            localStorage.setItem("sede_id", this.sedeSeleccionada.id.toString());

            /*TODO: Traer esta info de la BD*/
            this.messageService.add({severity: 'success', summary: 'Éxito', detail: 'Ha iniciado sesión correctamente'});
            window.location.reload()
            this.router.navigate(['/']);
            this.blnCargando = false;
          },
          error: (err) => {
            this.blnCargando = false;
            this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error al obtener información de inicio de sesión'});
          },
        });
      },
      error: (err) => {
        this.blnCargando = false;
        if(err.status == 400 && err.error.error_description.includes('disabled')) {
          this.messageService.add({severity: 'warn', summary: 'Advertencia', detail: 'El usuario se encuentra inactivo'});
        } else {
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error al iniciar sesión'});
        }
      },
    });
  }

  aver(event) {
    console.log(event)
  }

}
