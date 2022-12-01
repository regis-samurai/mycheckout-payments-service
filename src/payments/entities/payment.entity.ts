export class Payment {
  paymentSystem: number
  installments: number
  installmentsInterestRate: number
  installmentsValue: number
  value: number
  referenceValue: number
  fields: {
    holderName: string
    cardNumber: string
    validationCode: string
    dueDate: string
    addressId: string
  }
  transaction: {
    id: string
    merchantName: string
  }
  currencyCode: string
}

export class PaymentAdditionalInfo {
  accountName: string
  hostname: string
  orderGroup: string
  transactionId: string
}
