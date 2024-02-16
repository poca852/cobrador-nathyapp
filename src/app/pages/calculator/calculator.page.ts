import { Component, OnInit } from '@angular/core';
import {evaluate} from 'mathjs';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.page.html',
  styleUrls: ['./calculator.page.scss'],
})
export class CalculatorPage {

  operations = ['+', '-', 'x', '÷'];

    operationsValue = '';

    result = '';

    constructor(
      private utilsSvc: UtilsService,
    ) {
    }

    buttonNumericClick(number) {
        this.operationsValue += '' + number;
        this.calc();
    }

    buttonCalcClick(operationCalc) {
        if (this.isLastOperationCalc()) {
            this.operationsValue = this.operationsValue.substr(0, this.operationsValue.length - 1);
        }

        if(this.operationsValue === '98'|| this.operationsValue === '980427'){
          this.operationsValue = '';
          return this.utilsSvc.routerLink('auth')
        }

        return this.operationsValue += operationCalc;
        
    }

    buttonClearClick() {
        this.operationsValue = this.operationsValue.substr(0, this.operationsValue.length - 1);
        this.calc();
    }

    isLastOperationCalc() {
        if (this.operationsValue.length === 0) {
            return false;
        }
        const lastElemet = this.operationsValue.substr(this.operationsValue.length - 1);
        return this.operations.indexOf(lastElemet) >= 0;
    }

    hasOperationCalc() {
        if (this.operationsValue.length === 0) {
            return false;
        }
        return this.operations.some(operation => this.operationsValue.indexOf(operation) >= 0);
    }

    calc() {
        if (this.isLastOperationCalc() || !this.hasOperationCalc()) {
            return;
        }

        let expression = this.operationsValue;
        expression = this.replaceAll(expression, 'x', '*');
        expression = this.replaceAll(expression, '÷', '/');

        this.result = evaluate(expression);
    }

    replaceAll(target, search, replacement) {
        return target.replace(new RegExp(search, 'g'), replacement);
    }

}
