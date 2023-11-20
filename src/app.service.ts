import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Lets authenticate!';
  }
  getPrivate(): string {
    return 'This is a protected resource. Welcome member';
  }
  
  getPublic(): string {
    return 'This is a public resource. Welcome visitor!'; 
  }
}
