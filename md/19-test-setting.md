# 단위 테스트
단위 테스트의 경우 NestJS에서 사양 파일을 테스트하는 애플리케이션 소스 코드 파일과 동일한 폴더에 보관하는 것이 일반적입니다. 

각 컨트롤러, 공급자, 서비스 등에는 자체 전용 테스트 파일이 있어야합니다. 테스트 파일 확장자 는 (dot) .spec.ts 여야합니다 (이렇게하면 통합 테스트 도구가 테스트 스위트가있는 테스트 파일로 식별 할 수 있습니다).

# 종단 간 (e2e) 테스트
e2e 테스트의 경우 이러한 파일은 일반적으로 기본적으로 전용`test` 디렉토리에 있습니다. e2e 테스트는 일반적으로 테스트하는 기능에 따라 별도의 파일로 그룹화됩니다. 파일 확장자는 (점) .e2e-spec.ts 여야합니다. 

# 어떻게 다릅니 까?
* 단위 테스트는 개별 클래스와 함수에 중점을 둡니다.

* e2e 테스트는 전체 시스템의 높은 수준의 검증에 적합합니다. e2e 테스트는 최종 사용자가 프로덕션 시스템과의 상호 작용에 더 가깝게 더 종합적인 수준에서 클래스 및 모듈의 상호 작용을 다룹니다.

# unit test
## cli
```
// Run a unit test for a -specific- file pattern
npm run test:watch -- coffees.service
```

## Basic / empty "Mocks" for Entities in our CoffeesService 
```ts
providers: [
  CoffeesService,
  { provide: Connection, useValue: {} },
  { provide: getRepositoryToken(Flavor), useValue: {} }, // 👈
  { provide: getRepositoryToken(Coffee), useValue: {} }, // 👈
]
```
## Repository 추가
```ts
import { Test, TestingModule } from '@nestjs/testing';
import { CoffeesService } from './coffees.service';
import { Connection, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Flavor } from './entities/flavor.entity';
import { Coffee } from './entities/coffee.entity';
import { NotFoundException } from '@nestjs/common';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
});

describe('CoffeesService', () => {
  let service: CoffeesService;
  let coffeeRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoffeesService,
        {
          provide: Connection,
          useValue: {},
        },
        {
          provide: getRepositoryToken(Flavor),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Coffee),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<CoffeesService>(CoffeesService);
    coffeeRepository = module.get<MockRepository>(getRepositoryToken(Coffee));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // "findOne"메소드가 내부에 "coffeeRepository.findOne"을 사용하고 있으므로,
  // 따라서 테스트가 제대로 실행 되려면 이 repository 메소드를 모방해야한다.
  describe('findOne', () => {
    describe('when coffee with ID exists', () => {
      it('should return the coffee object', async () => {
        const coffeeId = '1';
        const expectedCoffee = {};
        coffeeRepository.findOne.mockReturnValue(expectedCoffee);
        const coffee = await service.findOne(coffeeId);
        expect(coffee).toEqual(expectedCoffee);
      });
    });
    describe('otherwise', () => {
      it('should throw the NotFoundException', async () => {
        const coffeeId = '1';
        coffeeRepository.findOne.mockReturnValue(undefined);

        try {
          await service.findOne(coffeeId);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`Coffee #${coffeeId} not found`);
        }
      });
    });
  });
});

```

# e2e 테스트
## cli
```
yarn test:e2e
```

## app.e2e-spec.ts
```ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .set('Authorization', process.env.API_KEY)
      .expect(200)
      .expect('Hello World!');
  });

  // 이걸 넣어야 경고가 발생하지 않음. (테스트가 끝나면 앱을 종료)
  afterAll(async () => {
    await app.close();
  });
});

```