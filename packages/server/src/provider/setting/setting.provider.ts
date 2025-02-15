import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  HttpsSetting,
  LayoutSetting,
  LoginSetting,
  SettingType,
  StaticSetting,
  WalineSetting,
} from 'src/types/setting.dto';
import { SettingDocument } from 'src/scheme/setting.schema';
import { PicgoProvider } from '../static/picgo.provider';
import { encode, decode } from 'js-base64';

@Injectable()
export class SettingProvider {
  constructor(
    @InjectModel('Setting')
    private settingModel: Model<SettingDocument>,
    private readonly picgoProvider: PicgoProvider,
  ) {}
  async getStaticSetting(): Promise<any> {
    const res = await this.settingModel.findOne({ type: 'static' }).exec();
    if (res) {
      return res?.value || { storageType: 'local', picgoConfig: null };
    }
    return null;
  }
  async importSetting(setting: any) {
    for (const [k, v] of Object.entries(setting)) {
      if (k == 'static') {
        await this.importStaticSetting(v as any);
      }
    }
  }
  async importStaticSetting(dto: StaticSetting) {
    await this.updateStaticSetting(dto);
  }
  async getHttpsSetting(): Promise<HttpsSetting> {
    const res = await this.settingModel.findOne({ type: 'https' }).exec();
    if (res) {
      return (res?.value as any) || { redirect: false };
    }
    return null;
  }
  async getLayoutSetting(): Promise<LayoutSetting> {
    const res = await this.settingModel.findOne({ type: 'layout' }).exec();
    if (res) {
      return res?.value as any;
    }
    return null;
  }
  async getLoginSetting(): Promise<LoginSetting> {
    const res = await this.settingModel.findOne({ type: 'login' }).exec();
    if (res) {
      return (
        (res?.value as any) || {
          enableMaxLoginRetry: false,
          maxRetryTimes: 3,
          durationSeconds: 60,
        }
      );
    }
    return null;
  }
  encodeLayoutSetting(dto: LayoutSetting) {
    if (!dto) {
      return null;
    }
    const res: any = {};
    for (const key of Object.keys(dto)) {
      res[key] = encode(dto[key]);
    }
    return res;
  }
  async getWalineSetting(): Promise<WalineSetting> {
    const res = await this.settingModel.findOne({ type: 'waline' }).exec();
    if (res) {
      return (
        (res?.value as any) || {
          email: process.env.EMAIL || undefined,
          'smtp.enabled': false,
          forceLoginComment: false,
        }
      );
    }
    return null;
  }
  async updateLoginSetting(dto: LoginSetting) {
    const oldValue = await this.getLoginSetting();
    const newValue = { ...oldValue, ...dto };
    if (!oldValue) {
      return await this.settingModel.create({
        type: 'login',
        value: newValue,
      });
    }
    const res = await this.settingModel.updateOne(
      { type: 'login' },
      { value: newValue },
    );
    return res;
  }

  async updateWalineSetting(dto: WalineSetting) {
    const oldValue = await this.getWalineSetting();
    const newValue = { ...oldValue, ...dto };
    if (!oldValue) {
      return await this.settingModel.create({
        type: 'waline',
        value: newValue,
      });
    }
    const res = await this.settingModel.updateOne(
      { type: 'waline' },
      { value: newValue },
    );
    return res;
  }
  async updateLayoutSetting(dto: LayoutSetting) {
    const oldValue = await this.getLayoutSetting();
    const newValue = { ...oldValue, ...dto };
    if (!oldValue) {
      return await this.settingModel.create({
        type: 'layout',
        value: newValue,
      });
    }
    const res = await this.settingModel.updateOne(
      { type: 'layout' },
      { value: newValue },
    );
    return res;
  }
  async updateHttpsSetting(dto: HttpsSetting) {
    const oldValue = await this.getHttpsSetting();
    const newValue = { ...oldValue, ...dto };
    if (!oldValue) {
      return await this.settingModel.create({
        type: 'https',
        value: newValue,
      });
    }
    const res = await this.settingModel.updateOne(
      { type: 'https' },
      { value: newValue },
    );
    return res;
  }
  async updateStaticSetting(dto: StaticSetting) {
    const oldValue = await this.getStaticSetting();
    const newValue = { ...oldValue, ...dto };
    if (!oldValue) {
      return await this.settingModel.create({
        type: 'static',
        value: newValue,
      });
    }
    const res = await this.settingModel.updateOne(
      { type: 'static' },
      { value: newValue },
    );

    await this.picgoProvider.initDriver();
    return res;
  }
}
