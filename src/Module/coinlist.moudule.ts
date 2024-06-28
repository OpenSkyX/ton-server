
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import CoinList from '../Model/coinlist.model';
import { CoinListManager } from '../Manager/coinlist.manager';
import { CoinListService } from '../Service/coinlist.service';
import { CoinListController } from '../Controller/coinlist.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([CoinList]), // Ensure models are included here
  ],
  controllers: [CoinListController], // Ensure CommentController is not listed as a controller
  providers: [CoinListManager,CoinListService], // Ensure CommentManager is listed as a provider
})
export class CoinListModule {}