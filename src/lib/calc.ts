import * as types from 'ns-types';
import { BigNumber } from 'BigNumber.js';

/**
  * @class
  * @classdesc 计算器
  */
export class Calc {

  static closePosition(options: {
    account: types.Account,
    order: types.Order,
    position?: types.Position
  }) {
    const posiQty = options.position ? new BigNumber(options.position.quantity) : undefined;

    switch (options.order.side) {
      // 多单买入
      case types.OrderSide.Buy:
        // 已有持仓
        if (options.position) {
          // 更新数量（已有数量+订单数量）
          options.position.quantity = new BigNumber(options.position.quantity)
            .plus(new BigNumber(options.order.amount)).toFormat(8);
          // 更新持仓均价（(已有仓位价格+订单价格）/2）
          options.position.price = new BigNumber(options.position.price)
            .plus(options.order.price).div(2).toFormat(8);
        } else { // 建仓
          options.position = {
            account_id: options.account.id,
            symbol: options.order.symbol,
            type: options.order.symbolType,
            side: options.order.side,
            quantity: options.order.amount,
            price: options.order.price,
            backtest: options.order.backtest,
            mocktime: options.order.mocktime
          }
        }
        // 更新余额（余币）
        // 购买总价 = 订单股价*订单股数
        const buyTotal = new BigNumber(options.order.price).
          times(new BigNumber(options.order.amount));
        // TODO
        const useBitcoin = false;
        const fee = 0;
        if (useBitcoin) {
          // 余币 = 当前余币 - 股数
          options.account.bitcoin = new BigNumber(options.account.bitcoin)
            .minus(options.order.amount).minus(fee).toFormat(8);
        } else {
          // 余额 = 当前余额 - 购买总价 - 手续费
          options.account.balance = new BigNumber(options.account.balance)
            .minus(buyTotal).minus(fee).toFormat(8);
        }
        return {
          account: options.account,
          position: options.position
        };

      default:
        break;
    }
  }
}
