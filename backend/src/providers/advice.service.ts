import { Injectable } from '@nestjs/common';
import { AdviceDto } from './dtos/advice.dto';
import { TranslateMessageDto } from './dtos/translateMessage.dto';

@Injectable()
export class AdviceService {
  private readonly adviceApiUrl = `${process.env.URL_API_RANDOM_MESSAGES}/advice`;
  private readonly googleApiUrl = `${process.env.URL_GOOGLE_TRANSLATE}?target=pt&key=${process.env.API_KEY_GOOGLE}&q=`;

  async getRandomAdvice(): Promise<AdviceDto> {
    try {
      const response = await fetch(this.adviceApiUrl);
      if (response.ok) {
        const data = await response.json();
        if (data.slip && data.slip.advice) {
          return data;
        } else {
          throw new Error('Unable to fetch advice from the API');
        }
      } else {
        throw new Error('Error fetching advice: ' + response.status);
      }
    } catch (error) {
      throw new Error('Error fetching advice: ' + error.message);
    }
  }

  async getTranslateOfAdvice(message: string): Promise<TranslateMessageDto> {
    try {
      const response = await fetch(this.googleApiUrl + message);
      if (response.ok) {
        const data = await response.json();
        if (data.data && data.data.translations) {
          return data;
        } else {
          throw new Error('Unable to translate message from the API GOOGLE');
        }
      } else {
        throw new Error('Error fetching GOOGLE: ' + response.status);
      }
    } catch (error) {
      throw new Error('Error fetching GOOGLE: ' + error.message);
    }
  }
}
