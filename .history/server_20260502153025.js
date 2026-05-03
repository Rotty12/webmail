require('dotenv').config();

const express    = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path       = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

/* ─── Middleware ─────────────────────────────────────────────────────────── */
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

/* ─── Nodemailer Transporter ─────────────────────────────────────────────── */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
