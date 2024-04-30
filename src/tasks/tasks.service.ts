import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDTO, UpdateTaskDTO } from './tasks-dto';
import { UserService } from 'src/user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { Tasks } from 'src/entities/tasks.entity';
import { Repository } from 'typeorm';
import { CardsService } from 'src/cards/cards.service';

@Injectable()
export class TasksService {
  constructor(
    private userService: UserService,
    private cardsService: CardsService,
    @InjectRepository(Tasks)
    private taskRepositry: Repository<Tasks>,
  ) {}
  async create(data: CreateTaskDTO, currentUser: Users) {
    const user = await this.userService.getUserDetails(data.assignedTo);
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    const card = await this.cardsService.findOne(data.cardId);
    const task = this.taskRepositry.create({
      assignedTo: { id: data.assignedTo },
      assignedBy: { id: currentUser.id },
      description: data.description,
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
      cardId: { id: card.id },
    });
    return this.taskRepositry.save(task);
  }

  async fetchTasks(cardId: number, isDeleted: string) {
    return this.taskRepositry.find({
      where: { cardId: { id: cardId } },
      relations: { cardId: true, assignedBy: true, assignedTo: true },
      select: {
        cardId: { id: true },
        assignedBy: { id: true },
        assignedTo: { id: true },
      },
      withDeleted: isDeleted === 'true' ? true : false,
    });
  }
  fetchTask(taskId: number, isDeleted: string) {
    return this.taskRepositry.findOne({
      where: { id: taskId },
      relations: { cardId: true, assignedBy: true, assignedTo: true },
      select: {
        cardId: { id: true },
        assignedBy: { id: true },
        assignedTo: { id: true },
      },
      withDeleted: isDeleted === 'true' ? true : false,
    });
  }
  async update(data: UpdateTaskDTO, tasksId: number) {
    const task = await this.taskRepositry.findOne({
      where: { id: tasksId },
      relations: { assignedTo: true, cardId: true },
    });
    if (data.assignedTo) {
      const user = await this.userService.getUserDetails(data.assignedTo);
      if (!user) {
        throw new NotFoundException('User not found!');
      }
    }
    if (!task) {
      throw new NotFoundException('Task not found!');
    }
    if (data.cardId) {
      const card = await this.cardsService.findOne(data.cardId);
      if (!card) {
        throw new NotFoundException('Card not found!');
      }
    }
    const updateObject = {
      assignedTo: {
        id: data.assignedTo ?? task.assignedTo.id,
      },
      cardId: {
        id: data.cardId ?? task.cardId.id,
      },
      completedAt: data.completedAt ?? task.completedAt,
      description: data.description ?? task.description,
      endDate: data.endDate ?? task.endDate,
      name: data.name ?? task.name,
      startDate: data.startDate ?? task.startDate,
      status: data.status ?? task.status,
    };

    return this.taskRepositry.save({ ...task, ...updateObject });
  }

  async delete(id: number) {
    const card = await this.taskRepositry.findOne({
      where: { id },
    });
    if (!card) {
      throw new NotFoundException('Task not found!');
    }
    return this.taskRepositry.softRemove(card);
  }
}
