# swagger란?
모든 최신 도구와 Nest 플러그인을 활용하여 프로세스의 모든 측면을 자동화하고 단순화 할 것입니다. 

애플리케이션을 문서화하는 가장 좋은 방법 중 하나는 OpenAPI 사양을 사용하는 것입니다. OpenAPI 사양은 RESTful API 를 설명하는 데 사용되는 언어에 구애받지 않는 정의 형식 입니다.

OpenAPI 문서를 통해 다음을 포함한 전체 API를 설명 할 수 있습니다.

* 사용 가능한 작업 (엔드 포인트)
* 작동 매개 변수 : 각 작동에 대한 입력 및 출력
* 인증 방법
* 연락처 정보, 라이센스, 사용 약관 및 기타 정보.
* 그 외..

# install
```bash
yarn add @nestjs/swagger swagger-ui-express
```

# main.ts
```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ApiKeyGuard } from './common/guards/api-key.guard';
import { WrapResponseInterceptor } from './common/interceptors/wrap-response.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalInterceptors(
    new WrapResponseInterceptor(),
    new TimeoutInterceptor(),
  );
  // 가드 내부 주입으로 인해 문제가 발생한다. (guard내의 constructor)
  // app.useGlobalGuards(new ApiKeyGuard())
  app.useGlobalFilters(new HttpExceptionFilter());

  // swagger
  const options = new DocumentBuilder()
    .setTitle('Iluvcoffee')
    .setDescription('Coffee application')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(5000);
}

bootstrap();

```

# cli plugin 활성화
## nest-cli.json에 아래 옵션 추가
```
"compilerOptions": {
  "deleteOutDir": true,
  "plugins": ["@nestjs/swagger/plugin"] 
}
```

# dto에 swagger추가하기
```ts
import { PartialType } from '@nestjs/swagger'; // <--
import { CreateCoffeeDto } from './create-coffee.dto';

export class UpdateCoffeeDto extends PartialType(CreateCoffeeDto) {}

```

# model 속성 꾸미기
CreateCoffeeDto
```ts
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCoffeeDto {
  @ApiProperty({ description: 'The name of a coffee.' })
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'The brand of a coffee.' })
  @IsString()
  readonly brand: string;

  @ApiProperty({ example: [] })
  @IsString({ each: true })
  readonly flavors: string[];
}

```

# 태그를 사용하여 리소스 그룹화
```
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @Public()
  @Get()
  findAll(
    @Protocol('https') protocol: string,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    console.log(protocol);
    return this.coffeesService.findAll(paginationQuery);
  }
```
