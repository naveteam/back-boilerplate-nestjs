import { Injectable } from '@nestjs/common';
import { CONFIG } from '../config';

@Injectable()
export class HealthService {
  check() {
    return {
      isMaintenance: false,
      apiVersion: CONFIG.API_VERSION,
      apiHealthMessage: CONFIG.API_HEALTH_MESSAGE,
      apiStatus: true,
      dbStatus: true,
    };
  }
}
