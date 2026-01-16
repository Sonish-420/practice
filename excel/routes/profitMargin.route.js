import { Router } from 'express'
import { ProfitMarginApi } from '../controller/profitMargin.controller.js'

const router = Router()

router.post('/list', ProfitMarginApi)

export default router
