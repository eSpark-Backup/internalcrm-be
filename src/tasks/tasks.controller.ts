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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth-guard';
import { Roles } from 'src/auth/roles-guard';
import { UserRoles } from 'src/entities/roles.entity';
import { CreateTaskDTO, QueryParamDTO, UpdateTaskDTO } from './tasks-dto';
import { TasksService } from './tasks.service';
import { CurrentUser } from 'src/utils/decorators/current-user';
import { Users } from 'src/entities/users.entity';
import { ParamIdDTO } from 'src/utils/id-dto';

@ApiTags('Tasks')
@Controller('tasks')
@UseGuards(AuthGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a Task',
  })
  @Roles([UserRoles.super, UserRoles.lead])
  @Post('')
  @HttpCode(200)
  async createTask(@Body() reqBody: CreateTaskDTO, @CurrentUser() user: Users) {
    const data = await this.tasksService.create(reqBody, user);
    return {
      data,
      status: 'success',
      message: 'Task has been created successfully!',
    };
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get Tasks by Card ID',
  })
  @Get('/card/:id')
  @HttpCode(200)
  async fetchTasks(
    @Param() id: ParamIdDTO,
    @Query() queryParams: QueryParamDTO,
  ) {
    const data = await this.tasksService.fetchTasks(
      id.id,
      queryParams.deleted as unknown as string,
    );
    return {
      data,
      status: 'success',
      message: 'Tasks have been fetched successfully!',
    };
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get Task by ID',
  })
  @Get(':id')
  @HttpCode(200)
  async fetchTask(
    @Param() id: ParamIdDTO,
    @Query() queryParams: QueryParamDTO,
  ) {
    const data = await this.tasksService.fetchTask(
      id.id,
      queryParams.deleted as unknown as string,
    );
    return {
      data,
      status: 'success',
      message: 'Task has been fetched successfully!',
    };
  }
  @ApiBearerAuth()
  @Roles([UserRoles.super, UserRoles.lead])
  @ApiOperation({
    summary: 'Update Task by ID',
  })
  @Patch(':id')
  @HttpCode(200)
  async updateTask(@Body() reqData: UpdateTaskDTO, @Param() id: ParamIdDTO) {
    const data = await this.tasksService.update(reqData, id.id);
    return {
      data,
      status: 'success',
      message: 'Tasks has been updated successfully!',
    };
  }
  @ApiBearerAuth()
  @Roles([UserRoles.super, UserRoles.lead])
  @ApiOperation({
    summary: 'Delete Task by ID',
  })
  @Delete(':id')
  @HttpCode(200)
  async deleteTask(@Param() id: ParamIdDTO) {
    await this.tasksService.delete(id.id);
    return {
      status: 'success',
      message: 'Tasks has been deleted successfully!',
    };
  }
}
