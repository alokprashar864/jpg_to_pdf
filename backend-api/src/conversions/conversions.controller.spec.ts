import { Test, TestingModule } from '@nestjs/testing';
import { ConversionsController } from './conversions.controller.js';

describe('ConversionsController', () => {
  let controller: ConversionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConversionsController],
    }).compile();

    controller = module.get<ConversionsController>(ConversionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
