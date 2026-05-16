import Head from 'next/head'
import Script from 'next/script'
import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {}, [])

  return (
    <>
      <Head>
        <title>Familien-Code · herzbewegung von Susana</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Raleway:wght@300;400;500&display=swap" rel="stylesheet" />
        <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
        <script dangerouslySetInnerHTML={{__html: `
          window.addEventListener('load', function() {
            if (window.emailjs && '${process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ''}') {
              window.emailjs.init({ publicKey: '${process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ''}' });
            }
          });
        `}} />
        <style>{`
          :root {
            --cream: #fdf8f2;
            --paper: #f7efe4;
            --paper-deep: #f0e5d6;
            --gold: #a07828;
            --gold-light: #c49840;
            --gold-pale: #ecddb8;
            --gold-faint: #fdf5e8;
            --rose: #9e5472;
            --rose-light: #c4849e;
            --rose-pale: #f5e8ef;
            --ink: #2a1f18;
            --muted: #7a6358;
            --silver: #a89080;
            --mauve: #8a6070;
          }

          /* ── BASE ─────────────────────────────────────────────── */
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          html { font-size: 16px; }
          body {
            font-family: 'Raleway', sans-serif;
            font-weight: 300;
            color: var(--ink);
            background: var(--cream);
          }

          /* ── TOPNAV ───────────────────────────────────────────── */
          .topnav {
            position: fixed; top: 0; left: 0; right: 0; z-index: 100;
            background: rgba(253,248,242,0.95);
            backdrop-filter: blur(16px);
            border-bottom: 1px solid var(--gold-pale);
            display: flex; align-items: center; justify-content: space-between;
            padding: 0 56px; height: 68px;
          }
          .nav-brand { display: flex; align-items: center; gap: 12px; }
          .nav-symbol { font-size: 20px; color: var(--rose-light); }
          .nav-name {
            font-family: 'Playfair Display', serif;
            font-size: 18px; font-weight: 400;
            color: var(--ink); letter-spacing: 0.3px;
          }
          .nav-by {
            font-size: 9px; letter-spacing: 2.5px;
            text-transform: uppercase; color: var(--rose-light); margin-left: 4px;
          }
          .nav-progress { display: flex; align-items: center; gap: 6px; }
          .nav-step { width: 24px; height: 2px; background: var(--gold-pale); border-radius: 2px; transition: background 0.3s; }
          .nav-step.done { background: var(--rose-light); }
          .nav-step.active { background: var(--rose); }
          .nav-cta {
            font-size: 9px; letter-spacing: 2px; text-transform: uppercase;
            color: var(--muted); cursor: pointer; padding: 8px 0;
            background: none; border: none;
            font-family: 'Raleway', sans-serif; transition: color 0.2s;
          }
          .nav-cta:hover { color: var(--rose); }

          /* ── SCREENS ──────────────────────────────────────────── */
          .screen { display: none; padding-top: 68px; }
          .screen.active { display: block; animation: fadeUp 0.45s ease forwards; }
          @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }

          /* ── HERO / SPLASH ────────────────────────────────────── */
          #screen-splash { min-height: 100vh; display: none; flex-direction: column; }
          #screen-splash.active { display: flex; }

          .hero {
            display: grid;
            grid-template-columns: 1fr 1fr;
            min-height: calc(100vh - 68px);
          }

          /* Left — warm cream with rose gradient, no dark background */
          .hero-left {
            background: linear-gradient(145deg, var(--paper-deep) 0%, var(--paper) 60%, var(--rose-pale) 100%);
            padding: 80px 72px;
            display: flex; flex-direction: column; justify-content: center;
            position: relative; overflow: hidden;
          }
          .hero-left::before {
            content: '';
            position: absolute; top: -80px; right: -80px;
            width: 360px; height: 360px; border-radius: 50%;
            background: radial-gradient(circle, rgba(196,152,64,0.12) 0%, transparent 70%);
          }
          .hero-left::after {
            content: '';
            position: absolute; bottom: -60px; left: 40px;
            width: 260px; height: 260px; border-radius: 50%;
            background: radial-gradient(circle, rgba(158,84,114,0.10) 0%, transparent 70%);
          }
          /* decorative top line */
          .hero-left-inner { position: relative; z-index: 1; }

          .hero-eyebrow {
            font-size: 9px; letter-spacing: 4px; text-transform: uppercase;
            color: var(--rose); margin-bottom: 28px; font-weight: 400;
          }
          .hero-symbol {
            font-size: 32px; color: var(--rose-light);
            margin-bottom: 20px; display: block;
            animation: float 6s ease-in-out infinite;
          }
          @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

          .hero-h1 {
            font-family: 'Playfair Display', serif;
            font-size: 68px; font-weight: 400;
            line-height: 0.98; color: var(--ink);
            margin-bottom: 28px; letter-spacing: -0.5px;
          }
          .hero-h1 em {
            font-style: italic; color: var(--rose);
          }

          .hero-rule {
            width: 40px; height: 1px;
            background: linear-gradient(90deg, var(--rose-light), transparent);
            margin-bottom: 24px;
          }
          .hero-sub {
            font-family: 'Playfair Display', serif;
            font-style: italic; font-size: 18px;
            color: var(--muted); line-height: 1.7;
            max-width: 380px; margin-bottom: 48px;
          }
          .hero-cta {
            display: inline-flex; align-items: center; gap: 12px;
            background: var(--rose); color: white;
            font-family: 'Raleway', sans-serif; font-weight: 400;
            font-size: 10px; letter-spacing: 2.5px; text-transform: uppercase;
            padding: 16px 40px; border-radius: 40px; border: none; cursor: pointer;
            transition: background 0.22s, transform 0.12s; width: fit-content;
            box-shadow: 0 4px 20px rgba(158,84,114,0.25);
          }
          .hero-cta:hover { background: var(--mauve); transform: translateY(-2px); box-shadow: 0 8px 28px rgba(158,84,114,0.30); }
          .hero-cta-arrow { font-size: 15px; transition: transform 0.2s; }
          .hero-cta:hover .hero-cta-arrow { transform: translateX(4px); }

          /* tagline under CTA */
          .hero-tagline {
            margin-top: 20px;
            font-size: 10px; color: var(--silver);
            letter-spacing: 0.5px; font-style: italic;
            font-family: 'Playfair Display', serif;
          }

          /* Right side */
          .hero-right {
            background: var(--cream);
            padding: 80px 64px;
            display: flex; flex-direction: column; justify-content: center;
            border-left: 1px solid var(--gold-pale);
          }
          .hero-features-title {
            font-size: 9px; letter-spacing: 3px; text-transform: uppercase;
            color: var(--rose-light); margin-bottom: 28px; font-weight: 400;
          }
          .feature-list { display: flex; flex-direction: column; gap: 0; }
          .feature-item {
            display: grid; grid-template-columns: 44px 1fr;
            align-items: start; gap: 0;
            padding: 20px 0; border-bottom: 1px solid var(--gold-pale);
          }
          .feature-item:first-child { border-top: 1px solid var(--gold-pale); }
          .feature-num {
            font-family: 'Playfair Display', serif;
            font-size: 28px; font-weight: 400;
            color: var(--rose-pale); line-height: 1; padding-top: 3px;
          }
          .feature-title {
            font-family: 'Playfair Display', serif;
            font-size: 18px; color: var(--ink); margin-bottom: 4px;
          }
          .feature-desc { font-size: 11px; color: var(--muted); line-height: 1.6; }

          /* ── GLOSSAR ──────────────────────────────────────────── */
          .hero-glossar { margin-top: 36px; padding-top: 28px; border-top: 1px solid var(--gold-pale); }
          .hero-glossar-title { font-size: 9px; letter-spacing: 3px; text-transform: uppercase; color: var(--rose-light); margin-bottom: 16px; font-weight: 400; }
          .hero-glossar-grid { display: flex; flex-direction: column; gap: 0; }
          .hero-glossar-item { display: grid; grid-template-columns: 130px 1fr; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--gold-pale); align-items: baseline; }
          .hero-glossar-item:last-child { border-bottom: none; }
          .hero-glossar-term { font-family: 'Playfair Display', serif; font-size: 14px; color: var(--ink); }
          .hero-glossar-def { font-size: 10.5px; color: var(--muted); line-height: 1.55; }

          /* ── LEAD GATE ────────────────────────────────────────── */
          #screen-lead {
            min-height: 100vh; display: none;
            align-items: center; justify-content: center;
            background: linear-gradient(145deg, var(--paper-deep) 0%, var(--paper) 50%, var(--rose-pale) 100%);
            padding-top: 68px;
          }
          #screen-lead.active { display: flex; }
          .lead-wrap { width: 100%; max-width: 500px; padding: 48px 32px; }
          .lead-eyebrow { font-size: 9px; letter-spacing: 3.5px; text-transform: uppercase; color: var(--rose); margin-bottom: 16px; font-weight: 400; }
          .lead-title {
            font-family: 'Playfair Display', serif;
            font-size: 44px; font-weight: 400; color: var(--ink);
            line-height: 1.08; margin-bottom: 14px;
          }
          .lead-title em { font-style: italic; color: var(--rose); }
          .lead-sub {
            font-family: 'Playfair Display', serif;
            font-style: italic; font-size: 17px; color: var(--muted);
            line-height: 1.7; margin-bottom: 44px;
          }
          .lead-field { margin-bottom: 28px; }
          .lead-label { display: block; font-size: 9px; letter-spacing: 2.5px; text-transform: uppercase; color: var(--muted); margin-bottom: 10px; font-weight: 400; }
          .lead-input {
            width: 100%; background: transparent; border: none;
            border-bottom: 1px solid var(--gold-pale);
            padding: 6px 0 14px;
            font-family: 'Playfair Display', serif; font-size: 22px;
            color: var(--ink); outline: none;
            transition: border-color 0.2s;
          }
          .lead-input:focus { border-bottom-color: var(--rose); }
          .lead-input::placeholder { color: var(--silver); font-style: italic; }
          .lead-privacy { font-size: 10.5px; color: var(--silver); margin-top: 18px; line-height: 1.55; }
          .lead-btn {
            width: 100%; margin-top: 36px;
            background: var(--rose); color: white; border: none;
            font-family: 'Raleway', sans-serif; font-weight: 400; font-size: 10px;
            letter-spacing: 2.5px; text-transform: uppercase;
            padding: 18px; border-radius: 40px; cursor: pointer;
            transition: background 0.22s, transform 0.12s;
            box-shadow: 0 4px 20px rgba(158,84,114,0.22);
          }
          .lead-btn:hover { background: var(--mauve); transform: translateY(-1px); }
          .lead-btn:disabled { opacity: 0.3; cursor: default; pointer-events: none; }

          /* ── FORM ─────────────────────────────────────────────── */
          .form-page { max-width: 820px; margin: 0 auto; padding: 68px 56px 96px; }
          .form-page-header { margin-bottom: 52px; padding-bottom: 36px; border-bottom: 1px solid var(--gold-pale); }
          .form-eyebrow { font-size: 9px; letter-spacing: 3px; text-transform: uppercase; color: var(--rose-light); margin-bottom: 12px; font-weight: 400; }
          .form-h2 {
            font-family: 'Playfair Display', serif;
            font-size: 48px; font-weight: 400; line-height: 1.05;
            color: var(--ink); margin-bottom: 12px; letter-spacing: -0.3px;
          }
          .form-sub {
            font-family: 'Playfair Display', serif;
            font-style: italic; font-size: 17px;
            color: var(--muted); line-height: 1.65; max-width: 540px;
          }

          /* ── CARDS ────────────────────────────────────────────── */
          .card-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 48px; }
          .card-grid-2-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; margin-bottom: 48px; }
          .select-card {
            background: white; border: 1.5px solid var(--gold-pale); border-radius: 18px; padding: 26px;
            cursor: pointer; display: flex; flex-direction: column; gap: 10px;
            position: relative; overflow: hidden;
            transition: border-color 0.2s, box-shadow 0.2s, transform 0.15s;
          }
          .select-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: transparent; transition: background 0.2s; border-radius: 18px 18px 0 0; }
          .select-card:hover { border-color: var(--rose-pale); box-shadow: 0 8px 32px rgba(158,84,114,0.10); transform: translateY(-2px); }
          .select-card.selected { border-color: var(--rose-light); background: var(--rose-pale); box-shadow: 0 8px 28px rgba(158,84,114,0.14); }
          .select-card.selected::before { background: var(--rose); }
          .card-top { display: flex; align-items: center; justify-content: space-between; }
          .card-icon { font-size: 22px; color: var(--rose-light); }
          .card-check { width: 20px; height: 20px; border-radius: 50%; border: 1.5px solid var(--gold-pale); display: flex; align-items: center; justify-content: center; font-size: 9px; color: transparent; transition: all 0.2s; }
          .select-card.selected .card-check { background: var(--rose); border-color: var(--rose); color: white; }
          .card-title { font-family: 'Playfair Display', serif; font-size: 18px; color: var(--ink); }
          .card-desc { font-size: 11px; color: var(--muted); line-height: 1.55; }

          /* ── INPUTS ───────────────────────────────────────────── */
          .field-group { margin-bottom: 32px; }
          .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 44px; }
          .field-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 32px; }
          .field-label { display: block; font-size: 9px; letter-spacing: 2.5px; text-transform: uppercase; color: var(--muted); margin-bottom: 12px; font-weight: 400; }
          .field-input {
            width: 100%; background: transparent; border: none;
            border-bottom: 1px solid #ddd0c0;
            padding: 4px 0 14px;
            font-family: 'Playfair Display', serif; font-size: 21px;
            color: var(--ink); outline: none; transition: border-color 0.2s; -webkit-appearance: none;
          }
          .field-input:focus { border-bottom-color: var(--rose); }
          .field-input::placeholder { color: #c8bcb0; font-style: italic; }
          .field-input:disabled { opacity: 0.25; }
          .toggle-row { display: flex; align-items: center; gap: 10px; margin-top: 12px; cursor: pointer; }
          .toggle-label { font-size: 11px; color: var(--silver); user-select: none; }
          .toggle-box { width: 34px; height: 19px; border-radius: 10px; background: #d8cec8; position: relative; flex-shrink: 0; transition: background 0.2s; }
          .toggle-box.on { background: var(--rose); }
          .toggle-box::after { content: ''; position: absolute; width: 15px; height: 15px; border-radius: 50%; background: white; top: 2px; left: 2px; transition: transform 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.15); }
          .toggle-box.on::after { transform: translateX(15px); }

          /* ── PERSON SECTION ───────────────────────────────────── */
          .person-section { background: white; border: 1px solid var(--gold-pale); border-radius: 18px; padding: 36px 40px; margin-bottom: 20px; }
          .person-section-title {
            font-family: 'Playfair Display', serif; font-size: 13px; font-weight: 500;
            letter-spacing: 1.5px; text-transform: uppercase; color: var(--rose-light);
            margin-bottom: 28px; padding-bottom: 14px; border-bottom: 1px solid var(--gold-pale);
          }

          /* ── NAMENSWECHSEL ────────────────────────────────────── */
          .namechange-section { background: var(--gold-faint); border: 1px dashed var(--gold-pale); border-radius: 14px; padding: 24px 32px; margin-top: 20px; }
          .namechange-toggle { display: flex; align-items: center; gap: 12px; cursor: pointer; }
          .namechange-toggle-label { font-size: 12px; color: var(--muted); }
          .namechange-fields { margin-top: 24px; display: none; }
          .namechange-fields.open { display: block; }

          /* ── CHILD BLOCK ──────────────────────────────────────── */
          .child-block { background: white; border: 1px solid var(--gold-pale); border-radius: 18px; padding: 36px 40px; margin-bottom: 18px; }
          .child-block-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; }
          .child-block-title { font-family: 'Playfair Display', serif; font-size: 17px; color: var(--rose-light); }
          .btn-remove { background: transparent; border: none; color: var(--silver); cursor: pointer; font-size: 22px; padding: 0; line-height: 1; transition: color 0.2s; }
          .btn-remove:hover { color: var(--rose); }

          /* ── BUTTONS ──────────────────────────────────────────── */
          .form-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 52px; padding-top: 32px; border-top: 1px solid var(--gold-pale); }
          .btn-primary {
            background: var(--ink); border: none; color: var(--cream);
            font-family: 'Raleway', sans-serif; font-weight: 400; font-size: 10px;
            letter-spacing: 2.5px; text-transform: uppercase;
            padding: 16px 48px; border-radius: 40px; cursor: pointer;
            transition: background 0.22s, transform 0.12s;
          }
          .btn-primary:hover { background: var(--rose); transform: translateY(-1px); }
          .btn-primary:disabled { opacity: 0.3; cursor: default; pointer-events: none; }
          .btn-primary.gold { background: var(--rose); box-shadow: 0 4px 20px rgba(158,84,114,0.22); }
          .btn-primary.gold:hover { background: var(--mauve); }
          .btn-back { background: transparent; border: none; color: var(--silver); font-family: 'Raleway', sans-serif; font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; cursor: pointer; padding: 0; transition: color 0.2s; }
          .btn-back:hover { color: var(--rose); }
          .btn-add {
            background: transparent; border: 1px dashed var(--rose-light); color: var(--rose);
            font-family: 'Raleway', sans-serif; font-weight: 400; font-size: 10px;
            letter-spacing: 2px; text-transform: uppercase;
            padding: 14px 28px; border-radius: 10px; cursor: pointer;
            width: 100%; margin-top: 4px; margin-bottom: 4px; transition: background 0.2s;
          }
          .btn-add:hover { background: var(--rose-pale); border-style: solid; }

          /* ── LOADING ──────────────────────────────────────────── */
          #screen-loading { display: none; align-items: center; justify-content: center; min-height: calc(100vh - 68px); background: var(--cream); }
          #screen-loading.active { display: flex; }
          .loading-inner { text-align: center; max-width: 440px; padding: 60px; }
          .loading-symbol { font-size: 56px; color: var(--rose-light); display: block; animation: spin 12s linear infinite; margin-bottom: 36px; }
          @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
          .loading-h { font-family: 'Playfair Display', serif; font-size: 38px; font-weight: 400; color: var(--ink); margin-bottom: 14px; line-height: 1.2; }
          .loading-sub { font-family: 'Playfair Display', serif; font-style: italic; font-size: 17px; color: var(--muted); min-height: 28px; transition: opacity 0.4s; }
          .loading-sub.hidden { opacity: 0; }
          .loading-dots { display: flex; gap: 8px; justify-content: center; margin-top: 44px; }
          .dot { width: 7px; height: 7px; border-radius: 50%; background: var(--rose-pale); animation: dp 1.6s ease-in-out infinite; }
          .dot:nth-child(2){animation-delay:0.3s} .dot:nth-child(3){animation-delay:0.6s}
          @keyframes dp { 0%,100%{background:var(--rose-pale);transform:scale(1)} 50%{background:var(--rose-light);transform:scale(1.4)} }

          /* ── RESULT ───────────────────────────────────────────── */
          #screen-result { min-height: calc(100vh - 68px); }
          #screen-ancestry .ancestor-block { border: 1.5px solid var(--rule, #e8ddc8); border-radius: 6px; padding: 0; margin-bottom: 10px; background: var(--white, #fff); overflow: hidden; }
          #screen-ancestry .ancestor-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 18px; cursor: pointer; gap: 12px; }
          #screen-ancestry .ancestor-title { font-family: 'Cormorant Garamond', serif; font-size: 17px; color: var(--ink, #1c1714); margin-bottom: 2px; }
          #screen-ancestry .ancestor-sub { font-size: 12px; color: var(--silver, #9a8a80); font-style: italic; }
          #screen-ancestry .ancestor-arrow { font-size: 18px; color: var(--gold-l, #c4962a); flex-shrink: 0; }
          #screen-ancestry .ancestor-fields { padding: 0 18px 16px; display: flex; flex-direction: column; gap: 12px; }
          #screen-ancestry .ancestry-toggle-card { border: 1.5px solid var(--rule, #e8ddc8); border-radius: 6px; padding: 18px; margin-bottom: 14px; background: var(--white, #fff); cursor: pointer; transition: all 0.2s; }
          #screen-ancestry .ancestry-check-circle { width: 26px; height: 26px; border-radius: 50%; background: var(--gold-p, #f0e4c0); display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background 0.2s; }
          #screen-ancestry .ancestry-toggle-title { font-family: 'Cormorant Garamond', serif; font-size: 18px; color: var(--ink, #1c1714); }
          #screen-ancestry .ancestry-toggle-sub { font-size: 12px; color: var(--silver, #9a8a80); margin-top: 2px; }
          .btn-rose { width: 100%; padding: 15px 24px; background: var(--rose, #8b4060); color: white; border: 1.5px solid var(--rose, #8b4060); border-radius: 3px; font-family: 'Lato', sans-serif; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; cursor: pointer; margin-bottom: 10px; transition: all 0.2s; }
          .btn-rose:hover:not(:disabled) { background: var(--rose-l, #c4687e); border-color: var(--rose-l, #c4687e); }
          .btn-rose:disabled { opacity: 0.4; cursor: not-allowed; }
          .result-hero {
            background: linear-gradient(145deg, var(--paper-deep) 0%, var(--paper) 60%, var(--rose-pale) 100%);
            padding: 68px 56px; position: relative; overflow: hidden;
          }
          .result-hero::before { content: ''; position: absolute; top: -60px; right: -60px; width: 300px; height: 300px; border-radius: 50%; background: radial-gradient(circle, rgba(196,152,64,0.10) 0%, transparent 70%); }
          .result-hero-eyebrow { font-size: 9px; letter-spacing: 3px; text-transform: uppercase; color: var(--rose-light); margin-bottom: 12px; font-weight: 400; }
          .result-hero-title { font-family: 'Playfair Display', serif; font-size: 48px; font-weight: 400; color: var(--ink); margin-bottom: 8px; }
          .result-hero-name { font-family: 'Playfair Display', serif; font-style: italic; font-size: 21px; color: var(--rose); }

          .result-content { max-width: 820px; margin: 0 auto; padding: 68px 56px 80px; }

          /* ── SECTION TITLES WITH INFO ─────────────────────────── */
          .result-section { margin-bottom: 52px; }
          .result-section-title-row { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 20px; padding-bottom: 14px; border-bottom: 1px solid var(--gold-pale); }
          .result-section-title { font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 500; color: var(--rose); flex: 1; }
          .sec-info-btn {
            flex-shrink: 0; width: 20px; height: 20px; border-radius: 50%;
            border: 1.5px solid var(--gold-pale); background: transparent;
            color: var(--silver); font-family: 'Georgia', serif; font-style: italic;
            font-size: 11px; cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            margin-top: 4px; transition: border-color 0.2s, color 0.2s, background 0.2s; line-height: 1;
          }
          .sec-info-btn:hover { border-color: var(--rose-light); color: var(--rose); background: var(--rose-pale); }
          .sec-info-panel {
            display: none; background: var(--rose-pale);
            border: 1px solid rgba(196,132,158,0.3); border-left: 3px solid var(--rose-light);
            border-radius: 10px; padding: 14px 18px;
            font-family: 'Raleway', sans-serif; font-size: 12.5px; font-weight: 300;
            color: var(--muted); line-height: 1.7; margin-bottom: 16px; letter-spacing: 0.1px;
          }
          .sec-info-panel.open { display: block; animation: fadeUp 0.25s ease forwards; }

          .result-text { font-family: 'Playfair Display', serif; font-size: 18px; line-height: 1.9; color: var(--ink); white-space: pre-wrap; }
          .result-body-inner { }
          .res-p { font-family: 'Playfair Display', serif; font-size: 18px; line-height: 1.9; color: var(--ink); margin-bottom: 14px; }

          .result-ornament { text-align: center; color: var(--rose-pale); font-size: 14px; letter-spacing: 16px; margin: 10px 0 52px; }
          .result-actions { background: var(--paper-deep); border-top: 1px solid var(--gold-pale); padding: 36px 56px; display: flex; align-items: center; gap: 24px; }
          .btn-ghost { background: transparent; border: none; color: var(--muted); font-family: 'Raleway', sans-serif; font-weight: 300; font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; cursor: pointer; padding: 0; transition: color 0.2s; }
          .btn-ghost:hover { color: var(--rose); }
          .error-box { background: #fff5f5; border: 1px solid #f0c0c8; border-radius: 12px; padding: 22px 26px; color: var(--rose); font-size: 14px; line-height: 1.6; }

          /* ── RESULT COMPONENTS ────────────────────────────────── */
          .res-big-zahl { font-family: 'Playfair Display', serif; font-size: 96px; font-weight: 400; color: var(--rose); line-height: 1; margin: 14px 0 22px; letter-spacing: -3px; font-style: italic; }

          .res-person-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin: 20px 0; }
          .res-person-card { background: white; border: 1px solid var(--gold-pale); border-radius: 18px; padding: 28px; border-top: 3px solid var(--rose-light); }
          .res-pc-label { font-size: 9px; letter-spacing: 2.5px; text-transform: uppercase; color: var(--rose-light); margin-bottom: 6px; font-weight: 400; }
          .res-pc-zahl { font-family: 'Playfair Display', serif; font-size: 64px; font-weight: 400; color: var(--rose); line-height: 1; margin-bottom: 8px; font-style: italic; }
          .res-pc-datum { font-size: 11px; color: var(--silver); margin-bottom: 6px; }
          .res-pc-stern { font-size: 11px; color: var(--muted); margin-bottom: 14px; }
          .res-pc-desc { font-family: 'Playfair Display', serif; font-style: italic; font-size: 14px; color: var(--ink); line-height: 1.65; margin-bottom: 18px; border-top: 1px solid var(--gold-pale); padding-top: 14px; }
          .res-pc-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
          .res-pc-stat { background: var(--rose-pale); border-radius: 10px; padding: 10px 6px; text-align: center; }
          .res-pc-stat-val { font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 400; color: var(--rose); line-height: 1; }
          .res-pc-stat-label { font-size: 7.5px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); margin-top: 4px; }

          .res-karten-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 18px 0; }
          .res-karte { background: white; border: 1px solid var(--gold-pale); border-radius: 16px; padding: 26px; border-top: 3px solid var(--rose-light); }
          .res-karte-eyebrow { font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: var(--rose-light); margin-bottom: 6px; font-weight: 400; }
          .res-karte-zahl { font-family: 'Playfair Display', serif; font-size: 52px; font-weight: 400; color: var(--rose); line-height: 1; margin-bottom: 8px; font-style: italic; }
          .res-karte-titel { font-family: 'Playfair Display', serif; font-size: 17px; color: var(--ink); margin-bottom: 8px; }
          .res-karte-desc { font-family: 'Playfair Display', serif; font-style: italic; font-size: 13px; color: var(--muted); line-height: 1.65; }

          .res-dynamik { background: var(--rose-pale); border: 1px solid rgba(196,132,158,0.3); border-radius: 18px; padding: 32px; margin: 18px 0; }
          .res-dyn-pole { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
          .res-dyn-pole-item { text-align: center; flex: 1; }
          .res-dyn-zahl { font-family: 'Playfair Display', serif; font-size: 60px; font-weight: 400; color: var(--rose); line-height: 1; font-style: italic; }
          .res-dyn-label { font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); margin-top: 8px; font-weight: 400; }
          .res-dyn-arrows { font-size: 26px; color: var(--rose-light); text-align: center; flex-shrink: 0; display: flex; flex-direction: column; align-items: center; gap: 4px; }
          .res-dyn-resonanz { font-size: 8.5px; letter-spacing: 2px; text-transform: uppercase; color: var(--rose); font-weight: 400; }

          .res-astro-list { display: flex; flex-direction: column; gap: 0; margin: 14px 0; }
          .res-astro-item { display: grid; grid-template-columns: 44px 1fr; gap: 0; padding: 18px 0; border-bottom: 1px solid var(--gold-pale); align-items: start; }
          .res-astro-item:first-child { border-top: 1px solid var(--gold-pale); }
          .res-astro-symbol { font-size: 22px; color: var(--rose-light); padding-top: 2px; }
          .res-astro-titel { font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: var(--rose-light); margin-bottom: 5px; font-weight: 400; }
          .res-astro-text { font-family: 'Playfair Display', serif; font-size: 16px; color: var(--ink); line-height: 1.75; font-style: italic; }

          .res-hs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin: 14px 0; }
          .res-hs-col { background: white; border-radius: 16px; padding: 26px; border: 1px solid var(--gold-pale); }
          .res-hs-challenge { border-left: 3px solid var(--rose-light); }
          .res-hs-key { border-left: 3px solid var(--gold); }
          .res-hs-header { font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-bottom: 14px; font-weight: 400; }
          .res-hs-item { font-family: 'Playfair Display', serif; font-size: 16px; color: var(--ink); line-height: 1.65; margin-bottom: 10px; }

          .res-tabelle-wrap { overflow-x: auto; margin: 14px 0; border-radius: 14px; border: 1px solid var(--gold-pale); }
          .res-tabelle { width: 100%; border-collapse: collapse; font-family: 'Raleway', sans-serif; }
          .res-tabelle thead th { background: var(--mauve); color: white; font-size: 9px; letter-spacing: 2px; text-transform: uppercase; padding: 14px 16px; text-align: left; font-weight: 400; }
          .res-tabelle tbody tr { border-bottom: 1px solid var(--gold-pale); }
          .res-tabelle tbody tr:last-child { border-bottom: none; }
          .res-tabelle tbody td { padding: 13px 16px; vertical-align: top; }
          .res-row-now { background: var(--rose-pale); }
          .res-jahr-cell { font-family: 'Playfair Display', serif; font-size: 19px; font-weight: 400; color: var(--rose); white-space: nowrap; font-style: italic; }
          .res-tab-zahl { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 400; color: var(--ink); display: block; }
          .res-tab-kw { font-size: 10px; color: var(--muted); display: block; margin-top: 2px; }

          .res-pinnacle { display: grid; grid-template-columns: 60px 1fr; gap: 0; padding: 18px 0; border-bottom: 1px solid var(--gold-pale); align-items: start; }
          .res-pin-zahl { font-family: 'Playfair Display', serif; font-size: 44px; font-weight: 400; color: var(--rose-pale); line-height: 1; padding-top: 4px; font-style: italic; }
          .res-pin-header { display: flex; align-items: center; gap: 10px; margin-bottom: 5px; flex-wrap: wrap; }
          .res-pin-num { font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: var(--rose-light); font-weight: 400; }
          .res-pin-zeit { font-size: 11px; color: var(--silver); }
          .res-pin-person { font-size: 9px; letter-spacing: 1px; text-transform: uppercase; color: var(--rose); font-weight: 400; }
          .res-pin-desc { font-family: 'Playfair Display', serif; font-style: italic; font-size: 16px; color: var(--ink); line-height: 1.7; }
          .res-pin-challenge { font-size: 11px; color: var(--rose-light); margin-top: 5px; }

          .res-namen-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 14px 0; }
          .res-namen-card { background: white; border: 1px solid var(--gold-pale); border-radius: 16px; padding: 26px; border-top: 3px solid var(--rose-light); }
          .res-nc-name { font-family: 'Playfair Display', serif; font-size: 19px; color: var(--ink); margin-bottom: 2px; }
          .res-nc-rolle { font-size: 8.5px; letter-spacing: 2px; text-transform: uppercase; color: var(--rose-light); margin-bottom: 18px; font-weight: 400; }
          .res-nc-zahlen { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-bottom: 14px; }
          .res-nc-zahl-item { text-align: center; background: var(--rose-pale); border-radius: 10px; padding: 10px 5px; }
          .res-nc-z { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 400; color: var(--rose); line-height: 1; font-style: italic; }
          .res-nc-zl { font-size: 7.5px; letter-spacing: 1px; text-transform: uppercase; color: var(--muted); margin-top: 3px; font-weight: 400; }
          .res-nc-ll { font-size: 9.5px; color: var(--muted); margin-top: 2px; }
          .res-nc-desc { font-family: 'Playfair Display', serif; font-style: italic; font-size: 13px; color: var(--muted); line-height: 1.65; border-top: 1px solid var(--gold-pale); padding-top: 12px; }

          .res-essenz {
            font-family: 'Playfair Display', serif; font-style: italic;
            font-size: 24px; line-height: 1.75; color: var(--ink);
            text-align: center; padding: 44px 28px;
            background: linear-gradient(135deg, var(--rose-pale) 0%, var(--gold-faint) 100%);
            border-radius: 18px; border: 1px solid rgba(196,132,158,0.25); margin: 14px 0;
          }

          /* ── MOBILE ───────────────────────────────────────────── */
          @media (max-width: 860px) {
            .topnav { padding: 0 20px; }
            .nav-progress { display: none; }
            .hero { grid-template-columns: 1fr; }
            .hero-left { padding: 52px 28px 44px; }
            .hero-h1 { font-size: 52px; }
            .hero-right { padding: 44px 28px; border-left: none; border-top: 1px solid var(--gold-pale); }
            .form-page { padding: 44px 20px 68px; }
            .form-h2 { font-size: 36px; }
            .card-grid-2, .card-grid-2-3 { grid-template-columns: 1fr; }
            .field-row, .field-row-3 { grid-template-columns: 1fr; gap: 0; }
            .person-section { padding: 24px 20px; }
            .child-block { padding: 24px 20px; }
            .result-hero { padding: 44px 20px; }
            .result-hero-title { font-size: 36px; }
            .result-content { padding: 44px 20px 56px; }
            .result-actions { padding: 24px 20px; flex-direction: column; align-items: flex-start; }
            .form-footer { flex-direction: column-reverse; gap: 18px; align-items: flex-start; }
            .res-person-grid, .res-karten-grid, .res-hs-grid, .res-namen-grid { grid-template-columns: 1fr; }
            .res-big-zahl { font-size: 72px; }
            .res-dyn-pole { flex-direction: column; }
            .res-tabelle thead th, .res-tabelle tbody td { padding: 10px 12px; }
            .lead-wrap { padding: 32px 20px; }
            .lead-title { font-size: 36px; }
          }

          @media print {
            .topnav, .result-actions { display: none !important; }
            .result-content { padding: 20px; }
          }
        `}</style>
      </Head>

      {/* TOP NAV */}
      <nav className="topnav">
        <div className="nav-brand">
          <span className="nav-symbol">✦</span>
          <div>
            <span className="nav-name">Familien-Code</span>
            <span className="nav-by"> · von Susana</span>
          </div>
        </div>
        <div className="nav-progress" id="nav-progress"></div>
        <button className="nav-cta" id="nav-reset" style={{display:'none'}}>Neue Analyse</button>
      </nav>

      {/* SCREEN 0: SPLASH */}
      <div className="screen active" id="screen-splash">
        <div className="hero">
          <div className="hero-left">
            <div className="hero-left-inner">
              <div className="hero-eyebrow">herzbewegung · Numerologie & Astrologie</div>
              <span className="hero-symbol">✦</span>
              <h1 className="hero-h1">Familien-<br/><em>Code</em></h1>
              <div className="hero-rule"></div>
              <p className="hero-sub">Deine Seelenlandschaft in Zahlen und Zeichen — persönlich, präzise, tiefgehend.</p>
              <button className="hero-cta" id="hero-cta-btn">
                Analyse starten
                <span className="hero-cta-arrow">→</span>
              </button>
              <p className="hero-tagline">Für dich, dein/e Partner:in & deine Familie</p>
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-features-title">Was diese Analyse umfasst</div>
            <div className="feature-list">
              {[
                ['01', 'Numerologie', 'Lebenszahl, Seelendrang, Persönlichkeit & Ausdruckskraft — aus Taufname und Geburtsdatum'],
                ['02', 'Astrologie', 'Sternzeichen, kosmische Verbindungen & astrologische Resonanzen im System'],
                ['03', 'Beziehungen', 'Dynamiken zwischen Partnern, Eltern & Kindern — das Familiensystem als Ganzes'],
                ['04', 'Jahresprognosen', 'Persönliche Jahresenergien, Pinnacles & Challenges 2025–2029'],
              ].map(([num, title, desc]) => (
                <div className="feature-item" key={num}>
                  <div className="feature-num">{num}</div>
                  <div className="feature-body">
                    <div className="feature-title">{title}</div>
                    <div className="feature-desc">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="hero-glossar">
              <div className="hero-glossar-title">Begriffe auf einen Blick</div>
              <div className="hero-glossar-grid">
                {[
                  ['Lebenszahl', 'Die wichtigste Zahl — errechnet aus dem vollständigen Geburtsdatum. Zeigt die Lebensaufgabe.'],
                  ['Seelendrang', 'Aus den Vokalen des Taufnamens. Was die Seele innerlich antreibt und ersehnt.'],
                  ['Persönlichkeit', 'Aus den Konsonanten. Wie man nach aussen wirkt — das erste Bild, das andere empfangen.'],
                  ['Ausdruckszahl', 'Alle Buchstaben des Namens. Das Gesamtpotenzial — was gelebt werden kann.'],
                  ['Persönliches Jahr', 'Jährlicher Energiezyklus von 1–9. Zeigt das Thema des laufenden Jahres.'],
                  ['Pinnacle', 'Längere Lebensphase (7–27 Jahre) mit spezifischer Energie und Lernaufgabe.'],
                  ['Challenge', 'Das Reibungsthema innerhalb eines Pinnacles — das Wachstumsfeld.'],
                  ['Meisterzahl', '11, 22 oder 33. Werden nicht reduziert — tragen erhöhtes Potenzial und erhöhte Anforderung.'],
                ].map(([term, def]) => (
                  <div className="hero-glossar-item" key={term}>
                    <div className="hero-glossar-term">{term}</div>
                    <div className="hero-glossar-def">{def}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SCREEN LEAD: LEAD GATE */}
      <div className="screen" id="screen-constellation">
        <div className="form-page">
          <div className="form-page-header">
            <div className="form-eyebrow">Schritt 1 von 6 · Konstellation</div>
            <h2 className="form-h2">Für wen ist diese Analyse?</h2>
            <p className="form-sub">Wähle deine Konstellation. Sie bestimmt Tiefe und Sektionen der Analyse.</p>
          </div>
          <div className="card-grid-2">
            {[
              ['solo', '✦', 'Nur für mich', 'Persönliche Einzelanalyse — Lebensweg, Seele, Namen-Energie & Jahresprognosen'],
              ['pair', '✦✦', 'Für mich & Partner:in', 'Beziehungsanalyse — Dynamik, astrologische Resonanz & Verbindungen zu zweit'],
              ['family', '✦✦✦', 'Für unsere Familie', 'Paar & Kinder — das vollständige Familiensystem mit allen Verbindungen'],
              ['solo_children', '✦◇', 'Für mich & mein/e Kind/er', 'Alleinerziehend — du und deine Kinder im Zentrum der Analyse'],
            ].map(([value, icon, title, desc]) => (
              <div className="select-card" data-value={value} key={value}>
                <div className="card-top"><div className="card-icon">{icon}</div><div className="card-check">✓</div></div>
                <div className="card-title">{title}</div>
                <div className="card-desc">{desc}</div>
              </div>
            ))}
          </div>
          <div className="form-footer">
            <button className="btn-back">← Zurück</button>
            <button className="btn-primary" id="btn-constellation-next" disabled>Weiter →</button>
          </div>
        </div>
      </div>

      {/* SCREEN 2: PERSON 1 */}
      <div className="screen" id="screen-person1">
        <div className="form-page">
          <div className="form-page-header">
            <div className="form-eyebrow">Schritt 2 von 6 · Deine Daten</div>
            <h2 className="form-h2">Du</h2>
            <p className="form-sub">Der vollständige Taufname — der Name, den du bei der Geburt erhalten hast — ist für die Numerologie entscheidend.</p>
          </div>
          <div className="person-section">
            <div className="person-section-title">Persönliche Angaben</div>
            <div id="person1-form"></div>
          </div>
          <div className="namechange-section">
            <div className="namechange-toggle" onClick={(e) => {
              const fields = e.currentTarget.parentElement.querySelector('.namechange-fields');
              if (fields) fields.classList.toggle('open');
            }}>
              <div className="toggle-box" id="nc-p1-toggle"></div>
              <span className="namechange-toggle-label">Ich habe meinen Namen geändert (z. B. nach Heirat)</span>
            </div>
            <div className="namechange-fields">
              <div className="field-row" style={{marginTop: '8px'}}>
                <div className="field-group">
                  <label className="field-label">Neuer Vorname</label>
                  <input className="field-input" id="p1-newname-first" placeholder="Neuer Vorname" />
                </div>
                <div className="field-group">
                  <label className="field-label">Neuer Nachname</label>
                  <input className="field-input" id="p1-newname-last" placeholder="Neuer Nachname" />
                </div>
              </div>
            </div>
          </div>
          <div className="form-footer">
            <button className="btn-back">← Zurück</button>
            <button className="btn-primary btn-next-generic">Weiter →</button>
          </div>
        </div>
      </div>

      {/* SCREEN 3: PERSON 2 */}
      <div className="screen" id="screen-person2">
        <div className="form-page">
          <div className="form-page-header">
            <div className="form-eyebrow">Schritt 3 von 6 · Partner:in</div>
            <h2 className="form-h2">Dein/e Partner:in</h2>
            <p className="form-sub">Auch hier ist der Taufname massgebend — der Name bei der Geburt, nicht der spätere Alltagsname.</p>
          </div>
          <div className="person-section">
            <div className="person-section-title">Angaben Partner:in</div>
            <div id="person2-form"></div>
          </div>
          <div className="namechange-section">
            <div className="namechange-toggle" onClick={(e) => {
              const fields = e.currentTarget.parentElement.querySelector('.namechange-fields');
              if (fields) fields.classList.toggle('open');
            }}>
              <div className="toggle-box" id="nc-p2-toggle"></div>
              <span className="namechange-toggle-label">Partner:in hat den Namen geändert (z. B. nach Heirat)</span>
            </div>
            <div className="namechange-fields">
              <div className="field-row" style={{marginTop: '8px'}}>
                <div className="field-group">
                  <label className="field-label">Neuer Vorname</label>
                  <input className="field-input" id="p2-newname-first" placeholder="Neuer Vorname" />
                </div>
                <div className="field-group">
                  <label className="field-label">Neuer Nachname</label>
                  <input className="field-input" id="p2-newname-last" placeholder="Neuer Nachname" />
                </div>
              </div>
            </div>
          </div>
          <div className="form-footer">
            <button className="btn-back">← Zurück</button>
            <button className="btn-primary btn-next-generic">Weiter →</button>
          </div>
        </div>
      </div>

      {/* SCREEN 4: COUPLE */}
      <div className="screen" id="screen-couple">
        <div className="form-page">
          <div className="form-page-header">
            <div className="form-eyebrow">Schritt 4 von 6 · Schlüsseldaten</div>
            <h2 className="form-h2">Eure Geschichte</h2>
            <p className="form-sub">Diese Daten fliessen als numerologische Energiepunkte in die Analyse ein. Beide Angaben sind vollständig optional.</p>
          </div>
          <div className="person-section">
            <div className="person-section-title">Gemeinsame Daten</div>
            <div className="field-row">
              <div className="field-group">
                <label className="field-label">Kennenlernen (TT.MM.JJJJ)</label>
                <input className="field-input" id="meet-date" placeholder="Optional" />
                <div className="toggle-row" data-toggle-input="meet-date" data-toggle-id="no-meet">
                  <div className="toggle-box" id="no-meet"></div>
                  <span className="toggle-label">Datum unbekannt oder überspringen</span>
                </div>
              </div>
              <div className="field-group">
                <label className="field-label">Hochzeit / Zusammenzug (TT.MM.JJJJ)</label>
                <input className="field-input" id="wedding-date" placeholder="Optional" />
                <div className="toggle-row" data-toggle-input="wedding-date" data-toggle-id="no-wedding">
                  <div className="toggle-box" id="no-wedding"></div>
                  <span className="toggle-label">Datum unbekannt oder überspringen</span>
                </div>
              </div>
            </div>
          </div>
          <div className="form-footer">
            <button className="btn-back">← Zurück</button>
            <button className="btn-primary btn-next-generic">Weiter →</button>
          </div>
        </div>
      </div>

      {/* SCREEN 5: KINDER */}
      <div className="screen" id="screen-children">
        <div className="form-page">
          <div className="form-page-header">
            <div className="form-eyebrow">Schritt 5 von 6 · Kinder</div>
            <h2 className="form-h2">Die Kinder</h2>
            <p className="form-sub">Bis zu 5 Kinder können erfasst werden. Die Geburtszeit ist optional, aber wertvoll für die Analyse.</p>
          </div>
          <div id="children-container"></div>
          <button className="btn-add" id="btn-add-child">+ Weiteres Kind hinzufügen</button>
          <div className="form-footer">
            <button className="btn-back">← Zurück</button>
            <button className="btn-primary btn-next-generic">Weiter →</button>
          </div>
        </div>
      </div>


      {/* SCREEN: AHNENLINIE */}
      <div className="screen" id="screen-ancestry">
        <div className="form-page">
          <div className="form-page-header">
            <button className="btn-back" id="btn-back-ancestry">← Zurück</button>
            <div className="form-eyebrow">Optional</div>
            <div className="form-h1">Die Ahnenlinie</div>
            <div className="form-sub">Was aus deiner Familie mitschwingt — über Generationen. Alle Felder sind freiwillig.</div>
          </div>

          <div id="ancestry-toggle-card" className="ancestry-toggle-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div className="ancestry-check-circle" id="ancestry-check-circle"></div>
              <div>
                <div className="ancestry-toggle-title">Ahnenlinie einbeziehen</div>
                <div className="ancestry-toggle-sub">Eltern, Grosseltern, Familienthemen</div>
              </div>
            </div>
          </div>

          <div id="ancestry-fields" style={{ display: 'none' }}>
            <div className="ornament" style={{ margin: '12px 0 8px' }}>— Eltern —</div>

            {[
              { key: 'mother', label: 'Mutter' },
              { key: 'father', label: 'Vater' },
            ].map(({ key, label }) => (
              <div key={key} id={"ancestor-block-" + key} className="ancestor-block">
                <div className="ancestor-header" id={"ancestor-toggle-" + key}>
                  <div>
                    <div className="ancestor-title">{label} <span className="optional-badge">optional</span></div>
                    <div className="ancestor-sub" id={"ancestor-sub-" + key}>Tippe hier um Angaben zu machen</div>
                  </div>
                  <div className="ancestor-arrow" id={"ancestor-arrow-" + key}>▾</div>
                </div>
                <div className="ancestor-fields" id={"ancestor-fields-" + key} style={{ display: 'none' }}>
                  <div className="field-row">
                    <div className="field-group">
                      <label className="field-label">Taufname</label>
                      <input className="field-input" id={"ancestor-" + key + "-firstname"} placeholder="Vorname" />
                    </div>
                    <div className="field-group">
                      <label className="field-label">Nachname</label>
                      <input className="field-input" id={"ancestor-" + key + "-lastname"} placeholder="Geburtsname" />
                    </div>
                  </div>
                  <div className="field-row">
                    <div className="field-group">
                      <label className="field-label">Geburtsort</label>
                      <input className="field-input" id={"ancestor-" + key + "-place"} placeholder="Stadt, Land" />
                    </div>
                    <div className="field-group">
                      <label className="field-label">Herkunftsland</label>
                      <input className="field-input" id={"ancestor-" + key + "-country"} placeholder="z. B. Portugal, Schweiz" />
                    </div>
                  </div>
                  <div className="field-group">
                    <label className="field-label">Geburtsdatum (optional)</label>
                    <div className="date-row">
                      <div className="field-group"><input className="field-input" id={"ancestor-" + key + "-day"} type="number" placeholder="TT" style={{ textAlign: 'center' }} /><div className="date-hint">Tag</div></div>
                      <div className="field-group"><input className="field-input" id={"ancestor-" + key + "-month"} type="number" placeholder="MM" style={{ textAlign: 'center' }} /><div className="date-hint">Monat</div></div>
                      <div className="field-group"><input className="field-input" id={"ancestor-" + key + "-year"} type="number" placeholder="JJJJ" style={{ textAlign: 'center' }} /><div className="date-hint">Jahr</div></div>
                    </div>
                  </div>
                  <div className="field-row">
                    <div className="field-group">
                      <label className="field-label">Geburtszeit (optional)</label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        <div><input className="field-input" id={"ancestor-" + key + "-hour"} type="number" placeholder="HH" min="0" max="23" style={{ textAlign: 'center' }} /><div className="date-hint">Stunde</div></div>
                        <div><input className="field-input" id={"ancestor-" + key + "-minute"} type="number" placeholder="MM" min="0" max="59" style={{ textAlign: 'center' }} /><div className="date-hint">Minute</div></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="ornament" style={{ margin: '14px 0 8px' }}>— Grosseltern —</div>

            {[
              { key: 'mgm', label: 'Grossmutter (mütterlicherseits)' },
              { key: 'mgf', label: 'Grossvater (mütterlicherseits)' },
              { key: 'pgm', label: 'Grossmutter (väterlicherseits)' },
              { key: 'pgf', label: 'Grossvater (väterlicherseits)' },
            ].map(({ key, label }) => (
              <div key={key} id={"ancestor-block-" + key} className="ancestor-block">
                <div className="ancestor-header" id={"ancestor-toggle-" + key}>
                  <div>
                    <div className="ancestor-title">{label} <span className="optional-badge">optional</span></div>
                    <div className="ancestor-sub" id={"ancestor-sub-" + key}>Tippe hier um Angaben zu machen</div>
                  </div>
                  <div className="ancestor-arrow" id={"ancestor-arrow-" + key}>▾</div>
                </div>
                <div className="ancestor-fields" id={"ancestor-fields-" + key} style={{ display: 'none' }}>
                  <div className="field-row">
                    <div className="field-group">
                      <label className="field-label">Taufname</label>
                      <input className="field-input" id={"ancestor-" + key + "-firstname"} placeholder="Vorname" />
                    </div>
                    <div className="field-group">
                      <label className="field-label">Nachname</label>
                      <input className="field-input" id={"ancestor-" + key + "-lastname"} placeholder="Geburtsname" />
                    </div>
                  </div>
                  <div className="field-row">
                    <div className="field-group">
                      <label className="field-label">Geburtsort</label>
                      <input className="field-input" id={"ancestor-" + key + "-place"} placeholder="Stadt, Land" />
                    </div>
                    <div className="field-group">
                      <label className="field-label">Herkunftsland</label>
                      <input className="field-input" id={"ancestor-" + key + "-country"} placeholder="z. B. Portugal, Schweiz" />
                    </div>
                  </div>
                  <div className="field-group">
                    <label className="field-label">Geburtsdatum (optional)</label>
                    <div className="date-row">
                      <div className="field-group"><input className="field-input" id={"ancestor-" + key + "-day"} type="number" placeholder="TT" style={{ textAlign: 'center' }} /><div className="date-hint">Tag</div></div>
                      <div className="field-group"><input className="field-input" id={"ancestor-" + key + "-month"} type="number" placeholder="MM" style={{ textAlign: 'center' }} /><div className="date-hint">Monat</div></div>
                      <div className="field-group"><input className="field-input" id={"ancestor-" + key + "-year"} type="number" placeholder="JJJJ" style={{ textAlign: 'center' }} /><div className="date-hint">Jahr</div></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="ornament" style={{ margin: '14px 0 8px' }}>— Themen —</div>
            <div className="field-group">
              <label className="field-label">Wiederkehrende Familienthemen <span className="optional-badge">optional</span></label>
              <textarea className="field-input" id="ancestry-themes" rows={3} placeholder="z. B. frühe Verluste, starke Frauen, Migration, spirituelle Berufe..." style={{ resize: 'vertical' }} />
              <div className="field-note">Hilft, generationsübergreifende Muster zu erkennen.</div>
            </div>
          </div>

          <div className="btn-row" style={{ marginTop: 24 }}>
            <button className="btn-primary btn-next-generic" id="btn-ancestry-next">Weiter</button>
            <button className="btn-ghost btn-next-generic" id="btn-ancestry-skip" style={{ display: '' }}>Ohne Ahnenlinie weiter</button>
          </div>
        </div>
      </div>

      {/* SCREEN 6: FOKUS */}
      <div className="screen" id="screen-focus">
        <div className="form-page">
          <div className="form-page-header">
            <div className="form-eyebrow">Schritt 6 von 6 · Fokus</div>
            <h2 className="form-h2">Was bewegt dich<br/>am meisten?</h2>
            <p className="form-sub">Wähle deinen Schwerpunkt. Die Analyse bleibt vollständig — dieser Fokus bestimmt, wo sie am tiefsten geht.</p>
          </div>
          <div className="card-grid-2-3">
            {[
              ['overview', '◎', 'Das grosse Gesamtbild', 'Alle Dimensionen — vollständige Tiefenanalyse'],
              ['relationship', '♡', 'Beziehungsdynamik', 'Verbindung, Resonanz & Partnerschaft'],
              ['personal', '◈', 'Persönlicher Lebensweg', 'Seele, Bestimmung & innere Kraft'],
              ['children_focus', '✧', 'Die Kinder', 'Seelenbild & Energien der Kinder'],
              ['future', '◬', 'Zukunft & Jahresprognosen', 'Energien & Pinnacles 2025–2029'],
            ].map(([value, icon, title, desc]) => (
              <div className="select-card" data-value={value} key={value}>
                <div className="card-top"><div className="card-icon">{icon}</div><div className="card-check">✓</div></div>
                <div className="card-title">{title}</div>
                <div className="card-desc">{desc}</div>
              </div>
            ))}
          </div>
          <div className="form-footer">
            <button className="btn-back">← Zurück</button>
            <button className="btn-primary gold" id="btn-focus-next" disabled>Analyse generieren ✦</button>
          </div>
        </div>
      </div>

      {/* SCREEN 7: LOADING */}
      <div className="screen" id="screen-loading">
        <div className="loading-inner">
          <span className="loading-symbol">✦</span>
          <div className="loading-h">Dein Code<br/>wird berechnet…</div>
          <div className="loading-sub" id="loading-sub">Lebenszahlen werden ermittelt…</div>
          <div className="loading-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
      </div>

      {/* SCREEN 8: RESULT */}
      <div className="screen" id="screen-result">
        <div className="result-hero">
          <div className="result-hero-eyebrow">herzbewegung · Familien-Code · Deine persönliche Analyse</div>
          <div className="result-hero-title">Deine Seelenlandschaft</div>
          <div className="result-hero-name" id="result-name"></div>
        </div>
        <div className="result-content" id="result-body"></div>
        <div className="result-actions">
          <button className="btn-rose" id="btn-download-docx">↓ Als Word-Dokument (editierbar)</button>
          <button className="btn-primary" id="btn-print">Drucken / Als PDF speichern</button>
          <button className="btn-ghost" id="btn-reset-result">Neue Analyse starten</button>
        </div>
      </div>
      <Script src="/app-logic.js" strategy="afterInteractive" />
    </>
  )
}
