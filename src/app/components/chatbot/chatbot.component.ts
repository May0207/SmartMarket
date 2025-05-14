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

  constructor(private http: HttpClient) {}

  // 👋 Mensaje de bienvenida del bot al iniciar
  ngOnInit(): void {
    this.mensajes.push({
      de: 'bot',
      texto: '¡Hola! 👋 Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?'
    });
  }

  enviarMensaje() {
    const mensaje = this.mensajeUsuario.trim();
    if (!mensaje) return;

    this.mensajes.push({ de: 'user', texto: mensaje });
    this.mensajeUsuario = '';
    this.cargando = true;

    this.http
      .post<any>('http://localhost:3000/chatbot', { mensaje })
      .subscribe({
        next: (res) => {
          const productos = res.resultados;
          if (productos.length === 0) {
            this.mensajes.push({ de: 'bot', texto: 'No encontré productos.' });
          } else {
            const listado = productos
              .slice(0, 5)
              .map((p: any) => `- ${p.nombre} (${p.precio}€)`)
              .join('\n');
            this.mensajes.push({
              de: 'bot',
              texto: `Aquí tienes:\n${listado}`,
            });
          }
          this.cargando = false;
        },
        error: () => {
          this.mensajes.push({ de: 'bot', texto: 'Ocurrió un error.' });
          this.cargando = false;
        },
      });
  }
}
