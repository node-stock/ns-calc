import * as types from 'ns-types';
import { BigNumber } from 'BigNumber.js';
import { Log, Util } from 'ns-common';


export interface IAccPosi {
  account: types.Account,
  position: types.Position | null
}

/**
  * @class
  * @classdesc 计算器
  */
export class Calc {

  static openPosition(options: {
    account: types.Account,
    order: types.Order
  }) {
    Log.system.info('计算建仓[启动]');
    Log.system.info(`账户信息：${JSON.stringify(options.account, null, 2)}，
    订单：${JSON.stringify(options.order, null, 2)}`);
    if (options.order.side !== types.OrderSide.Buy
      && options.order.side !== types.OrderSide.Sell) {
      Log.system.error(`订单方向${options.order.side}异常!`);
      return;
    }
    if (options.order.side === types.OrderSide.Sell) {
      Log.system.error(`暂时未对应做空!`);
      return;
    }
    let position = null;
    switch (options.order.side) {
      // 多单买入
      case types.OrderSide.Buy:
        Log.system.info('多单建仓');
        position = options.account.positions.find(o =>
          o.symbol === options.order.symbol && o.side === types.OrderSide.Buy
        );
        // 已有持仓
        if (position) {
          Log.system.info('已有持仓信息：', JSON.stringify(position, null, 2));
          // 更新数量（已有数量+订单数量）
          position.quantity = new BigNumber(position.quantity)
            .plus(new BigNumber(options.order.amount)).toString();
          // 更新持仓均价（(已有仓位价格+订单价格）/2）
          position.price = new BigNumber(position.price)
            .plus(options.order.price).div(2).toString();
        } else { // 建仓
          position = {
            account_id: options.account.id,
            symbol: options.order.symbol,
            type: options.order.symbolType,
            side: options.order.side,
            quantity: options.order.amount,
            price: options.order.price,
            backtest: options.order.backtest,
            mocktime: options.order.mocktime
          }
          Log.system.info('查询到持仓信息，建仓：', JSON.stringify(position, null, 2));
          options.account.positions.push(position);
        }
        // 更新余额（余币）
        // 购买总价 = 订单价格*订单数量
        const contractPrice = new BigNumber(options.order.price).
          times(new BigNumber(options.order.amount));
        Log.system.info(`购买总价(${contractPrice.toString()}) =
          订单价格(${options.order.price}) * 订单数量(${options.order.amount})`);

        const useBitcoin = Util.getTradeUnit(options.order.symbol).type === 'btc';
        const fee = Util.getFee(options.order.symbol);
        if (useBitcoin) {
          const lastBitcoin = options.account.bitcoin;
          // 余币 = 当前余币 - 购买总价 - 手续费
          options.account.bitcoin = new BigNumber(lastBitcoin)
            .minus(contractPrice).minus(fee).toString();
          Log.system.info(`余币(${options.account.bitcoin}) =
            当前余币(${lastBitcoin}) - 购买总价(${contractPrice}) - 手续费(${fee})`);
        } else {
          const lastBalance = options.account.balance;
          // 余额 = 当前余额 - 购买总价 - 手续费
          options.account.balance = new BigNumber(lastBalance)
            .minus(contractPrice).minus(fee).toString();
          Log.system.info(`余额(${options.account.balance}) =
              当前余额(${lastBalance}) - 购买总价(${contractPrice}) - 手续费(${fee})`);
        }
        break;
    }
    Log.system.info('计算建仓[终了]');
    return <IAccPosi>{ account: options.account, position };
  }

  static closePosition(options: {
    account: types.Account,
    order: types.Order
  }) {
    Log.system.info('计算平仓[启动]');
    Log.system.info(`账户信息：${JSON.stringify(options.account, null, 2)}，
    订单：${JSON.stringify(options.order, null, 2)}`);
    if (options.order.side !== types.OrderSide.BuyClose
      && options.order.side !== types.OrderSide.SellClose) {
      Log.system.error(`订单方向${options.order.side}异常!`);
      return;
    }
    if (options.order.side === types.OrderSide.SellClose) {
      Log.system.error(`暂时未对应空单平仓!`);
      return;
    }
    let position = null;
    switch (options.order.side) {
      // 多单平仓
      case types.OrderSide.BuyClose:
        Log.system.info('多单平仓');
        position = options.account.positions.find(o =>
          o.symbol === options.order.symbol && o.side === types.OrderSide.Buy
        );
        // 已有持仓
        if (position) {
          Log.system.info('已有持仓信息：', JSON.stringify(position, null, 2));
          // 更新数量（已有数量-订单数量）
          position.quantity = new BigNumber(position.quantity)
            .minus(new BigNumber(options.order.amount)).toString();
        } else {
          Log.system.error('平多出错，未找到多单持仓[异常终了]');
          return;
        }
        // 更新余额（余币）
        // 平仓总价 = 订单价格*订单数量
        const contractPrice = new BigNumber(options.order.price).
          times(new BigNumber(options.order.amount));
        Log.system.info(`平仓总价(${contractPrice.toString()}) =
          订单价格(${options.order.price}) * 订单数量(${options.order.amount})`);

        const useBitcoin = Util.getTradeUnit(options.order.symbol).type === 'btc';
        const fee = Util.getFee(options.order.symbol);
        if (useBitcoin) {
          const lastBitcoin = options.account.bitcoin;
          // 余币 = 当前余币 + 平仓总价 - 手续费
          options.account.bitcoin = new BigNumber(lastBitcoin)
            .plus(contractPrice).minus(fee).toString();
          Log.system.info(`余币(${options.account.bitcoin}) =
            当前余币(${lastBitcoin}) - 平仓总价(${contractPrice}) - 手续费(${fee})`);
        } else {
          const lastBalance = options.account.balance;
          // 余额 = 当前余额 + 购买总价 - 手续费
          options.account.balance = new BigNumber(lastBalance)
            .plus(contractPrice).minus(fee).toString();
          Log.system.info(`余额(${options.account.balance}) =
              当前余额(${lastBalance}) + 购买总价(${contractPrice}) - 手续费(${fee})`);
        }
        break;
    }
    Log.system.info('计算平仓[终了]');
    return <IAccPosi>{ account: options.account, position };
  }
}
