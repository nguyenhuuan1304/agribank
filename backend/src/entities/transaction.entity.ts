import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  transaction_number: string;

  @Column()
  customer_number: string;

  @Column()
  customer_name: string;

  @Column({ type: 'date' })
  transaction_date: Date;

  @Column()
  currency: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  transaction_amount: number;

  @Column()
  beneficiary: string;

  @Column({ type: 'text' })
  remark: string;

  @Column({ nullable: true })
  contract_number: string;

  @Column({ type: 'date', nullable: true })
  expected_delivery_date: Date;

  @Column({ type: 'date', nullable: true })
  expected_declaration_date: Date;

  @Column({ default: false })
  is_document_added: boolean;

  @CreateDateColumn()
  created_at: Date;
}
