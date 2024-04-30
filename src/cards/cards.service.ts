import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cards } from 'src/entities/cards.entity';
import { Repository } from 'typeorm';
import { CreateCardDTO, UpdateCardDTO } from './cards-dto';
import { ProjectsService } from 'src/projects/projects.service';
import { TaskStatus } from 'src/entities/tasks.entity';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Cards)
    private cardsRepo: Repository<Cards>,
    private projectService: ProjectsService,
  ) {}
  async create(cardDetails: CreateCardDTO) {
    const project = await this.projectService.findOne(cardDetails.projectId);
    const newCard = this.cardsRepo.create({
      name: cardDetails.name,
      projectId: project,
    });
    return this.cardsRepo.save(newCard);
  }

  async findOne(id: number) {
    const card = await this.cardsRepo.findOne({ where: { id } });
    if (!card) {
      throw new NotFoundException('Card not found');
    }
    return card;
  }

  async fetchCards(projectId: number) {
    return this.cardsRepo.find({
      where: { projectId: { id: projectId } },
      relations: { tasks: true },
    });
  }

  async updateCard(id: number, cardDetails: UpdateCardDTO) {
    const card = await this.cardsRepo.findOne({
      where: { id },
    });
    if (!card) {
      throw new NotFoundException('Card not found');
    }
    const updatedCard = await this.cardsRepo.save({
      ...card,
      name: cardDetails.name,
    });
    return updatedCard;
  }

  async deleteCard(id: number) {
    const card = await this.cardsRepo.findOne({
      where: { id },
      relations: {
        tasks: true,
      },
    });
    if (!card) {
      throw new NotFoundException('Card not found!');
    }
    const hasPendingTasks = card.tasks.some(
      (task) =>
        task.status === TaskStatus.pending ||
        task.status === TaskStatus.active ||
        task.status === TaskStatus.incomplete,
    );
    if (hasPendingTasks) {
      throw new ForbiddenException(
        'Cannot delete. Card has pending/active/incomplete tasks',
      );
    }
    return this.cardsRepo.softRemove(card);
  }
}
