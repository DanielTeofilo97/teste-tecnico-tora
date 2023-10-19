import { Injectable } from '@nestjs/common';
import { AdviceDto } from './dtos/advice.dto';

@Injectable()
export class AdviceService {
  private readonly adviceApiUrl = `${process.env.URl_API_RANDOM_MESSAGES}/advice`;

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
}
