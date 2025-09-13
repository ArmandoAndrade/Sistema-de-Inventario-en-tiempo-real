import { Router } from "express";
import { 
    getProducts,
    getStockTotalProduct,
    createProduct,
    addExistingProductToSede,
    updateProduct,
    getStockLowProducts
} from "../controllers/productsController.js";

import { verificarToken } from "../middlewares/auth.js";
import { verificarAdmin } from "../middlewares/verificarAdmin.js";

const router = Router();

router.get("/", getProducts); //Get /api/products
router.get("/total", getStockTotalProduct); //Get /api/products/total
router.get("/low-stock", getStockLowProducts); //Get /api/products/low-stock
router.post("/", verificarToken, verificarAdmin,createProduct);  //POST /api/products
router.post("/exist", verificarToken, addExistingProductToSede);  //POST /api/products
router.patch("/:id", verificarToken, updateProduct); //PATCH /api/products/:id
//router.delete("/:id", verificarToken, deleteProduct); // DELETE /api/products/:id 

export default router;