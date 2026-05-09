import { Router } from "express";
import DFctrl from "../Controller/DFctrl.js";

const rotaDF = Router();
const dfCtrl = new DFctrl();

rotaDF.get("/", dfCtrl.obterCardsProdutos);
rotaDF.post("/", dfCtrl.processarIntents);

export default rotaDF;