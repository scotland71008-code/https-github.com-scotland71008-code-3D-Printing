/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Printer,
  FileDown,
  RotateCcw,
  Info,
  CheckCircle2,
  Copy,
  Cpu,
  Sun,
  Moon,
  Globe,
  Share2,
  Layers,
  Flame,
  Drill,
  Save,
  Trash2,
  Percent,
  Clock,
  DollarSign,
  Briefcase,
  Sliders,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ArrowRight
} from 'lucide-react';

type Language = 'en' | 'ar';
type MachineMode = '3dp' | 'laser' | 'cnc';

interface CurrencyInfo {
  code: string;
  symbol: string;
  nameEn: string;
  nameAr: string;
}

const CURRENCIES: Record<string, CurrencyInfo> = {
  USD: { code: 'USD', symbol: '$', nameEn: 'USD ($)', nameAr: 'دولار أمريكي ($)' },
  SAR: { code: 'SAR', symbol: 'SAR', nameEn: 'Saudi Riyal (SAR)', nameAr: 'ريال سعودي (ر.س)' },
  EUR: { code: 'EUR', symbol: '€', nameEn: 'Euro (€)', nameAr: 'يورو (€)' },
  AED: { code: 'AED', symbol: 'AED', nameEn: 'UAE Dirham (AED)', nameAr: 'درهم إماراتي (د.إ)' },
  GBP: { code: 'GBP', symbol: '£', nameEn: 'British Pound (£)', nameAr: 'جنيه إسترليني (£)' }
};

interface SavedQuote {
  id: string;
  date: string;
  projectTitle: string;
  clientName: string;
  mode: MachineMode;
  quantity: number;
  grandTotal: number;
  currency: string;
  data: Record<string, any>;
}

interface Translations {
  title: string;
  subtitle: string;
  langToggle: string;
  themeToggle: string;
  mode3dp: string;
  modeLaser: string;
  modeCnc: string;
  clientDetailsTitle: string;
  clientName: string;
  projectTitle: string;
  quoteDate: string;
  currencyLabel: string;
  vatToggleLabel: string;
  vatRateLabel: string;
  quantityLabel: string;
  volDiscountLabel: string;
  
  // 3D Print mode
  mat3dpTitle: string;
  spoolPrice: string;
  spoolWeight: string;
  gramsConsumed: string;
  printTimeHours: string;
  printTimeMins: string;
  filamentPresetsLabel: string;
  
  // Laser mode
  matLaserTitle: string;
  sheetPrice: string;
  sheetArea: string;
  areaUsed: string;
  laserTimeHours: string;
  laserTimeMins: string;
  laserPresetsLabel: string;
  
  // CNC mode
  matCncTitle: string;
  blockPrice: string;
  stockVolume: string;
  volumeUsed: string;
  cncTimeHours: string;
  cncTimeMins: string;
  cncPresetsLabel: string;
  
  // Advanced Global
  advancedTitle: string;
  machineDepreciationTitle: string;
  machineCost: string;
  lifespanHours: string;
  calculatedDepreciationRate: string;
  scrapBufferLabel: string;
  scrapBufferDesc: string;
  postLaborTitle: string;
  laborHours: string;
  hourlyWage: string;
  extraConsumables: string;
  extraConsumablesDesc: string;
  profitMargin: string;
  
  // Receipt Breakdown
  receiptHeaderTitle: string;
  refLabel: string;
  rawMaterialCost: string;
  scrapAllowance: string;
  depreciationCost: string;
  laborCost: string;
  consumablesCost: string;
  unitProductionCost: string;
  marginMarkup: string;
  unitPriceBeforeDisc: string;
  qtyLine: string;
  volumeDiscountAmt: string;
  subtotalAfterDisc: string;
  taxVatLine: string;
  finalSellingPrice: string;
  unitFinalPrice: string;
  
  // Actions
  printBtn: string;
  exportPdfBtn: string;
  exportingPdfBtn: string;
  whatsappBtn: string;
  copyBtn: string;
  copiedBtn: string;
  saveQuoteBtn: string;
  savedSuccess: string;
  resetBtn: string;
  
  // History
  historyTitle: string;
  historyEmpty: string;
  colDate: string;
  colProject: string;
  colClient: string;
  colMode: string;
  colQty: string;
  colTotal: string;
  colActions: string;
  loadBtn: string;
  deleteBtn: string;
  clearHistoryBtn: string;
}

