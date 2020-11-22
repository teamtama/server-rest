# middleware
미들웨어 함수는 요청 및 응답 객체에 액세스 할 수 있으며 특별히 어떤 메서드에도 연결되지 않고 지정된 경로 PATH에 연결 됩니다.

미들웨어 기능은 다음 작업을 수행 할 수 있습니다.

* 코드 실행
* 요청 및 응답 개체를 변경합니다.
* 요청-응답주기를 종료합니다.
* 또는 호출 스택에서 다음 미들웨어 함수를 호출 할 수도 있습니다.

미들웨어로 작업 할 때 현재 미들웨어 함수가 요청-응답주기를 종료하지 않으면 다음 미들웨어 함수에 제어를 전달하는 next () 메서드를 호출 해야합니다 .

그렇지 않으면 요청이 중단되고 완료되지 않습니다.

# Generate LoggingMiddleware with Nest CLI
```
nest g middleware common/middleware/logging
```

# Apply LoggingMiddleware in our AppModule or CommonModule
```ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ApiKeyGuard } from './guards/api-key.guard';
import { ConfigModule } from '@nestjs/config';
import { LoggingMiddleware } from './middleware/logging.middleware';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
  ],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
```

# LoggingMiddleware FINAL CODE 
```ts
import {
  Injectable,
  NestMiddleware,
} from '@nestjs/common';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.time('Request-response time');
    console.log('Hi from middleware!');
    
    res.on('finish', () => console.timeEnd('Request-response time'));
    next(); 
  }
}
```