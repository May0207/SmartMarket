import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss'],
})
export class ChatbotComponent implements OnInit, OnDestroy {
  mensajeUsuario = '';
  mensajes: { de: 'user' | 'bot'; texto: string }[] = [];
  cargando = false;
  userId!: number;
  private authSubscription!: Subscription;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    // 1. Intento inicial de obtener el usuario desde localStorage
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.id_usuario) {
      this.userId = currentUser.id_usuario;
      console.log('Usuario encontrado en localStorage. ID:', this.userId);
    }

    // 2. Suscribirse al estado de autenticación por si cambia después
    this.authSubscription = this.authService.authStateChanged().subscribe(isLoggedIn => {
      if (isLoggedIn) {
        const currentUser = this.authService.getCurrentUser();
        if (currentUser && currentUser.id_usuario) {
          this.userId = currentUser.id_usuario;
          console.log('Usuario cargado tras login. ID:', this.userId);
        }
      }
    });

    // 3. Mensaje de bienvenida
    this.mensajes.push({
      de: 'bot',
      texto: '¡Hola! 👋 Soy tu chef personal. Puedo ayudarte a preparar recetas con lo que tienes en favoritos. ¿Te apetece algo en particular?'
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  enviarMensaje(): void {
    const mensaje = this.mensajeUsuario.trim();
    if (!mensaje) return;

    // Verifica que el userId esté disponible
    if (!this.userId) {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser?.id_usuario) {
        this.userId = currentUser.id_usuario;
        console.log('ID cargado en enviarMensaje():', this.userId);
      } else {
        this.mensajes.push({
          de: 'bot',
          texto: 'No se ha podido identificar tu sesión. Por favor, inicia sesión.'
        });
        return;
      }
    }

    // Muestra el mensaje del usuario
    this.mensajes.push({ de: 'user', texto: mensaje });
    this.mensajeUsuario = '';
    this.cargando = true;

    // Envía la solicitud al backend
    this.http.post<any>('http://localhost:3000/chatbot', {
      mensaje,
      userId: this.userId
    }).subscribe({
      next: (res) => {
        if (res.receta) {
          this.mensajes.push({ de: 'bot', texto: res.receta });
        } else if (res.mensaje) {
          this.mensajes.push({ de: 'bot', texto: res.mensaje });
        } else {
          this.mensajes.push({
            de: 'bot',
            texto: 'No encontré ninguna receta con tus productos.'
          });
        }
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.mensajes.push({
          de: 'bot',
          texto: 'Ocurrió un error al generar la receta.'
        });
        this.cargando = false;
      }
    });
  }
}
