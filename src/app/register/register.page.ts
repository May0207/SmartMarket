import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true, // 👈 Hace que sea standalone
  imports: [CommonModule, IonicModule, FormsModule] // 👈 Importa los módulos necesarios
})
export class RegisterPage {
  email: string = '';
  password: string = '';
  birthdate: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async register() {
    if (!this.isAdult(this.birthdate)) {
      alert('Debes ser mayor de 18 años para registrarte.');
      return;
    }

    try {
      await this.authService.register(this.email, this.password, this.birthdate);
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error en registro:', error);
    }
  }

  isAdult(birthdate: string): boolean {
    const birthDate = new Date(birthdate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();

    return age > 18 || (age === 18 && today >= new Date(birthDate.setFullYear(today.getFullYear())));
  }
}
