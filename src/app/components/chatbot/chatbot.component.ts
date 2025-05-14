// src/app/components/chatbot/chatbot.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss'],
})
export class ChatbotComponent implements OnInit {
  mensajeUsuario = '';
  mensajes: { de: 'user' | 'bot'; texto: string }[] = [];
  cargando = false;

  // ⚠️ Aquí deberías usar el ID real del usuario logueado
  userId = 1;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.mensajes.push({
      de: 'bot',
      texto: '¡Hola! 👋 Soy tu chef personal. Puedo ayudarte a preparar recetas con lo que tienes en favoritos. ¿Te apetece algo en particular?'
    });
  }

  enviarMensaje() {
    const mensaje = this.mensajeUsuario.trim();
    if (!mensaje) return;

    this.mensajes.push({ de: 'user', texto: mensaje });
    this.mensajeUsuario = '';
    this.cargando = true;

    this.http
      .post<any>('http://localhost:3000/chatbot', {
        mensaje,
        userId: this.userId,
      })
      .subscribe({
        next: (res) => {
          if (res.receta) {
            this.mensajes.push({ de: 'bot', texto: res.receta });
          } else if (res.mensaje) {
            this.mensajes.push({ de: 'bot', texto: res.mensaje });
          } else {
            this.mensajes.push({ de: 'bot', texto: 'No encontré ninguna receta con tus productos.' });
          }
          this.cargando = false;
        },
        error: (err) => {
          console.error(err);
          this.mensajes.push({ de: 'bot', texto: 'Ocurrió un error al generar la receta.' });
          this.cargando = false;
        },
      });
  }
}
