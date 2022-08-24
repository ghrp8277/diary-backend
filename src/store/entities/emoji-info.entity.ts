import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ImageFile } from './image-file.entity';

@Entity({ name: 'emoji_info' })
export class EmojiInfo extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => ImageFile, (imageFile) => imageFile.emojiInfo, {
        cascade: true,
    })
    @JoinColumn()
    imageFile: ImageFile;

    @CreateDateColumn({
        name: 'create_at',
        nullable: false,
        comment: '등록일',
        default: () => 'NOW()',
    })
    createdAt: Date;

    @Column({
        default: false,
        nullable: false,
        name: 'is_confirm',
        comment: '승인 여부',
        type: 'boolean'
    })
    is_confirm: boolean;
}