const DICTIONARY: Record<Language, Translations> = {
  en: {
    title: 'Snapmaker Quoting Tool V2',
    subtitle: 'Multi-Mode Manufacturing: 3D Print · Laser · CNC',
    langToggle: 'العربية',
    themeToggle: 'Toggle Theme',
    mode3dp: '3D Printing',
    modeLaser: 'Laser Cutting',
    modeCnc: 'CNC Milling',
    clientDetailsTitle: 'Commercial & Client Information',
    clientName: 'Client Name',
    projectTitle: 'Project / Part Title',
    quoteDate: 'Quotation Date',
    currencyLabel: 'Currency',
    vatToggleLabel: 'Apply VAT / Tax',
    vatRateLabel: 'VAT Rate (%)',
    quantityLabel: 'Order Quantity',
    volDiscountLabel: 'Volume Discount (%)',
    
    // 3DP
    mat3dpTitle: '3D Printing Parameters',
    spoolPrice: 'Spool Price',
    spoolWeight: 'Spool Weight (g)',
    gramsConsumed: 'Grams Consumed (g)',
    printTimeHours: 'Print Hours',
    printTimeMins: 'Print Minutes',
    filamentPresetsLabel: 'Filament Presets:',
    
    // Laser
    matLaserTitle: 'Laser Engraving & Cutting Parameters',
    sheetPrice: 'Material Sheet Price',
    sheetArea: 'Sheet Total Area (cm²)',
    areaUsed: 'Area Consumed (cm²)',
    laserTimeHours: 'Laser Hours',
    laserTimeMins: 'Laser Minutes',
    laserPresetsLabel: 'Sheet Presets:',
    
    // CNC
    matCncTitle: 'CNC Milling & Carving Parameters',
    blockPrice: 'Stock Block Price',
    stockVolume: 'Stock Volume (cm³)',
    volumeUsed: 'Volume Milled (cm³)',
    cncTimeHours: 'Milling Hours',
    cncTimeMins: 'Milling Minutes',
    cncPresetsLabel: 'Stock Presets:',
    
    // Advanced Global
    advancedTitle: 'Operational, Scrap & Labor Costs',
    machineDepreciationTitle: 'Machine Depreciation & Wear',
    machineCost: 'Machine Purchase Cost',
    lifespanHours: 'Expected Lifespan (hours)',
    calculatedDepreciationRate: 'Depreciation Hourly Rate',
    scrapBufferLabel: 'Failure & Scrap Buffer',
    scrapBufferDesc: 'Adds safety buffer for print/cut failures & supports',
    postLaborTitle: 'Post-Processing & Finishing Labor',
    laborHours: 'Labor Duration (hours)',
    hourlyWage: 'Operator Hourly Wage',
    extraConsumables: 'Hardware & Packaging ($)',
    extraConsumablesDesc: 'Screws, heat inserts, glue, sandpaper, packaging box',
    profitMargin: 'Profit Margin Markup',
    
    // Receipt
    receiptHeaderTitle: 'Snapmaker Commercial Quotation',
    refLabel: 'Ref ID',
    rawMaterialCost: 'Raw Material Cost',
    scrapAllowance: 'Scrap & Failure Buffer',
    depreciationCost: 'Machine Depreciation & Run Cost',
    laborCost: 'Post-Processing Labor',
    consumablesCost: 'Hardware & Packaging',
    unitProductionCost: 'Unit Base Production Cost',
    marginMarkup: 'Profit Margin Markup',
    unitPriceBeforeDisc: 'Unit Selling Price',
    qtyLine: 'Quantity Multiplier',
    volumeDiscountAmt: 'Volume Discount',
    subtotalAfterDisc: 'Net Subtotal',
    taxVatLine: 'Applicable VAT / Tax',
    finalSellingPrice: 'Grand Total Price',
    unitFinalPrice: 'Effective Price Per Unit',
    
    // Actions
    printBtn: 'Print Invoice',
    exportPdfBtn: 'Export PDF',
    exportingPdfBtn: 'Generating PDF...',
    whatsappBtn: 'Share to WhatsApp',
    copyBtn: 'Copy Text',
    copiedBtn: 'Copied!',
    saveQuoteBtn: 'Save to History',
    savedSuccess: 'Quote Saved!',
    resetBtn: 'Reset to Defaults',
    
    // History
    historyTitle: 'Recent Quotation History',
    historyEmpty: 'No stored quotes yet. Save your quotes to access them anytime.',
    colDate: 'Date',
    colProject: 'Project',
    colClient: 'Client',
    colMode: 'Mode',
    colQty: 'Qty',
    colTotal: 'Total',
    colActions: 'Actions',
    loadBtn: 'Load',
    deleteBtn: 'Delete',
    clearHistoryBtn: 'Clear All'
  },
  ar: {
    title: 'أداة تسعير سناب ميكر - الإصدار الثاني',
    subtitle: 'تصنيع متعدد الأنماط: طباعة ثلاثية الأبعاد · ليزر · سي إن سي',
    langToggle: 'English',
    themeToggle: 'تبديل المظهر',
    mode3dp: 'طباعة ثلاثية الأبعاد',
    modeLaser: 'قص ونقش بالليزر',
    modeCnc: 'تفريز ونحت CNC',
    clientDetailsTitle: 'البيانات التجارية وتفاصيل العميل',
    clientName: 'اسم العميل',
    projectTitle: 'اسم المشروع / القطعة',
    quoteDate: 'تاريخ عرض السعر',
    currencyLabel: 'العملة',
    vatToggleLabel: 'تطبيق ضريبة القيمة المضافة',
    vatRateLabel: 'نسبة الضريبة (%)',
    quantityLabel: 'الكمية المطلوبة',
    volDiscountLabel: 'خصم الكمية (%)',
    
    // 3DP
    mat3dpTitle: 'معاملات الطباعة ثلاثية الأبعاد',
    spoolPrice: 'سعر بكرة الفيلومنت',
    spoolWeight: 'وزن البكرة (غرام)',
    gramsConsumed: 'الوزن المستهلك (غرام)',
    printTimeHours: 'ساعات الطباعة',
    printTimeMins: 'دقائق الطباعة',
    filamentPresetsLabel: 'نماذج الفيلومنت:',
    
    // Laser
    matLaserTitle: 'معاملات القص والنقش بالليزر',
    sheetPrice: 'سعر لوح الخامة',
    sheetArea: 'المساحة الإجمالية للوح (سم²)',
    areaUsed: 'المساحة المستهلكة (سم²)',
    laserTimeHours: 'ساعات الليزر',
    laserTimeMins: 'دقائق الليزر',
    laserPresetsLabel: 'نماذج الألواح الجاهزة:',
    
    // CNC
    matCncTitle: 'معاملات التفريز والنحت CNC',
    blockPrice: 'سعر بلوك الخامة',
    stockVolume: 'الحجم الإجمالي للبلوك (سم³)',
    volumeUsed: 'الحجم المنحوت (سم³)',
    cncTimeHours: 'ساعات التفريز',
    cncTimeMins: 'دقائق التفريز',
    cncPresetsLabel: 'نماذج خامات CNC:',
    
    // Advanced Global
    advancedTitle: 'تكاليف التشغيل والهدر والعمالة',
    machineDepreciationTitle: 'إهلاك واستهلاك الطابعة',
    machineCost: 'سعر شراء الطابعة',
    lifespanHours: 'العمر التشغيلي المتوقع (ساعات)',
    calculatedDepreciationRate: 'معدل الإهلاك لكل ساعة',
    scrapBufferLabel: 'هامش أمان الهدر وفشل القطع',
    scrapBufferDesc: 'يغطي احتمالية الفشل وهياكل الدعم والزوائد',
    postLaborTitle: 'أجرة العمالة والمعالجة اليدوية',
    laborHours: 'مدة المعالجة (ساعات)',
    hourlyWage: 'أجرة ساعة الفني',
    extraConsumables: 'المستلزمات والتغليف ($)',
    extraConsumablesDesc: 'براغي، صواميل حرارية، غراء، صنفرة، صندوق التغليف',
    profitMargin: 'هامش الربح والزيادة التجارية',
    
    // Receipt
    receiptHeaderTitle: 'فاتورة تسعير تصنيع سناب ميكر',
    refLabel: 'رقم المرجع',
    rawMaterialCost: 'تكلفة الخامة الأساسية',
    scrapAllowance: 'هامش أمان الهدر والفشل',
    depreciationCost: 'إهلاك الآلة وتشغيل المحاور',
    laborCost: 'أجرة المعالجة والتشطيب اليدوي',
    consumablesCost: 'المستلزمات والبراغي والتغليف',
    unitProductionCost: 'تكلفة الإنتاج للقطعة الواحدة',
    marginMarkup: 'مبلغ هامش الربح',
    unitPriceBeforeDisc: 'سعر بيع القطعة قبل الخصم',
    qtyLine: 'إجمالي الكمية',
    volumeDiscountAmt: 'مبلغ خصم الكمية',
    subtotalAfterDisc: 'الصافي بعد الخصم',
    taxVatLine: 'ضريبة القيمة المضافة',
    finalSellingPrice: 'المبلغ الإجمالي النهائي',
    unitFinalPrice: 'السعر الفعلي للقطعة الواحدة',
    
    // Actions
    printBtn: 'طباعة الفاتورة',
    exportPdfBtn: 'تصدير PDF',
    exportingPdfBtn: 'جاري إنشاء PDF...',
    whatsappBtn: 'مشاركة عبر واتساب',
    copyBtn: 'نسخ النص',
    copiedBtn: 'تم النسخ!',
    saveQuoteBtn: 'حفظ في السجل',
    savedSuccess: 'تم الحفظ!',
    resetBtn: 'استعادة الافتراضيات',
    
    // History
    historyTitle: 'سجل عروض الأسعار السابقة',
    historyEmpty: 'لا توجد عروض أسعار محفوظة حالياً. احفظ عروضك للرجوع إليها لاحقاً.',
    colDate: 'التاريخ',
    colProject: 'المشروع',
    colClient: 'العميل',
    colMode: 'النمط',
    colQty: 'الكمية',
    colTotal: 'الإجمالي',
    colActions: 'الإجراءات',
    loadBtn: 'تحميل',
    deleteBtn: 'حذف',
    clearHistoryBtn: 'مسح الكل'
  }
};

// Preset lists for modes
const FILAMENT_PRESETS = [
  { name: 'Snapmaker PLA', price: 24.99, weight: 1000 },
  { name: 'Snapmaker PETG', price: 26.99, weight: 1000 },
  { name: 'Snapmaker ABS', price: 27.99, weight: 1000 },
  { name: 'Snapmaker TPU 95A', price: 34.99, weight: 1000 },
  { name: 'Carbon Fiber PLA', price: 39.99, weight: 1000 },
];

const LASER_PRESETS = [
  { name: '3mm Basswood Plywood (30x30cm)', price: 14.50, area: 900 },
  { name: '5mm Clear Cast Acrylic (30x30cm)', price: 22.00, area: 900 },
  { name: 'Anodized Aluminum Sheet (10x20cm)', price: 8.50, area: 200 },
  { name: 'Genuine Craft Leather (30x40cm)', price: 28.00, area: 1200 },
  { name: 'Bamboo Cutting Board (20x30cm)', price: 18.00, area: 600 }
];

