# 파이프에는 두 가지 일반적인 사용 사례가 있습니다.
* 변환 : 입력 데이터를 원하는 출력으로 변환하는 곳
* & validation : 입력 데이터를 평가하고 유효한 경우 변경하지 않고 전달합니다. 데이터가 유효하지 않으면 예외를 던지고 싶습니다.
두 경우 모두 파이프는 컨트롤러의 경로 처리기에 의해 처리되는 인수에서 작동합니다. 

NestJS 는 메소드가 호출 되기 직전에 파이프를 트리거합니다 .
파이프는 또한 메서드에 전달 될 인수를받습니다. 이 시점 에서 모든 변환 또는 유효성 검사 작업이 발생 합니다. 이후에 (잠재적으로) 변환 된 인수와 함께 경로 처리기가 호출됩니다.


# Generate ParseIntPipe with Nest CLI
nest g pipe common/pipes/parse-int

# ParseIntPipe FINAL CODE
```ts
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException(
        `Validation failed. "${val}" is not an integer.`,
      );
    }
    return val;
  }
}
```