import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { expressJwtSecret } from 'jwks-rsa';
import { expressjwt, GetVerificationKey } from 'express-jwt';
import { promisify } from 'util';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthorizationGuard implements CanActivate {

  private AUTH0_AUDIENCE: string;
  private AUTH0_DOMAIN: string;

  constructor( private configService: ConfigService){
    this.AUTH0_AUDIENCE = this.configService.get('AUTH0_AUDIENCE');
    this.AUTH0_DOMAIN = this.configService.get('AUTH0_DOMAIN');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.getArgByIndex(0);
    const res = context.getArgByIndex(1);
   
    console.log("jwksUri:-----------> ", `${this.AUTH0_DOMAIN}.well-known/jwks.json`)
    console.log("audience:-----------> ", this.AUTH0_AUDIENCE)
    console.log("issuer:-----------> ",  this.AUTH0_DOMAIN)
    
    const checkJwt = promisify(expressjwt({
          secret: expressJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: 'https://dev-vltfesvzg1vkq6r1.us.auth0.com/.well-known/jwks.json'
          // `${this.AUTH0_DOMAIN}.well-known/jwks.json`,
        })as GetVerificationKey,
        audience:'nestjs-demo',
        //  this.AUTH0_AUDIENCE,
        issuer: 'https://dev-vltfesvzg1vkq6r1.us.auth0.com/',
        // this.AUTH0_DOMAIN,
        algorithms: ['RS256']
      })
    );
    try{
      await checkJwt(req, res)
      return true;
    }
    catch(error){
      console.log("error=======", error)
      throw new UnauthorizedException(error)
    }
  }
}
