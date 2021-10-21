import { Module } from '@nestjs/common';
import { HealthController } from '../controllers/health.controller';
import { HealthService } from '../services/health.service';

@Module({
  imports: [],
  controllers: [HealthController],
  providers: [HealthService],
  exports: [HealthService],
})
export class HealthModule {}
