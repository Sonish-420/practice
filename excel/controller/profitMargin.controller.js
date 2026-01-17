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

        const result = await ProfitMarginStoreProService.getList(params)
        
       const totalRows = result.recordsets[0][0]?.totalRows || 0
        const data = result.recordsets[1] || []

        const page = params.page
        const limit = params.limit
        const totalPages = Math.ceil(totalRows / limit)

        res.status(200).json({
        message: '✅ Profit margin fetched',
        totalRows,
        totalPages,
        page,
        limit,
        data,
        })

  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: '❌ Profit margin fetch failed',
      error: err.message,
    })
  }
}

export const ProfitMarginFilterApi = async (req, res) => {
  try {
    const result = await ProfitMarginStoreProService.getFilterList()
    const customers = result.recordsets[0] || []
    const items = result.recordsets[1] || []

    res.status(200).json({
      message: '✅ Profit margin filters fetched',
      customers,
      items,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: '❌ Profit margin filters fetch failed',
      error: err.message,
    })
  }
}