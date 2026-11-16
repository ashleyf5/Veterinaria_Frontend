export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  imageUrl: string | null;
  icon: string | null;
}

export interface Especialidad {
  id: number;
  nombre: string;
  descripcion: string;
  imageUrl: string | null;
}

export interface Precio {
  servicioId: number;
  serviceName: string;
  price: string | number | null;
  currency: string;
  note: string | null;
}

export interface Veterinaria {
  id: number;
  nombre: string;
  descripcion: string;
  historia: string;
  mision: string;
  vision: string;
  valores: string;
  direccion: string;
  telefono: string;
  correo: string;
  whatsapp: string | null;
  horarioAtencion: string;
  mapaUrl: string | null;
}

export interface FotoGaleria {
  id: number;
  titulo: string;
  descripcion: string | null;
  imageUrl: string;
  categoria: string | null;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'welcome';
  content: string;
}
