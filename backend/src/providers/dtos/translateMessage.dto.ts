export class TranslateMessageDto {
  data: Data;
}

class Data {
  translations: Translation[];
}

class Translation {
  translatedText: string;
  detectedSourceLanguage: string;
}
