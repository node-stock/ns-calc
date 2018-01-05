import * as types from 'ns-types';
import { BigNumber } from 'BigNumber.js';
import { Log, Util } from 'ns-common';

export interface ICalcOutput {
  account: types.Account,
  position?: types.Position,
  earning?: types.Earning
}

/**
  * @class
  * @classdesc 计算器
  */
export class Calc {

  static order(options: {
    account: types.Account,
    order: types.Order
  }) {
    Log.system.info('计算下单[启动]');
    Log.system.info(`账户信息：${JSON.stringify(options.account, null, 2)}，
    订单：${JSON.stringify(options.order, null, 2)}`);
    if (options.order.side === types.OrderSide.Buy) {
      Log.system.info('多头订单');
      // 购买总价 = 订单价格*订单数量
      const contractPrice = new BigNumber(options.order.price).
        times(options.order.amount);
      Log.system.info(`购买总价(${contractPrice.toString()}) =
          订单价格(${options.order.price}) * 订单数量(${options.order.amount})`);

      const fee = Util.getFee(options.order.symbol);
      // 交易成本 = 购买总价 + 手续费
      const tradeCost = contractPrice.plus(fee);
      Log.system.info(`交易成本(${tradeCost.toString()}) =
        购买总价(${contractPrice.toString()}) + 手续费(${fee})`);
      const asset = Calc.getAsset(options.order.symbol, options.account.assets);
      if (!asset) {
        return;
      }

      const old_free_amount = asset.free_amount;
      // 可用余币 = 当前余币 - 交易成本
      const free_amount = new BigNumber(old_free_amount).minus(tradeCost);
      Log.system.info(`可用余额(${free_amount.toString()}) =
        当前余额(${old_free_amount}) - 交易成本(${contractPrice})`);
      if (free_amount.isNegative()) {
        Log.system.warn(`可用余额(${free_amount.toString()})为负数！`);
        asset.free_amount = '0';
      } else {
        asset.free_amount = free_amount.toString();
      }

      // 锁仓量 = 当前锁仓量 + 交易成本
      const locked_amount = new BigNumber(asset.locked_amount).plus(tradeCost);
      Log.system.info(`锁仓量(${locked_amount.toString()}) =
        当前锁仓量(${asset.locked_amount}) + 交易成本(${tradeCost.toString()})`);
      if (locked_amount.isNegative()) {
        Log.system.warn(`锁仓量(${locked_amount.toString()})为负数！`);
        asset.locked_amount = '0';
      } else {
        asset.locked_amount = locked_amount.toString();
      }
    }
    Log.system.info('计算下单[终了]');
    return <ICalcOutput>{
      account: options.account
    };
  }

