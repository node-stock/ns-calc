import { Calc } from './calc';
import * as types from 'ns-types';

const testOrder = () => {

  const account: types.Account = {
    id: 'test',
    "assets": [
      {
        "asset": "jpy",
        account_id: 'test',
        type: types.SymbolType.cryptocoin,
        backtest: '1',
        "amount_precision": 4,
        "onhand_amount": "419139.4737",
        "locked_amount": "0.0000",
        "free_amount": "419139.4737"
      },
      {
        account_id: 'test',
        type: types.SymbolType.cryptocoin,
        backtest: '1',
        "asset": "btc",
        "amount_precision": 8,
        "onhand_amount": "0.025",
        "locked_amount": "0.00000000",
        "free_amount": "0.025"
      },
      {
        account_id: 'test',
        type: types.SymbolType.cryptocoin,
        backtest: '1',
        "asset": "ltc",
        "amount_precision": 8,
        "onhand_amount": "0.00000000",
        "locked_amount": "0.00000000",
        "free_amount": "0.00000000"
      },
      {
        account_id: 'test',
        type: types.SymbolType.cryptocoin,
        backtest: '1',
        "asset": "xrp",
        "amount_precision": 6,
        "onhand_amount": "539.369900",
        "locked_amount": "539.369900",
        "free_amount": "0.000000"
      },
      {
        account_id: 'test',
        type: types.SymbolType.cryptocoin,
        backtest: '1',
        "asset": "eth",
        "amount_precision": 8,
        "onhand_amount": "0.00000000",
        "locked_amount": "0.00000000",
        "free_amount": "0.00000000"
      },
      {
        account_id: 'test',
        type: types.SymbolType.cryptocoin,
        backtest: '1',
        "asset": "mona",
        "amount_precision": 8,
        "onhand_amount": "0.05000000",
        "locked_amount": "0.00000000",
        "free_amount": "0.05000000"
      },
      {
        account_id: 'test',
        type: types.SymbolType.cryptocoin,
        backtest: '1',
        "asset": "bcc",
        "amount_precision": 8,
        "onhand_amount": "0.00000000",
        "locked_amount": "0.00000000",
        "free_amount": "0.00000000"
      }
    ],
    backtest: '1',
    positions: [],
    transactions: []
  }
  const order: types.LimitOrder = {
    account_id: 'test',
    symbol: types.Pair.BTC_JPY,
    price: '1675000',
    amount: '0.00421125',
    symbolType: types.SymbolType.cryptocoin,
    eventType: types.EventType.Order,
    tradeType: types.TradeType.Spot,
    orderType: types.OrderType.Limit,
    side: types.OrderSide.Buy,
    backtest: '1'
  }
  const res = Calc.order({
    account, order
  });
  console.log(JSON.stringify(res, null, 2));
}

const testOpenPosition = () => {

  const account: types.Account = {
    id: 'test',
    "assets": [
      {
        "asset": "jpy",
        account_id: 'test',
        type: types.SymbolType.cryptocoin,
        backtest: '1',
        "amount_precision": 4,
        "onhand_amount": "419139.4737",
        "locked_amount": "10000.0000",
        "free_amount": "419139.4737"
      },
      {
        account_id: 'test',
        type: types.SymbolType.cryptocoin,
        backtest: '1',
        "asset": "btc",
        "amount_precision": 8,
        "onhand_amount": "0.025",
        "locked_amount": "0.00000000",
        "free_amount": "0.025"
      }
    ],
    backtest: '1',
    positions: [],
    transactions: []
  }
  const order: types.LimitOrder = {
    account_id: 'test',
    symbol: types.Pair.BCC_JPY,
    price: '1675000',
    amount: '0.00421125',
    symbolType: types.SymbolType.cryptocoin,
    eventType: types.EventType.Order,
    tradeType: types.TradeType.Spot,
    orderType: types.OrderType.Limit,
    side: types.OrderSide.Buy,
    backtest: '1'
  }
  const res = Calc.openPosition({
    account, order
  });
  console.log(JSON.stringify(res, null, 2));
}

const testOpenPosition2 = () => {
  const positions: types.Position[] = [{
    account_id: 'test',
    symbol: types.Pair.BTC_JPY,
    type: types.SymbolType.cryptocoin,
    side: types.OrderSide.Buy,
    price: '1804897',
    quantity: '0.00325',
    backtest: '1'
  }];

  const account: types.Account = {
    id: 'test',
    "assets": [
      {
        "asset": "jpy",
        account_id: 'test',
        type: types.SymbolType.cryptocoin,
        backtest: '1',
        "amount_precision": 4,
        "onhand_amount": "419139.4737",
        "locked_amount": "0.0000",
        "free_amount": "419139.4737"
      },
      {
        account_id: 'test',
        type: types.SymbolType.cryptocoin,
        backtest: '1',
        "asset": "btc",
        "amount_precision": 8,
        "onhand_amount": "0.025",
        "locked_amount": "0.00000000",
        "free_amount": "0.025"
      },
      {
        account_id: 'test',
        type: types.SymbolType.cryptocoin,
        backtest: '1',
        "asset": "ltc",
        "amount_precision": 8,
        "onhand_amount": "0.00000000",
        "locked_amount": "0.00000000",
        "free_amount": "0.00000000"
      },
      {
        account_id: 'test',
        type: types.SymbolType.cryptocoin,
        backtest: '1',
        "asset": "xrp",
        "amount_precision": 6,
        "onhand_amount": "539.369900",
        "locked_amount": "539.369900",
        "free_amount": "0.000000"
      },
      {
        account_id: 'test',
        type: types.SymbolType.cryptocoin,
        backtest: '1',
        "asset": "eth",
        "amount_precision": 8,
        "onhand_amount": "0.00000000",
        "locked_amount": "0.00000000",
        "free_amount": "0.00000000"
      },
      {
        account_id: 'test',
        type: types.SymbolType.cryptocoin,
        backtest: '1',
        "asset": "mona",
        "amount_precision": 8,
        "onhand_amount": "0.05000000",
        "locked_amount": "0.00000000",
        "free_amount": "0.05000000"
      },
      {
        account_id: 'test',
        type: types.SymbolType.cryptocoin,
        backtest: '1',
        "asset": "bcc",
        "amount_precision": 8,
        "onhand_amount": "0.00000000",
        "locked_amount": "0.00000000",
        "free_amount": "0.00000000"
      }
    ],
    backtest: '1',
    positions,
    transactions: []
  }
  const order: types.LimitOrder = {
    account_id: 'test',
    symbol: types.Pair.BTC_JPY,
    price: '1675000',
    amount: '0.00421125',
    symbolType: types.SymbolType.cryptocoin,
    eventType: types.EventType.Order,
    tradeType: types.TradeType.Spot,
    orderType: types.OrderType.Limit,
    side: types.OrderSide.Buy,
    backtest: '1'
  }
  const res = Calc.openPosition({
    account, order
  });
  console.log(JSON.stringify(res, null, 2));
}