const CNC_PRESETS = [
  { name: 'Solid Black Walnut (15x15x3cm)', price: 32.00, volume: 675 },
  { name: 'Delrin / POM Plastic (10x10x5cm)', price: 26.00, volume: 500 },
  { name: 'Carbon Fiber Plate (20x20x1cm)', price: 45.00, volume: 400 },
  { name: 'High-Density Tooling Board (20x20x2cm)', price: 19.00, volume: 800 },
  { name: '6061 Aluminum Billet (15x10x3cm)', price: 38.00, volume: 450 }
];

declare global {
  interface Window {
    html2pdf?: () => {
      set: (opt: Record<string, unknown>) => {
        from: (el: HTMLElement | null) => {
          save: () => Promise<void>;
        };
      };
    };
  }
}

// Logo Component
function SnapmakerEmblem({ className = "w-12 h-12" }: { className?: string }) {
  const [srcIndex, setSrcIndex] = useState(0);
  const possibleSrcs = [
    'Gemini_Generated_Image_1onuux1onuux1onu.jfif.svg',
    'Gemini_Generated_Image_1onuux1onuux1onu.jfif',
    'logo.svg',
    'logo.png'
  ];

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (srcIndex < possibleSrcs.length - 1) {
      setSrcIndex(srcIndex + 1);
    } else {
      setSrcIndex(999); // Fallback to SVG
    }
  };

  if (srcIndex < possibleSrcs.length) {
    return (
      <div className={`relative rounded-full p-0.5 bg-gradient-to-tr from-amber-700 via-amber-500 to-amber-300 shadow-md overflow-hidden shrink-0 ${className}`}>
        <img
          src={possibleSrcs[srcIndex]}
          alt="Snapmaker Emblem - From Engraving to Creative 3D Printing"
          onError={handleImgError}
          className="w-full h-full object-cover rounded-full"
        />
      </div>
    );
  }

  // High-fidelity vector rendition of the uploaded emblem
  return (
    <div className={`relative rounded-full shadow-md p-0.5 bg-gradient-to-br from-amber-600 via-amber-400 to-amber-700 shrink-0 ${className}`}>
      <svg viewBox="0 0 400 400" className="w-full h-full rounded-full bg-slate-950">
        <defs>
          <radialGradient id="emblemBgV2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#222834" />
            <stop offset="65%" stopColor="#11151e" />
            <stop offset="100%" stopColor="#080a0e" />
          </radialGradient>
          <linearGradient id="bronzeRingV2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
          <filter id="neonGlowV2">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Outer Circular Ring */}
        <circle cx="200" cy="200" r="195" fill="url(#emblemBgV2)" stroke="url(#bronzeRingV2)" strokeWidth="8" />
        <circle cx="200" cy="200" r="175" fill="none" stroke="#d97706" strokeWidth="2" strokeDasharray="4 2" />

        {/* Outer English Engraving Text Arc */}
        <path id="topTextArcV2" d="M 50 200 A 150 150 0 0 1 350 200" fill="none" />
        <text fill="#fbbf24" fontSize="13" fontWeight="bold" letterSpacing="2.5">
          <textPath href="#topTextArcV2" startOffset="50%" textAnchor="middle">
            FROM ENGRAVING TO CREATIVE 3D PRINTING
          </textPath>
        </text>

        {/* Outer Arabic Engraving Text Arc */}
        <path id="bottomTextArcV2" d="M 350 200 A 150 150 0 0 1 50 200" fill="none" />
        <text fill="#fbbf24" fontSize="13" fontWeight="bold" letterSpacing="1">
          <textPath href="#bottomTextArcV2" startOffset="50%" textAnchor="middle">
            من الحفر إلى الطباعة ثلاثية الأبعاد الإبداعية
          </textPath>
        </text>

        {/* Center Artwork Boundary */}
        <circle cx="200" cy="200" r="130" fill="#131822" stroke="#475569" strokeWidth="2" />

        {/* Left Side: Woodworking Chisel & Traditional Workshop */}
        <path d="M 200 70 A 130 130 0 0 0 70 200 A 130 130 0 0 0 200 330 Z" fill="#2d2218" opacity="0.6" />
        <line x1="120" y1="260" x2="185" y2="210" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
        <polygon points="185,210 195,202 198,206 188,214" fill="#cbd5e1" />
        <path d="M 140 240 Q 155 250 150 265 Q 140 260 140 240 Z" fill="#b45309" opacity="0.8" />
        <path d="M 115 220 Q 130 225 125 240" fill="none" stroke="#d97706" strokeWidth="2" />

        {/* Center Brand Ribbon: SNAPMAKER */}
        <rect x="135" y="100" width="130" height="24" rx="4" fill="#0f172a" stroke="#d97706" strokeWidth="1.5" />
        <text x="200" y="117" textAnchor="middle" fill="#fef08a" fontSize="14" fontWeight="900" letterSpacing="2">
          SNAPMAKER
        </text>

        {/* Right Side: Futuristic Cyan Grid & 3D Extruder Hotend */}
        <path d="M 200 230 L 310 230 M 200 250 L 305 250 M 200 270 L 290 270" stroke="#06b6d4" strokeWidth="1" opacity="0.4" />
        <path d="M 230 210 L 230 300 M 260 210 L 260 290 M 290 210 L 290 270" stroke="#06b6d4" strokeWidth="1" opacity="0.4" />
        <rect x="235" y="145" width="28" height="35" rx="3" fill="#334155" stroke="#06b6d4" strokeWidth="2" />
        <polygon points="244,180 254,180 249,195" fill="#f59e0b" filter="url(#neonGlowV2)" />
        <path d="M 250 145 Q 260 120 285 130" fill="none" stroke="#f97316" strokeWidth="3" filter="url(#neonGlowV2)" />
        <path d="M 255 145 Q 275 125 300 140" fill="none" stroke="#06b6d4" strokeWidth="2" filter="url(#neonGlowV2)" />
        <path d="M 249 195 Q 240 220 260 230 Q 280 240 255 255 Q 235 270 260 280" fill="none" stroke="#f97316" strokeWidth="5" strokeLinecap="round" filter="url(#neonGlowV2)" />
        <circle cx="305" cy="195" r="14" fill="none" stroke="#06b6d4" strokeWidth="2" strokeDasharray="3 3" />
        <circle cx="305" cy="195" r="6" fill="#06b6d4" />

        {/* Craftsman Silhouette */}
        <circle cx="190" cy="160" r="16" fill="#fde68a" />
        <path d="M 180 176 Q 190 170 200 176 L 205 210 L 175 210 Z" fill="#92400e" />
      </svg>
    </div>
  );
}

