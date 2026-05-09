import { Router } from "express";
import ProdutoCtrl from "../Controller/produtoCtrl.js";

const rotaProduto = Router();
const produtoCtrl = new ProdutoCtrl();

rotaProduto.get("/", produtoCtrl.consultar);

export default rotaProduto;