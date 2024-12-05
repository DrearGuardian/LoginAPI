import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  newUsername: string = '';  // Nombre de usuario para registro
  newPassword: string = '';  // Contraseña para registro
  newEmail: string = '';  // Correo electrónico para registro (añadido aquí)
  error: string = '';
  users: User[] = [];  // Lista de usuarios registrados
  showUsers: boolean = false; // Controla la visibilidad de la lista de usuarios
  showRegisterForm: boolean = false; // Controla la visibilidad del formulario de registro

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    // Cargar los usuarios registrados al iniciar el componente
    this.loadUsers();
  }

  // Método para cargar la lista de usuarios registrados
  loadUsers() {
    this.userService.getUsers().subscribe(
      (users: User[]) => {
        this.users = users; // Guardamos los usuarios en la lista
      },
      (error) => {
        this.error = 'No se pudo cargar la lista de usuarios';
        console.error(error);
      }
    );
  }

  // Método para iniciar sesión
  onSubmit() {
    this.userService.getUsers().subscribe(
      (users: User[]) => {
        const user = users.find(
          u => u.name === this.username && u.password === this.password
        );

        if (user) {
          // Usuario y contraseña correctos
          this.router.navigate(['/dashboard']);
        } else {
          // Usuario o contraseña incorrectos
          this.error = 'Usuario o contraseña incorrectos';
        }
      },
      (error) => {
        this.error = 'Error de conexión. Inténtelo de nuevo.';
        console.error(error);
      }
    );
  }

  // Método para registrar un nuevo usuario
  addUser() {
    if (this.newUsername && this.newPassword && this.newEmail) { // Verificar que se haya ingresado un correo electrónico
      console.log('Registrando nuevo usuario:', this.newUsername, this.newPassword, this.newEmail);

      const newUser: User = {
        id: 0,  // Si es necesario en la API
        name: this.newUsername,
        password: this.newPassword,
        email: this.newEmail,  // Asignar el correo electrónico al nuevo usuario
        role: '',   // Si la API requiere un role, agregar aquí
        avatar: '', // Si la API requiere un avatar, agregar aquí
      };

      this.userService.addUser(newUser).subscribe(
        (user: User) => {
          this.users.push(user); // Agregar el nuevo usuario a la lista local
          this.newUsername = '';
          this.newPassword = '';
          this.newEmail = '';  // Limpiar el campo de correo electrónico
          this.error = '';
        },
        (error) => {
          this.error = 'No se pudo registrar el nuevo usuario';
          console.error(error);
        }
      );
    } else {
      this.error = 'Por favor ingrese un nombre de usuario, una contraseña y un correo electrónico.';
    }
  }

  // Método para alternar la visibilidad de los usuarios registrados
  toggleUsers() {
    this.showUsers = !this.showUsers;
  }

  // Método para alternar la visibilidad del formulario de registro
  toggleRegisterForm() {
    this.showRegisterForm = !this.showRegisterForm;
  }
}
