import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, ChatMessage } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  private readonly http = inject(HttpClient);

  enviar(
    message: string,
    history: ChatMessage[],
  ): Observable<string> {
    return this.http
      .post<ApiResponse<{ reply: string }>>(`${environment.apiUrl}/chatbot/message`, {
        message,
        history: history
          .filter((item) => item.role !== 'welcome')
          .slice(-8)
          .map(({ role, content }) => ({ role, content })),
      })
      .pipe(map((response) => response.data.reply));
  }
}