  private static getAsset(symbol: string, assets: types.Asset[]) {
    const useBitcoin = Util.getTradeUnit(symbol).type === types.AssetType.Btc;
    let asset;
    if (useBitcoin) {
      asset = assets.find(o => o.asset === types.AssetType.Btc);
      if (!asset) {
        Log.system.warn('未查询到比特币资产！');
        return;
      }
    } else {
      asset = assets.find(o => o.asset === types.AssetType.Jpy);
      if (!asset) {
        Log.system.warn('未查询到日元资产！');
        return;
      }
    }
    return asset;
  }

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
    let position;
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
          Log.system.info('未查询到持仓信息，建仓：', JSON.stringify(position, null, 2));
          options.account.positions.push(position);
        }
        // 更新余额（余币）
        // 购买总价 = 订单价格*订单数量
        const contractPrice = new BigNumber(options.order.price).
          times(options.order.amount);
        Log.system.info(`购买总价(${contractPrice.toString()}) =
          订单价格(${options.order.price}) * 订单数量(${options.order.amount})`);

        const fee = Util.getFee(options.order.symbol);
        // 交易成本 = 购买总价 + 手续费
        const tradeCost = contractPrice.plus(fee);
        const asset = Calc.getAsset(options.order.symbol, options.account.assets);
        if (!asset) {
          return;
        }
        const old_free_amount = asset.free_amount;
        // 可用余币 = 当前余币 - 交易成本
        const free_amount = new BigNumber(old_free_amount).minus(tradeCost);
        Log.system.info(`可用余额(${free_amount.toString()}) =
          当前余额(${old_free_amount}) - 购买总价(${contractPrice}) - 手续费(${fee})`);
        if (free_amount.isNegative()) {
          Log.system.warn(`可用余额(${free_amount.toString()})为负数！`);
          asset.free_amount = '0';
        } else {
          asset.free_amount = free_amount.toString();
        }

        // 保有量 = 当前保有量 - 交易成本
        const onhand_amount = new BigNumber(asset.onhand_amount).minus(tradeCost);
        if (onhand_amount.isNegative()) {
          Log.system.warn(`可用余额(${onhand_amount.toString()})为负数！`);
          asset.onhand_amount = '0';
        } else {
          asset.onhand_amount = onhand_amount.toString();
        }

        // 锁仓量 = 当前锁仓量 - 交易成本
        const locked_amount = new BigNumber(asset.locked_amount).minus(tradeCost);
        if (locked_amount.isNegative()) {
          Log.system.warn(`锁仓量(${locked_amount.toString()})为负数！`);
          asset.locked_amount = '0';
        } else {
          asset.locked_amount = locked_amount.toString();
        }

        // 购买的商品
        const buySymbol = Util.getTradeAssetType(options.order.symbol);
        if (!buySymbol) {
          Log.system.error(`未找到购买商品名(${options.order.symbol})`);
          return
        }
        const buyAsset = options.account.assets.find(o => o.asset === buySymbol);
        // 如果为找到购买商品资产
        if (!buyAsset) {
          // 建立购买商品资产
          const asset: types.Asset = {
            asset: String(buySymbol),
            account_id: options.account.id,
            type: options.order.symbolType,
            amount_precision: 8,
            onhand_amount: options.order.amount,
            locked_amount: '0',
            free_amount: options.order.amount,
            backtest: options.order.backtest
          }
          Log.system.info(`未持有购买商品(${buySymbol})资产，创建资产(${JSON.stringify(asset, null, 2)}`);
          options.account.assets.push(asset);
        } else {
          // 更新资产
          buyAsset.onhand_amount = new BigNumber(buyAsset.onhand_amount).plus(options.order.amount).toString();
          buyAsset.free_amount = new BigNumber(buyAsset.free_amount).plus(options.order.amount).toString();
          Log.system.info(`已持有购买商品(${buySymbol})资产，更新资产(${JSON.stringify(buyAsset, null, 2)}`);
        }
        break;
    }
    Log.system.info('计算建仓[终了]');
    return <ICalcOutput>{
      account: options.account, position
    };
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
            .minus(options.order.amount).toString();
        } else {
          Log.system.error('平多出错，未找到多单持仓[异常终了]');
          return;
        }
        // 更新余额（余币）
        // 平仓总价 = 订单价格*订单数量
        const contractPrice = new BigNumber(options.order.price).
          times(options.order.amount);
        Log.system.info(`平仓总价(${contractPrice.toString()}) =
          订单价格(${options.order.price}) * 订单数量(${options.order.amount})`);

        const useBitcoin = Util.getTradeUnit(options.order.symbol).type === types.AssetType.Btc;
        const fee = Util.getFee(options.order.symbol);
        // 交易成本 = 卖出总价 - 手续费
        const tradeCost = contractPrice.minus(fee);
        const asset = Calc.getAsset(options.order.symbol, options.account.assets);
        if (!asset) {
          return;
        }

        const old_free_amount = asset.free_amount;
        // 可用余币 = 当前余币 + 交易成本
        const free_amount = new BigNumber(old_free_amount).plus(tradeCost);
        Log.system.info(`可用余额(${free_amount.toString()}) =
          当前余额(${old_free_amount}) + 交易成本(${contractPrice})`);
        if (free_amount.isNegative()) {
          Log.system.warn(`可用余额(${free_amount.toString()})为负数！`);
          asset.free_amount = '0';
        } else {
          asset.free_amount = free_amount.toString();
        }

        // 锁仓量 = 当前锁仓量 - 交易成本
        const locked_amount = new BigNumber(asset.locked_amount).minus(tradeCost);
        Log.system.info(`锁仓量(${locked_amount.toString()}) =
        当前锁仓量(${asset.locked_amount}) - 交易成本(${contractPrice})`);
        if (locked_amount.isNegative()) {
          Log.system.warn(`锁仓量(${locked_amount.toString()})为负数！`);
          asset.locked_amount = '0';
        } else {
          asset.locked_amount = locked_amount.toString();
        }
        delete asset.updated_at;
        break;
    }

    let earning;
    if (position) {
      earning = Calc.calcEarning(position, options.order);
      Log.system.info('计算收益：', JSON.stringify(earning, null, 2));
    }
    Log.system.info('计算平仓[终了]');

    return <ICalcOutput>{
      account: options.account,
      position, earning
    };
  }

  /**
   * 计算收益
   * @param position 持仓 
   * @param order 订单
   */
  static calcEarning(position: types.Position, order: types.Order): types.Earning {
    Log.system.info('计算收益[启动]');
    const fee = Util.getFee(order.symbol);
    // 持仓总价 = 持仓价格*订单数量 + 手续费
    const openPrice = new BigNumber(position.price).times(order.amount).plus(fee);
    Log.system.info(`持仓总价(${openPrice.toString()}) =
      持仓价格(${position.price}) * 订单数量(${order.amount}) + 手续费(${fee})`);
    // 平仓总价 = 订单价格*订单数量 - 手续费
    const closePrice = new BigNumber(order.price).times(order.amount).minus(fee);
    Log.system.info(`平仓总价(${closePrice.toString()}) =
      订单价格(${order.price}) * 订单数量(${order.amount}) - 手续费(${fee})`);

    // 点差 = 订单价格 - 持仓价格
    const pips = new BigNumber(order.price).minus(position.price);
    Log.system.info(`点差(${pips.toString()}) = 订单价格(${order.price}) - 持仓价格(${position.price})`);


    const earning: types.Earning = {
      account_id: position.account_id,
      symbol: position.symbol,
      type: position.type,
      side: order.side,
      quantity: order.amount,
      profit: closePrice.minus(openPrice).toString(),
      pips: pips.toString(),
      open: position.price,
      close: order.price,
      fee: new BigNumber(fee).times(2).toString(),
      backtest: order.backtest
    }
    Log.system.info('计算收益[终了]');
    return earning;
  }
}
