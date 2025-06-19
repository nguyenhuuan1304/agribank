import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../../entities/transaction.entity';
import { Repository } from 'typeorm';
import * as dayjs from 'dayjs';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
  ) {}

  // ✅ Hàm import Excel
  async importFromExcel(data: any[]) {
    const transactions: Transaction[] = [];

    for (const row of data) {
      const transactionNumber = this.safeField(
        row,
        'Transaction number',
        '\uFEFFTransaction number',
      );

      // ⚠️ Nếu thiếu số giao dịch thì bỏ qua dòng này
      if (!transactionNumber) {
        console.warn('❌ Thiếu Transaction number ở dòng:', row);
        continue;
      }

      const remarkInfo = this.parseRemark(this.safeField(row, 'Remark') || '');

      const transaction = this.transactionRepo.create({
        transaction_number: transactionNumber,
        customer_number: this.safeField(row, 'Customer number'),
        customer_name: this.safeField(row, 'Customer name'),
        transaction_date: this.toDate(this.safeField(row, 'Transaction Date')),
        currency: this.safeField(row, 'Currency'),
        transaction_amount: Number(
          this.safeField(row, 'Transaction Amount') || 0,
        ),
        beneficiary: this.safeField(row, 'Beneficiary'),
        remark: this.safeField(row, 'Remark'),
        contract_number: remarkInfo.contractNumber || null,
        expected_delivery_date: remarkInfo.deliveryDate,
        expected_declaration_date: remarkInfo.declarationDate,
        is_document_added: false,
      } as Partial<Transaction>);

      transactions.push(transaction);
    }

    return await this.transactionRepo.save(transactions);
  }

  // ✅ Parse remark
  private parseRemark(remark: string): {
    contractNumber: string | null;
    deliveryDate: Date | null;
    declarationDate: Date | null;
  } {
    // Ví dụ: "TT TRUOC 100% HD 8486" hoặc "TT TRUOC ... HD 25.3-F"
    const regex =
      /(In advance|Payment in advance|Deposit|TT in advance|TT trước|TT TRUOC|tạm ứng)[\s\-]*(.*?)\s*(\d{6})/i;
    const match = remark.match(regex);

    if (!match) {
      return {
        contractNumber: null,
        deliveryDate: null,
        declarationDate: null,
      };
    }

    const [, , contractNumber, yymmdd] = match;

    const deliveryDate = this.parseYYMMDD(yymmdd);
    const declarationDate = deliveryDate
      ? dayjs(deliveryDate).add(30, 'day').toDate()
      : null;

    return {
      contractNumber,
      deliveryDate,
      declarationDate,
    };
  }

  // ✅ Helper parse ngày YYMMDD → Date
  private parseYYMMDD(yymmdd: string): Date | null {
    if (!/^\d{6}$/.test(yymmdd)) return null;
    const year = +`20${yymmdd.slice(0, 2)}`;
    const month = +yymmdd.slice(2, 4) - 1;
    const day = +yymmdd.slice(4, 6);
    return new Date(year, month, day);
  }

  // ✅ Chuyển mọi kiểu ngày sang JS Date
  private toDate(value: any): Date | null {
    if (!value) return null;

    // Nếu là số (Excel serial date), chuyển sang Date
    if (typeof value === 'number') {
      // Excel serial starts from 1900-01-01
      return new Date(Date.UTC(1899, 11, 30 + value));
    }

    // Nếu là chuỗi, parse bình thường
    return dayjs(value).toDate();
  }

  // ✅ Helper để lấy field an toàn (chống lỗi key BOM)
  private safeField(row: any, ...keys: string[]): any {
    for (const key of keys) {
      if (row[key] !== undefined) return row[key];
    }
    return null;
  }


  // ✅ Hàm tìm kiếm và phân trang
  async findAllPaginated(page: number, limit: number, search?: string) {
    const qb = this.transactionRepo.createQueryBuilder('transaction');

    if (search) {
      qb.where('transaction.customer_name ILIKE :search', {
        search: `%${search}%`,
      });
    }

    qb.orderBy('transaction.id', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }
}
