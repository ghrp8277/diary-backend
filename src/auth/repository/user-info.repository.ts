import { EntityRepository, Repository } from 'typeorm';
import { UserInfo } from '../entities/user-info.entity';

@EntityRepository(UserInfo)
export class UserInfoRepository extends Repository<UserInfo> {
  async registerUserInfo(e_mail: string) {
    const account_expired = new Date(
      new Date().setFullYear(new Date().getFullYear() + 1),
    );

    const password_expired = new Date(
      new Date().setMonth(new Date().getMonth() + 6),
    );

    const userInfo = this.create({ e_mail, account_expired, password_expired });

    return await this.save(userInfo);
  }

  // 이메일 중복 확인
  async emailDuplicateCheck(e_mail: string): Promise<boolean> {
    const userInfo = await this.findOne({ e_mail });

    if (userInfo) return false;
    else return true;
  }

  // 활성화 유저인지 확인
  async userActiveMatch(id: number) {
    const userInfo = await this.findOne({ id });

    if (userInfo.status == 'ACTIVE') return true;
    else return false;
  }
}
