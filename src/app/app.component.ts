import { DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormsModule,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EspecialidadesService } from './core/services/especialidades.service';
import { GaleriaService } from './core/services/galeria.service';
import { PreciosService } from './core/services/precios.service';
import { ServiciosService } from './core/services/servicios.service';
import { VeterinariaService } from './core/services/veterinaria.service';
import { ContactosService } from './core/services/contactos.service';
import { ChatbotService } from './core/services/chatbot.service';
import {
  ChatMessage,
  Especialidad,
  FotoGaleria,
  Precio,
  Servicio,
  Veterinaria,
} from './core/models/api.models';

@Component({
  selector: 'app-root',
  imports: [DecimalPipe, FormsModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class App implements OnInit {
  private readonly serviciosApi = inject(ServiciosService);
  private readonly especialidadesApi = inject(EspecialidadesService);
  private readonly preciosApi = inject(PreciosService);
  private readonly veterinariaApi = inject(VeterinariaService);
  private readonly galeriaApi = inject(GaleriaService);
  private readonly contactosApi = inject(ContactosService);
  private readonly chatbotApi = inject(ChatbotService);
  private readonly formBuilder = inject(FormBuilder);

  servicios: Servicio[] = [];
  especialidades: Especialidad[] = [];
  precios: Precio[] = [];
  veterinaria: Veterinaria | null = null;
  galeria: FotoGaleria[] = [];
  selectedPhoto: FotoGaleria | null = null;
  loading = {
    servicios: true,
    especialidades: true,
    precios: true,
    veterinaria: true,
    galeria: true,
  };
  errors: Record<string, string> = {};
  contactSending = false;
  contactSuccess = false;
  contactError = '';
  chatOpen = false;
  chatSending = false;
  chatError = '';
  chatInput = '';
  chatMessages: ChatMessage[] = this.loadChatHistory();

  readonly contactForm = this.formBuilder.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
    correo: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    telefono: ['', [Validators.maxLength(30)]],
    asunto: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
    mensaje: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(5000)]],
  });

  ngOnInit(): void {
    this.cargar('servicios', () => this.serviciosApi.listar(), (data) => (this.servicios = data));
    this.cargar('especialidades', () => this.especialidadesApi.listar(), (data) => (this.especialidades = data));
    this.cargar('precios', () => this.preciosApi.listar(), (data) => (this.precios = data));
    this.cargar('veterinaria', () => this.veterinariaApi.obtener(), (data) => (this.veterinaria = data));
    this.cargar('galeria', () => this.galeriaApi.listar(), (data) => (this.galeria = data));
  }

  private cargar<T>(
    key: string,
    request: () => import('rxjs').Observable<T>,
    assign: (data: T) => void,
  ): void {
    request().subscribe({
      next: (data) => {
        assign(data);
        this.loading[key as keyof typeof this.loading] = false;
      },
      error: (error: HttpErrorResponse) => {
        this.errors[key] = this.apiError(error);
        this.loading[key as keyof typeof this.loading] = false;
      },
    });
  }

  enviarContacto(): void {
    this.contactSuccess = false;
    this.contactError = '';
    this.contactForm.markAllAsTouched();
    if (this.contactForm.invalid || this.contactSending) return;

    this.contactSending = true;
    this.contactosApi.enviar(this.contactForm.getRawValue()).subscribe({
      next: () => {
        this.contactSuccess = true;
        this.contactForm.reset();
        this.contactSending = false;
      },
      error: (error: HttpErrorResponse) => {
        this.contactError = this.apiError(error);
        this.contactSending = false;
      },
    });
  }

  enviarMensajeChat(): void {
    const message = this.chatInput.trim();
    if (!message || this.chatSending) return;

    this.chatError = '';
    this.chatInput = '';
    const history = [...this.chatMessages];
    this.chatMessages = [...this.chatMessages, { role: 'user', content: message }];
    this.chatSending = true;
    this.guardarChatHistory();

    this.chatbotApi.enviar(message, history).subscribe({
      next: (reply) => {
        this.chatMessages = [...this.chatMessages, { role: 'assistant', content: reply }];
        this.chatSending = false;
        this.guardarChatHistory();
      },
      error: () => {
        this.chatError =
          'El asistente virtual no está disponible en este momento. Puedes comunicarte directamente con nuestra veterinaria.';
        this.chatMessages = this.chatMessages.filter(
          (item, index) => !(index === this.chatMessages.length - 1 && item.role === 'user'),
        );
        this.chatInput = message;
        this.chatSending = false;
        this.guardarChatHistory();
      },
    });
  }

  private loadChatHistory(): ChatMessage[] {
    try {
      const saved = sessionStorage.getItem('veterinaria-chat');
      const parsed = saved ? (JSON.parse(saved) as ChatMessage[]) : null;
      return Array.isArray(parsed)
        ? parsed.slice(-16)
        : [{ role: 'welcome', content: '¡Hola! Soy el asistente virtual. ¿En qué puedo ayudarte con tu mascota?' }];
    } catch {
      return [{ role: 'welcome', content: '¡Hola! Soy el asistente virtual. ¿En qué puedo ayudarte con tu mascota?' }];
    }
  }

  private guardarChatHistory(): void {
    try {
      sessionStorage.setItem('veterinaria-chat', JSON.stringify(this.chatMessages.slice(-16)));
    } catch {
      this.chatError = 'No se pudo guardar el historial de esta conversación.';
    }
  }

  private apiError(error: HttpErrorResponse): string {
    if (error.status === 0) return 'No se pudo conectar con el servidor. Inténtalo más tarde.';
    if (error.status === 503) return 'El servicio no está disponible en este momento.';
    return error.error?.error || 'No se pudo cargar la información. Inténtalo más tarde.';
  }
}
