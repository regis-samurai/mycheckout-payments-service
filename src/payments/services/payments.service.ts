import { HttpService } from '@nestjs/axios'
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { catchError, map, of } from 'rxjs'

import { CreatePaymentDto } from '../dtos/payments.dtos'
import { Payment, PaymentAdditionalInfo } from '../entities/payment.entity'
import config from 'src/common/config'

@Injectable()
export class PaymentsService {
  constructor(
    private httpService: HttpService,
    @Inject(config.KEY) private configService: ConfigType<typeof config>
  ) {}

  getEncryptedInfo(transactionId: string) {
    return this.httpService
      .get(
        `${this.configService.proxy.token}/upp/services/v1/inline/token?transactionId=${transactionId}`,
        {
          headers: {
            Authorization: `Basic ${this.configService.proxy.authorization}`,
          },
        }
      )
      .pipe(
        map((response) => response.data),
        catchError((e) => {
          throw new HttpException(
            { status: e.response.status, error: e.response.data },
            e.response.status
          )
        })
      )
      .toPromise()
  }

  pullProxy(
    paymentInfo: Payment,
    paymentAdditionalInfo: PaymentAdditionalInfo,
    headers: any
  ) {
    const callbackUrl = encodeURIComponent(
      `https://${paymentAdditionalInfo.hostname}/checkout/gatewayCallback/${paymentAdditionalInfo.orderGroup}/{messageCode}`
    )

    return this.httpService
      .post(`${this.configService.proxy.pull}/v1/pull`, [paymentInfo], {
        headers: {
          'x-cc-merchant-id': this.configService.proxy.merchant,
          'pci-proxy-api-key': this.configService.proxy.key,
          'x-cc-url': `https://${paymentAdditionalInfo.accountName}.vtexpayments.com.br/api/pub/transactions/${paymentAdditionalInfo.transactionId}/payments?orderId=${paymentAdditionalInfo.orderGroup}&redirect=false&callbackUrl=${callbackUrl}`,
          'X-VTEX-API-AppKey': headers['x-vtex-api-appkey'],
          'X-VTEX-API-AppToken': headers['x-vtex-api-apptoken'],
        },
      })
      .pipe(
        map((response) => response.data),
        catchError((e) => {
          throw new HttpException(
            { status: e.response.status, error: e.response.data.error },
            e.response.status
          )
        })
      )
      .toPromise()
  }

  gatewayCallback(
    accountName: string,
    orderGroup: string,
    vtexChkoAuth: string,
    headers: any
  ) {
    return this.httpService
      .post(
        `https://${accountName}.vtexcommercestable.com.br/api/checkout/pub/gatewayCallback/${orderGroup}`,
        null,
        {
          headers: {
            Cookie: `Vtex_CHKO_Auth=${vtexChkoAuth}`,
            'X-VTEX-API-AppKey': headers['x-vtex-api-appkey'],
            'X-VTEX-API-AppToken': headers['x-vtex-api-apptoken'],
          },
        }
      )
      .pipe(
        map((response) => response.data),
        catchError((e) => {
          if (e.response.status !== HttpStatus.PRECONDITION_REQUIRED) {
            throw new HttpException(
              { status: e.response.status, error: e.response.data },
              e.response.status
            )
          }

          return of(e.response.data)
        })
      )
      .toPromise()
  }

  async create(payload: CreatePaymentDto, headers: any) {
    const {
      proxy: { transactionId, aliasCC, aliasCVV },
      vtex: { payment, order },
    } = payload

    let aliasCCValue = aliasCC
    let aliasCVVValue = aliasCVV

    if (transactionId) {
      const { aliasCC, aliasCVV } = await this.getEncryptedInfo(transactionId)
      if (!aliasCCValue) {
        aliasCCValue = aliasCC
      }
      aliasCVVValue = aliasCVV
    }

    const paymentInfo = {
      ...payment,
      fields: {
        cardNumber: aliasCCValue,
        validationCode: aliasCVVValue,
        ...payment.fields,
      },
    }

    await this.pullProxy(
      paymentInfo,
      {
        accountName: order.accountName,
        hostname: order.hostname,
        orderGroup: order.orderGroup,
        transactionId: payment.transaction.id,
      },
      headers
    )

    const respGate = await this.gatewayCallback(
      order.accountName,
      order.orderGroup,
      order.VtexChkoAuth,
      headers
    )

    return {
      aliasCC: aliasCCValue,
      aliasCVV: aliasCVVValue,
      gatewayCallbackResponse: respGate,
    }
  }
}
