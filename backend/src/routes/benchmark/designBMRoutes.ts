import { Router } from "express";
import { DesignBenchMarkController } from "../../controllers/benchmark/designBenchMarkController.js";
import { DesignBenchmarkService } from "../../services/benchmark/designBenchMarkService.js";
import { DesignRepository } from "../../repositories/designer/designRepository.js";
import { DesignBenchMarkRepository } from "../../repositories/benchmarks/designBenchMarkRepository.js";

const router = Router()

const designRepo = new DesignRepository()
const designBMRepo = new DesignBenchMarkRepository()
const designBMService = new DesignBenchmarkService(designRepo, designBMRepo)

const designBMController = new DesignBenchMarkController(designBMService)

router.get("/space-avg",designBMController.computeNewAveragePricBySPaceType)

export default router