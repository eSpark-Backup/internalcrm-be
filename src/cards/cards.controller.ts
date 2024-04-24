import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth-guard';
import { Roles } from 'src/auth/roles-guard';
import { UserRoles } from 'src/entities/roles.entity';
import { CreateCardDTO, ProjectIdDTO, UpdateCardDTO } from './cards-dto';
import { ParamIdDTO } from 'src/utils/id-dto';

@ApiTags('Cards')
@Controller('cards')
@UseGuards(AuthGuard)
export class CardsController {
  constructor(private cardsService: CardsService) {}
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a Card',
  })
  @Roles([UserRoles.super, UserRoles.lead])
  @Post('')
  @HttpCode(200)
  async createCard(@Body() reqBody: CreateCardDTO) {
    const data = await this.cardsService.create(reqBody);
    return {
      data,
      status: 'success',
      message: 'Card has been created successfully!',
    };
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Fetch All Cards of a Project',
  })
  @Roles([UserRoles.super, UserRoles.lead])
  @Get('')
  @HttpCode(200)
  async fetchCards(@Query() queryParams: ProjectIdDTO) {
    const data = await this.cardsService.fetchCards(queryParams.projectId);
    return {
      data,
      status: 'success',
      message: 'Cards have been fetched successfully!',
    };
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update Card Details',
  })
  @Roles([UserRoles.super, UserRoles.lead])
  @Patch(':id')
  @HttpCode(200)
  async updateCard(@Body() body: UpdateCardDTO, @Param() id: ParamIdDTO) {
    const data = await this.cardsService.updateCard(id.id, body);
    return {
      data,
      status: 'success',
      message: 'Card has been updated successfully!',
    };
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete Card',
  })
  @Roles([UserRoles.super, UserRoles.lead])
  @Delete(':id')
  @HttpCode(200)
  async deleteCard(@Param() id: ParamIdDTO) {
    await this.cardsService.deleteCard(id.id);
    return {
      status: 'success',
      message: 'Card has been updated successfully!',
    };
  }
}