export default function App() {
  // Theme & Language
  const [lang, setLang] = useState<Language>('en');
  const [isDark, setIsDark] = useState<boolean>(true);

  // Active Mode
  const [mode, setMode] = useState<MachineMode>('3dp');

  // Commercial & Client
  const [clientName, setClientName] = useState<string>('Acme Prototyping Ltd');
  const [projectTitle, setProjectTitle] = useState<string>('Snapmaker Dual-Extrusion Enclosure Part');
  const [quoteDate, setQuoteDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [currency, setCurrency] = useState<string>('USD');
  const [applyVat, setApplyVat] = useState<boolean>(true);
  const [vatRate, setVatRate] = useState<number>(15);
  const [quantity, setQuantity] = useState<number>(1);
  const [volumeDiscount, setVolumeDiscount] = useState<number>(0);

  // Mode 1: 3D Printing
  const [spoolPrice, setSpoolPrice] = useState<number>(25.0);
  const [spoolWeight, setSpoolWeight] = useState<number>(1000);
  const [gramsConsumed, setGramsConsumed] = useState<number>(145);
  const [printHours, setPrintHours] = useState<number>(4);
  const [printMins, setPrintMins] = useState<number>(30);

  // Mode 2: Laser
  const [sheetPrice, setSheetPrice] = useState<number>(14.50);
  const [sheetArea, setSheetArea] = useState<number>(900); // 30x30 cm
  const [areaUsed, setAreaUsed] = useState<number>(280);
  const [laserHours, setLaserHours] = useState<number>(1);
  const [laserMins, setLaserMins] = useState<number>(15);

  // Mode 3: CNC
  const [blockPrice, setBlockPrice] = useState<number>(32.0);
  const [stockVolume, setStockVolume] = useState<number>(675); // 15x15x3 cm
  const [volumeUsed, setVolumeUsed] = useState<number>(160);
  const [cncHours, setCncHours] = useState<number>(2);
  const [cncMins, setCncMins] = useState<number>(45);

  // Advanced Global Inputs
  const [machineCost, setMachineCost] = useState<number>(1500); // Snapmaker Artisan
  const [lifespanHours, setLifespanHours] = useState<number>(3000); // 3,000 hrs
  const [scrapBuffer, setScrapBuffer] = useState<number>(8); // 8%
  const [laborHours, setLaborHours] = useState<number>(0.5); // 30 mins
  const [hourlyWage, setHourlyWage] = useState<number>(25); // $25/hr
  const [extraConsumables, setExtraConsumables] = useState<number>(4.0); // screws, glue, box
  const [profitMargin, setProfitMargin] = useState<number>(50); // 50%

  // Status & Storage
  const [quoteId] = useState<string>(() => 'SM-' + Math.floor(100000 + Math.random() * 900000));
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [copiedState, setCopiedState] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [quotesHistory, setQuotesHistory] = useState<SavedQuote[]>([]);

  const t = DICTIONARY[lang];
  const isRtl = lang === 'ar';
  const curr = CURRENCIES[currency] || CURRENCIES.USD;

  // Auto-apply volume discount recommendation if quantity increases
  useEffect(() => {
    if (quantity === 1) {
      setVolumeDiscount(0);
    } else if (quantity >= 2 && quantity <= 5 && volumeDiscount === 0) {
      setVolumeDiscount(5);
    } else if (quantity >= 6 && quantity <= 10 && volumeDiscount <= 5) {
      setVolumeDiscount(10);
    } else if (quantity >= 11 && volumeDiscount <= 10) {
      setVolumeDiscount(15);
    }
  }, [quantity]);

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('snapmaker_quotes_v2');
      if (stored) {
        setQuotesHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load quote history', e);
    }
  }, []);

  // Update HTML tag dir/lang/dark
  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [lang, isDark, isRtl]);

  // MATHEMATICAL CORE
  // 1. Raw Material Cost according to mode
  let rawMaterialCost = 0;
  let activeRunHours = 0;

  if (mode === '3dp') {
    rawMaterialCost = spoolWeight > 0 ? (spoolPrice / spoolWeight) * gramsConsumed : 0;
    activeRunHours = printHours + (printMins / 60);
  } else if (mode === 'laser') {
    rawMaterialCost = sheetArea > 0 ? (sheetPrice / sheetArea) * areaUsed : 0;
    activeRunHours = laserHours + (laserMins / 60);
  } else if (mode === 'cnc') {
    rawMaterialCost = stockVolume > 0 ? (blockPrice / stockVolume) * volumeUsed : 0;
    activeRunHours = cncHours + (cncMins / 60);
  }

  // 2. Scrap & Failure Buffer
  const scrapAmount = rawMaterialCost * (scrapBuffer / 100);
  const bufferedMaterialCost = rawMaterialCost + scrapAmount;

  // 3. Machine Depreciation & Wear Rate
  const hourlyDepreciationRate = lifespanHours > 0 ? machineCost / lifespanHours : 0;
  const machineDepreciationCost = activeRunHours * hourlyDepreciationRate;

  // 4. Labor Cost
  const postLaborCost = laborHours * hourlyWage;

  // 5. Total Base Fabrication Cost (per unit)
  const unitProductionCost = bufferedMaterialCost + machineDepreciationCost + postLaborCost + extraConsumables;

  // 6. Profit Margin Markup
  const marginAmount = unitProductionCost * (profitMargin / 100);
  const unitBaseSellingPrice = unitProductionCost + marginAmount;

  // 7. Quantity & Volume Discount
  const totalRawPrice = unitBaseSellingPrice * quantity;
  const discountAmount = totalRawPrice * (volumeDiscount / 100);
  const subtotalAfterDiscount = totalRawPrice - discountAmount;

  // 8. Tax / VAT
  const vatAmount = applyVat ? subtotalAfterDiscount * (vatRate / 100) : 0;
  const grandTotal = subtotalAfterDiscount + vatAmount;
  const effectiveUnitPrice = quantity > 0 ? grandTotal / quantity : 0;

  // Mode helpers
  const handleApplyFilamentPreset = (p: typeof FILAMENT_PRESETS[0]) => {
    setSpoolPrice(p.price);
    setSpoolWeight(p.weight);
  };

  const handleApplyLaserPreset = (p: typeof LASER_PRESETS[0]) => {
    setSheetPrice(p.price);
    setSheetArea(p.area);
  };

  const handleApplyCncPreset = (p: typeof CNC_PRESETS[0]) => {
    setBlockPrice(p.price);
    setStockVolume(p.volume);
  };

  // Actions
  const handlePrint = () => {
    window.print();
  };

  const handleExportPdf = async () => {
    const receiptElement = document.getElementById('receipt-card');
    if (!receiptElement) return;

    if (typeof window.html2pdf !== 'function') {
      window.print();
      return;
    }

    try {
      setIsExportingPdf(true);
      const cleanFileName = `Snapmaker_Quote_${(projectTitle || 'Print').replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '_')}.pdf`;
      const opt = {
        margin: [10, 10, 10, 10],
        filename: cleanFileName,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await window.html2pdf().set(opt).from(receiptElement).save();
    } catch (err) {
      console.error('PDF export error:', err);
      window.print();
    } finally {
      setIsExportingPdf(false);
    }
  };

  // WhatsApp Integration
  const handleShareWhatsApp = () => {
    const modeName = mode === '3dp' ? t.mode3dp : mode === 'laser' ? t.modeLaser : t.modeCnc;
    const msg = `
*${t.title}*
-----------------------------
📄 *${t.projectTitle}:* ${projectTitle}
👤 *${t.clientName}:* ${clientName}
⚙️ *${t.colMode}:* ${modeName}
📅 *${t.quoteDate}:* ${quoteDate} (Ref: ${quoteId})

📦 *${t.quantityLabel}:* ${quantity} units
💰 *${t.unitFinalPrice}:* ${curr.symbol}${effectiveUnitPrice.toFixed(2)}
💵 *${t.finalSellingPrice}:* ${curr.symbol}${grandTotal.toFixed(2)} (${curr.code})
${applyVat ? `ℹ️ *${t.taxVatLine}:* ${vatRate}% (${curr.symbol}${vatAmount.toFixed(2)})\n` : ''}${volumeDiscount > 0 ? `🎁 *${t.volDiscountLabel}:* ${volumeDiscount}% (-${curr.symbol}${discountAmount.toFixed(2)})\n` : ''}
-----------------------------
_Generated via Snapmaker Manufacturing Quoting Tool_
`.trim();

    const waUrl = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  };

  // Copy Text
  const handleCopyText = () => {
    const modeName = mode === '3dp' ? t.mode3dp : mode === 'laser' ? t.modeLaser : t.modeCnc;
    const summary = `
SNAPMAKER COMMERCIAL QUOTE
-----------------------------
Project: ${projectTitle}
Client: ${clientName}
Mode: ${modeName}
Date: ${quoteDate} (Ref: ${quoteId})

Unit Base Cost: ${curr.symbol}${unitProductionCost.toFixed(2)}
Profit Margin: +${profitMargin}% (Unit Base Price: ${curr.symbol}${unitBaseSellingPrice.toFixed(2)})
Quantity: ${quantity}
Volume Discount: ${volumeDiscount}% (-${curr.symbol}${discountAmount.toFixed(2)})
VAT: ${applyVat ? `${vatRate}% (+${curr.symbol}${vatAmount.toFixed(2)})` : 'None'}
GRAND TOTAL: ${curr.symbol}${grandTotal.toFixed(2)} (${curr.code})
Effective Per Unit: ${curr.symbol}${effectiveUnitPrice.toFixed(2)}
`.trim();

    navigator.clipboard.writeText(summary).then(() => {
      setCopiedState(true);
      setTimeout(() => setCopiedState(false), 2500);
    });
  };

  // Save Quote to localStorage
  const handleSaveQuote = () => {
    const newQuote: SavedQuote = {
      id: quoteId,
      date: quoteDate,
      projectTitle: projectTitle || 'Untitled Project',
      clientName: clientName || 'Anonymous',
      mode,
      quantity,
      grandTotal,
      currency,
      data: {
        spoolPrice, spoolWeight, gramsConsumed, printHours, printMins,
        sheetPrice, sheetArea, areaUsed, laserHours, laserMins,
        blockPrice, stockVolume, volumeUsed, cncHours, cncMins,
        machineCost, lifespanHours, scrapBuffer, laborHours, hourlyWage, extraConsumables,
        profitMargin, applyVat, vatRate, volumeDiscount
      }
    };

    const updated = [newQuote, ...quotesHistory.filter(q => q.id !== quoteId)].slice(0, 15);
    setQuotesHistory(updated);
    localStorage.setItem('snapmaker_quotes_v2', JSON.stringify(updated));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Load Past Quote
  const handleLoadQuote = (q: SavedQuote) => {
    setProjectTitle(q.projectTitle);
    setClientName(q.clientName);
    setQuoteDate(q.date);
    setMode(q.mode);
    setQuantity(q.quantity);
    setCurrency(q.currency);

    const d = q.data;
    if (d) {
      if (d.spoolPrice !== undefined) setSpoolPrice(d.spoolPrice);
      if (d.spoolWeight !== undefined) setSpoolWeight(d.spoolWeight);
      if (d.gramsConsumed !== undefined) setGramsConsumed(d.gramsConsumed);
      if (d.printHours !== undefined) setPrintHours(d.printHours);
      if (d.printMins !== undefined) setPrintMins(d.printMins);

      if (d.sheetPrice !== undefined) setSheetPrice(d.sheetPrice);
      if (d.sheetArea !== undefined) setSheetArea(d.sheetArea);
      if (d.areaUsed !== undefined) setAreaUsed(d.areaUsed);
      if (d.laserHours !== undefined) setLaserHours(d.laserHours);
      if (d.laserMins !== undefined) setLaserMins(d.laserMins);

      if (d.blockPrice !== undefined) setBlockPrice(d.blockPrice);
      if (d.stockVolume !== undefined) setStockVolume(d.stockVolume);
      if (d.volumeUsed !== undefined) setVolumeUsed(d.volumeUsed);
      if (d.cncHours !== undefined) setCncHours(d.cncHours);
      if (d.cncMins !== undefined) setCncMins(d.cncMins);

      if (d.machineCost !== undefined) setMachineCost(d.machineCost);
      if (d.lifespanHours !== undefined) setLifespanHours(d.lifespanHours);
      if (d.scrapBuffer !== undefined) setScrapBuffer(d.scrapBuffer);
      if (d.laborHours !== undefined) setLaborHours(d.laborHours);
      if (d.hourlyWage !== undefined) setHourlyWage(d.hourlyWage);
      if (d.extraConsumables !== undefined) setExtraConsumables(d.extraConsumables);
      if (d.profitMargin !== undefined) setProfitMargin(d.profitMargin);
      if (d.applyVat !== undefined) setApplyVat(d.applyVat);
      if (d.vatRate !== undefined) setVatRate(d.vatRate);
      if (d.volumeDiscount !== undefined) setVolumeDiscount(d.volumeDiscount);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete from history
  const handleDeleteQuote = (id: string) => {
    const updated = quotesHistory.filter(q => q.id !== id);
    setQuotesHistory(updated);
    localStorage.setItem('snapmaker_quotes_v2', JSON.stringify(updated));
  };

  const handleClearHistory = () => {
    setQuotesHistory([]);
    localStorage.removeItem('snapmaker_quotes_v2');
  };

  const handleResetDefaults = () => {
    setProjectTitle('Snapmaker Precision Part');
    setClientName('Acme Prototyping');
    setQuantity(1);
    setVolumeDiscount(0);
    setApplyVat(true);
    setVatRate(15);
    setMode('3dp');
    setSpoolPrice(25.0);
    setSpoolWeight(1000);
    setGramsConsumed(120);
    setPrintHours(4);
    setPrintMins(0);
    setMachineCost(1500);
    setLifespanHours(3000);
    setScrapBuffer(5);
    setLaborHours(0.5);
    setHourlyWage(25);
    setExtraConsumables(4.0);
    setProfitMargin(50);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'} flex flex-col antialiased transition-colors duration-200`}>
      
      {/* Top Navbar */}
      <header className={`no-print border-b ${isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white/90'} backdrop-blur sticky top-0 z-40 transition-colors`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <SnapmakerEmblem className="w-10 h-10" />
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-base sm:text-lg font-black tracking-tight leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {t.title}
                </span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-500 border border-amber-500/30">
                  V2 3-in-1
                </span>
              </div>
              <p className={`text-xs hidden sm:block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {t.subtitle}
              </p>
            </div>
          </div>

          {/* Controls: Currency, Language, Theme, Print */}
          <div className="flex items-center gap-2">
            
            {/* Currency Selector */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border focus:outline-none transition ${
                isDark
                  ? 'bg-slate-800 text-slate-200 border-slate-700'
                  : 'bg-white text-slate-800 border-slate-300'
              }`}
            >
              {Object.values(CURRENCIES).map((c) => (
                <option key={c.code} value={c.code}>
                  {lang === 'ar' ? c.nameAr : c.nameEn}
                </option>
              ))}
            </select>

            {/* Language Switcher */}
            <button
              onClick={() => setLang(prev => prev === 'en' ? 'ar' : 'en')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                isDark
                  ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                  : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-amber-500" />
              <span>{t.langToggle}</span>
            </button>

            {/* Dark / Light Mode */}
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-lg border transition ${
                isDark
                  ? 'bg-slate-800 text-amber-400 border-slate-700 hover:bg-slate-700'
                  : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
              }`}
              title={t.themeToggle}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Quick Print Button */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition shadow-sm shrink-0"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.printBtn}</span>
            </button>

          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* SNAPMAKER MULTI-MODE TABS */}
        <div className="no-print mb-6">
          <div className="flex rounded-2xl p-1.5 bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 max-w-2xl mx-auto shadow-inner">
            
            <button
              onClick={() => setMode('3dp')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
                mode === '3dp'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>{t.mode3dp}</span>
            </button>

            <button
              onClick={() => setMode('laser')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
                mode === 'laser'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>{t.modeLaser}</span>
            </button>

            <button
              onClick={() => setMode('cnc')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
                mode === 'cnc'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Drill className="w-4 h-4" />
              <span>{t.modeCnc}</span>
            </button>

          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Inputs (Hidden in Print & PDF) */}
          <div className="no-print lg:col-span-7 space-y-6">
            
            {/* 1. Commercial & Client Details */}
            <div className={`border rounded-2xl p-5 shadow-sm space-y-4 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className={`flex items-center justify-between pb-3 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <h2 className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" />
                  <span>{t.clientDetailsTitle}</span>
                </h2>
                <span className="text-xs font-mono text-slate-500">{quoteId}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">
                    {t.clientName}
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400 ${
                      isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">
                    {t.projectTitle}
                  </label>
                  <input
                    type="text"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400 ${
                      isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                {/* Quantity */}
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">
                    {t.quantityLabel}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className={`w-full border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-amber-400 ${
                      isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                {/* Volume Discount */}
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">
                    {t.volDiscountLabel}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="80"
                      value={volumeDiscount}
                      onChange={(e) => setVolumeDiscount(Math.max(0, Math.min(80, parseFloat(e.target.value) || 0)))}
                      className={`w-full border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-amber-400 ${
                        isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                    <span className="absolute inset-y-0 end-3 flex items-center text-xs text-slate-400">%</span>
                  </div>
                </div>

                {/* VAT Toggle & Rate */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                      {t.vatToggleLabel}
                    </label>
                    <input
                      type="checkbox"
                      checked={applyVat}
                      onChange={(e) => setApplyVat(e.target.checked)}
                      className="rounded accent-amber-500 cursor-pointer"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="50"
                      disabled={!applyVat}
                      value={vatRate}
                      onChange={(e) => setVatRate(Math.max(0, parseFloat(e.target.value) || 0))}
                      className={`w-full border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-amber-400 disabled:opacity-40 ${
                        isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                    <span className="absolute inset-y-0 end-3 flex items-center text-xs text-slate-400">%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Active Mode Inputs (3D Print, Laser, or CNC) */}
            <div className={`border rounded-2xl p-5 shadow-sm space-y-4 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              
              {/* TAB 1: 3D PRINT MODE */}
              {mode === '3dp' && (
                <>
                  <div className={`flex items-center justify-between pb-3 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                      <Layers className="w-4 h-4" />
                      <span>{t.mat3dpTitle}</span>
                    </h2>
                    <span className="text-xs font-mono text-amber-500">
                      {curr.symbol}{(spoolWeight > 0 ? spoolPrice / spoolWeight : 0).toFixed(4)} / g
                    </span>
                  </div>

                  {/* Presets */}
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">{t.filamentPresetsLabel}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {FILAMENT_PRESETS.map((p) => (
                        <button
                          key={p.name}
                          type="button"
                          onClick={() => handleApplyFilamentPreset(p)}
                          className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                            isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {p.name} ({curr.symbol}{p.price})
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">{t.spoolPrice} ({curr.symbol})</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={spoolPrice}
                        onChange={(e) => setSpoolPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                        className={`w-full border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-amber-400 ${
                          isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">{t.spoolWeight}</label>
                      <input
                        type="number"
                        min="1"
                        value={spoolWeight}
                        onChange={(e) => setSpoolWeight(Math.max(1, parseFloat(e.target.value) || 1))}
                        className={`w-full border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-amber-400 ${
                          isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">{t.gramsConsumed}</label>
                      <input
                        type="number"
                        min="0"
                        value={gramsConsumed}
                        onChange={(e) => setGramsConsumed(Math.max(0, parseFloat(e.target.value) || 0))}
                        className={`w-full border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-amber-400 ${
                          isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">{t.printTimeHours}</label>
                      <input
                        type="number"
                        min="0"
                        value={printHours}
                        onChange={(e) => setPrintHours(Math.max(0, parseInt(e.target.value, 10) || 0))}
                        className={`w-full border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-amber-400 ${
                          isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">{t.printTimeMins}</label>
                      <input
                        type="number"
                        min="0"
                        max="59"
                        value={printMins}
                        onChange={(e) => setPrintMins(Math.max(0, Math.min(59, parseInt(e.target.value, 10) || 0)))}
                        className={`w-full border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-amber-400 ${
                          isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* TAB 2: LASER ENGRAVING & CUTTING MODE */}
              {mode === 'laser' && (
                <>
                  <div className={`flex items-center justify-between pb-3 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                      <Flame className="w-4 h-4" />
                      <span>{t.matLaserTitle}</span>
                    </h2>
                    <span className="text-xs font-mono text-amber-500">
                      {curr.symbol}{(sheetArea > 0 ? sheetPrice / sheetArea : 0).toFixed(4)} / cm²
                    </span>
                  </div>

                  {/* Presets */}
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">{t.laserPresetsLabel}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {LASER_PRESETS.map((p) => (
                        <button
                          key={p.name}
                          type="button"
                          onClick={() => handleApplyLaserPreset(p)}
                          className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                            isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {p.name} ({curr.symbol}{p.price})
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">{t.sheetPrice} ({curr.symbol})</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={sheetPrice}
                        onChange={(e) => setSheetPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                        className={`w-full border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-amber-400 ${
                          isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">{t.sheetArea}</label>
                      <input
                        type="number"
                        min="1"
                        value={sheetArea}
                        onChange={(e) => setSheetArea(Math.max(1, parseFloat(e.target.value) || 1))}
                        className={`w-full border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-amber-400 ${
                          isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">{t.areaUsed}</label>
                      <input
                        type="number"
                        min="0"
                        value={areaUsed}
                        onChange={(e) => setAreaUsed(Math.max(0, parseFloat(e.target.value) || 0))}
                        className={`w-full border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-amber-400 ${
                          isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">{t.laserTimeHours}</label>
                      <input
                        type="number"
                        min="0"
                        value={laserHours}
                        onChange={(e) => setLaserHours(Math.max(0, parseInt(e.target.value, 10) || 0))}
                        className={`w-full border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-amber-400 ${
                          isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">{t.laserTimeMins}</label>
                      <input
                        type="number"
                        min="0"
                        max="59"
                        value={laserMins}
                        onChange={(e) => setLaserMins(Math.max(0, Math.min(59, parseInt(e.target.value, 10) || 0)))}
                        className={`w-full border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-amber-400 ${
                          isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* TAB 3: CNC MILLING MODE */}
              {mode === 'cnc' && (
                <>
                  <div className={`flex items-center justify-between pb-3 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                      <Drill className="w-4 h-4" />
                      <span>{t.matCncTitle}</span>
                    </h2>
                    <span className="text-xs font-mono text-amber-500">
                      {curr.symbol}{(stockVolume > 0 ? blockPrice / stockVolume : 0).toFixed(4)} / cm³
                    </span>
                  </div>

                  {/* Presets */}
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">{t.cncPresetsLabel}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {CNC_PRESETS.map((p) => (
                        <button
                          key={p.name}
                          type="button"
                          onClick={() => handleApplyCncPreset(p)}
                          className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                            isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {p.name} ({curr.symbol}{p.price})
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">{t.blockPrice} ({curr.symbol})</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={blockPrice}
                        onChange={(e) => setBlockPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                        className={`w-full border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-amber-400 ${
                          isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">{t.stockVolume}</label>
                      <input
                        type="number"
                        min="1"
                        value={stockVolume}
                        onChange={(e) => setStockVolume(Math.max(1, parseFloat(e.target.value) || 1))}
                        className={`w-full border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-amber-400 ${
                          isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">{t.volumeUsed}</label>
                      <input
                        type="number"
                        min="0"
                        value={volumeUsed}
                        onChange={(e) => setVolumeUsed(Math.max(0, parseFloat(e.target.value) || 0))}
                        className={`w-full border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-amber-400 ${
                          isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">{t.cncTimeHours}</label>
                      <input
                        type="number"
                        min="0"
                        value={cncHours}
                        onChange={(e) => setCncHours(Math.max(0, parseInt(e.target.value, 10) || 0))}
                        className={`w-full border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-amber-400 ${
                          isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">{t.cncTimeMins}</label>
                      <input
                        type="number"
                        min="0"
                        max="59"
                        value={cncMins}
                        onChange={(e) => setCncMins(Math.max(0, Math.min(59, parseInt(e.target.value, 10) || 0)))}
                        className={`w-full border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-amber-400 ${
                          isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Raw Material Subtotal Display */}
              <div className={`p-3 rounded-xl border flex items-center justify-between text-xs font-mono ${
                isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className="text-slate-400">{t.rawMaterialCost}</span>
                <span className="font-bold text-amber-400 text-sm">{curr.symbol}{rawMaterialCost.toFixed(2)}</span>
              </div>
            </div>

            {/* 3. Advanced Operational, Depreciation & Labor Inputs */}
            <div className={`border rounded-2xl p-5 shadow-sm space-y-5 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className={`flex items-center justify-between pb-3 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <h2 className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4" />
                  <span>{t.advancedTitle}</span>
                </h2>
              </div>

              {/* Machine Depreciation */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{t.machineDepreciationTitle}</span>
                  <span className="text-xs font-mono text-amber-500 font-bold">
                    {curr.symbol}{hourlyDepreciationRate.toFixed(2)} / hr
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">{t.machineCost} ({curr.symbol})</label>
                    <input
                      type="number"
                      min="0"
                      value={machineCost}
                      onChange={(e) => setMachineCost(Math.max(0, parseFloat(e.target.value) || 0))}
                      className={`w-full border rounded-lg px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-amber-400 ${
                        isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">{t.lifespanHours}</label>
                    <input
                      type="number"
                      min="100"
                      value={lifespanHours}
                      onChange={(e) => setLifespanHours(Math.max(100, parseFloat(e.target.value) || 100))}
                      className={`w-full border rounded-lg px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-amber-400 ${
                        isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Scrap Buffer Slider (0% to 20%) */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">{t.scrapBufferLabel}</span>
                    <span className="text-[10px] text-slate-400">{t.scrapBufferDesc}</span>
                  </div>
                  <span className="text-sm font-mono font-bold text-amber-500">+{scrapBuffer}% (+{curr.symbol}{scrapAmount.toFixed(2)})</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="1"
                  value={scrapBuffer}
                  onChange={(e) => setScrapBuffer(parseInt(e.target.value, 10) || 0)}
                  className="w-full h-2 rounded-lg accent-amber-500 cursor-pointer bg-slate-200 dark:bg-slate-950"
                />
              </div>

              {/* Post-Processing Labor */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{t.postLaborTitle}</span>
                  <span className="text-xs font-mono text-emerald-500 font-bold">={curr.symbol}{postLaborCost.toFixed(2)}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">{t.laborHours}</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={laborHours}
                      onChange={(e) => setLaborHours(Math.max(0, parseFloat(e.target.value) || 0))}
                      className={`w-full border rounded-lg px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-amber-400 ${
                        isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">{t.hourlyWage} ({curr.symbol}/hr)</label>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={hourlyWage}
                      onChange={(e) => setHourlyWage(Math.max(0, parseFloat(e.target.value) || 0))}
                      className={`w-full border rounded-lg px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-amber-400 ${
                        isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Extra Consumables Flat Cost */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">{t.extraConsumables}</span>
                    <span className="text-[10px] text-slate-400">{t.extraConsumablesDesc}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-500">{curr.symbol}{extraConsumables.toFixed(2)}</span>
                </div>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={extraConsumables}
                  onChange={(e) => setExtraConsumables(Math.max(0, parseFloat(e.target.value) || 0))}
                  className={`w-full border rounded-lg px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-amber-400 ${
                    isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              {/* Profit Margin Range Slider (0% to 500%) */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{t.profitMargin}</span>
                  <span className="text-base font-mono font-bold text-amber-500">+{profitMargin}% (+{curr.symbol}{marginAmount.toFixed(2)})</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="5"
                  value={profitMargin}
                  onChange={(e) => setProfitMargin(parseInt(e.target.value, 10) || 0)}
                  className="w-full h-2.5 rounded-lg accent-amber-500 cursor-pointer bg-slate-200 dark:bg-slate-950"
                />
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                  <span>0% (Cost)</span>
                  <span>50%</span>
                  <span>100% (2x)</span>
                  <span>250%</span>
                  <span>500%</span>
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT COLUMN: Output Receipt Card & Actions (Target for PDF & Print) */}
          <div className="lg:col-span-5 sticky top-20">
            
            {/* Quick Action Bar above receipt */}
            <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Live Itemized Quote
              </span>
              
              <div className="flex flex-wrap items-center gap-1.5">
                {/* Save Quote */}
                <button
                  onClick={handleSaveQuote}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg border bg-slate-800 text-amber-400 border-slate-700 hover:bg-slate-700 transition"
                  title={t.saveQuoteBtn}
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savedSuccess ? t.savedSuccess : t.saveQuoteBtn}</span>
                </button>

                {/* WhatsApp */}
                <button
                  onClick={handleShareWhatsApp}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm"
                  title={t.whatsappBtn}
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </button>

                {/* Export PDF */}
                <button
                  onClick={handleExportPdf}
                  disabled={isExportingPdf}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 transition shadow-sm"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>{isExportingPdf ? t.exportingPdfBtn : t.exportPdfBtn}</span>
                </button>
              </div>
            </div>

            {/* THE COMMERCIAL RECEIPT CARD (#receipt-card) */}
            <div
              id="receipt-card"
              className="bg-white text-slate-900 rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-200 relative overflow-hidden"
              style={{ direction: isRtl ? 'rtl' : 'ltr' }}
            >
              
              {/* Receipt Header */}
              <div className="border-b border-slate-200 pb-5 mb-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <SnapmakerEmblem className="w-14 h-14" />
                    <div>
                      <div className="text-[11px] font-bold text-amber-700 uppercase tracking-widest mb-0.5 flex items-center gap-1.5">
                        <span className="inline-block w-2 h-2 rounded-full bg-amber-500"></span>
                        {t.receiptHeaderTitle}
                      </div>
                      <h1 className="text-xl font-black tracking-tight text-slate-950">
                        {projectTitle || 'Snapmaker Fabrication Job'}
                      </h1>
                      {clientName && (
                        <p className="text-xs text-slate-600 mt-0.5">
                          {t.clientName}: <span className="font-semibold text-slate-900">{clientName}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-end shrink-0">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">{t.refLabel}</span>
                    <span className="text-xs font-mono font-bold text-slate-800">{quoteId}</span>
                    <span className="text-[10px] text-slate-500 block mt-1">{quoteDate}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded font-bold text-[11px] bg-slate-100 text-slate-800 border border-slate-200">
                      {mode === '3dp' ? t.mode3dp : mode === 'laser' ? t.modeLaser : t.modeCnc}
                    </span>
                    <span>Quantity: <strong className="text-slate-900">{quantity} units</strong></span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-600">
                    Currency: <strong className="text-slate-900">{curr.code} ({curr.symbol})</strong>
                  </div>
                </div>
              </div>

              {/* Itemized Table Breakdown */}
              <div className="space-y-3 mb-6 text-sm">
                
                {/* 1. Raw Material */}
                <div className="flex items-start justify-between py-0.5">
                  <div>
                    <div className="font-semibold text-slate-900">{t.rawMaterialCost}</div>
                    <div className="text-xs text-slate-500 font-mono">
                      {mode === '3dp' && `${gramsConsumed}g @ ${curr.symbol}${(spoolWeight > 0 ? spoolPrice / spoolWeight : 0).toFixed(4)}/g`}
                      {mode === 'laser' && `${areaUsed} cm² @ ${curr.symbol}${(sheetArea > 0 ? sheetPrice / sheetArea : 0).toFixed(4)}/cm²`}
                      {mode === 'cnc' && `${volumeUsed} cm³ @ ${curr.symbol}${(stockVolume > 0 ? blockPrice / stockVolume : 0).toFixed(4)}/cm³`}
                    </div>
                  </div>
                  <div className="font-mono font-bold text-slate-900 tabular-nums">
                    {curr.symbol}{rawMaterialCost.toFixed(2)}
                  </div>
                </div>

                {/* 2. Scrap Buffer */}
                <div className="flex items-start justify-between py-0.5">
                  <div>
                    <div className="font-semibold text-slate-900">{t.scrapAllowance} ({scrapBuffer}%)</div>
                    <div className="text-xs text-slate-500 font-mono">Contingency buffer for production waste</div>
                  </div>
                  <div className="font-mono font-bold text-amber-700 tabular-nums">
                    +{curr.symbol}{scrapAmount.toFixed(2)}
                  </div>
                </div>

                {/* 3. Machine Depreciation */}
                <div className="flex items-start justify-between py-0.5">
                  <div>
                    <div className="font-semibold text-slate-900">{t.depreciationCost}</div>
                    <div className="text-xs text-slate-500 font-mono">
                      {activeRunHours.toFixed(2)} hrs @ {curr.symbol}{hourlyDepreciationRate.toFixed(2)}/hr wear
                    </div>
                  </div>
                  <div className="font-mono font-bold text-slate-900 tabular-nums">
                    +{curr.symbol}{machineDepreciationCost.toFixed(2)}
                  </div>
                </div>

                {/* 4. Labor */}
                <div className="flex items-start justify-between py-0.5">
                  <div>
                    <div className="font-semibold text-slate-900">{t.laborCost}</div>
                    <div className="text-xs text-slate-500 font-mono">
                      {laborHours} hrs @ {curr.symbol}{hourlyWage}/hr operator rate
                    </div>
                  </div>
                  <div className="font-mono font-bold text-slate-900 tabular-nums">
                    +{curr.symbol}{postLaborCost.toFixed(2)}
                  </div>
                </div>

                {/* 5. Consumables */}
                {extraConsumables > 0 && (
                  <div className="flex items-start justify-between py-0.5">
                    <div>
                      <div className="font-semibold text-slate-900">{t.consumablesCost}</div>
                      <div className="text-xs text-slate-500 font-mono">Hardware, packaging, fasteners</div>
                    </div>
                    <div className="font-mono font-bold text-slate-900 tabular-nums">
                      +{curr.symbol}{extraConsumables.toFixed(2)}
                    </div>
                  </div>
                )}

                <div className="border-t border-dashed border-slate-300 pt-2"></div>

                {/* Base Production Cost */}
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>{t.unitProductionCost}</span>
                  <span className="font-mono font-bold text-slate-800">{curr.symbol}{unitProductionCost.toFixed(2)}</span>
                </div>

                {/* Margin */}
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>{t.marginMarkup} (+{profitMargin}%)</span>
                  <span className="font-mono font-bold text-emerald-600">+{curr.symbol}{marginAmount.toFixed(2)}</span>
                </div>

                {/* Unit Price Before Disc */}
                <div className="flex items-center justify-between font-semibold text-slate-900 pt-1">
                  <span>{t.unitPriceBeforeDisc}</span>
                  <span className="font-mono">{curr.symbol}{unitBaseSellingPrice.toFixed(2)}</span>
                </div>

                {/* Quantity & Discount Callout if Qty > 1 */}
                {quantity > 1 && (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div className="flex justify-between text-slate-600">
                      <span>{quantity} × {curr.symbol}{unitBaseSellingPrice.toFixed(2)}</span>
                      <span className="font-mono">{curr.symbol}{totalRawPrice.toFixed(2)}</span>
                    </div>
                    {volumeDiscount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-semibold">
                        <span>{t.volumeDiscountAmt} (-{volumeDiscount}%)</span>
                        <span className="font-mono">-{curr.symbol}{discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-1">
                      <span>{t.subtotalAfterDisc}</span>
                      <span className="font-mono">{curr.symbol}{subtotalAfterDiscount.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                {/* Tax / VAT */}
                {applyVat && (
                  <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                    <span>{t.taxVatLine} ({vatRate}%)</span>
                    <span className="font-mono font-semibold text-slate-800">+{curr.symbol}{vatAmount.toFixed(2)}</span>
                  </div>
                )}

              </div>

              {/* GRAND TOTAL DISPLAY CALLOUT */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 mb-5 shadow-inner">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs uppercase tracking-wider font-bold text-amber-400">
                    {t.finalSellingPrice}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {quantity > 1 ? `${quantity} Units Batch` : 'Unit Total'}
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white tabular-nums">
                    {curr.symbol}{grandTotal.toFixed(2)}
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                    {curr.code} Net
                  </span>
                </div>

                {quantity > 1 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800 flex justify-between items-center text-xs font-mono text-slate-400">
                    <span>{t.unitFinalPrice}:</span>
                    <span className="font-bold text-amber-400">{curr.symbol}{effectiveUnitPrice.toFixed(2)} / unit</span>
                  </div>
                )}
              </div>

              {/* Receipt Footer Note */}
              <div className="text-center pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                <p>Generated via Snapmaker Multi-Mode Fabrication Architecture.</p>
                <p className="text-[10px] mt-0.5">Formal quotation valid for 30 calendar days.</p>
              </div>

            </div>

            {/* Quick Actions under Receipt */}
            <div className="no-print mt-3 flex items-center justify-between text-xs text-slate-500 px-1">
              <button
                onClick={handleCopyText}
                className="hover:text-amber-500 transition underline flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedState ? t.copiedBtn : t.copyBtn}</span>
              </button>
              
              <button
                onClick={handleResetDefaults}
                className="hover:text-amber-500 transition underline cursor-pointer"
              >
                {t.resetBtn}
              </button>
            </div>

          </div>

        </div>

        {/* 5. LOCAL QUOTES HISTORY TABLE (localStorage) */}
        <div className="no-print mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Save className="w-4 h-4 text-amber-500" />
              <span>{t.historyTitle}</span>
              {quotesHistory.length > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-mono font-bold">
                  {quotesHistory.length}
                </span>
              )}
            </h2>

            {quotesHistory.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="text-xs text-rose-500 hover:text-rose-400 font-medium transition cursor-pointer"
              >
                {t.clearHistoryBtn}
              </button>
            )}
          </div>

          {quotesHistory.length === 0 ? (
            <div className={`p-8 rounded-2xl border text-center text-xs ${
              isDark ? 'bg-slate-900/60 border-slate-800 text-slate-500' : 'bg-white border-slate-200 text-slate-500'
            }`}>
              {t.historyEmpty}
            </div>
          ) : (
            <div className={`rounded-2xl border overflow-x-auto shadow-sm ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <table className="w-full text-xs text-start">
                <thead className={`border-b text-slate-400 font-bold uppercase tracking-wider ${
                  isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <tr>
                    <th className="py-3 px-4 text-start">{t.colDate}</th>
                    <th className="py-3 px-4 text-start">{t.colProject}</th>
                    <th className="py-3 px-4 text-start">{t.colClient}</th>
                    <th className="py-3 px-4 text-start">{t.colMode}</th>
                    <th className="py-3 px-4 text-center">{t.colQty}</th>
                    <th className="py-3 px-4 text-end">{t.colTotal}</th>
                    <th className="py-3 px-4 text-end">{t.colActions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                  {quotesHistory.map((q) => {
                    const qCurr = CURRENCIES[q.currency] || CURRENCIES.USD;
                    const modeLabel = q.mode === '3dp' ? t.mode3dp : q.mode === 'laser' ? t.modeLaser : t.modeCnc;
                    return (
                      <tr key={q.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                        <td className="py-3 px-4 text-slate-400 whitespace-nowrap">{q.date}</td>
                        <td className="py-3 px-4 font-sans font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap max-w-xs truncate">
                          {q.projectTitle}
                        </td>
                        <td className="py-3 px-4 font-sans text-slate-500 whitespace-nowrap">{q.clientName}</td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded font-sans text-[11px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                            {modeLabel}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-bold">{q.quantity}</td>
                        <td className="py-3 px-4 text-end font-bold text-amber-500 whitespace-nowrap">
                          {qCurr.symbol}{q.grandTotal.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-end whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5 font-sans">
                            <button
                              onClick={() => handleLoadQuote(q)}
                              className="px-2.5 py-1 text-xs font-semibold rounded bg-amber-400 hover:bg-amber-300 text-slate-950 transition cursor-pointer"
                            >
                              {t.loadBtn}
                            </button>
                            <button
                              onClick={() => handleDeleteQuote(q.id)}
                              className="p-1 text-slate-400 hover:text-rose-500 transition cursor-pointer"
                              title={t.deleteBtn}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className={`no-print border-t py-6 mt-12 text-center text-xs ${
        isDark ? 'border-slate-900 bg-slate-950 text-slate-500' : 'border-slate-200 bg-white text-slate-600'
      }`}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>Snapmaker Quoting Tool V2 · Multi-Mode Additive & Subtractive Fabrication Engine</div>
          <div className="font-mono text-[11px]">Material (with Scrap) + Machine Depreciation + Labor + Hardware + VAT</div>
        </div>
      </footer>

    </div>
  );
}
