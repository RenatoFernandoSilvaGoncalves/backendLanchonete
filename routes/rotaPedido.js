import { Router } from "express";
import PedidoCtrl from "../Controller/pedidoCtrl.js";

const rotaPedido = Router();
const pedidoCtrl = new PedidoCtrl();

rotaPedido.get("/", pedidoCtrl.consultar);
rotaPedido.post("/", pedidoCtrl.gravar);

export default rotaPedido;
