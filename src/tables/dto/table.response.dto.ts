import { SessionSchema } from '@/schema/session.schema';
import { TablesSchema } from '@/schema/tables.schema';
import { AllPopulatedSessionDto } from '@/session/dto/all-populate-session-.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Ref } from '@typegoose/typegoose';

export class TableResponseDto extends TablesSchema {
  @ApiProperty({
    type: () => AllPopulatedSessionDto,
  })
  session: Ref<SessionSchema>;
}
