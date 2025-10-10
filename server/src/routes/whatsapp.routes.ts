import { Router } from "express";

const router = Router();

// WhatsApp number for Meghdoot Textiles
const WHATSAPP_NUMBER = "919342503401";

// WhatsApp redirect routes
router.get("/", (_req, res) => {
  res.redirect(301, `https://wa.me/${WHATSAPP_NUMBER}`);
});

router.get("/chat", (_req, res) => {
  res.redirect(301, `https://wa.me/${WHATSAPP_NUMBER}`);
});

router.get("/contact", (_req, res) => {
  const message = encodeURIComponent("Hi, I'm interested in your textile products. Please share more details.");
  res.redirect(301, `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`);
});

router.get("/order", (_req, res) => {
  const message = encodeURIComponent("Hi, I would like to place an order. Please assist me.");
  res.redirect(301, `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`);
});

router.get("/inquiry", (_req, res) => {
  const message = encodeURIComponent("Hi, I have an inquiry about your products. Please get in touch.");
  res.redirect(301, `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`);
});

export default router;
