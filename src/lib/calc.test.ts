import { Calc } from './calc';
import * as types from 'ns-types';

const testOpenPosition = () => {

  const account: types.Account = {
    id: 'test',
    balance: '1230004.12442',
    bitcoin: '0.025',
    backtest: '1',
    positions: [],
    transactions: []
  }
  const order: types.LimitOrder = {
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
  console.log(res);
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
    balance: '1230004.12442',
    bitcoin: '0.025',
    backtest: '1',
    positions,
    transactions: []
  }
  const order: types.LimitOrder = {
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
  console.log(res);
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
    balance: '1230004.12442',
    bitcoin: '0.025',
    backtest: '1',
    positions,
    transactions: []
  }
  const order: types.LimitOrder = {
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
  console.log(res);
}

describe('ns-calc', () => {

  // it('测试多单建仓', testOpenPosition);
  // it('测试多单建仓2', testOpenPosition2);
  it('测试多单平仓', testClosePosition);

});
