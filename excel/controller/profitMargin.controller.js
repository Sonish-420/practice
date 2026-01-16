import { ProfitMarginStoreProService } from '../service/profitMargin.service.js'

export const ProfitMarginApi = async (req, res) => {
  try {
    const params = {
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      limit: Number(req.body.limit) || 20,
      page: Number(req.body.page) || 1,
      search: req.body.search ?? null,

      // ✅ array -> comma string (match SQL param name)
      Customer: Array.isArray(req.body.Customer)
        ? req.body.Customer.join(',')
        : req.body.Customer ?? null,

      ItemName: Array.isArray(req.body.ItemName)
        ? req.body.ItemName.join(',')
        : req.body.ItemName ?? null,
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
