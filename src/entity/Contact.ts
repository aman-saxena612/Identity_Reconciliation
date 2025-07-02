import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Contact {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  phoneNumber!: string;

  @Column({ nullable: true })
  email!: string;

  @ManyToOne(() => Contact, (contact) => contact.linkedContacts, { nullable: true })
  linkedContact!: Contact;

  @OneToMany(() => Contact, (contact) => contact.linkedContact)
  linkedContacts!: Contact[];

  @Column({
    type: 'enum',
    enum: ['primary', 'secondary'],
    default: 'primary',
  })
  linkPrecedence!: 'primary' | 'secondary';

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt!: Date | null;
}
