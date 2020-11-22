# 인터셉터는 다음을 가능하게합니다.
* 메서드 실행 전후에 추가 논리 바인딩
* 메서드에서 반환 된 결과를 변환
* 메서드에서 throw 된 예외를 변환
* 기본 메서드 동작 확장
* 특정 조건에 따라 (예 : 다양한 응답 캐싱과 같은 작업 수행) 메서드를 완전히 재정의하거나

# 인터셉터를 이용하여 response wrapping 하기

### Generate WrapResponseInterceptor with Nest CLI 
nest g interceptor common/interceptors/wrap-response

### WrapResponseInterceptor FINAL CODE 
data로 wrapping한다.
```ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class WrapResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');

    return next.handle().pipe(map(data => ({ data })));
  }
}
```

### Apply Interceptor globally in main.ts file
```
...

app.useGlobalInterceptors(new WrapResponseInterceptor());

...
```

# 인터셉터를 이용하여 시간초과 처리하기
### Generate TimeoutInterceptor with Nest CLI */
```bash
nest g interceptor common/interceptors/timeout
```

### Apply TimeoutInterceptor globally in main.ts file */
```ts
app.useGlobalInterceptors(
  new WrapResponseInterceptor(), 
  new TimeoutInterceptor(), // 👈
);
```

### Add manual timeout to force timeout interceptor to work */
await new Promise(resolve => setTimeout(resolve, 5000));

### TimeoutInterceptor FINAL CODE */
```ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(3000),
      catchError(err => {
        if (err instanceof TimeoutError) {
          return throwError(new RequestTimeoutException());
        }
        return throwError(err);
      }),
    );
  }
}
```