const testClosePosition = () => {
  const positions: types.Position[] = [{
    account_id: 'test',
    symbol: types.Pair.BTC_JPY,
    type: types.SymbolType.cryptocoin,
    side: types.OrderSide.Buy,
    price: '1804897',
    quantity: '0.00325',
    backtest: '1'
  }];

  const account: types.Account = {
    id: 'test',
    "assets": [
      {
        "asset": "jpy",
        account_id: 'test',
        type: types.SymbolType.cryptocoin,
        backtest: '1',
        "amount_precision": 4,
        "onhand_amount": "419139.4737",
        "locked_amount": "0.0000",
        "free_amount": "419139.4737"
      },
      {
        account_id: 'test',
        type: types.SymbolType.cryptocoin,
        backtest: '1',
        "asset": "btc",
        "amount_precision": 8,
        "onhand_amount": "0.025",
        "locked_amount": "0.00000000",
        "free_amount": "0.025"
      },
      {
        account_id: 'test',
        type: types.SymbolType.cryptocoin,
        backtest: '1',
        "asset": "ltc",
        "amount_precision": 8,
        "onhand_amount": "0.00000000",
        "locked_amount": "0.00000000",
        "free_amount": "0.00000000"
      },
      {
        account_id: 'test',
        type: types.SymbolType.cryptocoin,
        backtest: '1',
        "asset": "xrp",
        "amount_precision": 6,
        "onhand_amount": "539.369900",
        "locked_amount": "539.369900",
        "free_amount": "0.000000"
      },
      {
        account_id: 'test',
        type: types.SymbolType.cryptocoin,
        backtest: '1',
        "asset": "eth",
        "amount_precision": 8,
        "onhand_amount": "0.00000000",
        "locked_amount": "0.00000000",
        "free_amount": "0.00000000"
      },
      {
        account_id: 'test',
        type: types.SymbolType.cryptocoin,
        backtest: '1',
        "asset": "mona",
        "amount_precision": 8,
        "onhand_amount": "0.05000000",
        "locked_amount": "0.00000000",
        "free_amount": "0.05000000"
      },
      {
        account_id: 'test',
        type: types.SymbolType.cryptocoin,
        backtest: '1',
        "asset": "bcc",
        "amount_precision": 8,
        "onhand_amount": "0.00000000",
        "locked_amount": "0.00000000",
        "free_amount": "0.00000000"
      }
    ],
    backtest: '1',
    positions,
    transactions: []
  }
  const order: types.LimitOrder = {
    account_id: 'test',
    symbol: types.Pair.BTC_JPY,
    price: '1675000',
    amount: '0.00321125',
    symbolType: types.SymbolType.cryptocoin,
    eventType: types.EventType.Order,
    tradeType: types.TradeType.Spot,
    orderType: types.OrderType.Limit,
    side: types.OrderSide.BuyClose,
    backtest: '1'
  }
  const res = Calc.closePosition({
    account, order
  });
  console.log(JSON.stringify(res, null, 2));
}

const testCalcEarning = () => {
  const position: types.Position = {
    account_id: 'test',
    symbol: types.Pair.BTC_JPY,
    type: types.SymbolType.cryptocoin,
    side: types.OrderSide.Buy,
    price: '0.14800000  ',
    quantity: '0.0001',
    backtest: '1'
  };
  const order: types.LimitOrder = {
    id: '1515241780293',
    account_id: 'test',
    symbol: types.Pair.BCC_BTC,
    price: '0.15211822',
    amount: '0.0001',
    symbolType: types.SymbolType.cryptocoin,
    eventType: types.EventType.Order,
    tradeType: types.TradeType.Spot,
    orderType: types.OrderType.Limit,
    side: types.OrderSide.BuyClose,
    backtest: '1'
  }
  const res = Calc.calcEarning(position, order);
  console.log(JSON.stringify(res, null, 2));
}

const testStopLoss = () => {

  const res = Calc.stopLoss('329');
  console.log(JSON.stringify(res, null, 2));
}

describe('ns-calc', () => {

  // it('测试多单订单', testOrder);
  // it('测试多单建仓', testOpenPosition);
  // it('测试多单建仓2', testOpenPosition2);
  // it('测试多单平仓', testClosePosition);
  it('测试计算收益表', testCalcEarning);
  // it('测试止损', testStopLoss);
});
