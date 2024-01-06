import { Injectable } from '@nestjs/common';
import { InjectUuidService, UuidService } from 'nestjs-uuid';

@Injectable()
export class TokenService {
  constructor(@InjectUuidService() private readonly uuidService: UuidService) {}
  create() {
    return this.uuidService.generate();
  }
}
