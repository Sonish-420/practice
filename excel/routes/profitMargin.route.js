import { Router } from 'express'
import { ProfitMarginApi, ProfitMarginFilterApi } from '../controller/profitMargin.controller.js'

const router = Router()

router.post('/list', ProfitMarginApi)
router.get('/list-filters', ProfitMarginFilterApi)

export default router
