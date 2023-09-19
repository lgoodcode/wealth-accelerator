import { dollarFormatter } from '@/lib/utils/dollar-formatter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { labels } from '../labels';
import type { DebtCalculationInputs } from '../types';

interface DebtSnowballInputsViewProps {
  inputs: DebtCalculationInputs;
}

export function DebtSnowballInputsView({ inputs }: DebtSnowballInputsViewProps) {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Inputs</CardTitle>
      </CardHeader>
      <CardContent className="pt-4 text-lg">
        <div className="space-y-8">
          <div className="space-y-2">
            <div className="flex py-4 justify-between border-b">
              <span>{labels.additionalPayment.title}</span>
              <span>{dollarFormatter(inputs.additional_payment)}</span>
            </div>
            <div className="flex py-4 justify-between border-b">
              <span>{labels.monthlyPayment.title}</span>
              <span>{dollarFormatter(inputs.monthly_payment)}</span>
            </div>
            <div className="flex py-4 justify-between border-b">
              <span>{labels.opportunityRate.title}</span>
              <span>{inputs.opportunity_rate}%</span>
            </div>
            <div className="flex py-4 justify-between border-b">
              <span>{labels.strategy.title}</span>
              <span>{inputs.strategy}</span>
            </div>
          </div>

          {inputs.strategy.includes('Wealth Accelerator') && (
            <div className="space-y-2">
              <div className="space-y-1">
                <h3 className="text-xl py-4 border-b font-medium">
                  {labels.wealthAcceleratorOptions.title}
                </h3>
              </div>
              <div className="space-y-2">
                <div className="flex py-4 justify-between border-b">
                  <span>{labels.payBackLoan.title}</span>
                  <span>{inputs.pay_back_loan ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex py-4 justify-between border-b">
                  <span>{labels.loanInterestRate.title}</span>
                  <span>{inputs.loan_interest_rate}%</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="space-y-1">
                  <h3 className="text-xl py-4 font-medium">{labels.loanAmounts.title}</h3>
                </div>
                <div>
                  {inputs.lump_amounts.map((loan, i) => (
                    <div key={`lump-amount-${i}`} className="flex py-4 justify-between border-b">
                      <span>{`Year ${i + 1}`}</span>
                      <span>{dollarFormatter(loan)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
