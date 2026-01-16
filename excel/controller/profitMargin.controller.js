import { ProfitMarginStoreProService } from '../service/profitMargin.service.js'

export const ProfitMarginApi = async (req, res) => {
  try {
    const params = {
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      limit: req.body.limit,
      page: req.body.page,
      search: req.body.search,
      Customer: req.body.Customer,
      ItemName: req.body.ItemName,
    }

    const result = await new ProfitMarginStoreProService().getList(params)

    res.status(200).json(result)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: '❌ Profit margin fetch failed',
      error: err.message,
    })
  }
}
