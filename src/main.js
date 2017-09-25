import { adder } from './modules/adder';
import Decimal from 'decimal.js';

const value1 = 2;
const value2 = 2;
console.log(Decimal.sqrt((adder(value1, value2))));
