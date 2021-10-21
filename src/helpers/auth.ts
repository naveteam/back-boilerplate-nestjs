import { OAuth2 } from '@naveteam/pandora-backend';

export const generateTokens = (dataToEncrypt: any) =>
  OAuth2.generateTokens(dataToEncrypt);
