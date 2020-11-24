import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';

import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

interface Request {
  title: string;
  value: number;
  category: string;
  type: 'income' | 'outcome';
}

class ImportTransactionsService {
  async execute(fileName: string): Promise<Transaction[]> {
    // TODO

    let transactionsList: Transaction[] = [];

    const lines = await this.loadCSV(fileName);

    console.log(lines);

    for (let x = 0; x < lines.length; x++) {
      const createTransaction = new CreateTransactionService();
      const transaction = await createTransaction.execute(lines[x]);
      transactionsList.push(transaction);
    }
    console.log(transactionsList);

    return transactionsList;
  }

  async loadCSV(fileName: string): Promise<Request[]> {
    const csvFilePath = path.resolve(
      __dirname,
      '..',
      '..',
      'tmp',
      `${fileName}`,
    );

    const readCSVStream = fs.createReadStream(csvFilePath);

    const parseStream = csvParse({ from_line: 2, ltrim: true, rtrim: true });

    const parseCSV = readCSVStream.pipe(parseStream);
    const lines: Request[] = [];
    parseCSV.on('data', line => {
      lines.push({
        title: line[0],
        type: line[1],
        value: line[2],
        category: line[3],
      });
    });
    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    return lines;
  }
}

export default ImportTransactionsService;
