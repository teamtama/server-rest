# custom decorator 만들기
### common/decorators/protocol.decorator.ts
```ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const Protocol = createParamDecorator(
  (defaultValue: string, ctx: ExecutionContext) => {
    console.log(defaultValue);
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.protocol;
  },
);

```

# 사용해보기
### coffees/coffees.controller.ts
```ts
...

  @Public()
  @Get()
  findAll(
    @Protocol('https') protocol: string,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    console.log(protocol);
    return this.coffeesService.findAll(paginationQuery);
  }

...
```