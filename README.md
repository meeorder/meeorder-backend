# MeeOrder (Backend)

## Prerequisite

- mongodb
  - Docker
  - [Host locally](https://www.mongodb.com/docs/manual/installation/)
- node v18 or greater [Download](https://nodejs.org/en)

## Preparing project

### Cloning the project

```bash
git clone <meeorder_backend_git_url>
```

### Install dependencies

```bash
# pnpm
npm i -g pnpm
# Install project's dependencies
pnpm i
```

### Setting MongoDB URI

There are two way to set the MongoDB URI

#### In `.env` file

1. Create a file named `.env` in project's root
2. Write `MONGO_URI=<your_mongodb_uri>` in the file

#### In `launch.json` file (for vscode)

1. Open `.vscode/launch.json`
2. Find line that contains `MONGO_URI`
3. Change the value to your MongoDB URI

## Run the project

```bash
pnpm run start:dev # Development Mode (Hot-Reload Avaliable)
```

## Guideline

### Guideline for create module

3 files that require to have (example for health module)

- health.module.ts (module file)
- health.service.ts (service file use for store useCase or business logic)
- health.controller.ts (controller file that provide endpoints by method)

### Naming convention

- camelCase for normal variable, function, methods
- PascalCase for class, type, interface, enum
- SCREAMING_SNAKE_CASE for string enum
- ตั้งชื่อให้สื่อด้วยนะจ๊ะ

#### Guideline for Request payload

- In some endpoints, you must provide request a payload for use in business logic I recommend you to create a class (dto) for body types of payload

##### Example for auth endpoints

###### login-body.dto.ts

```ts
import { ApiProperty } from '@nestjs/swagger';
export class LoginBodyDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  password: string;
}
```

###### auth.controller.ts

```ts
@Controller('auth')
export class IAmController {
  @Post('login')
  async login(@Body() login: LoginBodyDto) {
    return body;
  }
}
```

When you want to use a `Query` or `Params` types of payload you have two choice

- Use `@Query('field-name')` for query attribute or `@Param('field-name')` for params attribute in method's parameter
- Use `@Query()` for query dto or `@Param()` for params dto in method's parameter and create a class (dto) for body types of payload (same as above)

but, you must provide `@ApiParams()` or `@ApiQuery()` for swagger document

##### Example for any endpoints (first style)

###### health.controller.ts (not same health module below) in first style

```ts
import { ApiQuery, ApiParam } from '@nestjs/swagger';
@Controller('health')
export class HealthController {
  @Get()
  @ApiQuery({ name: 'id', type: String, required: true })
  @ApiParam({ name: 'm', type: String, required: true })
  async getHealth(@Query('id') id: string, @Param('m') m: string) {
    return id;
  }
}
```

##### Example for any endpoints (second style)

###### health.controller.ts (not same health module below) in second style

```ts
import { ApiQuery, ApiParam } from '@nestjs/swagger';
@Controller('health')
export class HealthController {
  @Get()
  async getHealth(
    @Query() query: HealthQueryDto,
    @Param() param: HealthParamDto,
  ) {
    return query.id;
  }
}
```

###### health-query.dto.ts

```ts
import { ApiProperty } from '@nestjs/swagger';
export class HealthQueryDto {
  @ApiProperty()
  id: string;
}
```

###### health-param.dto.ts

```ts
import { ApiProperty } from '@nestjs/swagger';
export class HealthParamDto {
  @ApiProperty()
  m: string;
}
```

## Health Module Example

## Abstract Endpoint

- GET /health
  - Record the time when user called this in database and return that record(document)

## Implementation

### health.module.ts

```ts
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HealthClass.name, schema: HealthSchema },
    ]),
  ] // import model ของ mongoose เพื่อใช้่ในการ inject ใน service ต่อไป,
  providers: [HealthService], // เพิ่ม service HealthService ใน HealthModule
  controllers: [HealthController],// เพิ่ม controller HealthController เพื่อ provide endpoint ในระดับ nestjs (เพราะเดียวใน AppModule จะมีการ import ตัว HealthModule)
})
export class HealthModule {}
```

### health.service.ts

```ts
@Injectable() // บอกให้ nest ทราบว่า class นี้รับการ inject ได้
export class HealthService {
  constructor(
    @InjectModel(HealthClass.name)
    private readonly healthModel: Model<HealthClass>, // จาก health.module.ts เราสามารถ inject healthModel ได้ผ่านการเรียก @InjectModel(name_of_model)
  ) {}
  async createRecord(): Promise<HealthClass> {
    const doc = await this.healthModel.create({}); // สร้าง mongo's document ใน db ใน collection ชื่อ healths (อ้างอิงใน @/src/schema/health.schema.ts ใน @Schema(...)
    return doc.toObject({ virtuals: true }); // https://mongoosejs.com/docs/guide.html#toObject
  }
}
```

### health.controller.ts

```ts
@Controller('health') // กำหนด path ของ controller นี้
@ApiTags('health') // กำหนด tag ของ swagger ให้ controller นี้
export class HealthController {
  constructor(private readonly healthService: HealthService) {} // inject service ที่เราสร้างไว้ใน health.module.ts
  @ApiResponse({
    status: HttpStatus.OK, // กำหนด status code ของ response (ใน swagger)
    description: 'Health status', // กำหนดคำอธิบายของ response (ใน swagger)
    type: () => HealthResponseDto, // กำหนด type ของ response (ใน swagger)
  })
  @Get() // กำหนด method ของ endpoint นี้
  async getHealth(): Promise<HealthResponseDto> {
    const doc = await this.healthService.createRecord(); // เรียกใช้ service ที่เราสร้างไว้ใน health.service.ts
    return new HealthResponseDto(doc); // สร้าง instance ของ HealthResponseDto โดยใช้ doc ที่ได้จากการเรียกใช้ service HealthResponseDto อยู่ใน @/health/dto/health-response.dto.ts
  }
}
```
