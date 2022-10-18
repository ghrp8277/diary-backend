import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmojiGroup } from '../entities/emoji-group.entity';
import { EmojiInfo } from '../entities/emoji-info.entity';
import { EmojiGroupItemRepository } from '../repository/emoji-group-item.repository';
import { EmojiGroupRepository } from '../repository/emoji-group.repository';

Injectable();
export class StoreGroupService {
  constructor(
    @InjectRepository(EmojiGroupItemRepository)
    private readonly emojiGroupItemRepository: EmojiGroupItemRepository,
    @InjectRepository(EmojiGroupRepository)
    private readonly emojiGroupRepository: EmojiGroupRepository,
  ) {}
  async createEmojiGroup(title: string, bg_color: string, text_color: string) {
    await this.emojiGroupRepository.createEmojiGroup(
      title,
      bg_color,
      text_color,
    );
  }

  async findEmojiGroupByTitle(title: string) {
    return await this.emojiGroupRepository.findEmojiGroupByTitle(title);
  }

  async createEmojiGroupItem(
    title: string,
    items: number[],
    emojiGroup: EmojiGroup,
  ) {
    await this.emojiGroupItemRepository.createEmojiGroupItem(
      title,
      items,
      emojiGroup,
    );
  }

  async findEmojiGroupItemByTitle(title: string) {
    return await this.emojiGroupItemRepository.findEmojiGroupItemByTitle(title);
  }

  async updateEmojiGroupItemByItems(id: number, items: number[]) {
    await this.emojiGroupItemRepository.updateEmojiGroupItemByItems(id, items);
  }

  async findAllEmojiGroup() {
    return await this.emojiGroupRepository.findAllEmojiGroup();
  }
}
