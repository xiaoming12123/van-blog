import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InitDto } from 'src/types/init.dto';
import { MetaDocument } from 'src/scheme/meta.schema';
import { UserDocument } from 'src/scheme/user.schema';
import { WalineProvider } from '../waline/waline.provider';

@Injectable()
export class InitProvider {
  constructor(
    @InjectModel('Meta') private metaModel: Model<MetaDocument>,
    @InjectModel('User') private userModel: Model<UserDocument>,
    private readonly walineProvider: WalineProvider,
  ) {}

  async init(initDto: InitDto) {
    const { user, siteInfo } = initDto;
    let toUpdateDto = siteInfo;
    if (!siteInfo.since) {
      toUpdateDto = { ...siteInfo, since: new Date() };
    }
    try {
      await this.userModel.create({
        id: 0,
        name: user.username,
        password: user.password,
        mickname: user?.nickname || user.username,
        type: 'admin',
      });
      await this.metaModel.create({
        siteInfo: toUpdateDto,
        links: [],
        socials: [],
        rewards: [],
        about: {
          updatedAt: new Date(),
          content: '',
        },
        categories: [],
      });
      // 运行 waline
      this.walineProvider.init();
      return '初始化成功!';
    } catch (err) {
      throw new BadRequestException('初始化失败');
    }
  }

  async checkHasInited() {
    const user = await this.userModel.findOne({}).exec();
    if (!user) {
      return false;
    }
    return true;
  }
}
