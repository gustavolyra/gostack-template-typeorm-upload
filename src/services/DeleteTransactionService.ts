// import AppError from '../errors/AppError';

import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const transactionDelete = await transactionsRepository.findOne({ id: id });

    if(!transactionDelete){
      throw new AppError("Transaction not Found!");
    }

    const response = await transactionsRepository.remove(transactionDelete);


  }
}

export default DeleteTransactionService;
